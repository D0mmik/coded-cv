import { Hero } from '@/components/landing/Hero';
import { PreviewShowcase } from '@/components/landing/PreviewShowcase';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-editor-bg relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #30363d 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.3,
        }}
      />

      <nav className="fixed top-0 w-full z-50 border-b border-editor-border/50 bg-editor-bg/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">
          <span className="text-base sm:text-lg text-code-type font-semibold">
            &lt;CodedCV /&gt;
          </span>
          <Link
            href="/create"
            className="text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 rounded-md bg-code-type/10 text-code-type border border-code-type/20 hover:bg-code-type/20 transition-colors"
          >
            Start Building
          </Link>
        </div>
      </nav>

      <main className="relative z-10 pt-16 min-h-screen flex items-center">
        <div className="max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row items-center px-6 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-0 gap-10 sm:gap-12 lg:gap-36">
          <div className="lg:w-[40%] flex items-center">
            <Hero />
          </div>
          <div className="lg:w-[60%] relative overflow-hidden">
            <PreviewShowcase />
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-editor-border py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-3 sm:gap-0 sm:justify-between">
          <span className="text-sm text-code-type font-semibold">&lt;CodedCV /&gt;</span>
          <span className="text-xs text-code-comment text-center">
            // Built for developers who code their way through life
          </span>
          <a
            href="https://x.com/Dstrnadel"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            @Dstrnadel
          </a>
        </div>
      </footer>
    </div>
  );
}
