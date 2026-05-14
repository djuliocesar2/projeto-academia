# OMNIFIT - Sistema de Gestão de Academia 🏋️‍♂️

O **OMNIFIT** é uma plataforma completa desenvolvida em React para a gestão de academias, personais e alunos. O projeto foca em alta performance, usabilidade moderna (Glassmorphism UI) e controle total sobre o ciclo de vida do aluno, desde a matrícula online até a prescrição detalhada de treinos.

## 🚀 Novas Funcionalidades (Updates Recentes)

- **Matrícula Direta Online**: Agora os alunos podem se cadastrar diretamente através da tela de planos.
- **Datas Dinâmicas**: Cálculo automático de Início e Vencimento (ciclos de 30 dias) no momento do cadastro.
- **Ficha de Treino Profissional**: Sistema detalhado com Exercício, Séries, Repetições, Carga e Observações.
- **Gestão de Cadastro Completa**: Inclusão de campos obrigatórios como CPF, Nascimento, Telefone e Endereço.

---

## 📋 Requisitos Atendidos

### 1. Cadastro de Alunos
Sistema completo de persistência de dados contendo:
- Nome, CPF, Data de Nascimento, Telefone, E-mail e Endereço.
- Status dinâmico: Ativo, Inativo ou Inadimplente.

### 2. Gestão de Planos
Modelos de negócio pré-configurados:
- **Plano Fit**: Focado no essencial.
- **Plano Black**: Acesso total e benefícios exclusivos.
- **Plano Smart**: Liberdade sem fidelidade.

### 3. Matrícula e Contratos
- Vinculação automática do aluno ao plano escolhido.
- Registro de **Data de Início** e **Data de Vencimento**.
- Controle de situação de pagamento.

### 4. Controle de Acesso
- Validação automática no Dashboard do Aluno.
- **Acesso Liberado**: Para alunos Ativos e "Em dia".
- **Acesso Bloqueado**: Para alunos Inadimplentes ou com planos vencidos.

### 5. Ficha de Treino (Painel do Instrutor)
Interface avançada de prescrição que permite cadastrar:
- Nome do exercício, Séries, Repetições, Carga e Observações técnicas.
- Possibilidade de múltiplos exercícios por dia da semana.

### 6. Relatórios Gerenciais
Visualização estratégica para o Personal:
- Quantitativo de Alunos Ativos.
- Listagem de Alunos Inadimplentes.
- Identificação do Plano mais utilizado.

---

## 🛠️ Tecnologias Utilizadas

- **React.js**: Biblioteca principal para interface.
- **Lucide React**: Biblioteca de ícones modernos.
- **LocalStorage**: Persistência de dados local (sem necessidade de banco de dados externo para o protótipo).
- **CSS-in-JS**: Estilização dinâmica e responsiva.

---

## ⚙️ Como Executar o Projeto

1. Clone o repositório:
   ```bash
   git clone [https://github.com/seu-usuario/omnifit.git](https://github.com/seu-usuario/omnifit.git)
Instale as dependências:

Bash
npm install
Inicie a aplicação:

Bash
npm start

## 🔐 Instruções de Acesso

Para navegar no sistema, utilize as seguintes credenciais de exemplo:

### Painel do Personal (Administrativo)
- **E-mail**: `admin@personal.com` (ou o e-mail definido como admin no código)
- **Acesso**: Permite matricular alunos, visualizar relatórios e prescrever treinos detalhados.

### Painel do Aluno
- **E-mail**: Utilize o e-mail cadastrado no momento da matrícula (Ex: `julio@aluno.com`).
- **Acesso**: Permite visualizar as datas de vigência do plano e a ficha de exercícios diários.
- **Nota**: O acesso será bloqueado automaticamente caso o status do aluno seja alterado para "Inadimplente" ou "Inativo" no painel do Personal.

---

## 👥 Equipe de Desenvolvimento

Este projeto foi desenvolvido como parte do trabalho acadêmico pelos membros:

* **Julio Cesar Nascimento**
* **Henrique Barros**
* **Luan Martiniano**
* **Igor Matos**

---
© 2026 OMNIFIT - Tecnologia aplicada ao Bem-Estar.