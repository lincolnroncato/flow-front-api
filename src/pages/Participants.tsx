import { Users, GraduationCap, Code, Heart, Linkedin, Github } from 'lucide-react';
import { useState } from 'react';

interface Participant {
  id: number;
  name: string;
  rm: string;
  role?: string;
  linkedin?: string;
  github?: string;
  photo?: string;
}

const ParticipantCard = ({ participant }: { participant: Participant }) => {
  const [imageError, setImageError] = useState(false);
  const showPhoto = participant.photo && !imageError;

  return (
    <div className="card card-hover p-6 text-center">
      <div className="mb-4">
        {showPhoto ? (
          <div className="w-32 h-32 rounded-full mx-auto overflow-hidden border-4 border-primary/20 shadow-lg">
            <img
              src={participant.photo}
              alt={participant.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto flex items-center justify-center border-4 border-primary/20 shadow-lg">
            <span className="text-white font-bold text-3xl">
              {participant.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{participant.name}</h3>
      <div className="flex items-center justify-center space-x-2 mb-3">
        <Code className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground font-mono">{participant.rm}</span>
      </div>
      {participant.role && (
        <p className="text-sm text-muted-foreground mb-4">{participant.role}</p>
      )}

      {/* Botões de LinkedIn e GitHub */}
      <div className="flex items-center justify-center space-x-2 mt-4">
        {participant.linkedin && (
          <a
            href={participant.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-small"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4 mr-1" />
            LinkedIn
          </a>
        )}
        {participant.github && (
          <a
            href={participant.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-small"
            title="GitHub"
          >
            <Github className="w-4 h-4 mr-1" />
            GitHub
          </a>
        )}
        {!participant.linkedin && !participant.github && (
          <p className="text-xs text-muted-foreground italic">
            Links em breve
          </p>
        )}
      </div>
    </div>
  );
};

const Participants = () => {
  const participants: Participant[] = [
    {
      id: 1,
      name: 'Rafael Malaguti',
      rm: 'RM 561830',
      role: 'Desenvolvedor',
      linkedin: 'https://www.linkedin.com/in/rafael-malaguti-481730340/',
      github: 'https://github.com/rafaelmalaguti',
      photo: 'https://img.ge/i/u25jX51.jpeg',
    },
    {
      id: 2,
      name: 'Lincoln Roncato',
      rm: 'RM 565944',
      role: 'Desenvolvedor',
      linkedin: 'https://www.linkedin.com/in/lincoln-roncato-266233353/',
      github: 'https://github.com/lincolnroncato',
      photo: 'https://img.ge/i/sCbyN51.jpeg',
    },
    {
      id: 3,
      name: 'Natalia Souza',
      rm: 'RM 564099',
      role: 'Desenvolvedora',
      linkedin: 'https://www.linkedin.com/in/natalia-cristina-de-souza-333b92169',
      github: 'https://github.com/natcsouza',
      photo: 'https://img.ge/i/27UbG57.jpeg',
    },
  ];

  const turma = '1TDSR';

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <div className="flex justify-center mb-4">
          <Users className="w-16 h-16 text-primary" />
        </div>
        <h1 className="section-title">Equipe de Desenvolvimento</h1>
        <p className="section-subtitle">
          Conheça os desenvolvedores por trás do projeto FLOW
        </p>
      </div>

      {/* Informações da Turma */}
      <div className="card p-6 mb-8 text-center bg-primary/5 border-primary/20">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <GraduationCap className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Turma: {turma}</h2>
        </div>
        <p className="text-muted-foreground">
          Global Solution - Sistema Inteligente de Padronização Operacional
        </p>
      </div>

      {/* Grid de Participantes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {participants.map((participant) => (
          <ParticipantCard key={participant.id} participant={participant} />
        ))}
      </div>

      {/* Informações Adicionais */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
          Sobre o Projeto
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Tecnologias Utilizadas</h3>
              <p className="text-muted-foreground text-sm">
                React, TypeScript, Vite, Tailwind CSS, React Router, Context API
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Desenvolvido com</h3>
              <p className="text-muted-foreground text-sm">
                Dedicação e foco em criar uma solução que realmente faça a diferença
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Participants;
