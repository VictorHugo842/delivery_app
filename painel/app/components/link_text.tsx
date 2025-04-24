import React from 'react';

interface LinkTextProps {
    href: string;
    text: string;
    className?: string;
}

export default function LinkText({ href, text, className = '' }: LinkTextProps) {
    return (
        <a href={href} className={`text-xs text-blue-400 hover:underline ${className}`}>
            {text}
        </a>
    );
}
