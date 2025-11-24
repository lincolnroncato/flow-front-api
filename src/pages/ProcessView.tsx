import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle, GraduationCap, ArrowLeft, Loader2, AlertCircle, Clock } from 'lucide-react';
import { buscarProcesso, listarEtapasPorProcesso, ProcessoTO, EtapaTO } from '../services/api';

const ProcessView = () => {
  const { id } = useParams<{ id: string }>();
  const [process, setProcess] = useState<ProcessoTO | null>(null);
  const [etapas, setEtapas] = useState<EtapaTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      carregarDados();
    }
  }, [id]);

  const carregarDados = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      
      const [processoData, etapasData] = await Promise.all([
        buscarProcesso(id),
        listarEtapasPorProcesso(id).catch(() => [] as EtapaTO[]), // Se falhar, retorna array vazio
      ]);

      setProcess(processoData);
      setEtapas(etapasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar processo');
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProcessTitle = (p: ProcessoTO): string => {
    return p.nome || p.title || 'Sem título';
  };

  const getProcessDescription = (p: ProcessoTO): string => {
    return p.descricao || p.description || 'Sem descrição';
  };

  const getProcessCategory = (p: ProcessoTO): string => {
    return p.categoria || p.category || 'Geral';
  };

  const getProcessTime = (p: ProcessoTO): number => {
    return p.tempoEstimado || p.estimatedTime || 0;
  };

  const getStepTitle = (step: EtapaTO): string => {
    return step.titulo || step.title || 'Sem título';
  };

  const getStepDescription = (step: EtapaTO): string => {
    return step.descricao || step.description || 'Sem descrição';
  };

  const getStepOrder = (step: EtapaTO): number => {
    return step.ordem || step.order || 0;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando processo...</p>
        </div>
      </div>
    );
  }

  if (error || !process) {
    return (
      <div className="max-w-7xl mx-auto">
        <Link
          to="/processos"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Processos
        </Link>
        <div className="card p-6 border-destructive bg-destructive/10">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-destructive" />
            <h2 className="text-xl font-bold text-foreground">Erro ao carregar processo</h2>
          </div>
          <p className="text-muted-foreground mb-4">{error || 'Processo não encontrado'}</p>
          <Link to="/processos" className="btn btn-primary">
            Voltar para Lista
          </Link>
        </div>
      </div>
    );
  }

  const sortedEtapas = [...etapas].sort((a, b) => getStepOrder(a) - getStepOrder(b));

  return (
    <div className="max-w-7xl mx-auto">
      <Link
        to="/processos"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar para Processos
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
            {getProcessCategory(process)}
          </span>
          {getProcessTime(process) > 0 && (
            <span className="text-muted-foreground flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              ~{getProcessTime(process)} minutos
            </span>
          )}
        </div>
        <h1 className="section-title text-left">{getProcessTitle(process)}</h1>
        <p className="text-lg text-muted-foreground mb-6">{getProcessDescription(process)}</p>

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/processos/${id}/executar`}
            className="btn btn-primary"
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            Iniciar Execução
          </Link>
          <Link
            to={`/treinamento/${id}`}
            className="btn btn-outline"
          >
            <GraduationCap className="w-5 h-5 mr-2" />
            Ver Treinamento
          </Link>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Etapas do Processo</h2>
        {sortedEtapas.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhuma etapa cadastrada para este processo.
          </p>
        ) : (
          <div className="space-y-4">
            {sortedEtapas.map((step) => {
              const stepId = step.id ?? step.codEtapa ?? 0;
              return (
                <div
                  key={stepId}
                  className="flow-step flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {getStepOrder(step)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {getStepTitle(step)}
                    </h3>
                    <p className="text-muted-foreground">{getStepDescription(step)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessView;

