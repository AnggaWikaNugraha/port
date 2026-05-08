import ReactMarkdown from 'react-markdown';

type ProjectMarkdownProps = {
    content: string;
    className?: string;
};

export function normalizeProjectMarkdown(content: string) {
    return content.replace(/\r\n/g, '\n').trim();
}

export default function ProjectMarkdown({ content, className = '' }: ProjectMarkdownProps) {
    return (
        <div
            className={[
                'text-gray-400',
                '[&_h1]:mb-3 [&_h1]:text-base [&_h1]:font-semibold [&_h1]:text-gray-200',
                '[&_h2]:mb-3 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-gray-200',
                '[&_h3]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-gray-200',
                '[&_p]:mb-3 [&_p]:whitespace-pre-wrap [&_p]:leading-relaxed [&_p:last-child]:mb-0',
                '[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul:last-child]:mb-0',
                '[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_ol:last-child]:mb-0',
                '[&_li]:whitespace-pre-wrap [&_li]:leading-relaxed',
                '[&_strong]:font-semibold [&_strong]:text-gray-200',
                '[&_a]:text-gray-200 [&_a]:underline [&_a]:underline-offset-4',
                className,
            ].join(' ')}
        >
            <ReactMarkdown>{normalizeProjectMarkdown(content)}</ReactMarkdown>
        </div>
    );
}
