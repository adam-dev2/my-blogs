import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ source }: { source: string }) {
  return (
    <div className="scrollbar-none font-sans text-[15px] leading-7 text-zinc-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
          em: ({ children }) => <em className="text-zinc-200 italic">{children}</em>,
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d98a2b] underline decoration-[#d98a2b]/60 underline-offset-2"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="mb-4 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
          li: ({ children }) => <li className="leading-7">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="mb-4 border-l-2 border-[#d98a2b]/70 pl-4 italic text-zinc-300">
              {children}
            </blockquote>
          ),
          code: ({ children, className, ...props }) => {
            const isInline = !className || !className.includes("language-");

            if (isInline) {
              return (
                <code
                  className="rounded bg-[#212125] px-1.5 py-0.5 font-mono text-[13px] text-[#d98a2b]"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <pre className="mb-4 scrollbar-none overflow-x-auto rounded-lg border border-[#26262b] bg-[#141417] p-4 font-mono text-[13px] leading-6 text-zinc-300 last:mb-0">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          pre: ({ children }) => <>{children}</>,
          h1: ({ children }) => <h1 className="mt-6 mb-3 font-mono text-2xl text-[#d98a2b] first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="mt-6 mb-3 font-mono text-xl text-[#d98a2b] first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="mt-6 mb-2 font-mono text-lg text-[#d98a2b] first:mt-0">{children}</h3>,
          h4: ({ children }) => <h4 className="mt-5 mb-2 font-mono text-base text-[#d98a2b] first:mt-0">{children}</h4>,
          h5: ({ children }) => <h5 className="mt-5 mb-2 font-mono text-sm text-[#d98a2b] first:mt-0">{children}</h5>,
          h6: ({ children }) => <h6 className="mt-5 mb-2 font-mono text-xs text-[#d98a2b] first:mt-0">{children}</h6>,
          hr: () => <hr className="my-6 border-[#26262b]" />,
          table: ({ children }) => (
            <div className="mb-4 overflow-x-auto">
              <table className="w-full border-collapse border border-[#26262b] text-left text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => <th className="border border-[#26262b] bg-[#1b1b1f] px-3 py-2 font-semibold text-white">{children}</th>,
          td: ({ children }) => <td className="border border-[#26262b] px-3 py-2 text-zinc-300">{children}</td>,
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
