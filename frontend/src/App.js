import React, { useState, useEffect } from 'react'; // Adicionado useEffect
import { 
  Dumbbell, CheckCircle, LayoutDashboard, User, Zap, 
  Monitor, Shield, Users, ArrowRight, XCircle, Activity, Lock, Mail, Plus, List,
  Calendar, BarChart3, Settings, LogOut, Search, Clock, Save, ChevronLeft, ClipboardList,
  UserPlus, FileText, AlertTriangle, PieChart
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

const inputStyle = { 
  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid #333', 
  padding: '15px', borderRadius: '12px', color: 'white', outline: 'none', marginBottom: '15px' 
};

// --- APP PRINCIPAL ---
export default function OmniFitApp() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null); 
  const [emailInput, setEmailInput] = useState('');
  const [senhaInput, setSenhaInput] = useState('');
  
  // 1. ESTADO DE ALUNOS COM PERSISTÊNCIA
  const [listaAlunos, setListaAlunos] = useState(() => {
    const saved = localStorage.getItem('omnifit_alunos');
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, nome: "Julio Cesar", email: "julio@aluno.com", cpf: "123.456.789-00", 
        status: "Ativo", plano: "Black", vencimento: "2026-12-30", pagamento: "Em dia" 
      },
      { 
        id: 2, nome: "Igor Matos", email: "igor@aluno.com", cpf: "987.654.321-11", 
        status: "Inadimplente", plano: "Fit", vencimento: "2026-01-01", pagamento: "Pendente" 
      }
    ];
  });

  // 2. ESTADO DE TREINOS COM PERSISTÊNCIA
const [treinosPorAluno, setTreinosPorAluno] = useState(() => {
  const saved = localStorage.getItem('omnifit_treinos');
  try {
    const parsed = saved ? JSON.parse(saved) : {};
    // Garante que para cada aluno, os dias sejam arrays, não strings
    listaAlunos.forEach(aluno => {
      if (!parsed[aluno.id] || typeof parsed[aluno.id] === 'string') {
        parsed[aluno.id] = { Segunda: [], Terça: [], Quarta: [], Quinta: [], Sexta: [] };
      } else {
        // Garante que cada dia dentro do objeto do aluno seja um array
        ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].forEach(dia => {
          if (!Array.isArray(parsed[aluno.id][dia])) parsed[aluno.id][dia] = [];
        });
      }
    });
    return parsed;
  } catch (e) {
    return {};
  }
});

  // SALVAMENTO AUTOMÁTICO
  useEffect(() => {
    localStorage.setItem('omnifit_alunos', JSON.stringify(listaAlunos));
  }, [listaAlunos]);

  useEffect(() => {
    localStorage.setItem('omnifit_treinos', JSON.stringify(treinosPorAluno));
  }, [treinosPorAluno]);

  const [editingAluno, setEditingAluno] = useState(null); 
  const [viewingFicha, setViewingFicha] = useState(null);
  const [showCadastro, setShowCadastro] = useState(false);
  const [showRelatorios, setShowRelatorios] = useState(false); 
  const [selectedPlan, setSelectedPlan] = useState(null); // Controla se o aluno está no fluxo de matrícula
  const [formTreino, setFormTreino] = useState({});
  const [novoAluno, setNovoAluno] = useState({ 
  nome: '', email: '', cpf: '', telefone: '', nascimento: '', endereco: '', 
  plano: 'Fit', status: 'Ativo', pagamento: 'Em dia' 
});

  const handleLogout = () => {
    setUser(null);
    setPage('landing');
    setViewingFicha(null);
    setEditingAluno(null);
    setShowRelatorios(false);
    window.scrollTo(0, 0);
  };

  const handleLogin = () => {
    const email = emailInput.toLowerCase();
    if (email.endsWith('@personal.com')) {
      setUser({ nome: email.split('@')[0], tipo: 'PERSONAL' });
      setPage('dashboard_personal');
    } else if (email.endsWith('@aluno.com')) {
      const aluno = listaAlunos.find(a => a.email.toLowerCase() === email);
      if (aluno) {
        setUser({ ...aluno, tipo: 'ALUNO' });
        setPage('dashboard_aluno');
      } else {
        alert("Aluno não encontrado.");
      }
    } else {
      alert("Use o formato nome@aluno.com ou nome@personal.com");
    }
  };

const cadastrarAluno = (e) => {
  e.preventDefault();

  // 1. Geração de Datas Dinâmicas
  const dataInicio = new Date(); // Captura data e hora atual
  const dataVencimento = new Date();
  dataVencimento.setDate(dataInicio.getDate() + 30); // Soma exatamente 30 dias

  // Formatação para exibição amigável (Ex: 14/05/2026)
  const formatarData = (data) => data.toLocaleDateString('pt-BR');

  const id = Date.now();
  const alunoCompleto = { 
    ...novoAluno, 
    id, 
    status: 'Ativo', 
    pagamento: 'Em dia',
    dataInicio: formatarData(dataInicio),
    vencimento: formatarData(dataVencimento), // Substitui a data fixa anterior
    timestamp: dataInicio.getTime() // Útil para ordenação se precisar
  };

  // 2. Atualização dos Estados
  setListaAlunos(prevAlunos => [...prevAlunos, alunoCompleto]);
  setTreinosPorAluno(prev => ({ 
  ...prev, 
  [id]: { Segunda: [], Terça: [], Quarta: [], Quinta: [], Sexta: [] } 
}));

  // 3. Fluxo de Navegação
  if (selectedPlan) {
    alert(`Matrícula realizada! Seu plano vence em: ${formatarData(dataVencimento)}`);
    setSelectedPlan(null);
    setPage('login');
  } else {
    setShowCadastro(false);
    alert("Aluno cadastrado com sucesso!");
  }

  // 4. Reset do formulário
  setNovoAluno({ nome: '', email: '', cpf: '', plano: 'Fit', status: 'Ativo', pagamento: 'Em dia' });
};

  const handleSaveTreino = () => {
    setTreinosPorAluno({ ...treinosPorAluno, [editingAluno.id]: formTreino });
    alert(`Ficha de ${editingAluno.nome} atualizada com sucesso!`);
    setEditingAluno(null);
  };

  const getRelatorios = () => {
    const ativos = listaAlunos.filter(a => a.status === 'Ativo').length;
    const inadimplentes = listaAlunos.filter(a => a.status === 'Inadimplente').length;
    const planosContagem = listaAlunos.reduce((acc, a) => {
      acc[a.plano] = (acc[a.plano] || 0) + 1;
      return acc;
    }, {});
    const planoMaisUsado = Object.entries(planosContagem).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A';
    return { ativos, inadimplentes, planoMaisUsado };
  };
// Interface de Matrícula para o Aluno (quando ele clica em contratar)
// --- TELA DE MATRÍCULA ONLINE (ESTILIZADA COM FUNDO DA HOME) ---
if (selectedPlan) return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#050505', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px',
      background: 'radial-gradient(circle at 50% 0%, #14532d 0%, #050505 50%)' 
    }}>
      <GlassCard style={{ width: '100%', maxWidth: '600px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
        <button 
          onClick={() => {
            setSelectedPlan(null);
            setNovoAluno({ nome: '', email: '', cpf: '', telefone: '', nascimento: '', endereco: '', plano: 'Fit', status: 'Ativo', pagamento: 'Em dia' });
          }} 
          style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <ChevronLeft size={18} /> Voltar para Planos
        </button>
        
        <h2 style={{ fontSize: '28px', fontWeight: '900', color: 'white', marginBottom: '5px' }}>Finalizar Matrícula</h2>
        <p style={{ color: '#22c55e', fontWeight: 'bold', marginBottom: '25px' }}>Plano Selecionado: {selectedPlan.toUpperCase()}</p>
        
        <form onSubmit={cadastrarAluno}>
            {/* LINHA 1: NOME */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '10px', marginBottom: '5px', fontWeight: 'bold', letterSpacing: '1px' }}>NOME COMPLETO *</label>
              <input style={inputStyle} placeholder="Ex: Julio Cesar" required value={novoAluno.nome}
                onChange={(e) => setNovoAluno(prev => ({ ...prev, nome: e.target.value, plano: selectedPlan }))} 
              />
            </div>

            {/* LINHA 2: CPF E NASCIMENTO */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '10px', marginBottom: '5px', fontWeight: 'bold' }}>CPF *</label>
                <input style={inputStyle} placeholder="000.000.000-00" required value={novoAluno.cpf}
                  onChange={(e) => setNovoAluno(prev => ({ ...prev, cpf: e.target.value }))} 
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '10px', marginBottom: '5px', fontWeight: 'bold' }}>DATA DE NASCIMENTO *</label>
                <input style={{...inputStyle, colorScheme: 'dark'}} type="date" required value={novoAluno.nascimento}
                  onChange={(e) => setNovoAluno(prev => ({ ...prev, nascimento: e.target.value }))} 
                />
              </div>
            </div>

            {/* LINHA 3: TELEFONE E E-MAIL */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '10px', marginBottom: '5px', fontWeight: 'bold' }}>TELEFONE *</label>
                <input style={inputStyle} placeholder="(11) 99999-9999" required value={novoAluno.telefone}
                  onChange={(e) => setNovoAluno(prev => ({ ...prev, telefone: e.target.value }))} 
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '10px', marginBottom: '5px', fontWeight: 'bold' }}>E-MAIL *</label>
                <input style={inputStyle} type="email" placeholder="nome@aluno.com" required value={novoAluno.email}
                  onChange={(e) => setNovoAluno(prev => ({ ...prev, email: e.target.value }))} 
                />
              </div>
            </div>

            {/* LINHA 4: ENDEREÇO */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '10px', marginBottom: '5px', fontWeight: 'bold' }}>ENDEREÇO COMPLETO *</label>
              <input style={inputStyle} placeholder="Rua, Número, Bairro, Cidade" required value={novoAluno.endereco}
                onChange={(e) => setNovoAluno(prev => ({ ...prev, endereco: e.target.value }))} 
              />
            </div>

            <button type="submit" 
              style={{ 
                width: '100%', padding: '18px', background: '#22c55e', color: 'black', 
                borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '16px',
                cursor: 'pointer', transition: '0.3s', textTransform: 'uppercase'
              }}
            >
              Concluir Matrícula
            </button>
        </form>
      </GlassCard>
    </div>
  );
  // --- TELA 1: LANDING PAGE ---
  if (page === 'landing') return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: 'white', fontFamily: '"Inter", sans-serif', scrollBehavior: 'smooth' }}>
      <header style={{ position: 'fixed', top: 0, width: '100%', padding: '20px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, backgroundColor: 'rgba(5, 5, 5, 0.8)', backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: '900' }}>
          <div style={{ backgroundColor: '#22c55e', padding: '5px', borderRadius: '8px' }}><Dumbbell size={24} color="black" /></div>
          OMNIFIT<span style={{ color: '#22c55e' }}>.</span>
        </div>
        <button onClick={() => setPage('login')} style={{ backgroundColor: '#22c55e', color: 'black', border: 'none', padding: '10px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Entrar</button>
      </header>

      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px', background: 'radial-gradient(circle at 50% -20%, #14532d 0%, #050505 70%)' }}>
        <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '8px 20px', borderRadius: '50px', fontSize: '12px', fontWeight: 'bold', marginBottom: '30px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>⚡️ TECNOLOGIA QUE ACELERA SEU RESULTADO</div>
        <h1 style={{ fontSize: 'clamp(45px, 10vw, 90px)', fontWeight: '900', lineHeight: '0.85', letterSpacing: '-4px', margin: '0 0 30px 0' }}>EVOLUA SUA <br/><span style={{ color: '#22c55e' }}>EXPERIÊNCIA.</span></h1>
        <p style={{ color: '#9ca3af', maxWidth: '600px', fontSize: '20px', lineHeight: '1.6', marginBottom: '50px' }}>A plataforma completa para alunos e personais que buscam alta performance e gestão simplificada.</p>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => setPage('plans')} style={{ backgroundColor: '#22c55e', color: 'black', border: 'none', padding: '20px 45px', borderRadius: '18px', fontWeight: '900', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>CONHEÇA NOSSOS PLANOS <ArrowRight size={20} /></button>
          <button onClick={() => setPage('login')} style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid #374151', padding: '20px 45px', borderRadius: '18px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>ÁREA DO ALUNO</button>
        </div>
      </section>

      <section style={{ padding: '100px 20px', backgroundColor: '#080808', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', textAlign: 'center' }}>
          <div><h3 style={{ fontSize: '48px', fontWeight: '900', color: '#22c55e', margin: 0 }}>+50k</h3><p style={{ color: '#4b5563', fontWeight: 'bold' }}>ALUNOS ATIVOS</p></div>
          <div><h3 style={{ fontSize: '48px', fontWeight: '900', color: '#22c55e', margin: 0 }}>98%</h3><p style={{ color: '#4b5563', fontWeight: 'bold' }}>SATISFAÇÃO</p></div>
          <div><h3 style={{ fontSize: '48px', fontWeight: '900', color: '#22c55e', margin: 0 }}>24/7</h3><p style={{ color: '#4b5563', fontWeight: 'bold' }}>SUPORTE TÉCNICO</p></div>
        </div>
      </section>

      <section style={{ padding: '120px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <SectionTitle subtitle="DIFERENCIAIS" title="Tudo o que você precisa em um só lugar" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <GlassCard><Monitor size={40} color="#22c55e" style={{ marginBottom: '20px' }} /><h4 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px' }}>Ecossistema Digital</h4><p style={{ color: '#9ca3af', lineHeight: '1.6' }}>Interface web responsiva otimizada para qualquer dispositivo. Acesse seus treinos instantaneamente.</p></GlassCard>
          <GlassCard><Users size={40} color="#22c55e" style={{ marginBottom: '20px' }} /><h4 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px' }}>Conexão com Personal</h4><p style={{ color: '#9ca3af', lineHeight: '1.6' }}>Sincronização direta com seu treinador para ajustes imediatos e consultoria via painel integrado.</p></GlassCard>
          <GlassCard><Shield size={40} color="#22c55e" style={{ marginBottom: '20px' }} /><h4 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px' }}>Gestão de Pagamentos</h4><p style={{ color: '#9ca3af', lineHeight: '1.6' }}>Pagamento seguro com liberação automática de acesso à sua ficha de treino.</p></GlassCard>
        </div>
      </section>
    </div>
  );

// --- TELA DE PLANOS (CORRIGIDA PARA MATRÍCULA DIRETA) ---
  if (page === 'plans') return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: 'white', padding: '60px 20px', background: 'radial-gradient(circle at 50% 0%, #14532d 0%, #050505 50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <button onClick={() => setPage('landing')} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontWeight: 'bold' }}>← VOLTAR</button>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '12px', letterSpacing: '2px' }}>MATRÍCULA ONLINE</span>
          <h2 style={{ fontSize: '32px', fontWeight: '900', marginTop: '5px' }}>Escolha sua jornada</h2>
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'stretch', flexWrap: 'nowrap' }}>
          
          {/* PLANO FIT */}
          <GlassCard style={{ flex: '1', padding: '24px', display: 'flex', flexDirection: 'column', minWidth: '0' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '5px' }}>Plano Fit</h3>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '15px', height: '40px' }}>O essencial para treinar na sua unidade.</p>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '12px', color: '#4b5563', textDecoration: 'line-through' }}>R$ 99,90</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                <span style={{ fontSize: '32px', fontWeight: '900', color: '#22c55e' }}>R$ 0,00*</span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedPlan('Fit')} 
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#22c55e', color: 'black', fontWeight: '900', cursor: 'pointer', marginBottom: '20px' }}
            >
              CONTRATAR
            </button>
            <ul style={{ padding: 0, listStyle: 'none', borderTop: '1px solid #1f2937', paddingTop: '15px', fontSize: '13px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><CheckCircle size={14} color="#22c55e" /> Musculação e aeróbicos</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><CheckCircle size={14} color="#22c55e" /> OmniFit App</li>
            </ul>
          </GlassCard>

          {/* PLANO BLACK */}
          <GlassCard style={{ flex: '1.1', padding: '24px', border: '2px solid #22c55e', position: 'relative', background: 'rgba(34, 197, 94, 0.05)', display: 'flex', flexDirection: 'column', minWidth: '0', transform: 'scale(1.02)' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#22c55e', color: 'black', padding: '2px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: '900', whiteSpace: 'nowrap' }}>MAIS VANTAJOSO</div>
            <h3 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '5px' }}>Plano Black</h3>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '15px', height: '40px' }}>Acesso total a todas as unidades.</p>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '12px', color: '#4b5563', textDecoration: 'line-through' }}>R$ 159,90</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                <span style={{ fontSize: '32px', fontWeight: '900', color: '#22c55e' }}>R$ 0,00*</span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedPlan('Black')} 
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#22c55e', color: 'black', fontWeight: '900', cursor: 'pointer', marginBottom: '20px' }}
            >
              CONTRATAR
            </button>
            <ul style={{ padding: 0, listStyle: 'none', borderTop: '1px solid #1f2937', paddingTop: '15px', fontSize: '13px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 'bold' }}><CheckCircle size={14} color="#22c55e" /> Unidades ilimitadas</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><CheckCircle size={14} color="#22c55e" /> Leve amigos</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><CheckCircle size={14} color="#22c55e" /> Massagem</li>
            </ul>
          </GlassCard>

          {/* PLANO SMART */}
          <GlassCard style={{ flex: '1', padding: '24px', display: 'flex', flexDirection: 'column', minWidth: '0' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '5px' }}>Plano Smart</h3>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '15px', height: '40px' }}>Liberdade total sem fidelidade.</p>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '12px', color: '#4b5563', textDecoration: 'line-through' }}>R$ 119,90</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                <span style={{ fontSize: '32px', fontWeight: '900', color: '#22c55e' }}>R$ 0,00*</span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedPlan('Smart')} 
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#22c55e', color: 'black', fontWeight: '900', cursor: 'pointer', marginBottom: '20px' }}
            >
              CONTRATAR
            </button>
            <ul style={{ padding: 0, listStyle: 'none', borderTop: '1px solid #1f2937', paddingTop: '15px', fontSize: '13px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><CheckCircle size={14} color="#22c55e" /> Sem fidelidade</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><CheckCircle size={14} color="#22c55e" /> Área de musculação</li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );

// --- DASHBOARD DO ALUNO (ATUALIZADO COM FICHA DETALHADA) ---
  if (page === 'dashboard_aluno' && user) {
    const dadosAtuais = listaAlunos.find(a => a.id === user.id);
    const acessoBloqueado = dadosAtuais?.status !== 'Ativo' || dadosAtuais?.pagamento !== 'Em dia';

    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#050505', display: 'flex', color: 'white' }}>
        <aside style={{ width: '280px', borderRight: '1px solid #1f2937', padding: '40px 24px' }}>
          <div style={{ fontWeight: '900', fontSize: '24px', color: '#22c55e', marginBottom: '40px' }}>OMNIFIT.</div>
          <nav>
            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', fontWeight: 'bold' }}>
              <LayoutDashboard size={20} style={{ marginRight: '10px' }} /> DASHBOARD
            </div>
          </nav>
        </aside>
        
        <main style={{ flex: 1, padding: '60px', overflowY: 'auto' }}>
          <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'60px' }}>
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: '900' }}>Olá, {user.nome}!</h2>
              <p style={{ color: '#4b5563' }}>Seu progresso começa aqui.</p>
            </div>
            <button onClick={handleLogout} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid #374151', color:'#9ca3af', padding:'10px 20px', borderRadius:'12px', cursor:'pointer' }}>Sair</button>
          </header>

          {acessoBloqueado ? (
            <GlassCard style={{ border: '2px solid #ef4444', textAlign: 'center' }}>
              <AlertTriangle size={60} color="#ef4444" style={{ margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '24px', color: '#ef4444' }}>ACESSO BLOQUEADO</h3>
              <p style={{ color: '#9ca3af', marginTop: '10px' }}>Detectamos pendências. Regularize seu plano na recepção.</p>
            </GlassCard>
          ) : !viewingFicha ? (
            <div>
              {/* INFORMAÇÕES DO CONTRATO */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <GlassCard style={{ padding: '20px', borderLeft: '4px solid #22c55e' }}>
                  <span style={{ color: '#4b5563', fontSize: '11px', fontWeight: 'bold' }}>INÍCIO DO PLANO</span>
                  <div style={{ color: 'white', fontSize: '18px', fontWeight: '900', marginTop: '5px' }}>{dadosAtuais?.dataInicio || '---'}</div>
                </GlassCard>
                <GlassCard style={{ padding: '20px', borderLeft: '4px solid #22c55e' }}>
                  <span style={{ color: '#22c55e', fontSize: '11px', fontWeight: 'bold' }}>VENCIMENTO</span>
                  <div style={{ color: 'white', fontSize: '18px', fontWeight: '900', marginTop: '5px' }}>{dadosAtuais?.vencimento || '---'}</div>
                </GlassCard>
                <GlassCard style={{ padding: '20px' }}>
                  <span style={{ color: '#4b5563', fontSize: '11px', fontWeight: 'bold' }}>STATUS</span>
                  <div style={{ color: '#22c55e', fontSize: '18px', fontWeight: '900', marginTop: '5px' }}>{dadosAtuais?.pagamento?.toUpperCase() || 'EM DIA'}</div>
                </GlassCard>
              </div>

              <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>Sua Semana de Treinos</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map((dia, idx) => {
                  const treino = treinosPorAluno[user.id]?.[dia] || [];
                  const temTreino = treino.length > 0;
                  return (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: temTreino ? '1px solid #22c55e' : '1px solid #111', borderRadius: '24px', padding: '24px' }}>
                      <span style={{ color: '#4b5563', fontWeight: 'bold', fontSize: '11px' }}>{dia.toUpperCase()}</span>
                      <h4 style={{ fontSize: '18px', margin: '10px 0', color: temTreino ? 'white' : '#4b5563' }}>
                        {temTreino ? `${treino.length} Exercícios` : 'Descanso'}
                      </h4>
                      {temTreino && (
                        <button onClick={() => setViewingFicha({ dia, conteudo: treino })} style={{ width: '100%', marginTop: '15px', padding: '10px', borderRadius: '10px', background: '#22c55e', color: 'black', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                          VER FICHA
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
              <button onClick={() => setViewingFicha(null)} style={{ background:'none', border:'none', color:'#22c55e', cursor:'pointer', marginBottom:'20px', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px' }}>
                <ChevronLeft size={18}/> VOLTAR
              </button>
              
              <SectionTitle title={`Treino: ${viewingFicha.dia}`} centered={false} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {viewingFicha.conteudo.map((ex, i) => (
                  <GlassCard key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '20px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr 40px', alignItems: 'center', gap: '15px' }}>
                    <div>
                      <span style={{ color: '#22c55e', fontSize: '10px', fontWeight: 'bold' }}>EXERCÍCIO</span>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>{ex.nome}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ color: '#4b5563', fontSize: '10px' }}>SÉRIES</span>
                      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{ex.series}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ color: '#4b5563', fontSize: '10px' }}>REPS</span>
                      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{ex.repeticoes}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ color: '#4b5563', fontSize: '10px' }}>CARGA</span>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#22c55e' }}>{ex.carga}</div>
                    </div>
                    <div style={{ paddingLeft: '15px', borderLeft: '1px solid #111' }}>
                      <span style={{ color: '#4b5563', fontSize: '10px' }}>OBSERVAÇÕES</span>
                      <div style={{ fontSize: '14px', color: '#9ca3af' }}>{ex.obs || '-'}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <CheckCircle size={24} color="#22c55e" />
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

// --- DASHBOARD DO PERSONAL (COMPLETO E CORRIGIDO) ---
  if (page === 'dashboard_personal' && user) {
    const stats = getRelatorios();

    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#020617', display: 'flex', color: 'white' }}>
        <aside style={{ width: '280px', borderRight: '1px solid #1e293b', padding: '40px 24px' }}>
          <div style={{ fontWeight: '900', fontSize: '24px', color: '#3b82f6', marginBottom: '40px' }}><Shield size={24} /> OMNI.PRO</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={() => {setShowCadastro(false); setEditingAluno(null); setShowRelatorios(false)}} style={{ textAlign:'left', padding:'14px', borderRadius:'12px', background: !showCadastro && !showRelatorios && !editingAluno ? 'rgba(59, 130, 246, 0.1)' : 'transparent', color: '#3b82f6', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'10px' }}><Users size={20}/> Alunos</button>
            <button onClick={() => {setShowCadastro(true); setShowRelatorios(false); setEditingAluno(null)}} style={{ textAlign:'left', padding:'14px', borderRadius:'12px', background: showCadastro ? 'rgba(59, 130, 246, 0.1)' : 'transparent', color: '#3b82f6', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'10px' }}><UserPlus size={20}/> Matricular</button>
            <button onClick={() => {setShowRelatorios(true); setShowCadastro(false); setEditingAluno(null)}} style={{ textAlign:'left', padding:'14px', borderRadius:'12px', background: showRelatorios ? 'rgba(59, 130, 246, 0.1)' : 'transparent', color: '#3b82f6', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'10px' }}><BarChart3 size={20}/> Relatórios</button>
          </nav>
        </aside>

        <main style={{ flex: 1, padding: '60px', overflowY: 'auto' }}>
          <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'60px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '900' }}>Gestão Profissional</h2>
            <button onClick={handleLogout} style={{ background:'rgba(59, 130, 246, 0.1)', border:'1px solid #1e293b', color:'#3b82f6', padding:'10px 20px', borderRadius:'12px', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px' }}><LogOut size={18}/> Sair</button>
          </header>

          {showRelatorios ? (
            <div style={{ display: 'grid', gap: '30px' }}>
               <SectionTitle title="Relatórios da Academia" color="#3b82f6" centered={false} />
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  <GlassCard style={{ border: '1px solid #22c55e' }}>
                     <h3 style={{ fontSize: '14px', color: '#22c55e', textTransform: 'uppercase', fontWeight: 'bold' }}>Alunos Ativos</h3>
                     <p style={{ fontSize: '48px', fontWeight: '900' }}>{stats.ativos}</p>
                  </GlassCard>
                  <GlassCard style={{ border: '1px solid #ef4444' }}>
                     <h3 style={{ fontSize: '14px', color: '#ef4444', textTransform: 'uppercase', fontWeight: 'bold' }}>Inadimplentes</h3>
                     <p style={{ fontSize: '48px', fontWeight: '900' }}>{stats.inadimplentes}</p>
                  </GlassCard>
                  <GlassCard>
                     <h3 style={{ fontSize: '14px', color: '#3b82f6', textTransform: 'uppercase', fontWeight: 'bold' }}>Plano Popular</h3>
                     <p style={{ fontSize: '32px', fontWeight: '900', marginTop: '15px' }}>{stats.planoMaisUsado}</p>
                  </GlassCard>
               </div>

               {/* NOVA SEÇÃO: LISTA DE NOMES INADIMPLENTES NOS RELATÓRIOS */}
               <GlassCard>
                  <h4 style={{ marginBottom: '20px', color: '#ef4444', fontWeight: 'bold' }}>Alunos com Pendência Financeira</h4>
                  {listaAlunos.filter(a => a.status === 'Inadimplente').length > 0 ? (
                    listaAlunos.filter(a => a.status === 'Inadimplente').map(aluno => (
                      <div key={aluno.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid rgba(239, 68, 68, 0.1)' }}>
                        <div>
                          <span style={{ fontWeight: 'bold', display: 'block', color: 'white' }}>{aluno.nome}</span>
                          <small style={{ color: '#64748b' }}>E-mail: {aluno.email}</small>
                        </div>
                        <span style={{ color: '#ef4444', fontWeight: '900', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ height: '8px', width: '8px', backgroundColor: '#ef4444', borderRadius: '50%', display: 'inline-block' }}></span>
                          INADIMPLENTE
                        </span>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#64748b', fontSize: '14px' }}>Nenhuma inadimplência registrada.</p>
                  )}
               </GlassCard>
            </div>
          ) : showCadastro ? (
            <div style={{ maxWidth: '600px' }}>
              <SectionTitle title="Nova Matrícula" color="#3b82f6" centered={false} />
              <GlassCard type="personal">
<form onSubmit={cadastrarAluno}>
  <input style={inputStyle} placeholder="Nome Completo" required value={novoAluno.nome} onChange={e => setNovoAluno({...novoAluno, nome: e.target.value})} />
  <input style={inputStyle} placeholder="CPF" required value={novoAluno.cpf} onChange={e => setNovoAluno({...novoAluno, cpf: e.target.value})} />
  <input style={inputStyle} type="date" placeholder="Nascimento" required value={novoAluno.nascimento} onChange={e => setNovoAluno({...novoAluno, nascimento: e.target.value})} />
  <input style={inputStyle} placeholder="Telefone" required value={novoAluno.telefone} onChange={e => setNovoAluno({...novoAluno, telefone: e.target.value})} />
  <input style={inputStyle} placeholder="Endereço" required value={novoAluno.endereco} onChange={e => setNovoAluno({...novoAluno, endereco: e.target.value})} />
  <input style={inputStyle} placeholder="email@aluno.com" required value={novoAluno.email} onChange={e => setNovoAluno({...novoAluno, email: e.target.value})} />
  
  <select style={{ ...inputStyle, color: 'white', backgroundColor: '#0a0f1e' }} value={novoAluno.plano} onChange={e => setNovoAluno({...novoAluno, plano: e.target.value})} required>
    <option value="Fit">Plano Fit</option>
    <option value="Black">Plano Black</option>
    <option value="Smart">Plano Smart</option>
  </select>
  <button type="submit" style={{ width:'100%', padding:'16px', borderRadius:'12px', background:'#3b82f6', color:'white', border:'none', fontWeight:'bold' }}>EFETIVAR MATRÍCULA</button>
</form>
              </GlassCard>
            </div>
          ) : editingAluno ? (
            <div style={{ maxWidth: '1200px' }}>
              <button onClick={() => setEditingAluno(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '20px', display:'flex', alignItems:'center', gap:'5px' }}>
                <ChevronLeft /> Voltar para Alunos
              </button>
              <SectionTitle title={`Ficha de Treino: ${editingAluno.nome}`} color="#3b82f6" centered={false} />
              
              {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map((dia) => (
                <GlassCard key={dia} style={{ marginBottom: '30px', padding: '30px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                  
                  {/* CABEÇALHO DO DIA: NOME DO DIA + GRUPAMENTO MUSCULAR */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                      <h3 style={{ color: '#3b82f6', margin: 0, textTransform: 'uppercase', minWidth: '100px' }}>{dia}</h3>
                      <input 
                        style={{ ...inputStyle, marginBottom: 0, maxWidth: '300px', borderBottom: '2px solid #3b82f6' }} 
                        placeholder="Ex: Peito e Tríceps" 
                        value={formTreino[`grupamento_${dia}`] || ''} 
                        onChange={(e) => setFormTreino({...formTreino, [`grupamento_${dia}`]: e.target.value})}
                      />
                    </div>
                    <button onClick={() => {
                        const novoEx = { nome: '', series: '', repeticoes: '', carga: '', obs: '' };
                        const treinosAtuais = { ...formTreino };
                        treinosAtuais[dia] = [...(treinosAtuais[dia] || []), novoEx];
                        setFormTreino(treinosAtuais);
                      }} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid #3b82f6', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                        + ADICIONAR EXERCÍCIO
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {(formTreino[dia] || []).map((ex, index) => (
                      <div key={index} style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr 40px', 
                        gap: '20px', // AQUI ESTÁ O ESPAÇAMENTO ENTRE OS CAMPOS
                        alignItems: 'end',
                        background: 'rgba(255,255,255,0.02)',
                        padding: '15px',
                        borderRadius: '12px'
                      }}>
                        <div>
                          <label style={{fontSize: '10px', color: '#4b5563', fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>EXERCÍCIO</label>
                          <input style={{...inputStyle, marginBottom: 0}} value={ex.nome} placeholder="Supino Reto" onChange={(e) => { const n = [...formTreino[dia]]; n[index].nome = e.target.value; setFormTreino({...formTreino, [dia]: n}); }} />
                        </div>
                        <div>
                          <label style={{fontSize: '10px', color: '#4b5563', fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>SÉRIES</label>
                          <input style={{...inputStyle, marginBottom: 0}} value={ex.series} placeholder="4" onChange={(e) => { const n = [...formTreino[dia]]; n[index].series = e.target.value; setFormTreino({...formTreino, [dia]: n}); }} />
                        </div>
                        <div>
                          <label style={{fontSize: '10px', color: '#4b5563', fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>REPS</label>
                          <input style={{...inputStyle, marginBottom: 0}} value={ex.repeticoes} placeholder="12" onChange={(e) => { const n = [...formTreino[dia]]; n[index].repeticoes = e.target.value; setFormTreino({...formTreino, [dia]: n}); }} />
                        </div>
                        <div>
                          <label style={{fontSize: '10px', color: '#4b5563', fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>CARGA</label>
                          <input style={{...inputStyle, marginBottom: 0}} value={ex.carga} placeholder="20kg" onChange={(e) => { const n = [...formTreino[dia]]; n[index].carga = e.target.value; setFormTreino({...formTreino, [dia]: n}); }} />
                        </div>
                        <div>
                          <label style={{fontSize: '10px', color: '#4b5563', fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>OBSERVAÇÕES</label>
                          <input style={{...inputStyle, marginBottom: 0}} value={ex.obs} placeholder="Lento" onChange={(e) => { const n = [...formTreino[dia]]; n[index].obs = e.target.value; setFormTreino({...formTreino, [dia]: n}); }} />
                        </div>
                        <button onClick={() => { const n = formTreino[dia].filter((_, i) => i !== index); setFormTreino({...formTreino, [dia]: n}); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', height: '45px' }}><XCircle size={24} /></button>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              ))}
              
              <button onClick={handleSaveTreino} style={{ width: '100%', padding: '20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px' }}>
                <Save /> SALVAR FICHA COMPLETA
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {listaAlunos.map(aluno => (
                <GlassCard key={aluno.id} type="personal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
                  <div>
                    <h4 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{aluno.nome}</h4>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '8px' }}>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Início: {aluno.dataInicio || '---'}</p>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Vence: <span style={{ color: '#3b82f6' }}>{aluno.vencimento || '---'}</span></p>
                    </div>
                  </div>

                  {/* INDICADOR VISUAL DE INADIMPLÊNCIA NO CARD */}
                      {aluno.status === 'Inadimplente' && (
                        <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ height: '8px', width: '8px', backgroundColor: '#ef4444', borderRadius: '50%', display: 'inline-block' }}></span>
                          INADIMPLENTE
                        </span>
                      )}
                  
                  <button 
                    onClick={() => { 
                      const dadosTreino = treinosPorAluno[aluno.id];
                      // CORREÇÃO: Garante que o formulário sempre receba um objeto de arrays, evitando o erro de .map()
                      if (!dadosTreino || typeof dadosTreino === 'string') {
                        setFormTreino({ Segunda: [], Terça: [], Quarta: [], Quinta: [], Sexta: [] });
                      } else {
                        setFormTreino(dadosTreino);
                      }
                      setEditingAluno(aluno); 
                    }} 
                    style={{ padding: '10px 20px', borderRadius: '10px', background: '#3b82f6', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    PRESCREVER
                  </button>
                </GlassCard>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  // --- TELA DE LOGIN ---
  if (page === 'login') return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <GlassCard style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <Dumbbell size={40} color="#22c55e" style={{ margin: '0 auto 20px' }} />
        <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '30px' }}>Acesso</h2>
        <input style={inputStyle} placeholder="nome@aluno.com ou @personal.com" value={emailInput} onChange={e => setEmailInput(e.target.value)} />
        <input type="password" style={inputStyle} placeholder="Senha" />
        <button onClick={handleLogin} style={{ width: '100%', padding: '16px', borderRadius: '12px', backgroundColor: '#22c55e', color: 'black', fontWeight: '900', border: 'none', cursor: 'pointer' }}>ENTRAR</button>
        <button onClick={() => setPage('landing')} style={{ background:'none', border:'none', color:'#4b5563', marginTop:'20px', cursor:'pointer' }}>Voltar para Home</button>
      </GlassCard>
    </div>
  );

  return null;
}