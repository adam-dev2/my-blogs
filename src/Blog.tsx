import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { POSTS, type Post } from "./Blogs/Blogs.ts";


interface RowInterface {
  key: number
  post: Post
  index: number
  active: boolean
  compact?: boolean
  onClick: () => void
}


function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ScrollFade({
  children,
  className,
  maxHeightClass,
}: {
  children: ReactNode;
  className?: string;
  maxHeightClass?: string;
}) {
  const [atBottom, setAtBottom] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  const checkScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 8);
    setAtTop(el.scrollTop < 8);
  }, []);

  useEffect(() => {
    checkScroll();
  }, [checkScroll]);

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <div
        ref={ref}
        onScroll={checkScroll}
        className={`overflow-y-auto scrollbar-none ${maxHeightClass ?? "h-full"}`}
      >
        {children}
      </div>
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#141417] to-transparent transition-opacity ${atBottom ? "opacity-0" : "opacity-100"
          }`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#141417] to-transparent transition-opacity ${atTop ? "opacity-0" : "opacity-100"
          }`}
      />
    </div>
  );
}

function EntryRow({ post, index, active, onClick, compact }: RowInterface) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left border-b last:border-b-0 border-[#26262b] px-4 py-3 transition-colors",
        "hover:bg-[#212125]",
        active ? "bg-[#212125] border-l-2 border-l-[#d98a2b] pl-3.5" : "border-l-2 border-l-transparent",
      ].join(" ")}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[15px] text-white truncate">
          {post.title}
        </span>
        {!compact && (
          <span className="font-mono text-[11px] text-white shrink-0">
            #{String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>
      <div className="mt-1 flex items-center justify-between font-mono text-[11px] text-white">
        <span>created {formatDate(post.createdAt)}</span>
        <span>updated {formatDate(post.updatedAt)}</span>
      </div>
    </button>
  );
}

function readSlugFromHash(): string | null {
  const slug = window.location.hash.replace(/^#\/?/, "");
  return slug || null;
}

export default function Blog() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(() =>
    readSlugFromHash()
  );

  const selected = POSTS.find((p) => p.slug === selectedSlug) || null;

  useEffect(() => {
    const onHashChange = () => setSelectedSlug(readSlugFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    document.title = selected
      ? `Adam | Backend Engineer | ${selected.title}`
      : "Adam | Backend Engineer | Blogs";
  }, [selected]);

  const openPost = (slug: string) => {
    window.location.hash = `/${slug}`;
  };

  const goHome = () => {
    window.history.pushState(null, "", window.location.pathname + window.location.search);
    setSelectedSlug(null);
  };

  return (
    <div className="min-h-screen text-white font-sans px-6 pt-24  bg-[#0a0a0c] bg-grid-pattern">
      {!selected ? (
        <div className="w-full max-w-2xl mx-auto border border-[#26262b] rounded-xl bg-[#141417] p-6">
          <div className="mb-5">
            <h1 className="font-mono text-2xl text-[#d98a2b]">My-Blogs</h1>
            <p className="mt-1 font-mono text-xs text-zinc-500">
              {POSTS.length} entries · newest first
            </p>
          </div>
          <ScrollFade
            maxHeightClass="max-h-105"
            className="border border-[#26262b] rounded-lg bg-[#0e0e10]"
          >
            {POSTS.map((post, i) => (
              <EntryRow
                key={post.id}
                post={post}
                index={i}
                active={false}
                onClick={() => openPost(post.slug)}
              />
            ))}
          </ScrollFade>
        </div>
      ) : (
        <div className="w-full max-w-5xl h-220 mx-auto border border-[#26262b] rounded-xl bg-[#141417] flex overflow-hidden">
          <ScrollFade className="w-75 shrink-0 border-r border-[#26262b]">
            <button
              onClick={goHome}
              className="w-full text-left font-mono text-xs text-zinc-400 hover:text-white px-4 py-3 border-b border-[#26262b]"
            >
              &larr; back to Home
            </button>
            {POSTS.map((post, i) => (
              <EntryRow
                key={post.id}
                post={post}
                index={i}
                compact
                active={post.id === selected.id}
                onClick={() => openPost(post.slug)}
              />
            ))}
          </ScrollFade>

          <ScrollFade className="flex-1">
            <div className="flex min-h-full flex-col p-8">
              <span className="font-mono text-xs tracking-wide text-white uppercase">
                Content
              </span>
              <h2 className="mt-3 font-mono text-2xl text-center text-[#d98a2b]">
                {selected.title}
              </h2>
              <div className="mt-3 flex items-center justify-center gap-4 font-mono text-[11px] text-white">
                <span>created {formatDate(selected.createdAt)}</span>
                <span>·</span>
                <span>updated {formatDate(selected.updatedAt)}</span>
              </div>
              <div className="mt-6 flex-1 border border-[#26262b] rounded-lg bg-[#0e0e10] p-6">
                <p className="font-sans text-[15px] leading-7 text-zinc-300">
                  {selected.content}
                </p>
              </div>
            </div>
          </ScrollFade>
        </div>
      )}
    </div>
  );
}
