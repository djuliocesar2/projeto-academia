# OmniFit Digital 🏋️‍♂️⚡️

O **OmniFit Digital** é uma plataforma de alta performance desenvolvida para conectar Personal Trainers e Alunos. O sistema oferece uma gestão completa de treinos com interfaces personalizadas, garantindo que a prescrição seja feita de forma profissional e o acompanhamento pelo aluno seja intuitivo e dinâmico.

## 🚀 Funcionalidades Principais

### 🟢 Para Alunos (Identidade Motivacional)
- **Agenda Semanal:** Acompanhamento de treinos organizados de Segunda a Sexta.
- **Detalhamento de Exercícios:** Botão "Ver Ficha" que exibe a lista completa de exercícios, séries e repetições em tempo real.
- **Interface Responsiva:** Design otimizado para uso em dispositivos móveis dentro da academia.

### 🔵 Para Personal Trainers - OMNI.PRO (Identidade Profissional)
- **Painel Administrativo:** Gestão centralizada de alunos com métricas de desempenho.
- **Editor de Treinos:** Interface exclusiva para prescrever exercícios detalhados para cada dia da semana.
- **Atualização Instantânea:** Sincronização direta onde o que o coach salva aparece imediatamente no dashboard do aluno.

### 🏠 Institucional e Planos
- **Landing Page Completa:** Seções de métricas (+50k alunos), diferenciais técnicos e tecnologia.
- **Tabela de Planos:** Visualização detalhada dos planos Fit, Black e Smart, com todos os benefícios e promoções restaurados...

---

## 🛠 Tecnologias Utilizadas

- **React.js:** Biblioteca base para a construção da interface.
- **Lucide React:** Iconografia moderna e intuitiva.
- **CSS-in-JS:** Estilização dinâmica para alternância de identidades visuais (Verde Neon vs. Azul Royal).
- **React Hooks (useState):** Gerenciamento de estado global e simulação de persistência de dados.

---

## 📂 Estrutura do Repositório

```bash
├── frontend/
│   ├── src/
│   │   ├── App.js         # Core do sistema (Rotas, Dashboards e Lógica)
│   │   ├── index.js       # Ponto de entrada
│   │   └── App.css        # Estilos globais
├── database.sql           # Schema estrutural do banco de dados
└── README.md              # Documentação oficial
⚙️ Como Executar
Clone o projeto:

Bash
git clone [https://github.com/seu-usuario/omnifit-digital.git](https://github.com/seu-usuario/omnifit-digital.git)
Entre na pasta do frontend:

Bash
cd frontend
Instale as dependências:

Bash
npm install
Inicie a aplicação:

Bash
npm start
🔐 Credenciais para Teste
O sistema utiliza lógica de reconhecimento via e-mail no login:

Perfil Personal: Use qualquer e-mail que contenha a palavra personal (ex: coach.personal@omnifit.com).

Perfil Aluno: Use nomes de alunos registrados para carregar treinos específicos (ex: julio@email.com, igor@email.com, luan@email.com).

Desenvolvido por Julio Cesar Nascimento, Henrique Barros, Luan Martiniano e Igor Matos.