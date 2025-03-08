<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User; // Impordi User mudel
use PragmaRX\Google2FA\Google2FA; // Kasutame Google2FA klassi

class UserGoogle2FA extends Model
{
    use HasFactory;

    protected $table = 'user_google2fa'; // Õige tabeli nimi

    protected $fillable = ['user_id', 'google2fa_secret'];

    // Seos User mudeliga
    public function user()
    {
        return $this->belongsTo(User::class); // User mudel, mille kaudu pääseb e-posti välja
    }

    public function generateSecret()
    {
        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        $this->google2fa_secret = $secret;
        $this->save();

        return $secret;
    }

    public function validateCode($code)
    {
  
        $google2fa = new Google2FA();
        return $google2fa->verifyKey($this->google2fa_secret, $code);
    }
}
