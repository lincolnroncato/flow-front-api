import { Link } from 'react-router-dom';
import { ArrowRight, Target, Users, Zap, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Sobre o <span className="text-primary">FLOW</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Transformando conhecimento solto em fluxos claros, seguros e eficientes.
        </p>
      </section>

      {/* Missão */}
      <section className="card p-8 md:p-12">
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            <Target className="w-12 h-12 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Nossa Missão</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Centralizar processos, treinar automaticamente e conduzir a operação como um fluxo contínuo.
            </p>
            <p className="text-muted-foreground">
              O FLOW nasceu para resolver um problema real: empresas perdem tempo, dinheiro e pessoas 
              por pura falta de padronização e organização operacional.
            </p>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section>
        <h2 className="section-title text-left mb-8">Nossos Valores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card card-hover p-6">
            <Zap className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Eficiência</h3>
            <p className="text-muted-foreground">
              Otimizamos processos para que tudo flua de forma rápida e eficiente.
            </p>
          </div>

          <div className="card card-hover p-6">
            <Shield className="w-12 h-12 text-secondary mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Confiabilidade</h3>
            <p className="text-muted-foreground">
              Processos padronizados garantem resultados consistentes e previsíveis.
            </p>
          </div>

          <div className="card card-hover p-6">
            <Users className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Colaboração</h3>
            <p className="text-muted-foreground">
              Facilitamos o aprendizado e a colaboração entre equipes.
            </p>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="card p-8 md:p-12">
        <h2 className="text-3xl font-bold text-foreground mb-8">Como Funciona</h2>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Fluxos Visuais</h3>
              <p className="text-muted-foreground">
                Cada processo é exibido como um mapa claro: etapas → ações → resultados.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Guia Passo a Passo</h3>
              <p className="text-muted-foreground">
                O usuário sabe exatamente o que fazer, quando fazer e como fazer.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Treinamento Automático</h3>
              <p className="text-muted-foreground">
                Vídeos, textos, tutoriais, testes e FAQs integrados em cada etapa.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Assistente IA</h3>
              <p className="text-muted-foreground">
                FLOW Coach responde dúvidas e explica processos em linguagem natural.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">Pronto para começar?</h2>
        <p className="text-muted-foreground mb-6">
          Explore nossos processos e descubra como o FLOW pode transformar sua operação.
        </p>
        <Link to="/processos" className="btn btn-primary btn-large">
          Ver Processos
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </section>
    </div>
  );
};

export default About;

