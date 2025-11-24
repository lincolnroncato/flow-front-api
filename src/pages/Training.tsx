import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Video, FileText, HelpCircle, BookOpen, CheckCircle2, Play, Download, Award, Loader2, AlertCircle } from 'lucide-react';
import { buscarProcesso, listarEtapasPorProcesso, ProcessoTO, EtapaTO } from '../services/api';

const Training = () => {
  const { processId } = useParams<{ processId?: string }>();
  const [process, setProcess] = useState<ProcessoTO | null>(null);
  const [etapas, setEtapas] = useState<EtapaTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
  const [testAnswers, setTestAnswers] = useState<{ [key: number]: number }>({});
  const [testResults, setTestResults] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (processId) {
      carregarDados();
    }
  }, [processId]);

  const carregarDados = async () => {
    if (!processId) return;

    try {
      setLoading(true);
      setError(null);
      
      const [processoData, etapasData] = await Promise.all([
        buscarProcesso(processId),
        listarEtapasPorProcesso(processId).catch(() => [] as EtapaTO[]),
      ]);

      setProcess(processoData);
      setEtapas(etapasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      console.error('Erro ao carregar treinamento:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock data simplificado - mantido para compatibilidade com UI existente
  const trainingContent = {
    processName: process ? (process.nome || process.title || 'Processo') : 'Processo de Onboarding',
    videos: [
      { id: 1, title: 'Introdução ao Processo de Onboarding', duration: 5, watched: false },
      { id: 2, title: 'Passo a Passo Detalhado', duration: 12, watched: false },
      { id: 3, title: 'Boas Práticas e Dicas', duration: 8, watched: false },
    ],
    documents: [
      { id: 1, title: 'Manual Completo do Processo', type: 'PDF', pages: 15 },
      { id: 2, title: 'Checklist de Execução', type: 'PDF', pages: 3 },
      { id: 3, title: 'Guia Rápido de Referência', type: 'PDF', pages: 5 },
    ],
    tutorials: [
      {
        id: 1,
        title: 'Como iniciar o processo',
        steps: [
          'Acesse a página de Processos',
          'Selecione o processo desejado',
          'Clique em "Executar"',
          'Siga as etapas guiadas',
        ],
      },
      {
        id: 2,
        title: 'Preenchendo formulários',
        steps: [
          'Leia todas as instruções cuidadosamente',
          'Preencha todos os campos obrigatórios',
          'Revise as informações antes de enviar',
          'Clique em "Próxima Etapa" para continuar',
        ],
      },
    ],
    faq: [
      {
        id: 1,
        question: 'Como começar o processo?',
        answer: 'Clique em "Executar" na página de processos e siga as etapas guiadas. O sistema mostrará cada passo com instruções claras.',
      },
      {
        id: 2,
        question: 'Posso pular etapas?',
        answer: 'Não, todas as etapas devem ser concluídas em ordem. Isso garante que o processo seja executado corretamente.',
      },
      {
        id: 3,
        question: 'O que fazer se tiver dúvidas?',
        answer: 'Use o FLOW Coach (chatbot) para tirar dúvidas em tempo real ou consulte a seção de FAQ.',
      },
    ],
    tests: [
      {
        id: 1,
        title: 'Teste de Conhecimento Básico',
        questions: [
          {
            id: 1,
            question: 'Qual é o primeiro passo ao iniciar um processo?',
            options: ['Ler o manual', 'Clicar em Executar', 'Fazer treinamento', 'Consultar FAQ'],
            correct: 1,
          },
          {
            id: 2,
            question: 'É possível pular etapas no FLOW?',
            options: ['Sim, sempre', 'Não, nunca', 'Depende do processo', 'Apenas algumas'],
            correct: 1,
          },
          {
            id: 3,
            question: 'Onde encontrar ajuda durante a execução?',
            options: ['Apenas no manual', 'No FLOW Coach', 'Não há ajuda disponível', 'Apenas no FAQ'],
            correct: 1,
          },
        ],
      },
    ],
  };

  const handleVideoWatch = (videoId: number) => {
    setCompletedItems((prev) => new Set([...prev, videoId]));
  };

  const handleDocumentRead = (docId: number) => {
    setCompletedItems((prev) => new Set([...prev, docId + 100]));
  };

  const handleTestSubmit = (testId: number) => {
    const test = trainingContent.tests.find((t) => t.id === testId);
    if (!test) return;

    let correct = 0;
    test.questions.forEach((q) => {
      if (testAnswers[q.id] === q.correct) {
        correct++;
      }
    });

    const passed = correct >= test.questions.length * 0.7; // 70% para passar
    setTestResults({ ...testResults, [testId]: passed });
    setCompletedItems((prev) => new Set([...prev, testId + 200]));
  };

  const progress = processId
    ? Math.round(
        (completedItems.size /
          (trainingContent.videos.length +
            trainingContent.documents.length +
            trainingContent.tutorials.length +
            trainingContent.tests.length)) *
          100
      )
    : 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="section-title text-left">FLOW Academy</h1>
            <p className="text-muted-foreground">
              Treinamento contextual e recursos de aprendizado
              {processId && ` - ${trainingContent.processName}`}
            </p>
          </div>
          {processId && (
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-foreground">{progress}%</span>
            </div>
          )}
        </div>
      </div>

      {processId ? (
        <div className="space-y-6">
          {/* Progresso Geral */}
          {progress > 0 && (
            <div className="card p-6 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Progresso do Treinamento</h3>
                  <p className="text-sm text-muted-foreground">
                    {completedItems.size} de{' '}
                    {trainingContent.videos.length +
                      trainingContent.documents.length +
                      trainingContent.tutorials.length +
                      trainingContent.tests.length}{' '}
                    itens concluídos
                  </p>
                </div>
                {progress === 100 && (
                  <div className="flex items-center space-x-2 text-success">
                    <Award className="w-6 h-6" />
                    <span className="font-semibold">Concluído!</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Vídeos */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Video className="w-6 h-6 text-primary mr-2" />
                <h2 className="text-xl font-bold text-foreground">Vídeos</h2>
              </div>
              <span className="text-sm text-muted-foreground">
                {trainingContent.videos.filter((v) => completedItems.has(v.id)).length}/
                {trainingContent.videos.length} assistidos
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainingContent.videos.map((video) => {
                const isCompleted = completedItems.has(video.id);
                return (
                  <div
                    key={video.id}
                    className={`border-2 rounded-lg p-4 transition-all ${
                      isCompleted
                        ? 'border-success bg-success/5'
                        : 'border-border hover:border-primary hover:bg-accent/5'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-foreground">{video.title}</h3>
                          {isCompleted && <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{video.duration} minutos</p>
                      </div>
                      <Video className="w-8 h-8 text-primary flex-shrink-0" />
                    </div>
                    <button
                      onClick={() => handleVideoWatch(video.id)}
                      className={`btn w-full ${
                        isCompleted ? 'btn-outline' : 'btn-primary'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Assistido
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Assistir Vídeo
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Documentos */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FileText className="w-6 h-6 text-secondary mr-2" />
                <h2 className="text-xl font-bold text-foreground">Documentos</h2>
              </div>
              <span className="text-sm text-muted-foreground">
                {trainingContent.documents.filter((d) => completedItems.has(d.id + 100)).length}/
                {trainingContent.documents.length} lidos
              </span>
            </div>
            <div className="space-y-3">
              {trainingContent.documents.map((doc) => {
                const isCompleted = completedItems.has(doc.id + 100);
                return (
                  <div
                    key={doc.id}
                    className={`flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                      isCompleted
                        ? 'border-success bg-success/5'
                        : 'border-border hover:border-secondary hover:bg-accent/5'
                    }`}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <FileText className="w-6 h-6 text-secondary" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-foreground">{doc.title}</span>
                          {isCompleted && <CheckCircle2 className="w-5 h-5 text-success" />}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} • {doc.pages} páginas
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDocumentRead(doc.id)}
                        className="btn btn-outline btn-small"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {isCompleted ? 'Lido' : 'Baixar'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tutoriais */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="w-6 h-6 text-accent mr-2" />
              <h2 className="text-xl font-bold text-foreground">Tutoriais Interativos</h2>
            </div>
            <div className="space-y-4">
              {trainingContent.tutorials.map((tutorial) => {
                const isCompleted = completedItems.has(tutorial.id + 300);
                return (
                  <div
                    key={tutorial.id}
                    className={`border-2 rounded-lg p-4 transition-all ${
                      isCompleted
                        ? 'border-success bg-success/5'
                        : 'border-border hover:border-accent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">{tutorial.title}</h3>
                      {isCompleted && <CheckCircle2 className="w-5 h-5 text-success" />}
                    </div>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
                      {tutorial.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                    <button
                      onClick={() => setCompletedItems((prev) => new Set([...prev, tutorial.id + 300]))}
                      className={`btn btn-small ${isCompleted ? 'btn-outline' : 'btn-primary'}`}
                    >
                      {isCompleted ? 'Concluído' : 'Marcar como Lido'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Testes */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Award className="w-6 h-6 text-warning mr-2" />
                <h2 className="text-xl font-bold text-foreground">Testes de Conhecimento</h2>
              </div>
            </div>
            <div className="space-y-6">
              {trainingContent.tests.map((test) => {
                const isCompleted = completedItems.has(test.id + 200);
                const passed = testResults[test.id];
                return (
                  <div
                    key={test.id}
                    className={`border-2 rounded-lg p-6 transition-all ${
                      isCompleted
                        ? passed
                          ? 'border-success bg-success/5'
                          : 'border-destructive bg-destructive/5'
                        : 'border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">{test.title}</h3>
                      {isCompleted && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            passed
                              ? 'bg-success/10 text-success'
                              : 'bg-destructive/10 text-destructive'
                          }`}
                        >
                          {passed ? 'Aprovado' : 'Reprovado'}
                        </span>
                      )}
                    </div>
                    <div className="space-y-4">
                      {test.questions.map((q) => (
                        <div key={q.id} className="space-y-2">
                          <p className="font-medium text-foreground">{q.question}</p>
                          <div className="space-y-2">
                            {q.options.map((option, idx) => (
                              <label
                                key={idx}
                                className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${
                                  testAnswers[q.id] === idx
                                    ? 'bg-primary/10 border-2 border-primary'
                                    : 'bg-muted border-2 border-transparent hover:bg-accent/5'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${q.id}`}
                                  checked={testAnswers[q.id] === idx}
                                  onChange={() =>
                                    setTestAnswers({ ...testAnswers, [q.id]: idx })
                                  }
                                  disabled={isCompleted}
                                  className="w-4 h-4 text-primary"
                                />
                                <span className="text-sm text-foreground">{option}</span>
                                {isCompleted && idx === q.correct && (
                                  <CheckCircle2 className="w-4 h-4 text-success ml-auto" />
                                )}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {!isCompleted && (
                      <button
                        onClick={() => handleTestSubmit(test.id)}
                        className="btn btn-primary mt-4"
                        disabled={test.questions.some((q) => testAnswers[q.id] === undefined)}
                      >
                        Enviar Respostas
                      </button>
                    )}
                    {isCompleted && !passed && (
                      <p className="text-sm text-destructive mt-4">
                        Você precisa acertar pelo menos 70% das questões. Tente novamente!
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <HelpCircle className="w-6 h-6 text-warning mr-2" />
              <h2 className="text-xl font-bold text-foreground">Perguntas Frequentes</h2>
            </div>
            <div className="space-y-4">
              {trainingContent.faq.map((item) => (
                <div key={item.id} className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-foreground mb-1">{item.question}</h3>
                  <p className="text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Selecione um Processo</h2>
          <p className="text-muted-foreground mb-6">
            Escolha um processo para ver o conteúdo de treinamento disponível
          </p>
          <Link to="/processos" className="btn btn-primary">
            Ver Processos
          </Link>
        </div>
      )}
    </div>
  );
};

export default Training;
