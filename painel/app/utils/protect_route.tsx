import axios from 'axios';
import { getCookie } from './cookies'; 

export const protectRoute = async (router: any) => {
    try {
        // Pega o CSRF Token do cookie
        const csrfToken = getCookie('csrf_access_token');

        // Faz a requisição POST para a proteção da rota, enviando o CSRF Token no cabeçalho
        await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/painel/protect_route`,
            {}, // Corpo vazio porque você está apenas validando a permissão
            {
                withCredentials: true, // Garante que os cookies sejam enviados
                headers: {
                    'X-CSRF-Token': csrfToken || '', // Envia o CSRF Token no cabeçalho
                },
            }
        );
    } catch (err: any) {
        const errorMessage = err.response?.data?.msg || err.message;

        // Redireciona para a página de erro, passando a mensagem e o erro detalhado
        router.push(`/error?message=${encodeURIComponent('Você não tem permissão para acessar esta página.')}&details=${encodeURIComponent(errorMessage)}`);

        // Lança o erro para impedir a execução de qualquer código após a falha
        throw new Error(errorMessage);
    }
};
