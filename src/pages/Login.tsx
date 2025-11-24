const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">F</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">FLOW</h1>
          <p className="text-muted-foreground">Sistema Inteligente de Padronização Operacional</p>
        </div>
        
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Entrar</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                className="input"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                className="input"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn btn-primary w-full btn-large">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

