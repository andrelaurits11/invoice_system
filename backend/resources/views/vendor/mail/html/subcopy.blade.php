<table class="subcopy" width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td>
{{ Illuminate\Mail\Markdown::parse($slot) }}

{{-- ✅ Eesti keelne subcopy --}}
@if(isset($resetUrl))
    <p>Kui teil on probleeme nupu "Lähtesta parool" vajutamisega, kopeerige ja kleepige allolev link oma veebibrauserisse:</p>
    <p><a href="{{ $resetUrl }}">{{ $resetUrl }}</a></p>
@endif

</td>
</tr>
</table>
