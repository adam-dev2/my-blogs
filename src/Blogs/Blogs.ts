export interface Post {
  id: number;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  content: string;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface Frontmatter {
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

function parseFrontmatter(raw: string): { data: Frontmatter; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error("Missing YAML frontmatter in blog markdown file");
  }

  const data: Partial<Record<keyof Frontmatter, string>> = {};
  for (const line of match[1].split("\n")) {
    const pair = line.match(/^\s*([A-Za-z][A-Za-z0-9]*)\s*:\s*(.*)$/);
    if (!pair) continue;
    let value = pair[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[pair[1] as keyof Frontmatter] = value;
  }

  return {
    data: {
      title: data.title ?? "",
      slug: data.slug ?? slugify(data.title ?? ""),
      createdAt: data.createdAt ?? "",
      updatedAt: data.updatedAt ?? "",
    },
    content: match[2],
  };
}

const modules = import.meta.glob("../content/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const POSTS: Post[] = Object.entries(modules)
  .map(([, raw], index) => {
    const { data, content } = parseFrontmatter(raw);
    return {
      id: index + 1,
      title: data.title,
      slug: data.slug,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      content: content.trim(),
    };
  })
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
