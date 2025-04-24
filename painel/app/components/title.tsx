// components/Title.tsx
interface TitleProps {
    text: string;
    className?: string;
}

export default function Title({ text, className = '' }: TitleProps) {
    return <h3 className={`text-black text-3xl font-semibold mb-0.5 ${className}`}>{text}</h3>;
}
