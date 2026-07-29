/**
 * Renders the markdown subset used by posts: `## ` headings, `- ` bullets, and
 * blank-line-separated paragraphs. Deliberately not a markdown parser — see the
 * note on Post.body in src/lib/posts.ts.
 */
export function PostBody({ body }: { body: string }) {
  const blocks = body.trim().split(/\n{2,}/);

  return (
    <div className="mt-10 space-y-6">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="font-heading pt-4 text-xl font-bold text-white md:text-2xl"
            >
              {block.slice(3)}
            </h2>
          );
        }

        if (block.startsWith("- ")) {
          return (
            <ul key={i} className="space-y-2.5">
              {block.split("\n").map((line, j) => (
                <li key={j} className="flex gap-3 leading-relaxed text-white/70">
                  <span aria-hidden className="text-purple-300">
                    ·
                  </span>
                  {line.replace(/^- /, "")}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="leading-relaxed text-white/70">
            {block}
          </p>
        );
      })}
    </div>
  );
}
