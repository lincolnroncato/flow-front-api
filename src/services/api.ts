// Configuração da API
const BASE_URL = import.meta.env.VITE_API_URL || 'https://flow-java-api-production.up.railway.app';

// Tipos para requisições
interface RequestOptions extends RequestInit {
  body?: any;
}

// Função genérica para requisições
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  // Se body existe e não é string, serializa para JSON
  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }

  try {
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
        } catch {
          // Mantém a mensagem padrão
        }
      }
      
      throw new Error(errorMessage);
    }

    // Se a resposta estiver vazia (204 No Content), retorna void
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro desconhecido na requisição');
  }
}

// ========== PROCESSOS ==========

export interface ProcessoTO {
  id?: number;
  codProcesso?: number;
  nome: string;
  descricao?: string;
  categoria?: string;
  tempoEstimado?: number;
  dificuldade?: 'easy' | 'medium' | 'hard';
  status?: 'draft' | 'active' | 'archived' | 'deprecated';
  etapas?: EtapaTO[];
}

export interface EtapaTO {
  id?: number;
  codEtapa?: number;
  codProcesso: number;
  ordem: number;
  titulo: string;
  descricao?: string;
  tipo?: 'action' | 'decision' | 'approval' | 'information';
  dependencias?: number[];
}

export interface ExecucaoTO {
  id?: number;
  codExecucao?: number;
  codProcesso: number;
  cpfOuUsuario?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  etapaAtual?: number;
  etapasConcluidas?: number[];
  dataInicio?: string;
  dataFim?: string;
  observacoes?: string;
}

// GET /processos - Listar todos os processos
export async function listarProcessos(): Promise<ProcessoTO[]> {
  return request<ProcessoTO[]>('/processos');
}

// GET /processos/{id} - Buscar processo por ID
export async function buscarProcesso(id: number | string): Promise<ProcessoTO> {
  return request<ProcessoTO>(`/processos/${id}`);
}

// POST /processos - Criar novo processo
export async function criarProcesso(processo: Omit<ProcessoTO, 'id' | 'codProcesso'>): Promise<ProcessoTO> {
  return request<ProcessoTO>('/processos', {
    method: 'POST',
    body: processo,
  });
}

// PUT /processos/{id} - Atualizar processo
export async function atualizarProcesso(
  id: number | string,
  processo: Partial<ProcessoTO>
): Promise<ProcessoTO> {
  return request<ProcessoTO>(`/processos/${id}`, {
    method: 'PUT',
    body: processo,
  });
}

// DELETE /processos/{id} - Deletar processo
export async function deletarProcesso(id: number | string): Promise<void> {
  return request<void>(`/processos/${id}`, {
    method: 'DELETE',
  });
}

// ========== ETAPAS ==========

// GET /etapas?codProcesso={id} - Listar etapas de um processo
export async function listarEtapas(codProcesso: number | string): Promise<EtapaTO[]> {
  return request<EtapaTO[]>(`/etapas?codProcesso=${codProcesso}`);
}

// GET /processos/{id}/etapas - Alternativa: listar etapas via processo
export async function listarEtapasPorProcesso(id: number | string): Promise<EtapaTO[]> {
  try {
    return await request<EtapaTO[]>(`/processos/${id}/etapas`);
  } catch {
    // Fallback para endpoint alternativo
    return listarEtapas(id);
  }
}

// POST /etapas - Criar nova etapa
export async function criarEtapa(etapa: Omit<EtapaTO, 'id' | 'codEtapa'>): Promise<EtapaTO> {
  return request<EtapaTO>('/etapas', {
    method: 'POST',
    body: etapa,
  });
}

// PUT /etapas/{id} - Atualizar etapa
export async function atualizarEtapa(
  id: number | string,
  etapa: Partial<EtapaTO>
): Promise<EtapaTO> {
  return request<EtapaTO>(`/etapas/${id}`, {
    method: 'PUT',
    body: etapa,
  });
}

// DELETE /etapas/{id} - Deletar etapa
export async function deletarEtapa(id: number | string): Promise<void> {
  return request<void>(`/etapas/${id}`, {
    method: 'DELETE',
  });
}

// ========== EXECUÇÕES ==========

// POST /execucoes/iniciar - Iniciar execução de processo
export async function iniciarExecucao(
  codProcesso: number,
  cpfOuUsuario?: string
): Promise<ExecucaoTO> {
  return request<ExecucaoTO>('/execucoes/iniciar', {
    method: 'POST',
    body: {
      codProcesso,
      cpfOuUsuario: cpfOuUsuario || 'usuario-teste',
    },
  });
}

// PUT /execucoes/{id}/finalizar-etapa - Finalizar etapa de execução
export async function finalizarEtapa(
  codExecucao: number | string,
  codEtapa: number
): Promise<ExecucaoTO> {
  return request<ExecucaoTO>(`/execucoes/${codExecucao}/finalizar-etapa`, {
    method: 'PUT',
    body: { codEtapa },
  });
}

// GET /execucoes?cpfOuUsuario={x} - Listar execuções por usuário
export async function listarExecucoes(cpfOuUsuario?: string): Promise<ExecucaoTO[]> {
  const query = cpfOuUsuario ? `?cpfOuUsuario=${cpfOuUsuario}` : '';
  return request<ExecucaoTO[]>(`/execucoes${query}`);
}

// GET /execucoes/{id} - Buscar execução por ID
export async function buscarExecucao(id: number | string): Promise<ExecucaoTO> {
  return request<ExecucaoTO>(`/execucoes/${id}`);
}

