import React, { useState } from 'react';
import { 
  Dumbbell, CheckCircle, LayoutDashboard, User, Zap, 
  Monitor, Shield, Users, ArrowRight, XCircle, Activity, Lock, Mail, Plus, List,
  Calendar, BarChart3, Settings, LogOut, Search, Clock, Save, ChevronLeft, ClipboardList
} from 'lucide-react';

// --- COMPONENTES UI REUTILIZÁVEIS ---
const GlassCard = ({ children, style, type = 'default' }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(12px)',
    borderRadius: '28px',
    border: `1px solid ${type === 'personal' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.08)'}`,
    padding: '32px',
    transition: '0.3s',
    ...style
  }}>{children}</div>
);

const SectionTitle = ({ subtitle, title, color = '#22c55e', centered = true }) => (
  <div style={{ textAlign: centered ? 'center' : 'left', marginBottom: '60px' }}>
    <span style={{ color: color, fontWeight: 'bold', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase' }}>{subtitle}</span>
    <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '900', marginTop: '10px', lineHeight: '1.1' }}>{title}</h2>
  </div>
);

// --- APP PRINCIPAL ---
export default function OmniFitApp() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null); 
  const [emailInput, setEmailInput] = useState('');
  const [senhaInput, setSenhaInput] = useState('');
  
  // ESTADO GLOBAL DE TREINOS
  const [treinosPorAluno, setTreinosPorAluno] = useState({
    "Julio Cesar": { Segunda: 'Supino Reto (4x10), Peck Deck (3x12), Tríceps Pulley (4x15)', Terça: 'Puxada Frente (4x12), Remada Curvada (3x12)', Quarta: '', Quinta: '', Sexta: '' },
    "Igor Matos": { Segunda: '', Terça: '', Quarta: '', Quinta: '', Sexta: '' },
    "Luan Martiniano": { Segunda: '', Terça: '', Quarta: '', Quinta: '', Sexta: '' }
  });

  const [editingAluno, setEditingAluno] = useState(null); 
  const [viewingFicha, setViewingFicha] = useState(null);
  const [formTreino, setFormTreino] = useState({ Segunda: '', Terça: '', Quarta: '', Quinta: '', Sexta: '' });

  const handleLogout = () => {
    setUser(null);
    setPage('landing');
    setViewingFicha(null);
    window.scrollTo(0, 0);
  };

  const handleSaveTreino = () => {
    setTreinosPorAluno({ ...treinosPorAluno, [editingAluno]: formTreino });
    alert(`Ficha atualizada para ${editingAluno}!`);
    setEditingAluno(null);
  };

  // --- TELA 1: LANDING PAGE ---
  if (page === 'landing') return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: 'white', fontFamily: '"Inter", sans-serif', scrollBehavior: 'smooth' }}>
      <header style={{ position: 'fixed', top: 0, width: '100%', padding: '20px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, backgroundColor: 'rgba(5, 5, 5, 0.8)', backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: '900', letterSpacing: '-1px' }}>
          <div style={{ backgroundColor: '#22c55e', padding: '5px', borderRadius: '8px' }}><Dumbbell size={24} color="black" /></div>
          OMNIFIT<span style={{ color: '#22c55e' }}>.</span>
        </div>
        <button onClick={() => setPage('login')} style={{ backgroundColor: '#22c55e', color: 'black', border: 'none', padding: '10px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Entrar</button>
      </header>

      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px', background: 'radial-gradient(circle at 50% -20%, #064e3b 0%, #050505 70%)' }}>
        <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '8px 20px', borderRadius: '50px', fontSize: '12px', fontWeight: 'bold', marginBottom: '30px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>⚡️ TECNOLOGIA QUE ACELERA SEU RESULTADO</div>
        <h1 style={{ fontSize: 'clamp(45px, 10vw, 90px)', fontWeight: '900', lineHeight: '0.85', letterSpacing: '-4px', margin: '0 0 30px 0' }}>EVOLUA SUA <br/><span style={{ color: '#22c55e' }}>EXPERIÊNCIA.</span></h1>
        <p style={{ color: '#9ca3af', maxWidth: '600px', fontSize: '20px', lineHeight: '1.6', marginBottom: '50px' }}>A plataforma completa para alunos e personais que buscam alta performance, gestão simplificada e treinos inteligentes.</p>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => setPage('plans')} style={{ backgroundColor: '#22c55e', color: 'black', border: 'none', padding: '20px 45px', borderRadius: '18px', fontWeight: '900', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>CONHEÇA NOSSOS PLANOS <ArrowRight size={20} /></button>
          <button onClick={() => setPage('login')} style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid #374151', padding: '20px 45px', borderRadius: '18px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>ÁREA DO ALUNO</button>
        </div>
      </section>

      {/* METRICAS RESTAURADAS */}
      <section style={{ padding: '100px 20px', backgroundColor: '#080808', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', textAlign: 'center' }}>
          <div><h3 style={{ fontSize: '48px', fontWeight: '900', color: '#22c55e', margin: 0 }}>+50k</h3><p style={{ color: '#4b5563', fontWeight: 'bold' }}>ALUNOS ATIVOS</p></div>
          <div><h3 style={{ fontSize: '48px', fontWeight: '900', color: '#22c55e', margin: 0 }}>98%</h3><p style={{ color: '#4b5563', fontWeight: 'bold' }}>SATISFAÇÃO</p></div>
          <div><h3 style={{ fontSize: '48px', fontWeight: '900', color: '#22c55e', margin: 0 }}>24/7</h3><p style={{ color: '#4b5563', fontWeight: 'bold' }}>SUPORTE TÉCNICO</p></div>
        </div>
      </section>

      {/* DIFERENCIAIS RESTAURADOS */}
      <section style={{ padding: '120px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <SectionTitle subtitle="DIFERENCIAIS" title="Tudo o que você precisa em um só lugar" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <GlassCard><Monitor size={40} color="#22c55e" style={{ marginBottom: '20px' }} /><h4 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px' }}>Ecossistema Digital</h4><p style={{ color: '#9ca3af', lineHeight: '1.6' }}>Interface web responsiva otimizada para qualquer dispositivo. Acesse seus treinos instantaneamente.</p></GlassCard>
          <GlassCard><Users size={40} color="#22c55e" style={{ marginBottom: '20px' }} /><h4 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px' }}>Conexão com Personal</h4><p style={{ color: '#9ca3af', lineHeight: '1.6' }}>Sincronização direta com seu treinador para ajustes imediatos e consultoria via painel integrado.</p></GlassCard>
          <GlassCard><Shield size={40} color="#22c55e" style={{ marginBottom: '20px' }} /><h4 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px' }}>Gestão de Pagamentos</h4><p style={{ color: '#9ca3af', lineHeight: '1.6' }}>Pagamento seguro via PIX ou Cartão com liberação automática de acesso à sua ficha de treino.</p></GlassCard>
        </div>
      </section>
    </div>
  );

  // --- TELA DE PLANOS (RESTAURADA CONFORME REFERÊNCIA) ---
  if (page === 'plans') return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: 'white', padding: '100px 20px', background: 'radial-gradient(circle at 50% 0%, #064e3b 0%, #050505 50%)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button onClick={() => setPage('landing')} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontWeight: 'bold' }}>← VOLTAR PARA HOME</button>
        <SectionTitle subtitle="PLANOS DISPONÍVEIS" title="Escolha a sua jornada de evolução" />
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '40px' }}>
          
          <GlassCard style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '10px' }}>Plano Fit</h3>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px', minHeight: '42px' }}>O plano essencial para treinar na unidade escolhida.</p>
            <div style={{ marginBottom: '30px' }}>
              <span style={{ fontSize: '14px', color: '#4b5563', textDecoration: 'line-through' }}>R$ 99,90</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}><span style={{ fontSize: '48px', fontWeight: '900', color: '#22c55e' }}>R$ 0,00*</span><span style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>100% OFF</span></div>
              <p style={{ color: '#9ca3af', fontSize: '13px' }}>no 1º mês, depois R$ 99,90/mês</p>
            </div>
            <button onClick={() => setPage('login')} style={{ width: '100%', padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: '#22c55e', color: 'black', fontWeight: '900', cursor: 'pointer', marginBottom: '30px' }}>CONTRATAR AGORA</button>
            <ul style={{ padding: 0, listStyle: 'none', borderTop: '1px solid #1f2937', paddingTop: '20px', flexGrow: 1 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#d1d5db' }}><CheckCircle size={18} color="#22c55e" /> Área de musculação e aeróbicos</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#d1d5db' }}><CheckCircle size={18} color="#22c55e" /> OmniFit App</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#4b5563' }}><XCircle size={18} /> Acesso ilimitado a outras unidades</li>
            </ul>
          </GlassCard>

          <GlassCard style={{ flex: 1, minWidth: '320px', border: '2px solid #22c55e', position: 'relative', background: 'rgba(34, 197, 94, 0.05)', display: 'flex', flexDirection: 'column', transform: 'scale(1.05)' }}>
            <div style={{ position: 'absolute', top: '-15px', left: '20px', backgroundColor: '#22c55e', color: 'black', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '900' }}>O MAIS VANTAJOSO</div>
            <h3 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '10px' }}>Plano Black</h3>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px', minHeight: '42px' }}>Acesso total às unidades OmniFit no Brasil e América Latina.</p>
            <div style={{ marginBottom: '30px' }}>
              <span style={{ fontSize: '14px', color: '#4b5563', textDecoration: 'line-through' }}>R$ 159,90</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}><span style={{ fontSize: '48px', fontWeight: '900', color: '#22c55e' }}>R$ 0,00*</span><span style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>100% OFF</span></div>
              <p style={{ color: '#9ca3af', fontSize: '13px' }}>no 1º mês, depois R$ 159,90/mês</p>
            </div>
            <button onClick={() => setPage('login')} style={{ width: '100%', padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: '#22c55e', color: 'black', fontWeight: '900', cursor: 'pointer', marginBottom: '30px' }}>CONTRATAR AGORA</button>
            <ul style={{ padding: 0, listStyle: 'none', borderTop: '1px solid #1f2937', paddingTop: '20px', flexGrow: 1 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#d1d5db', fontWeight: 'bold' }}><CheckCircle size={18} color="#22c55e" /> Acesso ilimitado a +2.000 un.</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#d1d5db' }}><CheckCircle size={18} color="#22c55e" /> Leve 5 amigos por mês</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#d1d5db' }}><CheckCircle size={18} color="#22c55e" /> Cadeira de massagem</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#d1d5db' }}><CheckCircle size={18} color="#22c55e" /> Sem taxa de cancelamento</li>
            </ul>
          </GlassCard>

          <GlassCard style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '10px' }}>Plano Smart</h3>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px', minHeight: '42px' }}>Liberdade total sem fidelidade.</p>
            <div style={{ marginBottom: '30px' }}>
              <span style={{ fontSize: '14px', color: '#4b5563', textDecoration: 'line-through' }}>R$ 119,90</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}><span style={{ fontSize: '48px', fontWeight: '900', color: '#22c55e' }}>R$ 0,00*</span><span style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>100% OFF</span></div>
              <p style={{ color: '#9ca3af', fontSize: '13px' }}>no 1º mês, depois R$ 119,90/mês</p>
            </div>
            <button onClick={() => setPage('login')} style={{ width: '100%', padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: '#22c55e', color: 'black', fontWeight: '900', cursor: 'pointer', marginBottom: '30px' }}>CONTRATAR AGORA</button>
            <ul style={{ padding: 0, listStyle: 'none', borderTop: '1px solid #1f2937', paddingTop: '20px', flexGrow: 1 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#d1d5db' }}><CheckCircle size={18} color="#22c55e" /> Sem fidelidade</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#d1d5db' }}><CheckCircle size={18} color="#22c55e" /> Área de musculação</li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );

  // --- DASHBOARD DO ALUNO ---
  if (page === 'dashboard_aluno' && user) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', display: 'flex', color: 'white' }}>
      <aside style={{ width: '280px', borderRight: '1px solid #1f2937', padding: '40px 24px' }}>
        <div style={{ fontWeight: '900', fontSize: '24px', color: '#22c55e', marginBottom: '40px' }}>OMNIFIT.</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div onClick={() => setViewingFicha(null)} style={{ cursor: 'pointer', padding: '16px', borderRadius: '12px', backgroundColor: !viewingFicha ? 'rgba(34, 197, 94, 0.1)' : 'transparent', color: !viewingFicha ? '#22c55e' : '#4b5563', fontWeight: 'bold' }}><LayoutDashboard size={20}/> DASHBOARD</div>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '60px', overflowY: 'auto' }}>
        <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'60px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900' }}>{viewingFicha ? `Ficha: ${viewingFicha.dia}` : `Olá, ${user.nome}!`}</h2>
          <button onClick={handleLogout} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid #374151', color:'#9ca3af', padding:'10px 20px', borderRadius:'12px', cursor:'pointer' }}>Sair</button>
        </header>

        {!viewingFicha ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
            {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map((dia) => {
              // PREVENÇÃO DO ERRO UNDEFINED
              const treinosDoAluno = treinosPorAluno[user.nome] || { Segunda: '', Terça: '', Quarta: '', Quinta: '', Sexta: '' };
              const treino = treinosDoAluno[dia];
              return (
                <div key={dia} style={{ background: 'rgba(255,255,255,0.02)', border: treino ? '1px solid #22c55e' : '1px solid #111', borderRadius: '24px', padding: '24px' }}>
                  <span style={{ color: '#4b5563', fontWeight: 'bold', fontSize: '11px' }}>{dia.toUpperCase()}</span>
                  <h4 style={{ fontSize: '18px', margin: '10px 0', color: treino ? 'white' : '#333' }}>{treino ? treino.split(',')[0] : 'Vazio'}</h4>
                  {treino && <button onClick={() => setViewingFicha({ dia, conteudo: treino })} style={{ width: '100%', marginTop: '15px', padding: '10px', borderRadius: '10px', background: '#22c55e', color: 'black', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>VER FICHA</button>}
                </div>
              );
            })}
          </div>
        ) : (
          <GlassCard style={{ borderLeft: '6px solid #22c55e' }}>
            <button onClick={() => setViewingFicha(null)} style={{ background:'none', border:'none', color:'#22c55e', cursor:'pointer', marginBottom:'20px', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px' }}><ChevronLeft size={18}/> VOLTAR</button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {viewingFicha.conteudo.split(',').map((ex, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px' }}>{ex.trim()}</span>
                        <CheckCircle size={20} color="#22c55e" />
                    </div>
                ))}
            </div>
          </GlassCard>
        )}
      </main>
    </div>
  );

  // --- DASHBOARD DO PERSONAL ---
  if (page === 'dashboard_personal' && user) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', display: 'flex', color: 'white' }}>
      <aside style={{ width: '280px', borderRight: '1px solid #1e293b', padding: '40px 24px', background: '#020617' }}>
        <div style={{ fontWeight: '900', fontSize: '24px', color: '#3b82f6', marginBottom: '40px' }}><Shield size={24} /> OMNI.PRO</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div onClick={() => setEditingAluno(null)} style={{ cursor: 'pointer', padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}><Users size={20}/> Alunos</div>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '60px', overflowY: 'auto' }}>
        {!editingAluno ? (
          <>
            <header style={{ display:'flex', justifyContent:'space-between', marginBottom:'60px' }}>
              <div><h2 style={{ fontSize: '36px', fontWeight: '900' }}>Gestão Pro</h2><p style={{ color: '#64748b' }}>Coach {user.nome}</p></div>
              <button onClick={handleLogout} style={{ background:'rgba(59, 130, 246, 0.05)', border:'1px solid #1e293b', color:'#64748b', padding:'12px 24px', borderRadius:'12px', cursor:'pointer' }}><LogOut size={18} /></button>
            </header>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {Object.keys(treinosPorAluno).map((aluno) => (
                <GlassCard key={aluno} type="personal" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 'bold' }}>{aluno}</h4>
                  <button onClick={() => { setEditingAluno(aluno); setFormTreino(treinosPorAluno[aluno]); }} style={{ padding: '10px 20px', borderRadius: '10px', background: '#3b82f6', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>EDITAR TREINOS</button>
                </GlassCard>
              ))}
            </div>
          </>
        ) : (
          <div>
            <button onClick={() => setEditingAluno(null)} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', display: 'flex', alignItems:'center', gap:'8px', marginBottom:'20px' }}><ChevronLeft /> Voltar</button>
            <SectionTitle subtitle="EDITOR" title={editingAluno} color="#3b82f6" centered={false} />
            {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map((dia) => (
              <div key={dia} style={{ marginBottom: '15px' }}>
                <label style={{ display:'block', color:'#3b82f6', fontWeight:'bold', marginBottom:'5px' }}>{dia}</label>
                <input style={{ width:'100%', background:'#0a0f1e', border:'1px solid #1e293b', padding:'15px', borderRadius:'12px', color:'white', outline:'none' }} value={formTreino[dia]} onChange={(e) => setFormTreino({...formTreino, [dia]: e.target.value})} placeholder="Exercícios (separe por vírgula)..." />
              </div>
            ))}
            <button onClick={handleSaveTreino} style={{ width: '100%', padding: '20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' }}><Save /> SALVAR TREINOS</button>
          </div>
        )}
      </main>
    </div>
  );

  // --- TELA DE LOGIN ---
  if (page === 'login') return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <GlassCard style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <Dumbbell size={40} color="#22c55e" style={{ margin: '0 auto 20px' }} />
        <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '30px' }}>Login</h2>
        <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} style={{ width: '100%', background: '#111', border: '1px solid #1f2937', borderRadius: '12px', padding: '15px', color: 'white', marginBottom: '15px', outline: 'none' }} placeholder="E-mail" />
        <input type="password" value={senhaInput} onChange={(e) => setSenhaInput(e.target.value)} style={{ width: '100%', background: '#111', border: '1px solid #1f2937', borderRadius: '12px', padding: '15px', color: 'white', marginBottom: '30px', outline: 'none' }} placeholder="Senha" />
        <button onClick={() => {
          if(emailInput.includes('personal')) { setUser({ nome: 'Coach Julio', tipo: 'PERSONAL' }); setPage('dashboard_personal'); }
          else { 
            const email = emailInput.toLowerCase();
            const nome = email.includes('julio') ? 'Julio Cesar' : email.includes('igor') ? 'Igor Matos' : 'Luan Martiniano';
            setUser({ nome, tipo: 'ALUNO', plano: 'Omni Black' }); 
            setPage('dashboard_aluno'); 
          }
        }} style={{ width: '100%', padding: '16px', borderRadius: '12px', backgroundColor: '#22c55e', color: 'black', fontWeight: '900', border: 'none', cursor: 'pointer' }}>ENTRAR</button>
      </GlassCard>
    </div>
  );

  return null;
}