'use client';

import { useEffect, useState, useCallback } from "react";
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

  const fetchData = useCallback(async () => {
    // Já é protegido no layout, aqui reforça a proteção
    try {
      await protectRoute(router);
    } catch (err: any) {
      // O protectRoute já cuida do redirecionamento, então saímos da função aqui
      return;
    }

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/painel/delivery`, {
        withCredentials: true,
      });
      setData(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.msg || err.message;
      setError(errorMessage);
    }
  }, [router]);

  const handleLogout = useCallback(async () => {
    try {
      const csrfToken = getCookie('csrf_access_token');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/painel/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            'X-CSRF-Token': csrfToken || '',
          },
        }
      );
      setData(null);
      router.push("/auth/login");
    } catch (err: any) {
      const errorMessage = 'Erro ao tentar fazer logout';
      const statusCode = err?.response?.status || 500;
      const errorDetails = err?.response?.data?.msg || err.message;
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/log/log_error`, {
        message: errorMessage,
        details: errorDetails,
      }).catch(logErr => {
        console.error('Erro ao enviar log para Flask:', logErr);
      });
      router.push(`/error?message=${encodeURIComponent(errorMessage)}&details=${encodeURIComponent(`{"error": "Erro de logout", "status": ${statusCode}}`)}`);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <Title className="text-red-500" text="Erro ao carregar dados" />
        <Paragraph text={error} className="text-lg" />
      </div>
    );
  }

  const LoadingLine = () => (
    <div className="fixed bottom-0 left-0 w-full h-1 bg-gray-300 animate-pulse"></div>
  );

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <LoadingLine />
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
