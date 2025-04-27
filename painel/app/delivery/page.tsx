'use client';

import { useEffect, useState } from "react";
import axios from 'axios';

const Delivery = () => {
  const [data, setData] = useState<{ message: string; store: string; store_type: string; client_name: string; client_email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/painel/delivery`, {
          withCredentials: true  // Permite o envio de cookies com a requisição
        });
        setData(response.data);  // Armazenar os dados da loja e do cliente
      } catch (err: any) {
        setError(err.response?.data?.msg || err.message);  // Captura o erro caso ocorra
      }
    };

    fetchData();  // Chama a função de fetch assim que o componente for montado
  }, []); // O useEffect vai rodar apenas uma vez, quando o componente for montado

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!data) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">Loja: {data.store}</h1>
      <p className="text-lg">Tipo de Estabelecimento: {data.store_type}</p>
      <h2 className="text-xl font-semibold mt-4">Informações do Cliente</h2>
      <p>Nome: {data.client_name}</p>
      <p>Email: {data.client_email}</p>
    </div>
  );
};

export default Delivery;
