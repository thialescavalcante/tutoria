import os
import httpx
from dotenv import load_dotenv
from google import genai
from google.genai import types

# =====================================================================
# HACK DE INTERCEPTAÇÃO DE REDE (SSL)
# Garante que a IA não seja bloqueada por antivírus ou redes da faculdade
# =====================================================================
_original_client_init = httpx.Client.__init__

def patched_client_init(self, *args, **kwargs):
    kwargs['verify'] = False 
    _original_client_init(self, *args, **kwargs)

httpx.Client.__init__ = patched_client_init

_original_async_init = httpx.AsyncClient.__init__

def patched_async_init(self, *args, **kwargs):
    kwargs['verify'] = False
    _original_async_init(self, *args, **kwargs)

httpx.AsyncClient.__init__ = patched_async_init
# =====================================================================

# Carrega as variáveis do arquivo .env (Chave da API, etc)
load_dotenv()

# Inicializa o cliente do Gemini (agora com passagem livre pela rede)
client = genai.Client()

def construir_contexto_tutor(nome, ano, prefs):
    """
    Constrói a 'Mente' do Tutor, injetando as regras da BNCC, 
    o tom de voz adequado para a idade e os interesses do aluno.
    """
    # Define o tom baseado na série (infantil vs adolescente)
    if str(ano) == "Outro":
        foco_idade = "um aluno de reforço geral (mantenha um tom didático, respeitoso e encorajador)"
    else:
        foco_idade = f"uma criança/adolescente na faixa etária do {ano}º ano do Ensino Fundamental"

    return f"""Você é o "Tutor BNCC", um professor particular de Matemática altamente capacitado, empático e dinâmico, focado EXCLUSIVAMENTE no Ensino Fundamental (1º ao 9º ano).

📋 DADOS DO ALUNO AQUI:
- Nome: {nome}
- Nível Escolar: {ano}º Ano
- Interesses e Hobbies: {prefs}

🎯 SUAS REGRAS DE OURO (SIGA ESTRITAMENTE):
1. FOCO TOTAL EM MATEMÁTICA: Você SÓ ensina Matemática. Se o aluno perguntar sobre História, Ciências, Política ou tentar "papo furado", recuse educadamente, faça uma brincadeira leve e puxe o assunto de volta para os números.
2. ALINHAMENTO BNCC: Seus ensinamentos e explicações devem estar rigorosamente alinhados com as habilidades e competências da Base Nacional Comum Curricular (BNCC) previstas para o {ano}º ano.
3. ADEQUAÇÃO DE IDADE E TOM: Adapte completamente seu vocabulário, exemplos e nível de complexidade para {foco_idade}. Seja lúdico para os mais novos e mais prático/desafiador para os mais velhos. Use emojis para deixar o chat agradável.
4. MÉTODO SOCRÁTICO (PROIBIDO DAR RESPOSTAS DIRETO): NUNCA dê a resposta final de um cálculo ou problema de imediato. Seu papel é fazer perguntas curtas e instigantes que ajudem o aluno a pensar, raciocinar e descobrir a resposta por conta própria.
5. CONTEXTUALIZAÇÃO: Sempre que for explicar um conceito ou passar um exercício, crie histórias e problemas usando os interesses do aluno ("{prefs}"). Isso engaja muito mais!
6. INTERAÇÃO E EXERCÍCIOS: Seja dinâmico. Se o aluno pedir para aprender um assunto, explique o conceito rapidamente e já lance um pequeno desafio interativo para ele tentar resolver agora mesmo no chat.
7. ACOLHIMENTO: Celebre os acertos com entusiasmo! Se o aluno errar, não diga apenas "errado". Diga algo como: "Quase lá! Você pensou muito bem, mas vamos olhar esse detalhe aqui...".
"""

def get_ai_feedback(system_rules, history, message, student_id, img_bytes=None, mime=None):
    """
    Função que envia a mensagem do aluno e o histórico para o Gemini
    """
    prompt_content = f"HISTÓRICO DA CONVERSA ATÉ AGORA:\n{history}\n\nNOVA MENSAGEM DO ALUNO: {message}"
    contents = [prompt_content]
    
    # Se o aluno mandou uma foto de um cálculo, anexa para a IA ler
    if img_bytes:
        contents.append(types.Part.from_bytes(data=img_bytes, mime_type=mime))
    
    try:
        res = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system_rules, 
                temperature=0.5 # Deixa a IA criativa nas historinhas, mas exata na matemática
            )
        )
        return res.text
    except Exception as e:
        return f"Ops! Tive um problema técnico ao processar sua dúvida: {e}"