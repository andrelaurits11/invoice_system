<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Parooli lähtestamine</title>
</head>
<body style="background-color: #f4f4f4; margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); padding: 40px;">
                    <!-- 👀 Emoji -->
                    <tr>
                        <td align="center" style="font-size: 36px; line-height: 1.5;">👀</td>
                    </tr>

                    <!-- Pealkiri -->
                    <tr>
                        <td align="center" style="font-size: 24px; font-weight: bold; color: #333; margin-top: 10px;">
                            Parooli lähtestamine
                        </td>
                    </tr>

                    <!-- Peamine tekst -->
                    <tr>
                        <td align="center" style="font-size: 16px; color: #666; padding: 20px;">
                            Keegi taotles teie konto parooli lähtestamist.<br>
                            Parooli lähtestamiseks klõpsake allolevat nuppu.
                        </td>
                    </tr>

                    <!-- Lähtestamise nupp -->
                    <tr>
                        <td align="center" style="padding: 20px;">
                            <a href="{{ $resetUrl }}" style="background-color: #007bff; color: #ffffff; text-decoration: none; font-size: 16px; padding: 12px 24px; border-radius: 6px; display: inline-block;">
                                Lähtesta parool
                            </a>
                        </td>
                    </tr>

                    <!-- Konto e-mail -->
                    <tr>
                        <td align="center" style="font-size: 14px; color: #666; padding-bottom: 20px;">
                            Teie e-mail: <a href="mailto:{{ $user->email }}" style="color: #007bff; text-decoration: none;">{{ $user->email }}</a>
                        </td>
                    </tr>

                    <!-- Alternatiivne link -->
                    <tr>
                        <td align="center" style="font-size: 14px; color: #666; padding-bottom: 20px;">
                            Kui teil on probleeme nupu vajutamisega, kopeerige ja kleepige see link oma veebibrauserisse:<br>
                            <a href="{{ $resetUrl }}" style="color: #007bff; word-wrap: break-word;">{{ $resetUrl }}</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td align="center" style="padding: 20px; font-size: 14px; color: #777;">
                &copy; {{ date('Y') }} PayDash Pro. Kõik õigused kaitstud.
            </td>
        </tr>
    </table>
</body>
</html>
