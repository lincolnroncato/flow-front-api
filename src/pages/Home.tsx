import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle, GraduationCap, BarChart3 } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Transforme conhecimento solto em{' '}
          <span className="text-primary">fluxos claros</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          FLOW organiza, corrige e otimiza fluxos de trabalho, transformando processos
          soltos em trilhas claras, seguras e eficientes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/processos" className="btn btn-primary btn-large">
            Ver Processos
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link to="/treinamento" className="btn btn-outline btn-large">
            Começar Treinamento
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link to="/sobre" className="text-muted-foreground hover:text-primary transition-colors">
            Sobre
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
            FAQ
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link to="/contato" className="text-muted-foreground hover:text-primary transition-colors">
            Contato
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link to="/participantes" className="text-muted-foreground hover:text-primary transition-colors">
            Participantes
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card card-hover p-6">
          <PlayCircle className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">Execução Guiada</h3>
          <p className="text-muted-foreground">
            Siga processos passo a passo com orientações claras e recursos contextuais.
          </p>
        </div>

        <div className="card card-hover p-6">
          <GraduationCap className="w-12 h-12 text-secondary mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">Treinamento Automático</h3>
          <p className="text-muted-foreground">
            Aprenda enquanto trabalha com vídeos, tutoriais e testes integrados.
          </p>
        </div>

        <div className="card card-hover p-6">
          <BarChart3 className="w-12 h-12 text-accent mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">Dashboard Inteligente</h3>
          <p className="text-muted-foreground">
            Acompanhe métricas, desempenho e histórico de execuções em tempo real.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;

