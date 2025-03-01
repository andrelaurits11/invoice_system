<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use App\Models\User;  // Lisa see rida, et kasutada User mudelit

class InvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public $mailData;

    public function __construct($mailData)
    {
        $this->mailData = $mailData;
    }

    public function build()
{
    // Eemaldame kasutaja leidmise osa ja määrame saatja otse
    $senderEmail = $this->mailData['senderEmail'];  // Saatja e-posti aadress määratakse otse
    $senderName = $this->mailData['senderName'];    // Saatja nimi määratakse otse

    // Määrame e-kirja saatja aadressi ja nime
    $this->from($senderEmail, $senderName);

    // Koostame e-kirja
    $email = $this->subject('Teie arve: ' . $this->mailData['invoiceID'])
                  ->view('emails.invoice')  // Vaade, mille järgi e-kiri saadetakse
                  ->with('mailData', $this->mailData);

    // Kontrollime, kas PDF fail on olemas ja lisame selle e-kirja
    if (isset($this->mailData['pdf_path']) && Storage::exists($this->mailData['pdf_path'])) {
        $email->attach(Storage::path($this->mailData['pdf_path']), [
            'as' => 'invoice.pdf',  // Faili nimi e-kirjas
            'mime' => 'application/pdf',  // MIME tüüp
        ]);
    }

    return $email;
}

}
