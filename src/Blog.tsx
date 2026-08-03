import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Menu } from 'lucide-react'
import { POSTS, type Post } from "./Blogs/Blogs.ts";
import { Markdown } from "./Blogs/Markdown.tsx";


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
      aria-current={active ? "true" : undefined}
      className={[
        "w-full cursor-pointer text-left border-b last:border-b-0 border-[#1f1f24] px-4 py-3 transition-colors",
        "hover:bg-[#1b1b1f]",
        active ? "bg-[#1b1b1f] border-l-2 border-l-[#d98a2b] pl-3.5" : "border-l-2 border-l-transparent",
      ].join(" ")}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className={`font-mono truncate ${active ? "text-[#d98a2b]" : "text-white"} text-[15px]`}>
          {post.title}
        </span>
        {!compact && (
          <span className="font-mono text-[11px] text-zinc-500 shrink-0">
            #{String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>
      <div className="mt-1.5 flex items-center justify-between font-mono text-[11px] text-zinc-500">
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

function SiteHeader() {
  return (
    <header className="mx-auto w-full max-w-5xl px-6 pt-10 pb-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="font-mono text-xs text-[#d98a2b]">~/blogs</span>
          <h1 className="mt-1 font-mono text-3xl text-white tracking-tight">
            Adam
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Backend engineer · devlogs on git internals, MCP servers,
            security, search and systems engineering.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://adamhq.site"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit my portfolio at adamhq.site"
            className="group hidden items-center gap-1.5 rounded-md border border-[#26262b] bg-[#141417] px-3 py-1.5 font-mono text-[11px] text-zinc-400 transition-colors hover:border-[#d98a2b] hover:text-white sm:flex"
          >
            portfolio
            <span className="text-[#d98a2b] transition-transform group-hover:translate-x-0.5">&rarr;</span>
          </a>
          <div className="hidden rounded-md border border-[#26262b] bg-[#141417] px-3 py-1.5 font-mono text-[11px] text-zinc-400 sm:block">
            {POSTS.length} archived {POSTS.length === 1 ? "note" : "notes"}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Blog() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(() =>
    readSlugFromHash()
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selected = POSTS.find((p) => p.slug === selectedSlug) || null;

  useEffect(() => {
    const syncFromLocation = () => setSelectedSlug(readSlugFromHash());
    const onHashChange = () => setSelectedSlug(readSlugFromHash());
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", syncFromLocation);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", syncFromLocation);
    };
  }, []);

  useEffect(() => {
    document.title = selected
      ? `Adam | Backend Engineer | ${selected.title}`
      : "Adam | Backend Engineer | Blogs";
  }, [selected]);

  const openPost = (slug: string) => {
    window.history.pushState(null, "", `#/${slug}`);
    setSelectedSlug(slug);
    setSidebarOpen(false);
  };

  const goHome = () => {
    window.history.pushState(null, "", window.location.pathname + window.location.search);
    setSelectedSlug(null);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col text-white font-sans bg-[#0a0a0c] bg-grid-pattern">
      <SiteHeader />

      {!selected ? (
        <div className="mx-auto w-full max-w-2xl px-6 pb-10 flex-1 min-h-0">
          <div className="flex h-[min(42rem,calc(100dvh-13.5rem))] min-h-[26rem] flex-col border border-[#26262b] rounded-xl bg-[#141417] p-6">
            <div className="mb-5 flex items-baseline justify-between">
              <h2 className="font-mono text-lg text-white">Archive</h2>
              <p className="font-mono text-xs text-zinc-500">newest first</p>
            </div>
            <ScrollFade className="flex-1 min-h-0 border border-[#26262b] rounded-lg bg-[#0e0e10]">
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
        </div>
      ) : (
        <div className="mx-auto w-full max-w-5xl px-6 pb-8 flex-1 min-h-0">
          <div className="relative flex h-[min(46rem,calc(100dvh-13.5rem))] min-h-[26rem] overflow-hidden rounded-xl border border-[#26262b] bg-[#141417]">
            {sidebarOpen && (
              <div
                className="absolute inset-0 z-10 bg-black/60 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            <div
              className={`absolute inset-y-0 h-full left-0 z-20 w-75 shrink-0 flex-col border-r border-[#26262b] bg-[#141417] transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:static md:translate-x-0 flex`}
            >
              <button
                onClick={goHome}
                className="w-full text-left font-mono text-xs text-zinc-400 hover:text-white px-4 py-3 border-b border-[#26262b]"
              >
                &larr; back to Home
              </button>
              <div className="min-h-0 flex-1 overflow-y-auto scrollbar-none">
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
              </div>
              <a
                href="https://adamhq.site"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit my portfolio at adamhq.site"
                className="mt-auto flex w-full items-center justify-between border-t border-[#26262b] px-4 py-3 font-mono text-xs text-zinc-400 transition-colors hover:text-white"
              >
                <span>portfolio</span>
                <span className="text-[#d98a2b]">&rarr;</span>
              </a>
            </div>

            <ScrollFade className="min-w-0 flex-1">
              <div className="flex min-h-full flex-col p-5 md:p-8">
                <div className="mb-4 flex items-center justify-between md:hidden">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open posts list"
                    className="flex h-8 w-8 items-center justify-center rounded border border-[#26262b] text-white hover:bg-[#212125]"
                  >
                    <Menu />
                  </button>
                </div>

                <h2 className="mt-3 font-mono text-2xl text-center text-[#d98a2b]">
                  {selected.title}
                </h2>
                <div className="mt-3 flex items-center justify-center gap-4 font-mono text-[11px] text-white">
                  <span>created {formatDate(selected.createdAt)}</span>
                  <span>·</span>
                  <span>updated {formatDate(selected.updatedAt)}</span>
                </div>
                <div className="mt-6 flex-1 border border-[#26262b] rounded-lg bg-[#0e0e10] p-6">
                  <Markdown source={selected.content} />
                </div>
              </div>
            </ScrollFade>
          </div>
        </div>
      )}
    </div>
  );
}
