import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, Plus, Edit, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { listarProcessos, deletarProcesso, ProcessoTO } from '../services/api';
import { Process } from '../types';

const ProcessList = () => {
  const [processes, setProcesses] = useState<ProcessoTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarProcessos();
  }, []);

  const carregarProcessos = async () => {
    try {
      setLoading(true);
      setError(null);
      const dados = await listarProcessos();
      setProcesses(dados);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar processos');
      console.error('Erro ao carregar processos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number | string | undefined) => {
    if (!id) return;
    
    if (!window.confirm('Tem certeza que deseja deletar este processo?')) {
      return;
    }

    try {
      setDeletingId(id);
      await deletarProcesso(id);
      await carregarProcessos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao deletar processo');
    } finally {
      setDeletingId(null);
    }
  };

  const getProcessId = (process: ProcessoTO): number | string => {
    return process.id ?? process.codProcesso ?? 0;
  };

  const getProcessTitle = (process: ProcessoTO): string => {
    return process.nome || process.title || 'Sem título';
  };

  const getProcessDescription = (process: ProcessoTO): string => {
    return process.descricao || process.description || 'Sem descrição';
  };

  const getProcessCategory = (process: ProcessoTO): string => {
    return process.categoria || process.category || 'Geral';
  };

  const getProcessTime = (process: ProcessoTO): number => {
    return process.tempoEstimado || process.estimatedTime || 0;
  };

  const getProcessDifficulty = (process: ProcessoTO): 'easy' | 'medium' | 'hard' => {
    return process.dificuldade || process.difficulty || 'medium';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando processos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="card p-6 border-destructive bg-destructive/10">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-destructive" />
            <h2 className="text-xl font-bold text-foreground">Erro ao carregar processos</h2>
          </div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button onClick={carregarProcessos} className="btn btn-primary">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="section-title">Processos Disponíveis</h1>
          <p className="section-subtitle">
            Selecione um processo para visualizar, executar ou treinar
          </p>
        </div>
        <button
          onClick={() => navigate('/processos/novo')}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Processo
        </button>
      </div>

      {processes.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-muted-foreground mb-4">Nenhum processo encontrado.</p>
          <button
            onClick={() => navigate('/processos/novo')}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Processo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processes.map((process) => {
            const processId = getProcessId(process);
            const isDeleting = deletingId === processId;

            return (
              <div key={processId} className="card card-hover p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {getProcessCategory(process)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    getProcessDifficulty(process) === 'easy' ? 'bg-success/10 text-success' :
                    getProcessDifficulty(process) === 'medium' ? 'bg-warning/10 text-warning' :
                    'bg-destructive/10 text-destructive'
                  }`}>
                    {getProcessDifficulty(process)}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {getProcessTitle(process)}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {getProcessDescription(process)}
                </p>
                
                {getProcessTime(process) > 0 && (
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{getProcessTime(process)} minutos</span>
                  </div>
                )}

                <div className="flex gap-2 mb-2">
                  <Link
                    to={`/processos/${processId}`}
                    className="btn btn-outline flex-1"
                  >
                    Ver Detalhes
                  </Link>
                  <Link
                    to={`/processos/${processId}/executar`}
                    className="btn btn-primary flex-1"
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Executar
                  </Link>
                </div>

                <div className="flex gap-2 pt-2 border-t border-border">
                  <button
                    onClick={() => navigate(`/processos/${processId}/editar`)}
                    className="btn btn-ghost btn-small flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(processId)}
                    disabled={isDeleting}
                    className="btn btn-ghost btn-small flex-1 text-destructive hover:bg-destructive/10"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Deletar
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProcessList;

