import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { AuthSplitLayout } from '../components/AuthSplitLayout.jsx';
import { InputField } from '@/shared/ui/InputField.jsx';
import { Button } from '@/shared/ui/Button.jsx';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@somosyby.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Simula login de sucesso guardando perfil no localStorage
      localStorage.setItem(
        'usuario',
        JSON.stringify({
          jwt: 'mock-jwt-token',
          user: {
            id: 1,
            username: 'admin',
            email,
            isAdmin: true,
          },
        })
      );
      setLoading(false);
      toast.success('Login realizado com sucesso! Bem-vindo(a) ao YBY.');
      navigate('/dashboard');
    }, 600);
  };

  return (
    <AuthSplitLayout
      badge={null}
      headline="Rastreabilidade e Mensuração de Impacto"
      description={null}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-yby-heading tracking-tight">
          Bem-vindo de volta
        </h1>
        <p className="text-xs md:text-sm text-yby-muted mt-1">
          Entre com seu e-mail e senha para acessar a plataforma.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="E-mail"
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com.br"
        />

        <div className="space-y-1">
          <InputField
            label="Senha"
            required
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-yby-muted hover:text-yby-heading p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-yby-primary hover:underline inline-block mt-1"
            >
              Esqueci minha senha
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          className="mt-2"
        >
          <span>Entrar</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-yby-border/60 text-center">
        <Link
          to="/signIn-client"
          className="text-xs font-semibold text-yby-muted hover:text-yby-primary transition-colors"
        >
          Acessar como cooperativa (Código de acesso)
        </Link>
      </div>
    </AuthSplitLayout>
  );
}
