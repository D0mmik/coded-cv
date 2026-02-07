'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const TYPING_PHRASES = [
  'class Developer',
  'def create_cv()',
  'fn build_resume()',
  'func NewResume()',
  'interface Career',
  'struct Life',
];

export function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = TYPING_PHRASES[phraseIndex];
    const timeout = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === phrase.length) {
      setTimeout(() => setIsDeleting(true), 2000);
      return;
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % TYPING_PHRASES.length);
      return;
    }

    const timer = setTimeout(() => {
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, timeout);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, phraseIndex]);

  const currentText = TYPING_PHRASES[phraseIndex].slice(0, charIndex);

  return (
    <div className="flex flex-col justify-center">
      <p className="animate-fade-in-up text-sm text-code-comment tracking-wide mb-6 sm:mb-8">
        // cv builder for developers
      </p>

      <h1 className="animate-fade-in-up delay-100 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-5 sm:mb-6">
        <span className="text-foreground">Your Resume,</span>
        <br />
        <span className="text-code-type">Written in Code</span>
      </h1>

      <div className="animate-fade-in-up delay-200 inline-flex items-center px-4 sm:px-5 py-2.5 sm:py-3 rounded-md bg-code-bg border border-editor-border text-sm sm:text-base mb-5 sm:mb-6 w-fit">
        <span className="text-code-comment mr-2 select-none">{'>'}</span>
        <span className="text-code-string">{currentText}</span>
        <span className="w-[2px] h-5 bg-code-keyword ml-0.5 animate-cursor-blink" />
      </div>

      <p className="animate-fade-in-up delay-300 text-muted-foreground text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-md">
        Choose from 6 programming languages. Fill in your details. Export a PDF styled as source code.
      </p>

      <div className="animate-fade-in-up delay-400 mb-6 sm:mb-8">
        <Link
          href="/create"
          className="inline-flex px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg bg-code-type text-editor-bg font-semibold text-sm sm:text-base hover:bg-code-type/90 transition-colors"
        >
          Create yours now
        </Link>
      </div>

      <div className="animate-fade-in-up delay-500 flex flex-wrap items-center gap-2 sm:gap-3">
        <span className="text-xs px-3 py-1 rounded-full border border-editor-border text-muted-foreground">
          6 Languages
        </span>
        <span className="text-xs px-3 py-1 rounded-full border border-editor-border text-muted-foreground">
          PDF Export
        </span>
        <span className="text-xs px-3 py-1 rounded-full border border-editor-border text-muted-foreground inline-flex items-center gap-1.5">
          Share on
          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </span>
        <span className="text-xs px-3 py-1 rounded-full border border-editor-border text-muted-foreground">
          Free
        </span>
      </div>
    </div>
  );
}
