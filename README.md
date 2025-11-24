# FLOW – Sistema Inteligente de Padronização Operacional

## Sobre o Projeto

O FLOW é um sistema desenvolvido para organizar e padronizar processos internos de forma clara e objetiva.  
A proposta é facilitar o dia a dia operacional, garantindo que qualquer pessoa consiga executar atividades seguindo um passo a passo estruturado.

O sistema permite visualizar processos, acompanhar etapas, executar tarefas e acessar conteúdos de apoio (como treinamentos, vídeos e quizzes).  
Ele foi desenvolvido como parte da Global Solution – Front-End do curso de Análise e Desenvolvimento de Sistemas da FIAP.

---

## Objetivo

- Oferecer uma interface simples para visualizar, cadastrar e executar processos.
- Integrar com a API desenvolvida em Java (backend da GS).
- Permitir que novos colaboradores sigam um fluxo guiado de execução.
- Exibir métricas e indicadores básicos a partir das informações fornecidas pela API.

---

## Sumário

- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Instalação](#-instalação)
- [Como Usar](#-como-usar)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Rotas da Aplicação](#-rotas-da-aplicação)
- [Integração com a API](#-integração-com-a-api)
- [Screenshots](#-screenshots)
- [Equipe](#-equipe)
- [Links Importantes](#-links-importantes)

---

## Tecnologias Utilizadas

- **React 18**
- **Vite 4**
- **TypeScript**
- **React Router DOM**
- **Tailwind CSS**
- **Lucide Icons**
- **Context API** (tema claro/escuro)
- **Fetch API** para consumo do backend

---

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/lincolnroncato/flow-front-api
cd flow-system
Instale as dependências:

bash
Copiar código
npm install
Copie o arquivo de variáveis de ambiente:

bash
Copiar código
cp .env.example .env
Caso necessário, edite a URL da API no arquivo .env:

ini
Copiar código
VITE_API_URL=https://flow-java-api-production.up.railway.app
Execute o ambiente de desenvolvimento:

bash
Copiar código
npm run dev
Para gerar o build de produção:

bash
Copiar código
npm run build

Como Usar
Após rodar npm run dev, o sistema estará disponível no navegador.
Nele, o usuário pode:

visualizar processos cadastrados;

criar, editar e excluir processos;

acessar detalhes de um processo;

executar etapas de forma sequencial;

acompanhar progresso;

visualizar dashboards simples;

acessar conteúdos de treinamento.

Estrutura de Pastas
bash
Copiar código
src/
├── components/
├── contexts/
├── pages/
│   ├── Home.tsx
│   ├── ProcessList.tsx
│   ├── ProcessView.tsx
│   ├── ProcessForm.tsx
│   ├── ProcessExecution.tsx
│   ├── Dashboard.tsx
│   ├── Training.tsx
│   └── Sobre/Contato/Participantes
├── services/        # API (fetch)
├── types/           # Tipagens TS
├── App.tsx
└── main.tsx
Rotas da Aplicação
Rotas Estáticas
/home – Página inicial

/sobre – Informações gerais

/faq – Perguntas frequentes

/contato – Página de contato

/participantes – Integrantes da equipe

/dashboard – Métricas básicas

/treinamento – FLOW Academy

Rotas Dinâmicas
/processos – Listagem de processos

/processos/novo – Criar processo

/processos/:id – Visualizar processo

/processos/:id/editar – Editar processo

/processos/:id/executar – Iniciar execução

/processos/:id/executar/etapa/:stepId – Etapa específica

Integração com a API (Backend Java)
O front consome a API publicada no Railway:

arduino
Copiar código
https://flow-java-api-production.up.railway.app
Endpoints principais
Processos
GET /processos

GET /processos/{id}

POST /processos

PUT /processos/{id}

DELETE /processos/{id}

Etapas
GET /etapas?codProcesso={id}

POST /etapas

PUT /etapas/{id}

DELETE /etapas/{id}

Execuções
POST /execucoes/iniciar

PUT /execucoes/{id}/finalizar-etapa

Toda comunicação é feita via Fetch API, sem bibliotecas externas.

Equipe
Turma: 1TDSR — FIAP

Lincoln Roncato	RM 565944
Rafael Malaguti	RM 561830
Natalia Souza	RM 564099

Links Importantes
Repositório GitHub: https://github.com/lincolnroncato/flow-front-api

Deploy (Vercel):

Video Pitch da Solução - FLOW: https://www.youtube.com/watch?v=TRQtgkjL0pw&t=3s

Video Front-end - FLOW: https://www.youtube.com/watch?v=BDxQdpMn19c 