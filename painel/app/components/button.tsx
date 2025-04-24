// components/Button.tsx
interface ButtonProps {
    type: 'submit' | 'button' | 'reset';
    text: string;
    className?: string;
    onClick?: () => void; // Adicionando a propriedade onClick como opcional
}

export default function Button({ type, text, className = '', onClick }: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick} // Passando a propriedade onClick
            className={`w-full text-sm font-medium text-slate-500 border border-slate-300 pl-4 pr-4 py-3 rounded-lg transition-colors duration-200 cursor-pointer focus:outline-none bg-blue-200 hover:bg-blue-300 ${className}`}
        >
            {text}
        </button>
    );
}
