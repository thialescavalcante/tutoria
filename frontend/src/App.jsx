import React, { useState } from 'react';
import Login from './Login';
import Cadastro from './Cadastro';
import Chat from './Chat';
import Admin from './Admin';

function App() {
  const [view, setView] = useState('login'); 
  const [user, setUser] = useState(null);

  const out = () => { setUser(null); setView('login'); };

  if (view === 'login') return <Login onIrParaCadastro={() => setView('register')} onLoginSucesso={u => { setUser(u); setView(u.role === 'admin' ? 'admin' : 'chat'); }} />;
  if (view === 'register') return <Cadastro onVoltar={() => setView('login')} onCadastroSucesso={() => { alert("Criado!"); setView('login'); }} />;
  if (view === 'chat') return <Chat user={user} onLogout={out} />;
  if (view === 'admin') return <Admin user={user} onLogout={out} />;

  return <div>Erro</div>;
}
export default App;