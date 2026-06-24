import { Container } from "@/components/container";
import type { PageContent } from "@/lib/site-content";

type SitePageProps = {
  content: PageContent;
};

export function SitePage({ content }: SitePageProps) {
  return (
    <main className="min-h-screen">
      <Container className="py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-white/45">
            {content.label}
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            {content.subtitle}
          </p>
        </div>
      </Container>
    </main>
  );
}
