<?php

namespace App\Models;

use App\Support\Resources;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'phone', 'avatar', 'profile'];

    protected $hidden = ['password', 'remember_token'];

    private Record|false|null $studentRow = false;

    protected function casts(): array
    {
        return ['email_verified_at' => 'datetime', 'password' => 'hashed', 'profile' => 'array'];
    }

    /** The student record linked to a siswa account (null for other roles). */
    public function student(): ?Record
    {
        if ($this->studentRow === false) {
            $this->studentRow = $this->role === 'siswa'
                ? Resources::model('students')->newQuery()->where('user_id', $this->id)->first()
                : null;
        }

        return $this->studentRow;
    }

    public function toApi(): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'phone' => $this->phone,
            'avatar' => $this->avatar,
            'profile' => $this->profile ?? (object) [],
            'studentId' => $this->student()?->ref,
        ];
    }
}
