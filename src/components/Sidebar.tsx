import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  List, 
  GraduationCap, 
  BarChart3, 
  MessageSquare,
  Info,
  HelpCircle,
  Mail,
  Users
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/sobre', icon: Info, label: 'Sobre' },
    { path: '/faq', icon: HelpCircle, label: 'FAQ' },
    { path: '/contato', icon: Mail, label: 'Contato' },
    { path: '/participantes', icon: Users, label: 'Participantes' },
    { path: '/processos', icon: List, label: 'Processos' },
    { path: '/treinamento', icon: GraduationCap, label: 'Treinamento' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/chatbot', icon: MessageSquare, label: 'Chatbot' },
  ];

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-border bg-card">
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'text-muted-foreground hover:bg-accent hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

