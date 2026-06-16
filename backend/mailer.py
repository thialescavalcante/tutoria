import os
import resend
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")

def enviar_token_senha(destinatario, token):
    try:
        params = {
            "from": "Tutor BNCC <onboarding@resend.dev>",
            "to": [destinatario],
            "subject": "Código de Verificação - Tutor de Matemática IA",
            "html": f"""
<html>
<body style="font-family: Arial, sans-serif; color: #333;">
    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #1a73a8; text-align: center;">Verificação de Conta</h2>
        <p>Seu código de verificação é:</p>
        <div style="font-size: 24px; font-weight: bold; background-color: #f5f5f5; padding: 10px 20px; border-radius: 5px; letter-spacing: 4px; text-align: center;">
            {token}
        </div>
        <p style="color: #dc3545; font-size: 0.9em; text-align: center;">* Este código é válido por apenas 15 minutos.</p>
    </div>
</body>
</html>
"""
        }
        resend.Emails.send(params)
        return True, "E-mail enviado com sucesso"
    except Exception as e:
        return False, str(e)