<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class InvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public $mailData;

    public function __construct($mailData)
    {
        \Log::info('📧 InvoiceMail konstruktori andmed:', $mailData); // ✅ Logime andmed
        $this->mailData = $mailData; // ✅ Salvestame saadud andmed
    }

    public function build()
    {
        // ✅ Kontrollime, millised väärtused meil tegelikult on
        \Log::info('📧 Saatja määramine:', [
            'senderEmail' => $this->mailData['senderEmail'] ?? 'default@example.com',
            'senderName'  => $this->mailData['senderName'] ?? 'Default Business',
        ]);

        // ✅ Kasutame andmeid, mis saime konstruktorist
        $senderEmail = $this->mailData['senderEmail'] ?? 'default@example.com';
        $senderName = $this->mailData['senderName'] ?? 'Default Business';

        // ✅ Määrame e-kirja saatja aadressi ja nime
        $this->from($senderEmail, $senderName) // Kasutab .env määratud saatjat
             ->replyTo($senderEmail, $senderName); // ✅ Lisa `replyTo()`, et vastamine läheks saatjale

        // ✅ Failinimi
        $invoiceFileName = ($this->mailData['invoiceID'] ?? 'default') . '.pdf';

        // ✅ Koostame e-kirja
        $email = $this->subject('Teie arve: ' . ($this->mailData['invoiceID'] ?? 'MISSING_ID'))
                      ->view('emails.invoice')
                      ->with('mailData', $this->mailData);

        // ✅ Kui PDF eksisteerib, lisame selle e-kirja manuseks
        if (!empty($this->mailData['pdf_path']) && Storage::exists($this->mailData['pdf_path'])) {
            $email->attach(Storage::path($this->mailData['pdf_path']), [
                'as'   => $invoiceFileName, // Failinimi
                'mime' => 'application/pdf',
            ]);
        }

        return $email;
    }
}
