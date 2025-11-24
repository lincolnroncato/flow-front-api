import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';

interface QuickQuestion {
  text: string;
  category: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Olá! Sou o FLOW Coach, seu assistente de IA. Como posso ajudá-lo hoje? Posso responder sobre processos, treinamento, funcionalidades do sistema e muito mais!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions: QuickQuestion[] = [
    { text: 'O que é o FLOW?', category: 'geral' },
    { text: 'Como executar um processo?', category: 'processos' },
    { text: 'Onde fazer treinamento?', category: 'treinamento' },
    { text: 'Como ver meu dashboard?', category: 'dashboard' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase().trim();

    // Saudações
    if (message.match(/^(oi|olá|ola|hey|hello|bom dia|boa tarde|boa noite)/)) {
      return 'Olá! Como posso ajudá-lo hoje? Posso responder sobre processos, treinamento, funcionalidades do FLOW e muito mais!';
    }

    // Sobre o FLOW
    if (message.match(/(o que é|o que e|sobre|conhecer|entender).*flow/)) {
      return 'O FLOW é um sistema inteligente de padronização, execução e aprendizado operacional. Ele organiza, corrige e otimiza fluxos de trabalho, transformando processos soltos em trilhas claras, seguras e eficientes. O sistema oferece fluxos visuais, guias passo a passo, treinamento automático e um assistente IA (eu!) para ajudar você.';
    }

    // Processos
    if (message.match(/(processo|processos|executar|como começar|iniciar)/)) {
      return 'Para executar um processo, siga estes passos:\n\n1. Acesse a página "Processos" no menu lateral\n2. Escolha o processo que deseja executar\n3. Clique em "Executar" ou "Ver Detalhes"\n4. Siga as etapas guiadas passo a passo\n5. Complete cada etapa antes de avançar\n\nO sistema guiará você através de cada etapa com instruções claras e recursos de apoio.';
    }

    // Treinamento
    if (message.match(/(treinamento|treinar|aprender|curso|academy|flown academy)/)) {
      return 'O FLOW Academy oferece treinamento contextual integrado aos processos! Você pode:\n\n• Acessar vídeos explicativos\n• Ler documentos e tutoriais\n• Fazer testes de conhecimento\n• Consultar perguntas frequentes\n\nAcesse a página "Treinamento" no menu ou clique em "Ver Treinamento" em qualquer processo. Todo o conteúdo está organizado por processo e etapa!';
    }

    // Dashboard
    if (message.match(/(dashboard|métricas|estatísticas|progresso|desempenho|estatísticas)/)) {
      return 'O Dashboard mostra todas as suas métricas e estatísticas:\n\n• Total de processos disponíveis\n• Execuções ativas\n• Processos concluídos hoje\n• Tempo médio de execução\n• Histórico de execuções recentes\n\nAcesse "Dashboard" no menu lateral para ver todas as suas informações em tempo real!';
    }

    // Tema
    if (message.match(/(tema|dark|escuro|claro|modo escuro|modo claro)/)) {
      return 'Para alterar o tema, clique no ícone de lua/sol no canto superior direito do header. O FLOW suporta tema claro, escuro e também detecta automaticamente as preferências do seu sistema operacional. Sua escolha é salva automaticamente!';
    }

    // Chatbot
    if (message.match(/(você|voce|quem é|assistente|ia|inteligência artificial)/)) {
      return 'Eu sou o FLOW Coach, seu assistente de IA integrado ao sistema FLOW. Estou aqui para:\n\n• Responder dúvidas sobre processos\n• Explicar funcionalidades do sistema\n• Sugerir melhorias\n• Ajudar você a navegar pelo FLOW\n\nPergunte-me qualquer coisa sobre o sistema!';
    }

    // Funcionalidades
    if (message.match(/(funcionalidade|recursos|o que pode|o que faz|features)/)) {
      return 'O FLOW oferece várias funcionalidades poderosas:\n\n✅ Fluxos visuais inteligentes\n✅ Guia de execução passo a passo\n✅ Treinamento contextual (FLOW Academy)\n✅ Assistente IA (eu!)\n✅ Dashboard com métricas\n✅ Histórico e rastreabilidade\n✅ Alertas inteligentes\n✅ Tema claro/escuro\n✅ Interface totalmente responsiva\n\nExplore o menu lateral para descobrir todas as funcionalidades!';
    }

    // Problemas/Erros
    if (message.match(/(problema|erro|não funciona|nao funciona|bug|ajuda|preciso de ajuda)/)) {
      return 'Entendo que você está com dificuldades. Vou ajudá-lo!\n\n• Verifique se está na página correta\n• Tente atualizar a página (F5)\n• Limpe o cache do navegador se necessário\n• Verifique sua conexão com a internet\n\nSe o problema persistir, entre em contato através da página "Contato" ou consulte a página "FAQ" para mais informações.';
    }

    // Contato
    if (message.match(/(contato|falar|suporte|ajuda|email|telefone)/)) {
      return 'Você pode entrar em contato conosco de várias formas:\n\n📧 E-mail: contato@flow.com.br\n📞 Telefone: (11) 1234-5678\n💬 Chat em tempo real: Estou aqui para ajudar!\n📄 Página de Contato: Acesse "Contato" no menu\n\nTambém temos uma página de FAQ com respostas para as perguntas mais frequentes!';
    }

    // Participantes
    if (message.match(/(participantes|equipe|desenvolvedores|quem fez|autores)/)) {
      return 'O projeto FLOW foi desenvolvido por uma equipe dedicada! Você pode conhecer os participantes acessando a página "Participantes" no menu lateral. Lá você encontrará informações sobre a equipe, RMs e a turma responsável pelo desenvolvimento.';
    }

    // Despedida
    if (message.match(/(tchau|até logo|ate logo|obrigado|obrigada|valeu|bye)/)) {
      return 'Foi um prazer ajudar! Se tiver mais dúvidas, estarei aqui. Boa sorte com seus processos no FLOW! 🚀';
    }

    // Resposta padrão
    return 'Entendi sua pergunta! O FLOW é um sistema completo de padronização operacional. Posso ajudar você com:\n\n• Informações sobre processos\n• Como usar o sistema\n• Treinamento e aprendizado\n• Funcionalidades do FLOW\n• Navegação pelo sistema\n\nTente fazer uma pergunta mais específica ou use uma das perguntas rápidas abaixo!';
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simular tempo de processamento
    setTimeout(() => {
      const response = getResponse(input);
      const assistantMessage: ChatMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 500);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    // Simular envio automático
    setTimeout(() => {
      const userMessage: ChatMessage = {
        id: messages.length + 1,
        role: 'user',
        content: question,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      setTimeout(() => {
        const response = getResponse(question);
        const assistantMessage: ChatMessage = {
          id: messages.length + 2,
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 800);
    }, 100);
  };

  const handleClearChat = () => {
    if (confirm('Tem certeza que deseja limpar a conversa?')) {
      setMessages([
        {
          id: 1,
          role: 'assistant',
          content: 'Conversa limpa! Como posso ajudá-lo agora?',
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="section-title text-left flex items-center">
            <Sparkles className="w-6 h-6 text-primary mr-2" />
            FLOW Coach
          </h1>
          <p className="text-muted-foreground">Assistente IA para dúvidas sobre processos</p>
        </div>
        {messages.length > 1 && (
          <button
            onClick={handleClearChat}
            className="btn btn-ghost btn-small"
            title="Limpar conversa"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="card flex-1 flex flex-col p-0 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-white'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Bot className="w-5 h-5" />
                )}
              </div>
              <div
                className={`flex-1 rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-primary text-white ml-12'
                    : 'bg-muted text-foreground mr-12'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-muted text-foreground mr-12 rounded-lg p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-6 pb-4 border-b border-border">
            <p className="text-sm text-muted-foreground mb-3">Perguntas rápidas:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(q.text)}
                  className="px-3 py-1.5 text-xs rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                >
                  {q.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSend} className="border-t border-border p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua pergunta..."
              className="input flex-1"
              disabled={isTyping}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isTyping || !input.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
