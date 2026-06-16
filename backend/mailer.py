import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

def enviar_token_senha(destinatario, token):
    remetente = os.getenv("SMTP_EMAIL")
    senha = os.getenv("SMTP_PASSWORD")

    if not remetente or not senha:
        return False, "Credenciais de e-mail (SMTP) não configuradas no arquivo .env"

    assunto = "Código de Recuperação - Tutor de Matemática IA"

    corpo_html = f"""
<html>
<body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #1a73a8; text-align: center;">Recuperação de Senha</h2>
        <p>Seu código de verificação é:</p>
        <span style="font-size: 24px; font-weight: bold; background-color: #f5f5f5; padding: 10px 20px; border-radius: 5px; letter-spacing: 4px;">
            {token}
        </span>
        <p style="color: #dc3545; font-size: 0.9em; text-align: center;"><em>* Este código é válido por apenas 15 minutos.</em></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 0.8em; color: #888; text-align: center;">Se você não solicitou esta alteração, ignore este e-mail.</p>
    </div>
</body>
</html>
"""

    msg = MIMEMultipart()
    msg['From'] = remetente
    msg['To'] = destinatario
    msg['Subject'] = assunto
    msg.attach(MIMEText(corpo_html, 'html'))

    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465, timeout=10)
        server.login(remetente, senha)
        server.send_message(msg)
        server.quit()
        return True, "E-mail enviado com sucesso"
    except Exception as e:
        return False, str(e)