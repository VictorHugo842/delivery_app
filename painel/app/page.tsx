'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Importa o hook de navegação do Next.js

function Home() {
  const router = useRouter();  // Hook para navegação

  useEffect(() => {
    // Redireciona automaticamente para a página 'delivery' após o componente ser montado
    router.push('/delivery');
  }, [router]);

  return (
    <div>
      <h1>Redirecionando...</h1>  {/* Mensagem opcional enquanto o redirecionamento ocorre */}
    </div>
  );
}

export default Home;
