import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: 'O que é o FLOW?',
      answer: 'FLOW é um sistema inteligente de padronização, execução e aprendizado operacional. Ele organiza, corrige e otimiza fluxos de trabalho, transformando processos soltos em trilhas claras, seguras e eficientes.',
      category: 'Geral',
    },
    {
      id: 2,
      question: 'Como posso começar a usar o FLOW?',
      answer: 'Para começar, acesse a página de Processos, escolha um processo que deseja executar e clique em "Executar". O sistema guiará você passo a passo através de cada etapa.',
      category: 'Uso',
    },
    {
      id: 3,
      question: 'O FLOW oferece treinamento?',
      answer: 'Sim! O FLOW Academy oferece treinamento contextual com vídeos, documentos, tutoriais, testes e perguntas frequentes. Todo o conteúdo está integrado aos processos.',
      category: 'Treinamento',
    },
    {
      id: 4,
      question: 'Como funciona o FLOW Coach?',
      answer: 'O FLOW Coach é um assistente de IA que responde dúvidas sobre processos, sugere melhorias e explica procedimentos em linguagem natural. Acesse a página do Chatbot para conversar com ele.',
      category: 'Funcionalidades',
    },
    {
      id: 5,
      question: 'Posso acompanhar meu progresso?',
      answer: 'Sim! O Dashboard mostra todas as suas execuções, estatísticas de conclusão, tempo médio e muito mais. Acesse a página Dashboard para ver suas métricas.',
      category: 'Funcionalidades',
    },
    {
      id: 6,
      question: 'O FLOW funciona em dispositivos móveis?',
      answer: 'Sim! O FLOW é totalmente responsivo e funciona perfeitamente em smartphones e tablets. Você pode executar processos de qualquer lugar.',
      category: 'Tecnologia',
    },
    {
      id: 7,
      question: 'Como altero entre tema claro e escuro?',
      answer: 'Clique no ícone de lua/sol no canto superior direito do header. O tema será salvo automaticamente para suas próximas visitas.',
      category: 'Uso',
    },
    {
      id: 8,
      question: 'O que acontece se eu pular uma etapa?',
      answer: 'O FLOW possui alertas inteligentes que avisam quando você tenta pular uma etapa obrigatória. Isso garante que todos os processos sejam executados corretamente.',
      category: 'Funcionalidades',
    },
  ];

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <HelpCircle className="w-16 h-16 text-primary" />
        </div>
        <h1 className="section-title">Perguntas Frequentes</h1>
        <p className="section-subtitle">
          Encontre respostas para as dúvidas mais comuns sobre o FLOW
        </p>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">{category}</h2>
            <div className="space-y-3">
              {faqs
                .filter((faq) => faq.category === category)
                .map((faq) => (
                  <div key={faq.id} className="card">
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-accent/5 transition-colors"
                    >
                      <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                          openItems.includes(faq.id) ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openItems.includes(faq.id) && (
                      <div className="px-6 pb-6">
                        <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 card p-8 text-center">
        <h3 className="text-xl font-bold text-foreground mb-4">
          Ainda tem dúvidas?
        </h3>
        <p className="text-muted-foreground mb-6">
          Entre em contato conosco ou converse com o FLOW Coach para obter mais informações.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/contato" className="btn btn-primary">
            Entrar em Contato
          </a>
          <a href="/chatbot" className="btn btn-outline">
            Falar com FLOW Coach
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

