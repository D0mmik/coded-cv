'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { CVProvider } from '@/lib/cv-context';
import { defaultCVData } from '@/lib/default-data';
import { EditorForm } from '@/components/editor/EditorForm';
import { CVPreview } from '@/components/preview/CVPreview';
import { ActionBar } from '@/components/shared/ActionBar';
import Link from 'next/link';

function ScaledPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;
    const cw = container.clientWidth;
    const iw = inner.scrollWidth;
    const s = Math.min(cw / iw, 1);
    setScale(s);
    setHeight(inner.scrollHeight * s);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    if (innerRef.current) ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <div ref={containerRef} style={{ height, overflow: 'hidden' }}>
      <div
        ref={innerRef}
        className="w-[900px] lg:w-auto"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        <CVPreview />
      </div>
    </div>
  );
}

function CreatePageContent() {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  return (
    <div className="min-h-screen bg-editor-bg lg:flex lg:flex-col">
      <header className="border-b border-editor-border bg-editor-bg/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3">
          <Link href="/" className="font-mono text-xs sm:text-sm text-code-type hover:text-code-type/70 transition-colors">
            &lt;CodedCV /&gt;
          </Link>
          <ActionBar />
        </div>
      </header>

      <div className="lg:hidden flex border-b border-editor-border">
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-2.5 font-mono text-sm text-center transition-colors ${
            activeTab === 'edit'
              ? 'text-code-keyword border-b-2 border-code-keyword bg-editor-surface'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          // Edit
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-2.5 font-mono text-sm text-center transition-colors ${
            activeTab === 'preview'
              ? 'text-code-keyword border-b-2 border-code-keyword bg-editor-surface'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          // Preview
        </button>
      </div>

      <div className="lg:flex-1 lg:flex lg:overflow-hidden">
        <div
          className={`lg:w-[42%] lg:block lg:overflow-y-auto border-r border-editor-border bg-editor-bg ${
            activeTab === 'edit' ? 'block w-full' : 'hidden'
          }`}
        >
          <EditorForm />
        </div>
        <div
          className={`lg:flex-1 lg:block lg:overflow-y-auto bg-[#0a0e14] p-2 sm:p-4 lg:p-6 ${
            activeTab === 'preview' ? 'block w-full' : 'hidden'
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <ScaledPreview />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <CVProvider initialData={defaultCVData}>
      <CreatePageContent />
    </CVProvider>
  );
}
