import React, { useState, useEffect } from 'react';
import BrandMark from './BrandMark';

function Admin({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const heads = {'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}`};

  const load = async () => {
    const r = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {headers: heads});
    const d = await r.json(); if (d.success) setUsers(d.users);
  };
  useEffect(() => { load(); }, []);

  const toggle = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/admin/toggle`, {method: 'POST', headers: heads, body: JSON.stringify({id})});
    load();
  };

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <BrandMark size={42} variant="chalk" />
          <div>
            <h2 style={{margin: 0, fontSize: '1.1rem', color: 'var(--ink)', fontWeight: 700}}>Painel administrativo</h2>
            <small style={{color: 'var(--ink-soft)'}}>Gerencie o acesso dos alunos</small>
          </div>
        </div>
        <button onClick={onLogout} style={logoutBtnStyle}>Sair</button>
      </header>

      <div style={contentStyle}>
        <div style={cardStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Nome</th>
                <th style={thStyle}>Ano escolar</th>
                <th style={thStyle}>Status</th>
                <th style={{...thStyle, textAlign: 'right'}}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={trStyle}>
                  <td style={tdStyle}>{u.nome}</td>
                  <td style={tdStyle}>{u.ano_escolar}º ano</td>
                  <td style={tdStyle}>
                    <span style={u.ativo ? statusActiveStyle : statusInactiveStyle}>
                      {u.ativo ? 'Ativo' : 'Bloqueado'}
                    </span>
                  </td>
                  <td style={{...tdStyle, textAlign: 'right'}}>
                    <button onClick={() => toggle(u.id)} style={u.ativo ? blockBtnStyle : unlockBtnStyle}>
                      {u.ativo ? 'Bloquear' : 'Liberar'}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" style={{...tdStyle, textAlign: 'center', color: 'var(--ink-soft)', padding: '24px'}}>
                    Nenhum aluno cadastrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Estilos
const pageStyle = {minHeight: '100vh', display: 'flex', flexDirection: 'column'};
const headerStyle = {padding: '14px 22px', backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--paper-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(43,43,46,0.04)'};
const logoutBtnStyle = {padding: '9px 18px', backgroundColor: 'var(--slate-light)', color: 'var(--slate)', border: 'none', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem'};
const contentStyle = {padding: '24px 20px', flex: 1};
const cardStyle = {background: 'var(--card-bg)', borderRadius: '14px', border: '1px solid var(--paper-line)', boxShadow: '0 8px 24px rgba(43,43,46,0.06)', overflow: 'hidden', maxWidth: '900px', margin: '0 auto'};
const tableStyle = {width: '100%', borderCollapse: 'collapse'};
const thStyle = {textAlign: 'left', padding: '14px 18px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-soft)', borderBottom: '1px solid var(--paper-line)', backgroundColor: 'var(--slate-light)'};
const trStyle = {borderBottom: '1px solid var(--paper-line)'};
const tdStyle = {padding: '14px 18px', fontSize: '0.92rem', color: 'var(--ink)'};
const statusActiveStyle = {padding: '4px 12px', borderRadius: '20px', backgroundColor: 'var(--slate-light)', color: 'var(--slate)', fontWeight: 700, fontSize: '0.8rem'};
const statusInactiveStyle = {padding: '4px 12px', borderRadius: '20px', backgroundColor: 'var(--chalk-light)', color: 'var(--chalk)', fontWeight: 700, fontSize: '0.8rem'};
const blockBtnStyle = {padding: '8px 16px', backgroundColor: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem'};
const unlockBtnStyle = {padding: '8px 16px', backgroundColor: 'var(--slate)', color: '#faf7f0', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem'};

export default Admin;
