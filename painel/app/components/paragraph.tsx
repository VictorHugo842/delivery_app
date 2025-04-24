interface ParagraphProps {
    text: string;
    className?: string;
}

export default function Paragraph({ text, className = '' }: ParagraphProps) {
    return <p className={`text-slate-800 text-sm ${className}`}>{text}</p>;

}
