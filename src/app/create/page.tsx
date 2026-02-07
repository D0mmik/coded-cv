'use client';

import { useState } from 'react';
import { CVProvider } from '@/lib/cv-context';
import { defaultCVData } from '@/lib/default-data';
import { EditorForm } from '@/components/editor/EditorForm';
import { CVPreview } from '@/components/preview/CVPreview';
import { ActionBar } from '@/components/shared/ActionBar';
import Link from 'next/link';

function CreatePageContent() {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  return (
    <div className="min-h-screen bg-editor-bg flex flex-col">
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

      <div className="flex-1 flex overflow-hidden">
        <div
          className={`lg:w-[42%] lg:block overflow-y-auto border-r border-editor-border bg-editor-bg ${
            activeTab === 'edit' ? 'block w-full' : 'hidden'
          }`}
        >
          <EditorForm />
        </div>
        <div
          className={`lg:flex-1 lg:block overflow-y-auto bg-[#0a0e14] p-4 lg:p-6 ${
            activeTab === 'preview' ? 'block w-full' : 'hidden'
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <CVPreview />
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
