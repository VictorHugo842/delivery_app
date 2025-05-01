import Paragraph from "../components/paragraph";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Navbar Vertical */}
      <header className="text-black p-4 fixed top-0 left-0 h-full w-14 bg-white drop-shadow-[4px_0_6px_rgba(0,0,0,0.1)] flex flex-col items-center">
        <div className="mt-4 mb-8">
          {/* Logo */}
          <div className="text-3xl">
            <span className="material-icons-round text-red-500">fastfood</span>
          </div>
        </div>

        <nav className="flex flex-col items-center space-y-6">
          <a href="/admin/delivery" className="flex flex-col items-center text-sm space-y-1 text-gray-600 group">
            <span className="material-icons-round group-hover:text-red-500 group-hover:scale-110 transition-transform duration-300">
              sports_motorsports
            </span>
            <Paragraph text="Delivery" className="font-semibold text-[10px] group-hover:text-red-500" />
          </a>

          <a href="/admin/historico" className="flex flex-col items-center text-sm space-y-1 text-gray-600 group">
            <span className="material-icons-round group-hover:text-red-500 group-hover:scale-110 transition-transform duration-300">
              history
            </span>
            <Paragraph text="Histórico" className="font-semibold text-[10px] group-hover:text-red-500" />
          </a>

          <a href="/admin/ajustes" className="flex flex-col items-center text-sm space-y-1 text-gray-600 group">
            <span className="material-icons-round group-hover:text-red-500 group-hover:scale-110 transition-transform duration-300">
              settings
            </span>
            <Paragraph text="Ajustes" className="font-semibold text-[10px] group-hover:text-red-500" />
          </a>
        </nav>
      </header>

      {/* Conteúdo Principal */}
      <main className="pl-16 pt-4">{children}</main>
    </>
  );
}
