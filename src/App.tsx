import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import Home from './pages/Home';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Participants from './pages/Participants';
import ProcessList from './pages/ProcessList';
import ProcessView from './pages/ProcessView';
import ProcessExecution from './pages/ProcessExecution';
import ProcessForm from './pages/ProcessForm';
import Training from './pages/Training';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import Layout from './components/Layout';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="sobre" element={<About />} />
          <Route path="about" element={<About />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contato" element={<Contact />} />
          <Route path="participantes" element={<Participants />} />
          <Route path="processos" element={<ProcessList />} />
          <Route path="processos/novo" element={<ProcessForm />} />
          <Route path="processos/:id" element={<ProcessView />} />
          <Route path="processos/:id/editar" element={<ProcessForm />} />
          <Route path="processos/:id/executar" element={<ProcessExecution />} />
          <Route path="processos/:id/executar/etapa/:stepId" element={<ProcessExecution />} />
          <Route path="treinamento" element={<Training />} />
          <Route path="treinamento/:processId" element={<Training />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
