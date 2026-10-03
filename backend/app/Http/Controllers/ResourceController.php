<?php

namespace App\Http\Controllers;

use App\Models\Record;
use App\Models\User;
use App\Support\ResourceHooks;
use App\Support\Resources;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/** Generic CRUD for every table in config/resources.php. */
class ResourceController extends Controller
{
    public function index(Request $request, string $resource): JsonResponse
    {
        $user = $this->authorizeFor($request, $resource, 'read');
        $query = $this->scoped($resource, $user);

        if ($q = trim((string) $request->query('q'))) {
            $search = Resources::def($resource)['search'] ?? [];
            $query->where(fn (Builder $b) => collect($search)->each(fn ($col) => $b->orWhere($col, 'like', "%{$q}%")));
        }
        $columns = Resources::columns($resource);
        foreach ((array) $request->query('filter', []) as $key => $value) {
            $col = Str::snake($key);
            if (isset($columns[$col]) && is_scalar($value)) {
                $query->where($col, $value);
            }
        }

        $rows = $query->orderBy('id')->limit(1000)->get();

        return response()->json(['data' => $rows->map(fn (Record $r) => $this->present($resource, $r, $user))->all()]);
    }

    public function store(Request $request, string $resource): JsonResponse
    {
        $user = $this->authorizeFor($request, $resource, 'write');
        $data = $this->validated($request, $resource, $user, true);
        $data = ResourceHooks::saving($resource, $data, $user, null);

        $owner = Resources::ownerColumn($resource);
        if ($owner === 'owner_id') {
            $data['owner_id'] = $user->role === 'guru' ? $user->id : null;
        }

        // One submission per (assignment, student): a re-submit replaces the earlier row.
        $existing = $resource === 'submissions'
            ? Resources::model($resource)->newQuery()->where('assignment_id', $data['assignment_id'])->where('student_id', $data['student_id'])->first()
            : null;

        $row = $existing ?? Resources::model($resource);
        for ($attempt = 0; ; $attempt++) {
            try {
                if (! $existing) {
                    $row->ref = Resources::nextRef($resource);
                }
                $row->forceFill($data)->save();
                break;
            } catch (UniqueConstraintViolationException $e) {
                if ($existing || $attempt >= 3) {
                    throw $e;
                }
            }
        }
        ResourceHooks::saved($resource, $row);

        return response()->json(['data' => $this->present($resource, $row->refresh(), $user)], $existing ? 200 : 201);
    }

    public function update(Request $request, string $resource, string $id): JsonResponse
    {
        $user = $this->authorizeFor($request, $resource, 'write');
        $row = $this->scoped($resource, $user)->where('ref', $id)->firstOrFail();
        $data = $this->validated($request, $resource, $user, false);
        $data = ResourceHooks::saving($resource, $data, $user, $row);

        $row->forceFill($data)->save();
        ResourceHooks::saved($resource, $row);

        return response()->json(['data' => $this->present($resource, $row->refresh(), $user)]);
    }

    public function destroy(Request $request, string $resource, string $id): JsonResponse
    {
        $user = $this->authorizeFor($request, $resource, 'write');
        if ($resource === 'submissions' && $user->role === 'siswa') {
            abort(403);
        }
        $row = $this->scoped($resource, $user)->where('ref', $id)->firstOrFail();
        $row->delete();
        ResourceHooks::saved($resource, $row);

        return response()->json(['ok' => true]);
    }

    private function authorizeFor(Request $request, string $resource, string $ability): User
    {
        abort_unless(Resources::exists($resource), 404);
        $user = $request->user();
        abort_unless(in_array($user->role, Resources::def($resource)[$ability], true), 403);

        return $user;
    }

    /** Query limited to the rows this user may see. */
    private function scoped(string $resource, User $user): Builder
    {
        $query = Resources::model($resource)->newQuery();
        $owner = Resources::ownerColumn($resource);
        if ($owner === 'owner_id' && $user->role === 'guru') {
            $query->where('owner_id', $user->id);
        } elseif ($owner && $owner !== 'owner_id' && $user->role === 'siswa') {
            $query->where($owner, $user->student()?->ref ?? '__none__');
        }

        return $query;
    }

    private function validated(Request $request, string $resource, User $user, bool $creating): array
    {
        $rules = Resources::rules($resource, $creating);
        foreach (ResourceHooks::rules($resource) as $field => $extra) {
            $rules[$field] = array_merge($rules[$field], $extra);
        }
        $writable = ResourceHooks::writable($resource, $user);
        if ($writable !== null) {
            $rules = array_intersect_key($rules, array_flip($writable));
        }
        $input = $request->validate($rules);

        return Resources::toColumns($resource, $input);
    }

    private function present(string $resource, Record $row, User $user): array
    {
        return ResourceHooks::present($resource, Resources::present($resource, $row), $user);
    }
}
