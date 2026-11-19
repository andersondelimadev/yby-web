import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AuthSplitLayout } from '../components/AuthSplitLayout.jsx';
import { InputField } from '@/shared/ui/InputField.jsx';
import { Button } from '@/shared/ui/Button.jsx';
import { useLoginController } from '../hooks/useLoginController.js';

export function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    loading,
    handleSubmit,
  } = useLoginController();

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
          type="text"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com.br"
        />

        <div className="space-y-1">
          <InputField
            label="Senha"
            required
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            rightElement={
              <button
                type="button"
                onClick={toggleShowPassword}
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
    </AuthSplitLayout>
  );
}
