'use client';

import { useCV } from '@/lib/cv-context';
import { CodeHeader } from './CodeHeader';
import { renderers } from './languages';
import { XmlTag } from './tokens';

export function CVPreview({ fullHeight = false, compact = false }: { fullHeight?: boolean; compact?: boolean }) {
  const { data } = useCV();
  const renderer = renderers[data.codeLanguage];

  return (
    <div id="cv-preview" className="rounded-lg overflow-hidden border border-editor-border shadow-2xl">
      <CodeHeader />
      <div data-lang={data.codeLanguage} className={`bg-code-bg font-mono ${compact ? 'text-[7pt] p-[20pt]' : 'text-[9pt] p-[30pt]'} ${fullHeight ? '' : 'lg:aspect-[210/297] lg:overflow-y-auto'}`}>
        <div className="flex gap-3">
          <div className="w-[33%] shrink-0">
            <div className="mb-2">
              <div><XmlTag>&lt;img&gt;</XmlTag></div>
              {data.photo ? (
                <img
                  src={data.photo}
                  alt="Profile"
                  className="w-24 h-28 sm:w-28 sm:h-32 rounded object-cover border border-editor-border my-1"
                />
              ) : (
                <div className="w-24 h-28 sm:w-28 sm:h-32 rounded border border-dashed border-editor-border my-1 flex items-center justify-center bg-code-bg-lighter">
                  <span className="text-code-comment text-[10px] text-center leading-tight px-1">{'// add photo'}</span>
                </div>
              )}
              <div><XmlTag>&lt;/img&gt;</XmlTag></div>
            </div>
            {renderer.renderSidebar(data)}
          </div>
          <div className="flex-1 min-w-0">
            {data.summary && renderer.renderSummary(data)}
            {renderer.renderInfo(data)}
            {renderer.renderEducation(data)}
            {renderer.renderExperience(data)}
          </div>
        </div>
      </div>
    </div>
  );
}
