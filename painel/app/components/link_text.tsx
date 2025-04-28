import React from 'react';

interface LinkTextProps {
    href: string;
    text: string;
    className?: string;
    onClick?: () => void; // Adiciona a propriedade onClick
}

export default function LinkText({ href, text, className = '', onClick }: LinkTextProps) {
    return (
        <a
            href={href}
            className={`text-xs transition cursor-pointer hover:underline ${className}`}
            onClick={onClick} // Adiciona o evento onClick
        >
            {text}
        </a>
    );
}
