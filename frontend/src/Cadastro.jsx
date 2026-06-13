import React, { useState } from 'react';
import BrandMark from './BrandMark';

function Cadastro({ onVoltar, onCadastroSucesso }) {
  const [step, setStep] = useState('form'); // 'form' ou 'verify'
  const [showPass, setShowPass] = useState(false);
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const [f, setF] = useState({
    nome: '',
    username: '',
    email: '',
    senha: '',
    data_nascimento: '',
    genero: '',
    ano_escolar: '5',
    preferencias: ''
  });

  const sub = async (e) => {
    e.preventDefault();
    if (f.senha !== confirmarSenha) return alert("As senhas não coincidem!");

    setLoading(true);
    const r = await fetch('http://127.0.0.1:5000/api/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(f)
    });
    const d = await r.json();
    setLoading(false);

    if (d.success) {
      alert(d.message);
      setStep('verify');
    } else {
      alert(d.message);
    }
  };

  const confirmarAtivacao = async (e) => {
    e.preventDefault();
    setLoading(true);
    const r = await fetch('http://127.0.0.1:5000/api/verify-registration', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email: f.email, token })
    });
    const d = await r.json();
    setLoading(false);

    if (d.success) {
      alert(d.message);
      onCadastroSucesso();
    } else {
      alert(d.message);
    }
  };

  // --- TELA DE VERIFICAÇÃO DE CÓDIGO ---
  if (step === 'verify') return (
    <div style={pageStyle}>
      <div style={{...cardStyle, maxWidth: '420px', textAlign: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', marginBottom: '22px'}}>
          <BrandMark variant="chalk" size={52} />
          <div>
            <h2 style={{...titleStyle, textAlign: 'center'}}>Verifique seu e-mail</h2>
            <p style={subtitleStyle}>Enviamos um código de 6 dígitos para</p>
            <p style={{fontWeight: 700, color: 'var(--ink)', margin: '4px 0 0'}}>{f.email}</p>
          </div>
        </div>
        <input
          placeholder="000000"
          maxLength="6"
          onChange={e => setToken(e.target.value)}
          style={{...inputStyle, textAlign: 'center', fontSize: '1.4rem', letterSpacing: '8px', fontWeight: 700}}
        />
        <button onClick={confirmarAtivacao} style={btnStyle} disabled={loading}>
          {loading ? 'Ativando…' : 'Ativar minha conta'}
        </button>
      </div>
    </div>
  );

  // --- FORMULÁRIO DE CADASTRO COMPLETO ---
  return (
    <div style={{padding: '20px', maxWidth: '520px', margin: '0 auto'}}>
      <form onSubmit={sub} style={{...cardStyle, maxWidth: 'none', marginTop: '24px', marginBottom: '24px'}}>
        <div style={brandRowStyle}>
          <BrandMark />
          <div>
            <h3 style={titleStyle}>Novo cadastro</h3>
            <p style={subtitleStyle}>Vamos personalizar seus estudos</p>
          </div>
        </div>

        <label style={labelStyle}>Nome completo</label>
        <input placeholder="Como podemos te chamar?" onChange={e => setF({...f, nome: e.target.value})} required style={inputStyle} />

        <label style={labelStyle}>Nome de usuário</label>
        <input placeholder="Escolha um nome de usuário" onChange={e => setF({...f, username: e.target.value})} required style={inputStyle} />

        <label style={labelStyle}>E-mail</label>
        <input placeholder="seu@email.com" type="email" onChange={e => setF({...f, email: e.target.value})} required style={inputStyle} />

        <label style={labelStyle}>Senha</label>
        <div style={{position: 'relative'}}>
          <input
            placeholder="Crie uma senha"
            type={showPass ? "text" : "password"}
            onChange={e => setF({...f, senha: e.target.value})}
            required
            style={inputStyle}
          />
          <span onClick={() => setShowPass(!showPass)} style={eyeIconStyle}>{showPass ? '🙈' : '👁️'}</span>
        </div>

        <label style={labelStyle}>Confirme a senha</label>
        <input
          placeholder="Repita a senha"
          type={showPass ? "text" : "password"}
          onChange={e => setConfirmarSenha(e.target.value)}
          required
          style={inputStyle}
        />

        <div style={{display: 'flex', gap: '12px'}}>
          <div style={{flex: 1}}>
            <label style={labelStyle}>Data de nascimento</label>
            <input type="date" onChange={e => setF({...f, data_nascimento: e.target.value})} required style={inputStyle} />
          </div>
          <div style={{flex: 1}}>
            <label style={labelStyle}>Gênero</label>
            <select onChange={e => setF({...f, genero: e.target.value})} required style={inputStyle} defaultValue="">
              <option value="" disabled>Selecionar…</option>
              <option value="Feminino">Feminino</option>
              <option value="Masculino">Masculino</option>
              <option value="Outro">Outro</option>
              <option value="Não informar">Não informar</option>
            </select>
          </div>
        </div>

        <label style={labelStyle}>Ano escolar</label>
        <select onChange={e => setF({...f, ano_escolar: e.target.value})} style={inputStyle} defaultValue="5">
          {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n}>{n}º ano (Ensino Fundamental)</option>)}
          <option value="Outro">Outro / Reforço geral</option>
        </select>

        <label style={labelStyle}>Suas preferências (hobbies, temas que gosta)</label>
        <input
          placeholder="Ex: futebol, Minecraft, espaço, música…"
          onChange={e => setF({...f, preferencias: e.target.value})}
          style={inputStyle}
        />

        <button type="submit" style={{...btnStyle, marginTop: '6px'}} disabled={loading}>
          {loading ? 'Enviando…' : 'Cadastrar e validar e-mail'}
        </button>

        <p onClick={onVoltar} style={secondaryLinkStyle}>
          Já tenho uma conta. Voltar.
        </p>
      </form>
    </div>
  );
}

// Estilos
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

const brandRowStyle = {display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px'};
const titleStyle = {margin: 0, color: 'var(--ink)', fontSize: '1.25rem', fontWeight: 700};
const subtitleStyle = {margin: '2px 0 0', color: 'var(--ink-soft)', fontSize: '0.85rem'};

const labelStyle = {display: 'block', marginBottom: '6px', color: 'var(--ink-soft)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em'};

const inputStyle = {
  display: 'block', width: '100%', padding: '12px 14px', marginBottom: '14px',
  borderRadius: '8px', border: '1px solid var(--paper-line)', boxSizing: 'border-box',
  fontSize: '0.92rem', backgroundColor: '#fdfcf9', color: 'var(--ink)',
};

const btnStyle = {
  width: '100%', padding: '14px', background: 'var(--slate)', color: '#faf7f0',
  border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem',
};

const eyeIconStyle = {position: 'absolute', right: '12px', top: '11px', cursor: 'pointer', fontSize: '1.15rem', zIndex: 2};

const secondaryLinkStyle = {textAlign: 'center', cursor: 'pointer', color: 'var(--slate)', marginTop: '18px', fontWeight: 600, fontSize: '0.9rem'};

export default Cadastro;
