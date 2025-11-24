/// <reference types="vite/client" />

// Configuração da API
const BASE_URL: string =
  import.meta.env.VITE_API_URL ??
  "https://flow-java-api-production.up.railway.app";

// Tipos para requisições
interface RequestOptions extends RequestInit {
  body?: any;
}

// Função genérica para requisições
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body !== "string") {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorMessage = `Erro ${response.status}: ${response.statusText}`;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      try {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      } catch {}
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  if (!text) return undefined as T;

  return JSON.parse(text) as T;
}

// =====================================================
// TIPOS (compatíveis com UI e com Backend)
// =====================================================

export type DificuldadeUI = "easy" | "medium" | "hard";
export type DificuldadeAPI = "FACIL" | "MEDIO" | "DIFICIL";

export interface ProcessoTO {
  id?: number;          
  codProcesso?: number; 
  codigo?: number;      

  nome?: string;        
  titulo?: string;      
  descricao?: string;

  // UI-only (backend pode não ter)
  categoria?: string;
  tempoEstimadoMin?: number;
  tempoEstimado?: number;
  dificuldade?: DificuldadeUI | DificuldadeAPI;
  status?: "draft" | "active" | "archived" | "deprecated";

  etapas?: EtapaTO[];
}

export interface EtapaTO {
  id?: number;
  codEtapa?: number;
  codigo?: number;

  codProcesso: number;
  ordem: number;
  titulo: string;
  descricao?: string;
  tipo?: "action" | "decision" | "approval" | "information";
  dependencias?: number[];
}

export interface ExecucaoTO {
  id?: number;
  codExecucao?: number;
  codigo?: number;

  codProcesso: number;
  cpfOuUsuario?: string;
  status: "pending" | "in_progress" | "completed" | "blocked";
  etapaAtual?: number;
  etapasConcluidas?: number[];
  dataInicio?: string;
  dataFim?: string;
  observacoes?: string;
}

// =====================================================
// HELPERS DE NORMALIZAÇÃO / MAPEAMENTO
// =====================================================

function normalizarProcesso(p: any): ProcessoTO {
  return {
    ...p,
    id: p.id ?? p.codProcesso ?? p.codigo,
    codProcesso: p.codProcesso ?? p.id ?? p.codigo,
    nome: p.nome ?? p.titulo,
    titulo: p.titulo ?? p.nome,
    tempoEstimadoMin: p.tempoEstimadoMin ?? p.tempoEstimado,
    tempoEstimado: p.tempoEstimado ?? p.tempoEstimadoMin,
  };
}

function normalizarEtapa(e: any, index = 0): EtapaTO {
  const codProcesso = Number(
    e.codProcesso ?? e.cod_processo ?? e.processoId ?? 0
  );

  const ordem = Number(e.ordem ?? e.order ?? index + 1);

  return {
    ...e,
    id: e.id ?? e.codEtapa ?? e.codigo ?? index + 1,
    codEtapa: e.codEtapa ?? e.id ?? e.codigo ?? index + 1,
    titulo: e.titulo ?? e.title ?? `Etapa ${index + 1}`,
    descricao: e.descricao ?? e.description ?? "",
    ordem,
    codProcesso,
  };
}

function mapDificuldadeToAPI(d?: DificuldadeUI | DificuldadeAPI): DificuldadeAPI {
  if (!d) return "MEDIO";
  if (d === "FACIL" || d === "MEDIO" || d === "DIFICIL") return d;

  const m: Record<DificuldadeUI, DificuldadeAPI> = {
    easy: "FACIL",
    medium: "MEDIO",
    hard: "DIFICIL",
  };
  return m[d];
}

// =====================================================
// PROCESSOS
// =====================================================

// GET /processos
export async function listarProcessos(): Promise<ProcessoTO[]> {
  const data = await request<any[]>("/processos");
  return (data || []).map(normalizarProcesso);
}

// GET /processos/{id}
export async function buscarProcesso(id: number | string): Promise<ProcessoTO> {
  const data = await request<any>(`/processos/${id}`);
  return normalizarProcesso(data);
}

// POST /processos
export async function criarProcesso(
  processo: Omit<ProcessoTO, "id" | "codProcesso" | "codigo">
): Promise<ProcessoTO> {
  // BACKEND ACEITA SÓ: titulo, descricao, dataCriacao
  const payload = {
    titulo: processo.titulo ?? processo.nome ?? "Novo Processo",
    descricao: processo.descricao ?? "",
    dataCriacao: new Date().toISOString().split("T")[0],
  };

  const data = await request<any>("/processos", {
    method: "POST",
    body: payload,
  });

  return normalizarProcesso(data);
}

// PUT /processos/{id}
export async function atualizarProcesso(
  id: number | string,
  processo: Partial<ProcessoTO>
): Promise<ProcessoTO> {
  // BACKEND ACEITA SÓ: titulo, descricao (dataCriacao geralmente não atualiza)
  const payload: any = {
    ...(processo.titulo || processo.nome
      ? { titulo: processo.titulo ?? processo.nome }
      : {}),
    ...(processo.descricao !== undefined
      ? { descricao: processo.descricao }
      : {}),
  };

  const data = await request<any>(`/processos/${id}`, {
    method: "PUT",
    body: payload,
  });

  return normalizarProcesso(data);
}

// DELETE /processos/{id}
export async function deletarProcesso(id: number | string): Promise<void> {
  return request<void>(`/processos/${id}`, { method: "DELETE" });
}

// =====================================================
// ETAPAS
// =====================================================

// GET /etapas?codProcesso={id}
export async function listarEtapas(codProcesso: number | string): Promise<EtapaTO[]> {
  const data = await request<any[]>(`/etapas?codProcesso=${codProcesso}`);
  return (data || []).map((e, i) => normalizarEtapa(e, i));
}

// GET /processos/{id}/etapas (fallback)
export async function listarEtapasPorProcesso(id: number | string): Promise<EtapaTO[]> {
  try {
    const data = await request<any[]>(`/processos/${id}/etapas`);
    return (data || []).map((e, i) => normalizarEtapa(e, i));
  } catch {
    return listarEtapas(id);
  }
}

// POST /etapas
export async function criarEtapa(
  etapa: Omit<EtapaTO, "id" | "codEtapa" | "codigo">
): Promise<EtapaTO> {
  const payload = {
    codProcesso: Number(etapa.codProcesso),
    ordem: Number(etapa.ordem),
    titulo: etapa.titulo,
    descricao: etapa.descricao ?? "",
    tipo: etapa.tipo ?? "action",
    dependencias: etapa.dependencias ?? [],
  };

  const data = await request<any>("/etapas", {
    method: "POST",
    body: payload,
  });

  return normalizarEtapa(data);
}

// PUT /etapas/{id}
export async function atualizarEtapa(
  id: number | string,
  etapa: Partial<EtapaTO>
): Promise<EtapaTO> {
  const payload: any = {
    ...(etapa.codProcesso !== undefined
      ? { codProcesso: Number(etapa.codProcesso) }
      : {}),
    ...(etapa.ordem !== undefined ? { ordem: Number(etapa.ordem) } : {}),
    ...(etapa.titulo !== undefined ? { titulo: etapa.titulo } : {}),
    ...(etapa.descricao !== undefined ? { descricao: etapa.descricao } : {}),
    ...(etapa.tipo !== undefined ? { tipo: etapa.tipo } : {}),
    ...(etapa.dependencias !== undefined
      ? { dependencias: etapa.dependencias }
      : {}),
  };

  const data = await request<any>(`/etapas/${id}`, {
    method: "PUT",
    body: payload,
  });

  return normalizarEtapa(data);
}

// DELETE /etapas/{id}
export async function deletarEtapa(id: number | string): Promise<void> {
  return request<void>(`/etapas/${id}`, { method: "DELETE" });
}

// =====================================================
// EXECUÇÕES
// =====================================================

// POST /execucoes/iniciar
export async function iniciarExecucao(
  codProcesso: number,
  cpfOuUsuario?: string
): Promise<ExecucaoTO> {
  return request<ExecucaoTO>("/execucoes/iniciar", {
    method: "POST",
    body: {
      codProcesso: Number(codProcesso),
      cpfOuUsuario: cpfOuUsuario || "usuario-teste",
    },
  });
}

// PUT /execucoes/{id}/finalizar-etapa
export async function finalizarEtapa(
  codExecucao: number | string,
  codEtapa: number
): Promise<ExecucaoTO> {
  return request<ExecucaoTO>(`/execucoes/${codExecucao}/finalizar-etapa`, {
    method: "PUT",
    body: { codEtapa: Number(codEtapa) },
  });
}

// GET /execucoes?cpfOuUsuario={x}
export async function listarExecucoes(cpfOuUsuario?: string): Promise<ExecucaoTO[]> {
  const query = cpfOuUsuario ? `?cpfOuUsuario=${cpfOuUsuario}` : "";
  return request<ExecucaoTO[]>(`/execucoes${query}`);
}

// GET /execucoes/{id}
export async function buscarExecucao(id: number | string): Promise<ExecucaoTO> {
  return request<ExecucaoTO>(`/execucoes/${id}`);
}
