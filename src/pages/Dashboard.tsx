import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, AlertCircle, CheckCircle2, PlayCircle, Loader2 } from 'lucide-react';
import { listarProcessos, listarExecucoes, ProcessoTO, ExecucaoTO } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProcesses: 0,
    activeExecutions: 0,
    completedToday: 0,
    averageCompletionTime: 0,
    errorRate: 0,
  });
  const [recentExecutions, setRecentExecutions] = useState<ExecucaoTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);

      const [processos, execucoes] = await Promise.all([
        listarProcessos().catch(() => [] as ProcessoTO[]),
        listarExecucoes().catch(() => [] as ExecucaoTO[]),
      ]);

      // Calcular estatísticas
      const hoje = new Date().toISOString().split('T')[0];
      const execucoesHoje = execucoes.filter((e) => {
        const dataFim = e.dataFim || e.completedAt;
        if (typeof dataFim === 'string') {
          return dataFim.startsWith(hoje);
        }
        return false;
      });

      const execucoesAtivas = execucoes.filter(
        (e) => e.status === 'in_progress' || e.status === 'pending'
      );

      const execucoesCompletas = execucoes.filter((e) => e.status === 'completed');
      const temposCompletos = execucoesCompletas
        .map((e) => {
          const inicio = e.dataInicio || e.startedAt;
          const fim = e.dataFim || e.completedAt;
          if (inicio && fim) {
            const inicioDate = new Date(inicio);
            const fimDate = new Date(fim);
            return (fimDate.getTime() - inicioDate.getTime()) / (1000 * 60); // minutos
          }
          return 0;
        })
        .filter((t) => t > 0);

      const tempoMedio =
        temposCompletos.length > 0
          ? Math.round(temposCompletos.reduce((a, b) => a + b, 0) / temposCompletos.length)
          : 0;

      setStats({
        totalProcesses: processos.length,
        activeExecutions: execucoesAtivas.length,
        completedToday: execucoesHoje.length,
        averageCompletionTime: tempoMedio,
        errorRate: execucoes.length > 0 ? (execucoes.filter((e) => e.status === 'blocked').length / execucoes.length) * 100 : 0,
      });

      // Últimas 5 execuções
      const execucoesOrdenadas = [...execucoes]
        .sort((a, b) => {
          const dataA = a.dataInicio || a.startedAt || '';
          const dataB = b.dataInicio || b.startedAt || '';
          return new Date(dataB).getTime() - new Date(dataA).getTime();
        })
        .slice(0, 5);

      setRecentExecutions(execucoesOrdenadas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      console.error('Erro ao carregar dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (execucao: ExecucaoTO): string => {
    const inicio = execucao.dataInicio || execucao.startedAt;
    if (!inicio) return 'N/A';
    
    const inicioDate = new Date(inicio);
    const agora = new Date();
    const diffMs = agora.getTime() - inicioDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) return `${diffMins}min`;
    const horas = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${horas}h ${mins}min`;
  };

  const getProcessName = async (codProcesso: number): Promise<string> => {
    try {
      const processo = await import('../services/api').then((m) => m.buscarProcesso(codProcesso));
      return processo.nome || processo.title || 'Processo';
    } catch {
      return 'Processo';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dashboard...</p>
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
            <h2 className="text-xl font-bold text-foreground">Erro ao carregar dashboard</h2>
          </div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button onClick={carregarDados} className="btn btn-primary">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="section-title text-left">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral das operações e métricas</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total de Processos</span>
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.totalProcesses}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Execuções Ativas</span>
            <PlayCircle className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.activeExecutions}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Concluídos Hoje</span>
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.completedToday}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Tempo Médio</span>
            <Clock className="w-5 h-5 text-warning" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.averageCompletionTime}min</p>
        </div>
      </div>

      {/* Recent Executions */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Execuções Recentes</h2>
        {recentExecutions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhuma execução encontrada.
          </p>
        ) : (
          <div className="space-y-3">
            {recentExecutions.map((execution) => {
              const execId = execution.id || execution.codExecucao || 0;
              return (
                <div
                  key={execId}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      Processo #{execution.codProcesso || execution.processId || 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {execution.cpfOuUsuario || execution.userId || 'Usuário não informado'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      execution.status === 'completed' ? 'bg-success/10 text-success' :
                      execution.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                      execution.status === 'blocked' ? 'bg-destructive/10 text-destructive' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {execution.status === 'completed' ? 'Concluído' :
                       execution.status === 'in_progress' ? 'Em Andamento' :
                       execution.status === 'blocked' ? 'Bloqueado' :
                       'Pendente'}
                    </span>
                    <span className="text-sm text-muted-foreground">{formatTime(execution)}</span>
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

export default Dashboard;

