'use client';

import { useEffect, useState } from "react";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { protectRoute } from '../../utils/protect_route';
import { getCookie } from '../../utils/cookies';
import Paragraph from "../../components/paragraph";
import Title from "../../components/title";

const Delivery = () => {
  const [data, setData] = useState<{ message: string; store: string; store_type: string; client_name: string; client_email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {

      // JÁ É PROTEGIDO NO PRÓPRIO LAYOUT, AQUI GARANTE NOVAMENTE.
      try {
        await protectRoute(router);
      } catch (err: any) {
        // O próprio protectRoute já faz o push para /error, então só retorna
        return;
      }

      try {
        // Faz a requisição para obter os dados do painel de delivery
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/painel/delivery`, {
          withCredentials: true,
        });

        setData(response.data);
      } catch (err: any) {
        const errorMessage = err.response?.data?.msg || err.message;
        setError(errorMessage);
      }
    };

    fetchData();
  }, []);


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
      router.push("/auth/login"); // Redireciona para a página de login

    } catch (err: any) {
      const errorMessage = 'Ocorreu um erro ao tentar fazer logout.';
      const statusCode = err?.response?.status || 500; // Pega o status ou assume 500
      const errorDetails = err?.response?.data?.msg || err.message;

      // Envia o log de erro
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/log/log_error`, {
          message: 'Erro ao tentar fazer logout',
          details: errorDetails,
        })
        .catch((logErr) => {
          console.error('Erro ao enviar log para Flask:', logErr);
        });

      // Redireciona para a página de erro com detalhes do erro
      router.push(
        `/error?message=${encodeURIComponent(errorMessage)}&details=${encodeURIComponent(`{"error": "Erro de logout", "status": ${statusCode}}`)}`
      );
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <Title className="text-red-500" text="Erro ao carregar dados" />
        <Paragraph
          text={error}
          className="text-lg"
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <Title text="Carregando..." />
      </div>
    );

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
