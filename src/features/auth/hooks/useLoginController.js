import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authenticateUser } from '@/services/authService.js';

/**
 * Controller Hook responsável pela orquestração do fluxo de login.
 * Mantém a regra de autenticação desacoplada da camada visual (LoginPage).
 */
export function useLoginController() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@somosyby.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { jwt, user, redirectTo } = await authenticateUser(email, password);
      localStorage.setItem('usuario', JSON.stringify({ jwt, user }));

      const welcomeMessage =
        redirectTo === '/ponto-coleta'
          ? 'Acesso concedido! Carregando rotas de hoje.'
          : 'Login realizado com sucesso! Bem-vindo(a) ao YBY.';

      toast.success(welcomeMessage);
      navigate(redirectTo);
    } catch (error) {
      toast.error(error?.message || 'Não foi possível realizar o login.');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    toggleShowPassword: () => setShowPassword((prev) => !prev),
    loading,
    handleSubmit,
  };
}
