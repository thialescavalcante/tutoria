import os, hashlib, binascii, jwt, random, time
from datetime import datetime, timedelta, timezone
from bson import ObjectId
from bson.errors import InvalidId
from pymongo.errors import DuplicateKeyError
from database import obter_db
from mailer import enviar_token_senha

JWT_SECRET = os.getenv("JWT_SECRET", "super_chave_secreta_jwt_tutor_bncc_2026")


def gerar_hash_senha(senha):
    salt = os.urandom(32)
    pwd_hash = hashlib.pbkdf2_hmac('sha256', senha.encode('utf-8'), salt, 210000)
    return binascii.hexlify(salt + pwd_hash).decode('ascii')


def verificar_senha(armazenada, fornecida):
    try:
        data = binascii.unhexlify(armazenada.encode('ascii'))
        salt, stored = data[:32], data[32:]
        return hashlib.pbkdf2_hmac('sha256', fornecida.encode('utf-8'), salt, 210000) == stored
    except:
        return False


def autenticar_usuario(login, senha):
    db = obter_db()
    user = db.usuarios.find_one({"$or": [{"email": login}, {"username": login}]})
    if user and verificar_senha(user['senha_hash'], senha):
        if not user.get('ativo', 1):
            return False, "Sua conta ainda não foi ativada. Verifique seu e-mail."
        user_id_str = str(user['_id'])
        token = jwt.encode(
            {'id': user_id_str, 'role': user.get('role', 'user'),
             'exp': datetime.now(timezone.utc) + timedelta(hours=24)},
            JWT_SECRET
        )
        u = dict(user)
        u['id'] = user_id_str
        u['_id'] = user_id_str
        u['token'] = token
        del u['senha_hash']
        return True, u
    return False, "Credenciais inválidas."


def registrar_usuario(nome, username, email, senha, data_nascimento, genero, ano_escolar, preferencias=""):
    hash_s = gerar_hash_senha(senha)
    token_ativacao = str(random.randint(100000, 999999))
    expira = int(time.time()) + 3600  # 1 hora de validade

    db = obter_db()
    try:
        db.usuarios.insert_one({
            "nome": nome,
            "username": username,
            "email": email,
            "senha_hash": hash_s,
            "role": "user",
            "ativo": 0,
            "data_nascimento": data_nascimento,
            "genero": genero,
            "ano_escolar": ano_escolar,
            "preferencias": preferencias,
            "reset_token": token_ativacao,
            "token_expira_em": expira
        })

        # Envia e-mail de boas-vindas com o código
        enviar_token_senha(email, token_ativacao)
        return True, "Cadastro realizado! Enviamos um código de ativação para o seu e-mail."
    except DuplicateKeyError:
        return False, "E-mail ou Usuário já existe no sistema."
    except Exception:
        return False, "E-mail ou Usuário já existe no sistema."


def confirmar_cadastro(email, token):
    db = obter_db()
    user = db.usuarios.find_one({"email": email, "reset_token": str(token)})
    if user:
        if int(time.time()) < user.get('token_expira_em', 0):
            db.usuarios.update_one(
                {"email": email},
                {"$set": {"ativo": 1, "reset_token": None, "token_expira_em": None}}
            )
            return True, "Conta ativada com sucesso! Agora você pode fazer login."
        return False, "Este código expirou."
    return False, "Código de ativação inválido."


def solicitar_token_recuperacao(email):
    db = obter_db()
    user = db.usuarios.find_one({"email": email}, {"_id": 1})
    if not user:
        return True, "Se o e-mail existir, o código será enviado."

    token = str(random.randint(100000, 999999))
    expira = int(time.time()) + 900
    db.usuarios.update_one(
        {"email": email},
        {"$set": {"reset_token": token, "token_expira_em": expira}}
    )
    enviar_token_senha(email, token)
    return True, "Código de recuperação enviado!"


def redefinir_senha_com_token(email, token, nova_senha):
    db = obter_db()
    user = db.usuarios.find_one({"email": email, "reset_token": str(token)})
    if not user or int(time.time()) > user.get('token_expira_em', 0):
        return False, "Token inválido ou expirado."

    hash_s = gerar_hash_senha(nova_senha)
    db.usuarios.update_one(
        {"email": email},
        {"$set": {"senha_hash": hash_s, "reset_token": None, "token_expira_em": None}}
    )
    return True, "Senha alterada com sucesso!"


def listar_todos_usuarios():
    db = obter_db()
    users = db.usuarios.find({}, {
        "nome": 1, "email": 1, "role": 1, "ativo": 1, "ano_escolar": 1
    })
    resultado = []
    for u in users:
        u['id'] = str(u['_id'])
        del u['_id']
        resultado.append(u)
    return resultado


def alternar_status_ativo(id):
    db = obter_db()
    try:
        oid = ObjectId(id)
    except InvalidId:
        return False, "ID inválido."

    user = db.usuarios.find_one({"_id": oid}, {"ativo": 1})
    if not user:
        return False, "Usuário não encontrado."

    novo_status = 0 if user.get('ativo', 1) else 1
    db.usuarios.update_one({"_id": oid}, {"$set": {"ativo": novo_status}})
    return True, "Status alterado."
