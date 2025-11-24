# FLOW - Sistema Inteligente de Padronização Operacional

## 📋 Sobre o Projeto

FLOW é um sistema inteligente de padronização, execução e aprendizado operacional. Ele organiza, corrige e otimiza fluxos de trabalho, transformando processos soltos em trilhas claras, seguras e eficientes.

### O Problema que o FLOW Resolve

- **Cada funcionário faz do seu jeito**: Não existe padronização. A operação fica instável e imprevisível.
- **Onboarding é lento e repetitivo**: Pessoas novas demoram meses para aprender — e sobrecarregam o time.
- **Erros operacionais se repetem**: Porque ninguém lembra o processo inteiro, só partes dele.
- **O conhecimento está espalhado**: PDFs, anotações, post-its, planilhas, mensagens… nada centralizado.

### A Solução

- ✅ **Fluxos visuais inteligentes**: Cada processo é exibido como um mapa: etapas → ações → resultados.
- ✅ **Guia de execução passo a passo**: O usuário sabe exatamente o que fazer, quando fazer e como fazer.
- ✅ **Treinamento contextual (FLOW Academy)**: Vídeos, textos, tutoriais, testes e FAQs automáticos.
- ✅ **Assistente IA (FLOW Coach)**: Responde dúvidas, sugere melhorias e explica processos em linguagem natural.
- ✅ **Histórico e rastreabilidade**: Quem fez o quê, quando e como — 100% registrado.
- ✅ **Redução de erros com alertas inteligentes**: Avisos e correções em tempo real.

## 🚀 Status do Projeto

✅ **Concluído** - Projeto pronto para deploy na Vercel com integração completa à API Java.

## 📚 Sumário

- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Instalação](#-instalação)
- [Como Usar](#-como-usar)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Endpoints ou Rotas Principais](#-endpoints-ou-rotas-principais)
- [Screenshots / Demonstração](#-screenshots--demonstração)
- [Autores e Créditos](#-autores-e-créditos)
- [Contato](#-contato)

## 🛠 Tecnologias Utilizadas

- **React 18.2.0** - Biblioteca JavaScript para construção de interfaces
- **Vite 4.5.0** - Build tool e dev server
- **TypeScript 5.2.2** - Superset do JavaScript com tipagem estática
- **React Router DOM 6.20.1** - Roteamento para aplicações React
- **Tailwind CSS 3.3.5** - Framework CSS utility-first
- **Lucide React** - Biblioteca de ícones
- **Context API** - Gerenciamento de estado (tema escuro/claro)

## 📦 Instalação

1. Clone o repositório:
```bash
git clone COLE AQUI O LINK DO GITHUB
cd flow-system
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` se necessário para alterar a URL da API.

4. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

5. Para build de produção:
```bash
npm run build
```

6. Para preview do build:
```bash
npm run preview
```

## 💻 Como Usar

### Desenvolvimento

Após instalar as dependências, execute:

```bash
npm run dev
```



### Navegação

- **Login**: `/login` - Página de autenticação
- **Home**: `/home` - Página inicial com visão geral
- **Processos**: `/processos` - Lista de processos disponíveis
- **Visualização de Processo**: `/processos/:id` - Detalhes de um processo específico
- **Execução**: `/processos/:id/executar` - Executar um processo
- **Treinamento**: `/treinamento` - FLOW Academy
- **Dashboard**: `/dashboard` - Métricas e estatísticas
- **Chatbot**: `/chatbot` - FLOW Coach (Assistente IA)

### Tema Escuro/Claro

O sistema possui suporte completo a tema escuro e claro, com detecção automática das preferências do sistema. Use o botão no header para alternar manualmente.

## 📁 Estrutura de Pastas

```
flow-system/
├── public/              # Arquivos estáticos
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   ├── contexts/        # Context API
│   │   └── ThemeContext.tsx
│   ├── pages/          # Páginas da aplicação
│   │   ├── Login.tsx
│   │   ├── Home.tsx
│   │   ├── ProcessList.tsx
│   │   ├── ProcessView.tsx
│   │   ├── ProcessExecution.tsx
│   │   ├── Training.tsx
│   │   ├── Dashboard.tsx
│   │   └── Chatbot.tsx
│   ├── types/          # Definições de tipos TypeScript
│   │   └── index.ts
│   ├── App.tsx         # Componente principal
│   ├── main.tsx        # Entry point
│   └── index.css       # Estilos globais
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🛣 Rotas da Aplicação

### Rotas Estáticas
- `/home` - Página inicial
- `/sobre` ou `/about` - Sobre o projeto
- `/faq` - Perguntas frequentes
- `/contato` - Página de contato
- `/participantes` - Equipe de desenvolvimento
- `/treinamento` - FLOW Academy
- `/dashboard` - Dashboard com métricas
- `/chatbot` - FLOW Coach (Assistente IA)

### Rotas Dinâmicas
- `/processos` - Lista de processos (GET)
- `/processos/novo` - Criar novo processo (POST)
- `/processos/:id` - Visualizar processo específico (GET)
- `/processos/:id/editar` - Editar processo (PUT)
- `/processos/:id/executar` - Iniciar execução de processo
- `/processos/:id/executar/etapa/:stepId` - Executar etapa específica
- `/treinamento/:processId` - Treinamento de processo específico

## 🔌 Endpoints da API (Backend Java)

### Processos
- `GET /processos` - Listar todos os processos
- `GET /processos/{id}` - Buscar processo por ID
- `POST /processos` - Criar novo processo
- `PUT /processos/{id}` - Atualizar processo
- `DELETE /processos/{id}` - Deletar processo

### Etapas
- `GET /etapas?codProcesso={id}` - Listar etapas de um processo
- `GET /processos/{id}/etapas` - Listar etapas (alternativa)
- `POST /etapas` - Criar nova etapa
- `PUT /etapas/{id}` - Atualizar etapa
- `DELETE /etapas/{id}` - Deletar etapa

### Execuções
- `POST /execucoes/iniciar` - Iniciar execução de processo
- `PUT /execucoes/{id}/finalizar-etapa` - Finalizar etapa de execução
- `GET /execucoes?cpfOuUsuario={x}` - Listar execuções por usuário
- `GET /execucoes/{id}` - Buscar execução por ID

## 📸 Screenshots / Demonstração

_Screenshots serão adicionados após a conclusão das telas principais._

## 👥 Autores e Créditos

### Equipe de Desenvolvimento
- **Rafael Malaguti** - RM 561830
- **Lincoln Roncato** - RM 565944
- **Natalia Souza** - RM 564099

**Turma**: 1TDSR

### Tecnologias
- **Framework**: React 18.2.0 + Vite 4.5.0 + TypeScript 5.2.2
- **Roteamento**: React Router DOM 6.20.1
- **Estilização**: Tailwind CSS 3.3.5
- **Ícones**: Lucide React
- **Gerenciamento de Estado**: Context API (tema claro/escuro)
- **Validação**: React Hook Form + Zod
- **API**: Fetch API nativo (sem axios)

### Características Técnicas
- ✅ SPA (Single Page Application) pronta para deploy na Vercel
- ✅ Integração completa com API Java remota via fetch
- ✅ CRUD completo (GET/POST/PUT/DELETE) para processos
- ✅ Rotas estáticas e dinâmicas funcionando
- ✅ Tema claro/escuro via Context API
- ✅ Tratamento de erros em todas as requisições
- ✅ Tipagem forte com TypeScript
- ✅ Layout responsivo com Tailwind CSS

---

## 🔗 Links

- **GitHub**: COLE AQUI O LINK DO GITHUB
- **Vídeo do YouTube**: COLE AQUI O LINK DO VÍDEO
- **Deploy Vercel**: COLE AQUI O LINK DO VERCEL

---

## 📞 Contato

Para dúvidas ou sugestões sobre o projeto, entre em contato através da página de contato da aplicação ou pelos perfis dos desenvolvedores listados na página de participantes.



