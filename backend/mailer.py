import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Carrega as variáveis de ambiente (onde estarão o SMTP_EMAIL e SMTP_PASSWORD)
load_dotenv()

def enviar_token_senha(destinatario, token):
    """
    Envia o token de recuperação de 6 dígitos para o e-mail do aluno,
    utilizando a biblioteca smtplib nativa do Python.
    """
    remetente = os.getenv("SMTP_EMAIL")
    senha = os.getenv("SMTP_PASSWORD")

    # Verifica se as credenciais foram configuradas no .env
    if not remetente or not senha:
        return False, "Credenciais de e-mail (SMTP) não configuradas no arquivo .env"

    assunto = "Código de Recuperação - Tutor de Matemática IA"
    
    # Corpo do e-mail em HTML para uma apresentação profissional
    corpo_html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #1a73e8; text-align: center;">Recuperação de Senha</h2>
            <p>Olá!</p>
            <p>Recebemos um pedido para redefinir a senha da sua conta na Plataforma de Matemática (BNCC).</p>
            <p>O seu código de verificação é:</p>
            <div style="text-align: center; margin: 20px 0;">
                <span style="font-size: 24px; font-weight: bold; background-color: #f5f5f5; padding: 10px 20px; border-radius: 5px; letter-spacing: 5px;">
                    {token}
                </span>
            </div>
            <p style="color: #dc3545; font-size: 0.9em; text-align: center;"><em>* Este código é válido por apenas 15 minutos.</em></p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 0.8em; color: #888; text-align: center;">Se você não solicitou esta alteração, ignore este e-mail de imediato.</p>
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
        # Configuração para o servidor SMTP do Gmail (Porta 587 com TLS)
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls() # Ativa a criptografia de segurança
        server.login(remetente, senha)
        server.send_message(msg)
        server.quit()
        return True, "E-mail enviado com sucesso"
    except Exception as e:
        return False, str(e)