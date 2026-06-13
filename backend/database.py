import os
from datetime import datetime
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "tutor_bncc")

_client = MongoClient(MONGO_URI)
_db = _client[MONGO_DB_NAME]

def obter_db():
    return _db

def inicializar_bd_historico():
    """Garante os índices necessários nas coleções."""
    db = obter_db()
    # Índices únicos para usuários (email e username)
    db.usuarios.create_index("email", unique=True)
    db.usuarios.create_index("username", unique=True)
    # Índice para consultas de histórico por usuário, ordenado por timestamp
    db.historico_chat.create_index([("usuario_id", 1), ("timestamp", -1)])

def save_interaction(usuario_id, ano_escolar, mensagem_aluno, resposta_tutor):
    db = obter_db()
    db.historico_chat.insert_one({
        "usuario_id": usuario_id,
        "ano_escolar_momento": str(ano_escolar),
        "mensagem_aluno": mensagem_aluno,
        "resposta_tutor": resposta_tutor,
        "timestamp": datetime.utcnow()
    })

def carregar_historico_aluno(usuario_id, limite=10):
    db = obter_db()
    cursor = db.historico_chat.find(
        {"usuario_id": usuario_id},
        {"mensagem_aluno": 1, "resposta_tutor": 1, "_id": 0}
    ).sort("timestamp", -1).limit(limite)
    historico = list(cursor)
    return list(reversed(historico))
