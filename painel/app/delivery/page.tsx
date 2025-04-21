"use client";

import { useEffect, useState } from "react";

export default function Delivery() {
  const [data, setData] = useState<{ message: string; store: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPainelDashboard() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/painel/delivery`);
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar os dados: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPainelDashboard();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">{data?.message}</h1>
      <p className="text-lg">Loja: {data?.store}</p>
    </div>
  );
}