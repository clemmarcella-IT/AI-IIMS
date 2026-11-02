<?php

namespace App\Auth;

use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Auth\Authenticatable as UserContract;
use Illuminate\Support\Facades\Log;

class SafeEloquentUserProvider extends EloquentUserProvider
{
    /**
     * Validate credentials without throwing for malformed stored hashes.
     *
     * @param  array<string, mixed>  $credentials
     */
    public function validateCredentials(UserContract $user, #[\SensitiveParameter] array $credentials): bool
    {
        $hashedPassword = $user->getAuthPassword();

        if ($hashedPassword !== null && ! $this->usesConfiguredAlgorithm($hashedPassword)) {
            Log::warning('Login rejected because the stored password hash is invalid.', [
                'user_id' => $user->getAuthIdentifier(),
            ]);

            return false;
        }

        return parent::validateCredentials($user, $credentials);
    }

    private function usesConfiguredAlgorithm(string $hashedPassword): bool
    {
        $algorithm = password_get_info($hashedPassword)['algoName'];

        $expectedAlgorithms = match (config('hashing.driver', 'bcrypt')) {
            'bcrypt' => ['bcrypt'],
            'argon' => ['argon2i', 'argon2id'],
            'argon2id' => ['argon2id'],
            default => null,
        };

        return $algorithm !== 'unknown'
            && ($expectedAlgorithms === null || in_array($algorithm, $expectedAlgorithms, true));
    }
}
