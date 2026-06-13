import os, base64, jwt
from functools import wraps
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from ai_service import get_ai_feedback, construir_contexto_tutor
from database import save_interaction, carregar_historico_aluno, inicializar_bd_historico
from auth import (
    autenticar_usuario, registrar_usuario, listar_todos_usuarios, 
    alternar_status_ativo, solicitar_token_recuperacao, 
    redefinir_senha_com_token, confirmar_cadastro, JWT_SECRET
)

app = Flask(__name__)
CORS(app)
limiter = Limiter(get_remote_address, app=app, default_limits=["200 per day"])

def token_obrigatorio(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', "").split(" ")[-1]
        if not token: return jsonify({'message': 'Token ausente'}), 401
        try: 
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            return f(data['id'], *args, **kwargs)
        except: return jsonify({'message': 'Token invalido'}), 401
    return decorated

@app.route('/api/login', methods=['POST'])
def login():
    s, u = autenticar_usuario(request.json.get('login'), request.json.get('senha'))
    return jsonify({"success": s, "user": u if s else None, "message": "" if s else u})

@app.route('/api/register', methods=['POST'])
def register():
    d = request.json
    s, m = registrar_usuario(d['nome'], d['username'], d['email'], d['senha'], d['data_nascimento'], d['genero'], d['ano_escolar'], d['preferencias'])
    return jsonify({"success": s, "message": m})

@app.route('/api/verify-registration', methods=['POST'])
def verify_reg():
    d = request.json
    s, m = confirmar_cadastro(d.get('email'), d.get('token'))
    return jsonify({"success": s, "message": m})

@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    s, m = solicitar_token_recuperacao(request.json.get('email'))
    return jsonify({"success": s, "message": m})

@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    d = request.json
    s, m = redefinir_senha_com_token(d.get('email'), d.get('token'), d.get('nova_senha'))
    return jsonify({"success": s, "message": m})

@app.route('/api/chat', methods=['POST'])
@token_obrigatorio
def chat(uid):
    d = request.json
    img_b64 = d.get('imagem_base64')
    img_bytes = base64.b64decode(img_b64) if img_b64 else None
    regras = construir_contexto_tutor(d['aluno_nome'], d['ano_escolar'], d['preferencias'])
    hist = carregar_historico_aluno(uid)
    hist_txt = "\n".join([f"A: {i['mensagem_aluno']}\nT: {i['resposta_tutor']}" for i in hist])
    resp = get_ai_feedback(regras, hist_txt, d['message'], uid, img_bytes, d.get('mime_type'))
    save_interaction(uid, d['ano_escolar'], d['message'], resp)
    return jsonify({"response": resp})

@app.route('/api/admin/users', methods=['GET'])
@token_obrigatorio
def admin_list(uid):
    return jsonify({"success": True, "users": listar_todos_usuarios()})

@app.route('/api/admin/toggle', methods=['POST'])
@token_obrigatorio
def admin_toggle(uid):
    s, m = alternar_status_ativo(request.json.get('id'))
    return jsonify({"success": s, "message": m})

if __name__ == '__main__':
    inicializar_bd_historico()
    app.run(debug=True, port=5000)