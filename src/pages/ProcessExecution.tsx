import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Upload,
  FileText,
  AlertCircle,
  Loader2
} from 'lucide-react';
import {
  buscarProcesso,
  listarEtapasPorProcesso,
  iniciarExecucao,
  finalizarEtapa,
  ProcessoTO,
  EtapaTO,
  ExecucaoTO
} from '../services/api';

interface StepData {
  [key: number]: {
    completed: boolean;
    data: any;
  };
}

const ProcessExecution = () => {
  const { id, stepId } = useParams<{ id: string; stepId?: string }>();
  const navigate = useNavigate();
  const currentStepId = stepId ? Number(stepId) : 1;

  const [process, setProcess] = useState<ProcessoTO | null>(null);
  const [etapas, setEtapas] = useState<EtapaTO[]>([]);
  const [execucao, setExecucao] = useState<ExecucaoTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stepData, setStepData] = useState<StepData>({});
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const carregarDados = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const [processoData, etapasData] = await Promise.all([
        buscarProcesso(id),
        listarEtapasPorProcesso(id).catch(() => [] as EtapaTO[]),
      ]);

      setProcess(processoData);
      setEtapas(etapasData);

      // Tentar iniciar execução se ainda não houver
      try {
        const codProcesso =
          (processoData as any).codProcesso ||
          (processoData as any).id ||
          Number(id);

        const execucaoData = await iniciarExecucao(Number(codProcesso));
        setExecucao(execucaoData);
      } catch (err) {
        console.warn('Erro ao iniciar execução (pode já estar iniciada):', err);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar processo');
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  // Converter dados da API para formato esperado pela UI
  const processMock: any = process
    ? {
        id: (process as any).id || (process as any).codProcesso || Number(id),
        title: (process as any).nome || (process as any).title || 'Processo',
        steps: etapas.map((etapa, index) => ({
          id: (etapa as any).id || (etapa as any).codEtapa || index + 1,
          order: etapa.ordem || (etapa as any).order || index + 1,
          title: etapa.titulo || (etapa as any).title || `Etapa ${index + 1}`,
          description: etapa.descricao || (etapa as any).description || '',
          type: (etapa as any).tipo || (etapa as any).type || 'action',
        })),
      }
    : {
        id: Number(id),
        title: 'Carregando...',
        steps: [],
      };

  // ====== STEPS DETALHADAS SEM TERNÁRIO EXTERNO (evita erro do esbuild) ======
  const buildDetailedSteps = () => {
    if (etapas.length > 0) {
      return etapas.map((etapa, index) => ({
        id: (etapa as any).id || (etapa as any).codEtapa || index + 1,
        order: etapa.ordem || (etapa as any).order || index + 1,
        title: etapa.titulo || (etapa as any).title || `Etapa ${index + 1}`,
        description: etapa.descricao || (etapa as any).description || '',
        type: (etapa as any).tipo || (etapa as any).type || 'action',

        // Campos adicionais para compatibilidade com UI
        fields: [],
        content: {},
        modules: [],
        questions: [],
        documents: [],
      }));
    }

    // fallback se o backend não retornar etapas
    return [
      {
        id: 1,
        order: 1,
        title: 'Cadastro Inicial',
        description: 'Preencha seus dados pessoais e informações básicas',
        type: 'form',
        fields: [
          { name: 'nome', label: 'Nome Completo', type: 'text', required: true },
          { name: 'email', label: 'E-mail', type: 'email', required: true },
          { name: 'telefone', label: 'Telefone', type: 'tel', required: true },
          { name: 'cargo', label: 'Cargo', type: 'text', required: true },
          {
            name: 'departamento',
            label: 'Departamento',
            type: 'select',
            required: true,
            options: ['RH', 'TI', 'Vendas', 'Marketing', 'Financeiro'],
          },
        ],
      },
      {
        id: 2,
        order: 2,
        title: 'Apresentação da Empresa',
        description: 'Assista ao vídeo de boas-vindas e leia as informações importantes',
        type: 'information',
        content: {
          video: 'https://example.com/video-boas-vindas',
          text:
            'Bem-vindo à nossa empresa! Este vídeo apresenta nossa cultura, valores e missão. Assista com atenção e depois marque como concluído.',
          checklist: [
            'Assistir vídeo completo',
            'Ler código de conduta',
            'Entender a estrutura organizacional',
          ],
        },
      },
      {
        id: 3,
        order: 3,
        title: 'Treinamento Obrigatório',
        description: 'Complete os módulos de treinamento obrigatórios',
        type: 'training',
        modules: [
          { id: 1, title: 'Segurança no Trabalho', completed: false },
          { id: 2, title: 'Políticas da Empresa', completed: false },
          { id: 3, title: 'Ferramentas de Trabalho', completed: false },
        ],
      },
      {
        id: 4,
        order: 4,
        title: 'Avaliação Final',
        description: 'Responda o questionário de conhecimento',
        type: 'quiz',
        questions: [
          {
            id: 1,
            question: 'Qual é o horário de trabalho padrão?',
            type: 'multiple-choice',
            options: ['8h às 17h', '9h às 18h', 'Flexível', 'A definir'],
            correct: 1,
          },
          {
            id: 2,
            question: 'Onde encontrar o manual do funcionário?',
            type: 'multiple-choice',
            options: ['Intranet', 'E-mail', 'FLOW Academy', 'Todas as anteriores'],
            correct: 3,
          },
        ],
      },
      {
        id: 5,
        order: 5,
        title: 'Upload de Documentos',
        description: 'Envie os documentos necessários',
        type: 'upload',
        documents: [
          { name: 'RG', required: true, uploaded: false },
          { name: 'CPF', required: true, uploaded: false },
          { name: 'Comprovante de Residência', required: true, uploaded: false },
        ],
      },
    ];
  };

  const processWithDetails: any = process
    ? {
        id: (process as any).id || (process as any).codProcesso || Number(id),
        title: (process as any).nome || (process as any).title || 'Processo',
        steps: buildDetailedSteps(),
      }
    : null;

  // Usar processWithDetails se disponível, senão usar processMock
  const processToUse =
    processWithDetails?.steps?.length > 0 ? processWithDetails : processMock;

  const currentStep =
    processToUse.steps.find((s: any) => s.id === currentStepId) ||
    processToUse.steps[0];

  const currentIndex = processToUse.steps.findIndex(
    (s: any) => s.id === currentStepId
  );

  const handleInputChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateStep = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (currentStep.type === 'form') {
      currentStep.fields?.forEach((field: any) => {
        if (field.required && !formData[field.name]) {
          newErrors[field.name] = `${field.label} é obrigatório`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCompleteStep = async () => {
    if (currentStep?.type === 'form' && !validateStep()) return;

    // Bloquear pular etapa
    if (currentIndex > 0) {
      const previousStep = processToUse.steps[currentIndex - 1];
      if (previousStep && !stepData[previousStep.id]?.completed) {
        alert('Você não pode pular etapas. Complete a etapa anterior primeiro.');
        return;
      }
    }

    try {
      setSaving(true);

      // Salvar na API se houver execução
      if (execucao && currentStep) {
        const codEtapa = currentStep.id || currentStepId;
        try {
          const codExecucao = (execucao as any).codExecucao || (execucao as any).id;
          if (codExecucao) {
            await finalizarEtapa(Number(codExecucao), Number(codEtapa));
          }
        } catch (err) {
          console.warn('Erro ao salvar etapa na API:', err);
        }
      }

      setStepData({
        ...stepData,
        [currentStepId]: {
          completed: true,
          data: formData,
        },
      });

      // Avançar para próxima etapa
      if (currentIndex < processToUse.steps.length - 1) {
        const nextStep = processToUse.steps[currentIndex + 1];
        navigate(`/processos/${id}/executar/etapa/${nextStep.id}`);
        setFormData({});
        setErrors({});
      } else {
        handleFinishProcess();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar etapa');
    } finally {
      setSaving(false);
    }
  };

  const handleFinishProcess = () => {
    if (
      confirm(
        'Tem certeza que deseja finalizar o processo? Todas as etapas foram concluídas?'
      )
    ) {
      alert('Processo concluído com sucesso! 🎉');
      navigate(`/processos/${id}`);
    }
  };

  const renderStepContent = () => {
    switch (currentStep.type) {
      case 'form':
        return (
          <div className="space-y-4">
            {currentStep.fields?.map((field: any) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {field.label}
                  {field.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </label>

                {field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    className={`input ${
                      errors[field.name] ? 'border-destructive' : ''
                    }`}
                  >
                    <option value="">Selecione...</option>
                    {field.options?.map((opt: string) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    className={`input ${
                      errors[field.name] ? 'border-destructive' : ''
                    }`}
                    placeholder={`Digite ${field.label.toLowerCase()}`}
                  />
                )}

                {errors[field.name] && (
                  <p className="text-sm text-destructive mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}
          </div>
        );

      case 'information':
        return (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-foreground mb-4">{currentStep.content?.text}</p>
              <div className="space-y-2">
                <p className="font-semibold text-foreground mb-2">Checklist:</p>
                {currentStep.content?.checklist?.map(
                  (item: string, idx: number) => (
                    <label
                      key={idx}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData[`checklist-${idx}`] || false}
                        onChange={(e) =>
                          handleInputChange(
                            `checklist-${idx}`,
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-primary rounded"
                      />
                      <span className="text-foreground">{item}</span>
                    </label>
                  )
                )}
              </div>
            </div>
            <div className="border border-border rounded-lg p-4 bg-primary/5">
              <p className="text-sm text-muted-foreground">
                💡 Dica: Assista o vídeo completo antes de marcar como concluído
              </p>
            </div>
          </div>
        );

      case 'training':
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground mb-4">
              Complete os módulos de treinamento abaixo. Cada módulo deve ser
              concluído antes de avançar.
            </p>

            {currentStep.modules?.map((module: any) => (
              <div
                key={module.id}
                className={`border-2 rounded-lg p-4 ${
                  formData[`module-${module.id}`]
                    ? 'border-success bg-success/5'
                    : 'border-border'
                }`}
              >
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData[`module-${module.id}`] || false}
                    onChange={(e) =>
                      handleInputChange(
                        `module-${module.id}`,
                        e.target.checked
                      )
                    }
                    className="w-5 h-5 text-primary rounded"
                  />
                  <div>
                    <span className="font-medium text-foreground">
                      {module.title}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      Acesse o FLOW Academy para completar este módulo
                    </p>
                  </div>
                </label>
              </div>
            ))}

            <Link
              to="/treinamento"
              className="btn btn-outline inline-flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Ir para Treinamento
            </Link>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-6">
            {currentStep.questions?.map((q: any) => (
              <div key={q.id} className="border border-border rounded-lg p-4">
                <p className="font-semibold text-foreground mb-3">
                  {q.question}
                </p>
                <div className="space-y-2">
                  {q.options?.map((option: string, idx: number) => (
                    <label
                      key={idx}
                      className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-colors ${
                        formData[`question-${q.id}`] === idx
                          ? 'bg-primary/10 border-2 border-primary'
                          : 'bg-muted border-2 border-transparent hover:bg-accent/5'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        checked={formData[`question-${q.id}`] === idx}
                        onChange={() =>
                          handleInputChange(`question-${q.id}`, idx)
                        }
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-foreground">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'upload':
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground mb-4">
              Faça upload dos documentos necessários. Todos os documentos
              marcados como obrigatórios devem ser enviados.
            </p>

            {currentStep.documents?.map((doc: any, idx: number) => (
              <div
                key={idx}
                className={`border-2 rounded-lg p-4 ${
                  formData[`doc-${idx}`]
                    ? 'border-success bg-success/5'
                    : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium text-foreground">
                      {doc.name}
                    </span>
                    {doc.required && (
                      <span className="ml-2 text-xs text-destructive">
                        * Obrigatório
                      </span>
                    )}
                  </div>

                {formData[`doc-${idx}`] && (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  )}
                </div>

                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleInputChange(`doc-${idx}`, true);
                    }
                  }}
                  className="hidden"
                  id={`file-${idx}`}
                />

                <label
                  htmlFor={`file-${idx}`}
                  className="btn btn-outline btn-small cursor-pointer inline-flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {formData[`doc-${idx}`]
                    ? 'Documento Enviado'
                    : 'Enviar Documento'}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <p className="text-muted-foreground">
            Conteúdo da etapa será carregado aqui...
          </p>
        );
    }
  };

  const canProceed = () => {
    if (currentStep.type === 'form') {
      return currentStep.fields?.every(
        (f: any) => !f.required || formData[f.name]
      );
    }
    if (currentStep.type === 'information') {
      return currentStep.content?.checklist?.every(
        (_: any, idx: number) => formData[`checklist-${idx}`]
      );
    }
    if (currentStep.type === 'training') {
      return currentStep.modules?.every(
        (m: any) => formData[`module-${m.id}`]
      );
    }
    if (currentStep.type === 'quiz') {
      return currentStep.questions?.every(
        (q: any) => formData[`question-${q.id}`] !== undefined
      );
    }
    if (currentStep.type === 'upload') {
      return currentStep.documents?.every(
        (d: any, idx: number) =>
          !d.required || formData[`doc-${idx}`]
      );
    }
    return true;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando execução...</p>
        </div>
      </div>
    );
  }

  if (error || !process) {
    return (
      <div className="max-w-7xl mx-auto">
        <Link
          to={`/processos/${id}`}
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>
        <div className="card p-6 border-destructive bg-destructive/10">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-destructive" />
            <h2 className="text-xl font-bold text-foreground">
              Erro ao carregar execução
            </h2>
          </div>
          <p className="text-muted-foreground mb-4">
            {error || 'Processo não encontrado'}
          </p>
          <Link to={`/processos/${id}`} className="btn btn-primary">
            Voltar para Processo
          </Link>
        </div>
      </div>
    );
  }

  if (!currentStep || processToUse.steps.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <Link
          to={`/processos/${id}`}
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>
        <div className="card p-6">
          <p className="text-muted-foreground text-center py-8">
            Nenhuma etapa disponível para este processo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Link
        to={`/processos/${id}`}
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Link>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-foreground">
            {processToUse.title}
          </h1>
          <div className="text-sm text-muted-foreground">
            Etapa {currentStep.order || currentIndex + 1} de{' '}
            {processToUse.steps.length}
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mt-4">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / processToUse.steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar com etapas */}
        <div className="lg:col-span-1">
          <div className="card p-4 space-y-2 sticky top-20">
            <h3 className="font-semibold text-foreground mb-4">
              Etapas do Processo
            </h3>

            {processToUse.steps.map((step: any, index: number) => {
              const isActive = step.id === currentStepId;
              const isCompleted =
                stepData[step.id]?.completed || index < currentIndex;
              const isBlocked = index > currentIndex && !isCompleted;

              return (
                <Link
                  key={step.id}
                  to={`/processos/${id}/executar/etapa/${step.id}`}
                  onClick={(e) => {
                    if (isBlocked) {
                      e.preventDefault();
                      alert(
                        'Você não pode pular etapas. Complete as etapas anteriores primeiro.'
                      );
                    }
                  }}
                  className={`flow-step block ${
                    isActive
                      ? 'flow-step-active'
                      : isCompleted
                      ? 'flow-step-completed'
                      : isBlocked
                      ? 'flow-step-blocked cursor-not-allowed'
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    ) : isBlocked ? (
                      <XCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-current flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{step.title}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {currentStep.title}
            </h2>
            <p className="text-muted-foreground mb-6">
              {currentStep.description}
            </p>

            <div className="border-t border-border pt-6 mb-6">
              {renderStepContent()}
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              {currentIndex > 0 && (
                <Link
                  to={`/processos/${id}/executar/etapa/${
                    processToUse.steps[currentIndex - 1].id
                  }`}
                  className="btn btn-outline"
                >
                  Etapa Anterior
                </Link>
              )}

              {currentIndex < processToUse.steps.length - 1 ? (
                <button
                  onClick={handleCompleteStep}
                  disabled={!canProceed() || saving}
                  className="btn btn-primary ml-auto"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      Concluir e Avançar
                      <PlayCircle className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleCompleteStep}
                  disabled={!canProceed() || saving}
                  className="btn btn-primary ml-auto"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      Finalizar Processo
                      <CheckCircle2 className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessExecution;
