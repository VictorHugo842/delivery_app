'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface AuthContextType {
    isAuthenticated: boolean;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    const checkAuth = async () => {
        try {
            // Obtém os cookies manualmente
            const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
                const [key, value] = cookie.split("=");
                acc[key] = value;
                return acc;
            }, {} as Record<string, string>);

            const token = cookies["access_token"];
            const csrfToken = cookies["csrf_access_token"];

            // Verifica se o token de autenticação não está presente
            if (!token) {
                setIsAuthenticated(false);
                router.push("/login");
                return;
            }

            // Configura o axios para incluir o CSRF em todas as requisições
            axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken || ""; // Adiciona o CSRF ao cabeçalho
            axios.defaults.withCredentials = true; // Garante que os cookies sejam enviados

            // Se tudo estiver correto, define o estado como autenticado
            setIsAuthenticated(true);
        } catch (err) {
            setIsAuthenticated(false);
            router.push("/login");
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
};