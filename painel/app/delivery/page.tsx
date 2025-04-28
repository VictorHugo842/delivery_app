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

      const showCookies = () => {
        // Exibe todos os cookies armazenados
        console.log("Cookies na página:", document.cookie);
      };

      // Chame essa função em algum momento no seu código, por exemplo, após a requisição de logout
      showCookies();

    };

    fetchData();  // Chama a função de fetch assim que o componente for montado
  }, []); // O useEffect vai rodar apenas uma vez, quando o componente for montado

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  const handleLogout = async () => {
    try {
      // Pega o CSRF Token do cookie
      const csrfToken = getCookie('csrf_access_token');

      // Faz a requisição de logout, enviando o CSRF Token no cabeçalho
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/painel/logout`,
        {},
        {
          withCredentials: true,  // Importante enviar os cookies na requisição
          headers: {
            'X-CSRF-Token': csrfToken || '', // Envia o CSRF Token no cabeçalho
          },
        }
      );

      // Após logout, você pode redirecionar ou limpar o estado
      setData(null);
      window.location.href = "/login"; // Redireciona para a página de login (ajuste conforme seu projeto)
    } catch (err: any) {
      setError(err.response?.data?.msg || err.message);
    }
  };


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

      {/* Botão de Logout */}
      <button
        onClick={handleLogout}
        className="mt-8 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Delivery;
