'use client';

import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    // Aqui você pode adicionar a lógica de autenticação
    alert("Login bem-sucedido!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-[family-name:var(--font-geist-sans)] px-4">
      <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-neutral-900 border border-black/[.08] dark:border-white/[.145] shadow-xl rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-center tracking-tight">Entrar na conta</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-foreground text-background py-2 rounded-md hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors font-medium text-sm sm:text-base"
          >
            Entrar
          </button>
        </form>

        <div className="text-sm text-center">
          <a href="#" className="text-indigo-600 hover:underline">
            Esqueceu sua senha?
          </a>
        </div>

        <div className="text-sm text-center">
          Não tem uma conta?{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            Cadastre-se
          </a>
        </div>
      </div>
    </div>
  );
}
