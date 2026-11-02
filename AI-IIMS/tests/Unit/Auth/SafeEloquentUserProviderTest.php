<?php

use App\Auth\SafeEloquentUserProvider;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

uses(Tests\TestCase::class);

test('invalid stored password hashes fail authentication without throwing', function () {
    $user = new User;
    $user->setRawAttributes(['id' => 1, 'password' => 'not-a-password-hash']);

    Log::shouldReceive('warning')
        ->once()
        ->with('Login rejected because the stored password hash is invalid.', ['user_id' => 1]);

    $provider = new SafeEloquentUserProvider(Hash::getFacadeRoot(), User::class);

    expect($provider->validateCredentials($user, ['password' => 'password']))->toBeFalse();
});

test('valid stored password hashes continue to authenticate', function () {
    $user = new User;
    $user->setRawAttributes(['id' => 1, 'password' => Hash::make('password')]);

    $provider = new SafeEloquentUserProvider(Hash::getFacadeRoot(), User::class);

    expect($provider->validateCredentials($user, ['password' => 'password']))->toBeTrue();
});

test('users support the configured email verification flow', function () {
    expect(new User)->toBeInstanceOf(MustVerifyEmail::class);
});
