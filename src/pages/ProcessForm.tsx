import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { buscarProcesso, criarProcesso, atualizarProcesso, ProcessoTO } from '../services/api';

const ProcessForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: '',
    tempoEstimado: 0,
    dificuldade: 'medium' as 'easy' | 'medium' | 'hard',
  });

  useEffect(() => {
    if (isEditing && id) {
      carregarProcesso();
    }
  }, [id, isEditing]);

  const carregarProcesso = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const processo = await buscarProcesso(id);
      
      setFormData({
        nome: processo.nome || processo.title || '',
        descricao: processo.descricao || processo.description || '',
        categoria: processo.categoria || processo.category || '',
        tempoEstimado: processo.tempoEstimado || processo.estimatedTime || 0,
        dificuldade: processo.dificuldade || processo.difficulty || 'medium',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar processo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      setError('O nome do processo é obrigatório');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const processoData: Omit<ProcessoTO, 'id' | 'codProcesso'> = {
        nome: formData.nome.trim(),
        descricao: formData.descricao.trim() || undefined,
        categoria: formData.categoria.trim() || undefined,
        tempoEstimado: formData.tempoEstimado > 0 ? formData.tempoEstimado : undefined,
        dificuldade: formData.dificuldade,
      };

      if (isEditing && id) {
        await atualizarProcesso(id, processoData);
        alert('Processo atualizado com sucesso!');
      } else {
        await criarProcesso(processoData);
        alert('Processo criado com sucesso!');
      }

      navigate('/processos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar processo');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando processo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/processos"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar para Processos
      </Link>

      <div className="mb-8">
        <h1 className="section-title text-left">
          {isEditing ? 'Editar Processo' : 'Novo Processo'}
        </h1>
        <p className="text-muted-foreground">
          {isEditing ? 'Atualize as informações do processo' : 'Preencha os dados para criar um novo processo'}
        </p>
      </div>

      {error && (
        <div className="card p-4 mb-6 border-destructive bg-destructive/10">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Nome do Processo <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            className="input"
            placeholder="Ex: Processo de Onboarding"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Descrição
          </label>
          <textarea
            value={formData.descricao}
            onChange={(e) => handleChange('descricao', e.target.value)}
            className="input min-h-[100px] resize-y"
            placeholder="Descreva o processo..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Categoria
            </label>
            <input
              type="text"
              value={formData.categoria}
              onChange={(e) => handleChange('categoria', e.target.value)}
              className="input"
              placeholder="Ex: RH, Vendas, TI"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tempo Estimado (minutos)
            </label>
            <input
              type="number"
              value={formData.tempoEstimado}
              onChange={(e) => handleChange('tempoEstimado', parseInt(e.target.value) || 0)}
              className="input"
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Dificuldade
          </label>
          <select
            value={formData.dificuldade}
            onChange={(e) => handleChange('dificuldade', e.target.value)}
            className="input"
          >
            <option value="easy">Fácil</option>
            <option value="medium">Médio</option>
            <option value="hard">Difícil</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Link to="/processos" className="btn btn-outline">
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary ml-auto"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Atualizar' : 'Criar'} Processo
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProcessForm;

