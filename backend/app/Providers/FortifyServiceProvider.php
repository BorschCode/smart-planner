<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use App\Http\Responses\JsonLoginResponse;
use App\Http\Responses\JsonLogoutResponse;
use App\Http\Responses\JsonPasswordConfirmedResponse;
use App\Http\Responses\JsonPasswordResetResponse;
use App\Http\Responses\JsonRegisterResponse;
use App\Http\Responses\JsonTwoFactorConfirmedResponse;
use App\Http\Responses\JsonTwoFactorDisabledResponse;
use App\Http\Responses\JsonTwoFactorEnabledResponse;
use App\Http\Responses\JsonTwoFactorChallengeViewResponse;
use App\Http\Responses\JsonTwoFactorLoginResponse;
use App\Http\Responses\JsonVerifyEmailResponse;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Contracts\LogoutResponse as LogoutResponseContract;
use Laravel\Fortify\Contracts\PasswordConfirmedResponse as PasswordConfirmedResponseContract;
use Laravel\Fortify\Contracts\PasswordResetResponse as PasswordResetResponseContract;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Laravel\Fortify\Contracts\TwoFactorConfirmedResponse as TwoFactorConfirmedResponseContract;
use Laravel\Fortify\Contracts\TwoFactorDisabledResponse as TwoFactorDisabledResponseContract;
use Laravel\Fortify\Contracts\TwoFactorEnabledResponse as TwoFactorEnabledResponseContract;
use Laravel\Fortify\Contracts\TwoFactorChallengeViewResponse as TwoFactorChallengeViewResponseContract;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse as TwoFactorLoginResponseContract;
use Laravel\Fortify\Contracts\VerifyEmailResponse as VerifyEmailResponseContract;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(LoginResponseContract::class, JsonLoginResponse::class);
        $this->app->singleton(LogoutResponseContract::class, JsonLogoutResponse::class);
        $this->app->singleton(RegisterResponseContract::class, JsonRegisterResponse::class);
        $this->app->singleton(PasswordResetResponseContract::class, JsonPasswordResetResponse::class);
        $this->app->singleton(PasswordConfirmedResponseContract::class, JsonPasswordConfirmedResponse::class);
        $this->app->singleton(TwoFactorLoginResponseContract::class, JsonTwoFactorLoginResponse::class);
        $this->app->singleton(TwoFactorChallengeViewResponseContract::class, JsonTwoFactorChallengeViewResponse::class);
        $this->app->singleton(TwoFactorEnabledResponseContract::class, JsonTwoFactorEnabledResponse::class);
        $this->app->singleton(TwoFactorDisabledResponseContract::class, JsonTwoFactorDisabledResponse::class);
        $this->app->singleton(TwoFactorConfirmedResponseContract::class, JsonTwoFactorConfirmedResponse::class);
        $this->app->singleton(VerifyEmailResponseContract::class, JsonVerifyEmailResponse::class);
    }

    public function boot(): void
    {
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::updateUserProfileInformationUsing(UpdateUserProfileInformation::class);
        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())) . '|' . $request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });
    }
}
