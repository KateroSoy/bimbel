<?php

namespace Tests\Feature;

use App\Support\Resources;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/** RES-*: every registry resource can be created, listed, updated and deleted, and the rows land in the database. */
class ResourceCrudTest extends TestCase
{
    use RefreshDatabase;

    /** Every resource except submissions, which has its own rules (see LearningTest). */
    public static function crudResources(): array
    {
        $names = array_diff(array_keys(require __DIR__.'/../../config/resources.php'), ['submissions']);

        return array_combine($names, array_map(fn ($name) => [$name], $names));
    }

    private function payload(string $resource): array
    {
        $payload = [];
        foreach (Resources::columns($resource) as $col => $spec) {
            if ($col === 'user_id') {
                continue;
            }
            $payload[Str::camel($col)] = match (true) {
                $col === 'email' => 'someone@example.test',
                $spec['type'] === 'i' && in_array($col, ['day', 'slot'], true) => 2,
                default => match ($spec['type']) {
                    's' => 'Contoh '.$col, 't' => 'Teks panjang '.$col, 'i' => 3, 'm' => 150000, 'd' => 7.5, 'b' => true, 'j' => ['satu', 'dua'],
                },
            };
        }

        return $payload;
    }

    #[DataProvider('crudResources')]
    public function test_create_list_update_delete(string $resource): void
    {
        $def = Resources::def($resource);
        $this->actingAsRole($def['write'][0]);
        $table = Resources::table($resource);
        $payload = $this->payload($resource);
        $firstString = collect(Resources::columns($resource))->filter(fn ($s) => $s['type'] === 's')->keys()->first();

        // create
        $created = $this->postJson("/api/r/$resource", $payload + ['id' => 'CHOSEN-BY-CLIENT', 'ownerId' => 999, 'unknownField' => 'x'])->assertCreated()->json('data');
        $this->assertNotSame('CHOSEN-BY-CLIENT', $created['id']);
        $this->assertArrayNotHasKey('unknownField', $created);
        $this->assertDatabaseHas($table, ['ref' => $created['id'], $firstString => $payload[Str::camel($firstString)]]);

        // list (+ search)
        $this->getJson("/api/r/$resource")->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.id', $created['id']);
        $this->getJson("/api/r/$resource?q=zzz-tidak-ada")->assertOk()->assertJsonCount(0, 'data');

        // update
        $this->putJson("/api/r/$resource/{$created['id']}", [Str::camel($firstString) => 'Diubah'])->assertOk()->assertJsonPath('data.'.Str::camel($firstString), 'Diubah');
        $this->assertDatabaseHas($table, ['ref' => $created['id'], $firstString => 'Diubah']);

        // delete
        $this->deleteJson("/api/r/$resource/{$created['id']}")->assertOk();
        $this->assertDatabaseMissing($table, ['ref' => $created['id']]);
        $this->deleteJson("/api/r/$resource/{$created['id']}")->assertNotFound();
    }

    #[DataProvider('crudResources')]
    public function test_required_fields_are_validated(string $resource): void
    {
        $def = Resources::def($resource);
        $this->actingAsRole($def['write'][0]);

        $this->postJson("/api/r/$resource", [])->assertStatus(422)->assertJsonValidationErrors(array_map(fn ($c) => Str::camel($c), $def['req']));
        $this->assertDatabaseCount(Resources::table($resource), 0);
    }

    public function test_wrong_types_are_rejected(): void
    {
        $this->actingAsRole('admin');

        $this->postJson('/api/r/rooms', ['name' => 'Ruang 9', 'capacity' => 'banyak'])->assertStatus(422)->assertJsonValidationErrors('capacity');
        $this->postJson('/api/r/staff', ['name' => 'Budi', 'email' => 'bukan-email'])->assertStatus(422)->assertJsonValidationErrors('email');
        $this->postJson('/api/r/expenses', ['category' => 'ATK', 'amount' => -5])->assertStatus(422)->assertJsonValidationErrors('amount');
    }

    public function test_generated_ids_follow_the_prefix_and_increment(): void
    {
        $this->actingAsRole('admin');

        $first = $this->postJson('/api/r/guardians', ['name' => 'Ibu Satu'])->json('data.id');
        $second = $this->postJson('/api/r/guardians', ['name' => 'Ibu Dua'])->json('data.id');

        $this->assertSame(['ORT-0001', 'ORT-0002'], [$first, $second]);
    }

    public function test_filter_by_column(): void
    {
        $this->actingAsRole('admin');
        $this->postJson('/api/r/rooms', ['name' => 'Ruang A', 'floor' => 'Lantai 1']);
        $this->postJson('/api/r/rooms', ['name' => 'Ruang B', 'floor' => 'Lantai 2']);

        $this->getJson('/api/r/rooms?filter[floor]=Lantai 2')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.name', 'Ruang B');
    }
}
