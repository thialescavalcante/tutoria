import React, { useState } from 'react';
import BrandMark from './BrandMark';

function Login({ onLoginSucesso, onIrParaCadastro }) {
  const [view, setView] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ email: '', senha: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [resetData, setResetData] = useState({ token: '', nova_senha: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const r = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ login: f.email, senha: f.senha })
    });
    const d = await r.json();
    setLoading(false);
    if (d.success) onLoginSucesso(d.user); else alert(d.message);
  };

  const handlePedirToken = async (e) => {
    e.preventDefault();
    setLoading(true);
    const r = await fetch(`${import.meta.env.VITE_API_URL}/api/forgot-password`, {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email: resetEmail })
    });
    const d = await r.json();
    setLoading(false);
    alert(d.message);
    if (d.success) setView('reset');
  };

  const handleSalvarSenha = async (e) => {
    e.preventDefault();
    setLoading(true);
    const r = await fetch(`${import.meta.env.VITE_API_URL}/api/reset-password`, {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email: resetEmail, token: resetData.token, nova_senha: resetData.nova_senha })
    });
    const d = await r.json();
    setLoading(false);
    alert(d.message);
    if (d.success) setView('login');
  };

  return (
    <div style={pageStyle}>

      {view === 'login' && (
        <form onSubmit={handleLogin} style={cardStyle}>
          <div style={brandRowStyle}>
            <BrandMark />
            <div>
              <h2 style={titleStyle}>Tutor BNCC</h2>
              <p style={subtitleStyle}>Matemática passo a passo</p>
            </div>
          </div>

          <label style={labelStyle}>E-mail ou usuário</label>
          <input placeholder="seu@email.com" onChange={e => setF({...f, email: e.target.value})} style={inputStyle} required />

          <label style={labelStyle}>Senha</label>
          <div style={{position: 'relative'}}>
            <input placeholder="••••••••" type={showPass ? "text" : "password"} onChange={e => setF({...f, senha: e.target.value})} style={inputStyle} required />
            <span onClick={() => setShowPass(!showPass)} style={eyeIconStyle}>{showPass ? '🙈' : '👁️'}</span>
          </div>

          <div style={{textAlign: 'right', marginBottom: '18px'}}>
            <small onClick={() => setView('forgot')} style={linkStyle}>Esqueci minha senha</small>
          </div>

          <button type="submit" style={btnStyle} disabled={loading}>{loading ? 'Verificando…' : 'Entrar'}</button>
          <p onClick={onIrParaCadastro} style={secondaryLinkStyle}>Criar conta gratuita</p>
        </form>
      )}

      {view === 'forgot' && (
        <form onSubmit={handlePedirToken} style={cardStyle}>
          <div style={brandRowStyle}>
            <BrandMark variant="chalk" />
            <div>
              <h2 style={titleStyle}>Recuperação</h2>
              <p style={subtitleStyle}>Vamos enviar um código</p>
            </div>
          </div>

          <label style={labelStyle}>E-mail da sua conta</label>
          <input placeholder="seu@email.com" type="email" onChange={e => setResetEmail(e.target.value)} style={inputStyle} required />
          <button type="submit" style={btnStyle} disabled={loading}>{loading ? 'Enviando…' : 'Enviar código'}</button>
          <p onClick={() => setView('login')} style={secondaryLinkStyle}>Voltar</p>
        </form>
      )}

      {view === 'reset' && (
        <form onSubmit={handleSalvarSenha} style={cardStyle}>
          <div style={brandRowStyle}>
            <BrandMark variant="chalk" />
            <div>
              <h2 style={titleStyle}>Nova senha</h2>
              <p style={subtitleStyle}>Confira seu e-mail</p>
            </div>
          </div>

          <label style={labelStyle}>Código de 6 dígitos</label>
          <input placeholder="000000" onChange={e => setResetData({...resetData, token: e.target.value})} style={{...inputStyle, textAlign: 'center', letterSpacing: '6px', fontWeight: 600}} required />

          <label style={labelStyle}>Nova senha</label>
          <div style={{position: 'relative'}}>
            <input placeholder="••••••••" type={showPass ? "text" : "password"} onChange={e => setResetData({...resetData, nova_senha: e.target.value})} style={inputStyle} required />
            <span onClick={() => setShowPass(!showPass)} style={eyeIconStyle}>{showPass ? '🙈' : '👁️'}</span>
          </div>

          <button type="submit" style={btnStyle} disabled={loading}>{loading ? 'Salvando…' : 'Alterar senha'}</button>
        </form>
      )}

    </div>
  );
}

const pageStyle = {display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px'};

const cardStyle = {
  background: 'var(--card-bg)',
  padding: '36px',
  borderRadius: '14px',
  border: '1px solid var(--paper-line)',
  boxShadow: '0 8px 24px rgba(43,43,46,0.08)',
  width: '100%',
  maxWidth: '380px',
};

const brandRowStyle = {display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '26px'};
const titleStyle = {margin: 0, color: 'var(--ink)', fontSize: '1.3rem', fontWeight: 700};
const subtitleStyle = {margin: '2px 0 0', color: 'var(--ink-soft)', fontSize: '0.85rem'};

const labelStyle = {display: 'block', marginBottom: '6px', color: 'var(--ink-soft)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em'};

const inputStyle = {
  display: 'block', width: '100%', padding: '12px 14px', marginBottom: '16px',
  borderRadius: '8px', border: '1px solid var(--paper-line)', boxSizing: 'border-box',
  fontSize: '0.95rem', backgroundColor: '#fdfcf9', color: 'var(--ink)',
};

const btnStyle = {
  width: '100%', padding: '13px', background: 'var(--slate)', color: '#faf7f0',
  border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem',
  letterSpacing: '0.01em',
};

const eyeIconStyle = {position: 'absolute', right: '12px', top: '11px', cursor: 'pointer', fontSize: '1.15rem'};

const linkStyle = {cursor: 'pointer', color: 'var(--slate)', fontWeight: 600};

const secondaryLinkStyle = {textAlign: 'center', cursor: 'pointer', color: 'var(--slate)', marginTop: '18px', fontWeight: 600, fontSize: '0.9rem'};

export default Login;
