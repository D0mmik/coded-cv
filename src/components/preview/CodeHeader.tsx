'use client';

import { useCV } from '@/lib/cv-context';
import { CODE_LANGUAGES } from '@/lib/types';

export function CodeHeader() {
  const { data } = useCV();
  const lang = CODE_LANGUAGES.find((l) => l.value === data.codeLanguage);
  const fileName = lang?.fileName ?? 'cv.txt';

  return (
    <div data-code-header className="flex items-center bg-editor-tab-inactive rounded-t-lg border-b border-editor-border">
      <div className="flex items-center gap-2 px-4 py-2">
        <div className="w-3 h-3 rounded-full bg-editor-dot-red" />
        <div className="w-3 h-3 rounded-full bg-editor-dot-yellow" />
        <div className="w-3 h-3 rounded-full bg-editor-dot-green" />
      </div>
      <div className="flex">
        <div className="px-4 py-2 bg-editor-tab-active text-code-plain text-sm font-mono border-t-2 border-t-code-keyword">
          {fileName}
        </div>
      </div>
    </div>
  );
}
