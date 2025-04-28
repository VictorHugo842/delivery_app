// app/layout.tsx ou src/layout.tsx
import { ReactNode } from 'react';
import { Roboto_Mono, Poppins } from 'next/font/google';
import './globals.css';

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap', // Melhora o carregamento da fonte
});

export const metadata = {
  title: 'Minha Aplicação',
  description: 'Aplicação de exemplo com Next.js',
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="pt-BR">
      <body className={`${robotoMono.variable} ${poppins.variable} antialiased`}>
        {/* Navbar Vertical */}
        <header className="bg-blue-600 text-white p-4 fixed top-0 left-0 h-full w-64">
          <nav className="flex flex-col items-start space-y-4">
            <h1 className="text-xl font-bold mb-8">Minha Loja</h1>
            <ul className="flex flex-col space-y-2">
              <li><a href="/" className="hover:text-gray-300">Home</a></li>
              <li><a href="/delivery" className="hover:text-gray-300">Delivery</a></li>
              <li><a href="/about" className="hover:text-gray-300">Sobre</a></li>
            </ul>
          </nav>
        </header>

        {/* Conteúdo Principal com margem à direita da navbar */}
        <main className="p-8 ml-64">{children}</main>

        {/* Rodapé */}
        <footer className="bg-gray-800 text-white text-center p-4">
          <p>&copy; 2025 Minha Loja. Todos os direitos reservados.</p>
        </footer>
      </body>
    </html>
  );
};

export default RootLayout;
