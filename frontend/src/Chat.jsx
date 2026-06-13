import React, { useState, useEffect, useRef } from 'react';
import BrandMark from './BrandMark';

function Chat({ user, onLogout }) {
  const [chat, setChat] = useState([{role: 'tutor', text: `Olá, ${user.nome}! Vamos praticar matemática do ${user.ano_escolar}º ano?`}]);
  const [input, setInput] = useState('');
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  // Faz a tela rolar para baixo automaticamente quando chega mensagem nova
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat, loading]);

  // Função para converter a imagem em texto (Base64) para enviar ao backend
  const convB64 = (file) => new Promise((res, rej) => {
    const r = new FileReader();
    r.readAsDataURL(file);
    r.onload = () => res(r.result.split(',')[1]);
    r.onerror = rej;
  });

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() && !img) return; // Não envia se estiver tudo vazio

    const msg = input;
    setInput('');
    setLoading(true);

    // Adiciona a mensagem do aluno na tela
    const newChat = [...chat, {role: 'student', text: msg || "(Foto enviada para análise)"}];
    setChat(newChat);

    const b64 = img ? await convB64(img) : null;
    const mtype = img ? img.type : null;
    setImg(null); // Limpa o anexo da tela após o envio

    try {
      const r = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          message: msg,
          aluno_nome: user.nome,
          ano_escolar: user.ano_escolar,
          student_id: user.id,
          preferencias: user.preferencias,
          imagem_base64: b64,
          mime_type: mtype
        })
      });
      const d = await r.json();
      setChat([...newChat, {role: 'tutor', text: d.response}]);
    } catch (error) {
      setChat([...newChat, {role: 'tutor', text: "Ocorreu um erro de comunicação com o servidor."}]);
    }
    setLoading(false);
  };

  return (
    <div style={pageStyle}>

      {/* CABEÇALHO */}
      <header style={headerStyle}>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <BrandMark size={42} />
          <div>
            <h3 style={{margin: 0, fontSize: '1.05rem', color: 'var(--ink)', fontWeight: 700}}>Tutor BNCC</h3>
            <small style={{color: 'var(--ink-soft)'}}>{user.ano_escolar}º ano do Ensino Fundamental</small>
          </div>
        </div>
        <button onClick={onLogout} style={logoutBtnStyle}>Sair</button>
      </header>

      {/* ÁREA DE MENSAGENS */}
      <div style={{flex: 1, overflowY: 'auto', padding: '24px 20px'}}>
        {chat.map((c, i) => (
          <div key={i} style={{marginBottom: '16px', display: 'flex', justifyContent: c.role === 'student' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '10px'}}>
            {c.role === 'tutor' && <BrandMark size={30} />}
            <div style={{
              padding: '12px 18px',
              borderRadius: c.role === 'student' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
              backgroundColor: c.role === 'student' ? 'var(--slate)' : 'var(--card-bg)',
              color: c.role === 'student' ? '#faf7f0' : 'var(--ink)',
              border: c.role === 'student' ? 'none' : '1px solid var(--paper-line)',
              maxWidth: '75%',
              boxShadow: '0 1px 4px rgba(43,43,46,0.06)',
              lineHeight: '1.55',
              fontSize: '0.95rem',
            }}>
              {c.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', gap: '10px'}}>
            <BrandMark size={30} />
            <div style={{padding: '12px 18px', borderRadius: '14px 14px 14px 2px', backgroundColor: 'var(--card-bg)', color: 'var(--ink-soft)', border: '1px solid var(--paper-line)', boxShadow: '0 1px 4px rgba(43,43,46,0.06)', fontSize: '0.9rem'}}>
              <em>O tutor está pensando…</em>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* ÁREA DE DIGITAÇÃO E ENVIO */}
      <div style={formWrapperStyle}>
        {/* Mostra um aviso se houver imagem anexada */}
        {img && (
          <div style={attachmentBannerStyle}>
            📸 Imagem anexada: {img.name}
            <span style={{marginLeft: '12px', cursor: 'pointer', fontWeight: 700}} onClick={() => setImg(null)}>Remover</span>
          </div>
        )}

        <form onSubmit={send} style={formStyle}>

          {/* Botão de Anexo */}
          <label title="Anexar foto do caderno/cálculo" style={attachLabelStyle}>
            📷
            <input type="file" accept="image/*" onChange={e => setImg(e.target.files[0])} style={{display: 'none'}} />
          </label>

          {/* Caixa de Texto */}
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            style={inputStyle}
            placeholder="Digite sua dúvida ou envie a foto do exercício…"
            disabled={loading}
          />

          <button type="submit" style={sendBtnStyle} disabled={loading || (!input.trim() && !img)}>
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

// Estilos
const pageStyle = {height: '100vh', display: 'flex', flexDirection: 'column'};
const headerStyle = {padding: '14px 22px', backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--paper-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(43,43,46,0.04)', zIndex: 10};
const logoutBtnStyle = {padding: '9px 18px', backgroundColor: 'var(--slate-light)', color: 'var(--slate)', border: 'none', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem'};
const formWrapperStyle = {padding: '14px 20px', backgroundColor: 'var(--card-bg)', borderTop: '1px solid var(--paper-line)'};
const attachmentBannerStyle = {padding: '8px 12px', backgroundColor: 'var(--chalk-light)', color: 'var(--chalk)', borderRadius: '8px', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 600};
const formStyle = {display: 'flex', alignItems: 'center', gap: '10px'};
const attachLabelStyle = {cursor: 'pointer', fontSize: '1.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '46px', height: '46px', backgroundColor: 'var(--slate-light)', borderRadius: '50%', flexShrink: 0};
const inputStyle = {flex: 1, padding: '13px 18px', borderRadius: '24px', border: '1px solid var(--paper-line)', fontSize: '0.95rem', backgroundColor: '#fdfcf9', outline: 'none', color: 'var(--ink)'};
const sendBtnStyle = {padding: '13px 26px', backgroundColor: 'var(--slate)', color: '#faf7f0', border: 'none', borderRadius: '24px', fontWeight: 700, fontSize: '0.92rem'};

export default Chat;
