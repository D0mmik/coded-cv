'use client';

import { useCV } from '@/lib/cv-context';
import { CODE_LANGUAGES, type CodeLanguage } from '@/lib/types';

export function LanguageSelector() {
  const { data, dispatch } = useCV();

  return (
    <div>
      <label className="text-xs font-mono text-muted-foreground mb-2 block">// Code Language</label>
      <div className="flex gap-1.5 flex-wrap">
        {CODE_LANGUAGES.map((lang) => (
          <button
            key={lang.value}
            onClick={() => dispatch({ type: 'SET_CODE_LANGUAGE', payload: lang.value as CodeLanguage })}
            className={`px-3 py-2 rounded font-mono text-xs transition-colors ${
              data.codeLanguage === lang.value
                ? 'bg-code-type text-editor-bg font-semibold'
                : 'bg-code-type/10 text-code-type border border-code-type/20 hover:bg-code-type/20'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
