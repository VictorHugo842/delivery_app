'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      console.log('Login bem-sucedido:', data);
      // redirecionar ou armazenar token, etc.
    } catch (err: any) {
      console.error('Erro:', err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4 text-center">Login</h1>

        <div className="mb-4">
          <label className="block text-sm mb-1" htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1" htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
