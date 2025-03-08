@component('mail::layout')
{{-- Header --}}
@slot('header')
<tr>
    <td align="center" style="padding: 20px 0;">
        <a href="{{ config('app.url') }}" style="display: inline-block;">
            <img src="{{ asset('storage/images/favicon.png') }}" class="logo" alt="PayDashPro Logo" width="180" style="border: none; display: block;">
        </a>
    </td>
</tr>
<tr>
    <td style="background-color: #f4f4f4; padding: 40px; text-align: center; font-family: Arial, sans-serif; color: #333;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Tere, {{ $user->name ?? 'Kasutaja' }}!</h1>
        <p style="font-size: 16px; margin: 20px 0;">Saime taotluse teie parooli lähtestamiseks.</p>
        <p style="margin-bottom: 30px;">Vajutage allolevale nupule, et parool lähtestada.</p>

        <a href="{{ $resetUrl }}" style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-size: 16px;">Lähtesta parool</a>

        <p style="margin-top: 30px; font-size: 14px; color: #666;">
            See link aegub <strong>60 minuti</strong> pärast.<br>
            Kui te ei esitanud seda taotlust, võite selle e-kirja ignoreerida.
        </p>

        <hr style="border: 0; border-top: 1px solid #ddd; margin: 30px 0;">

        <p style="font-size: 14px; color: #666;">
            Kui teil on probleeme nupu <strong>"Lähtesta parool"</strong> vajutamisega, kopeerige ja kleepige allolev link oma veebibrauserisse:
        </p>
        <p style="word-wrap: break-word; font-size: 14px;">
            <a href="{{ $resetUrl }}" style="color: #007bff; text-decoration: none;">{{ $resetUrl }}</a>
        </p>
    </td>
</tr>

<tr>
    <td align="center" style="padding: 20px; font-size: 14px; color: #777; background-color: #fff;">
        &copy; {{ date('Y') }} PayDash Pro. Kõik õigused kaitstud.
    </td>
</tr>

@endslot
@endcomponent
