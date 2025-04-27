'use client';

import axios from "axios";
import { useEffect, useState } from "react";

const Delivery = () => {
  const [data, setData] = useState<{ message: string; store: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Faz a requisição SEM autenticação
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/painel/delivery`);
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.msg || err.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!data) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">{data.message}</h1>
      <p className="text-lg">Loja: {data.store}</p>
    </div>
  );
};

export default Delivery;
