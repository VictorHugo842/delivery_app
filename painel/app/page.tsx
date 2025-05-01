'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Importa o hook de navegação do Next.js
import Title from './components/title';  // Importa o componente de título

function Home() {
  const router = useRouter();  // Hook para navegação

  useEffect(() => {
    // Redireciona automaticamente para a página 'delivery' após o componente ser montado
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <Title text="Redirecionando..." />
    </div>
  );
}

export default Home;
