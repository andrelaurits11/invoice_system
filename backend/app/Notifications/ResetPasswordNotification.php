<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends Notification
{
    public $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
{
    $frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000'));
    $resetUrl = "{$frontendUrl}/password-reset/{$this->token}?email={$notifiable->email}";

    return (new MailMessage)
        ->subject('Teie parooli lähtestamise taotlus')
        ->view('mail::reset', ['resetUrl' => $resetUrl, 'user' => $notifiable]); // ✅ Kasuta mail::reset
}

}
