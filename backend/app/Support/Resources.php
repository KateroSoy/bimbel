<?php

namespace App\Support;

use App\Models\Record;
use Illuminate\Support\Str;

/** Reads config/resources.php and turns a definition into table, columns, casts and validation rules. */
class Resources
{
    public const TYPES = ['s' => 'string', 't' => 'text', 'i' => 'integer', 'm' => 'bigInteger', 'd' => 'decimal', 'b' => 'boolean', 'j' => 'json'];

    public static function names(): array
    {
        return array_keys(config('resources'));
    }

    public static function exists(string $name): bool
    {
        return array_key_exists($name, config('resources'));
    }

    public static function def(string $name): array
    {
        return config("resources.$name");
    }

    public static function table(string $name): string
    {
        return str_replace('-', '_', $name);
    }

    /** @return array<string, array{type: string, nullable: bool}> column => spec */
    public static function columns(string $name): array
    {
        $cols = [];
        foreach (preg_split('/\s+/', trim(self::def($name)['cols'])) as $part) {
            [$col, $type] = explode(':', $part);
            $nullable = str_ends_with($type, '?');
            $cols[$col] = ['type' => rtrim($type, '?'), 'nullable' => $nullable];
        }

        return $cols;
    }

    public static function ownerColumn(string $name): ?string
    {
        $def = self::def($name);

        return match ($def['owner'] ?? null) {
            'tutor' => 'owner_id',
            'student' => $def['ownerColumn'] ?? 'student_ref',
            default => null,
        };
    }

    public static function model(string $name): Record
    {
        $casts = [];
        foreach (self::columns($name) as $col => $spec) {
            $casts[$col] = match ($spec['type']) {
                'i', 'm' => 'integer', 'd' => 'float', 'b' => 'boolean', 'j' => 'array', default => 'string',
            };
        }

        return (new Record)->setTable(self::table($name))->mergeCasts($casts);
    }

    /** Validation rules keyed by camelCase input name. */
    public static function rules(string $name, bool $creating): array
    {
        $required = self::def($name)['req'] ?? [];
        $rules = [];
        foreach (self::columns($name) as $col => $spec) {
            $base = match ($spec['type']) {
                's' => ['string', 'max:191'],
                't' => ['string', 'max:20000'],
                'i' => ['integer', 'min:-1000000', 'max:100000000'],
                'm' => ['integer', 'min:0', 'max:100000000000'],
                'd' => ['numeric', 'min:-100000', 'max:100000'],
                'b' => ['boolean'],
                'j' => ['array'],
            };
            $presence = in_array($col, $required, true) ? ($creating ? ['required'] : ['sometimes', 'required']) : ['sometimes', 'nullable'];
            $rules[Str::camel($col)] = array_merge($presence, $base);
        }

        return $rules;
    }

    /** camelCase validated input → snake_case column values (unknown keys dropped). */
    public static function toColumns(string $name, array $input): array
    {
        $out = [];
        foreach (array_keys(self::columns($name)) as $col) {
            $key = Str::camel($col);
            if (array_key_exists($key, $input)) {
                $out[$col] = $input[$key];
            }
        }

        return $out;
    }

    /** Row → API shape: public ref as "id", camelCase keys, internal columns hidden. */
    public static function present(string $name, Record $row): array
    {
        $out = ['id' => $row->ref];
        foreach (array_keys(self::columns($name)) as $col) {
            $out[Str::camel($col)] = $row->{$col};
        }

        return $out;
    }

    public static function nextRef(string $name): string
    {
        [$prefix, $pad] = self::def($name)['ref'] ?? ['', 0];
        $max = 0;
        foreach (self::model($name)->newQuery()->where('ref', 'like', $prefix.'%')->pluck('ref') as $ref) {
            $tail = substr($ref, strlen($prefix));
            if (ctype_digit($tail)) {
                $max = max($max, (int) $tail);
            }
        }

        return $prefix.str_pad((string) ($max + 1), $pad, '0', STR_PAD_LEFT);
    }
}
