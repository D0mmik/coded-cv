'use client';

import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { PersonalInfoSection } from './PersonalInfoSection';
import { SkillsSection, LanguagesSection, PersonalitySection, MediaSection } from './SkillsSection';
import { EducationSection } from './EducationSection';
import { ExperienceSection } from './ExperienceSection';
import { LanguageSelector } from './LanguageSelector';
import { useCV } from '@/lib/cv-context';
import { personas } from '@/lib/personas';

export function EditorForm() {
  const { data, dispatch } = useCV();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleShuffle() {
    const currentIndex = personas.findIndex(
      (p) => p.personal.firstName === data.personal.firstName && p.personal.lastName === data.personal.lastName
    );
    let nextIndex: number;
    do {
      nextIndex = Math.floor(Math.random() * personas.length);
    } while (nextIndex === currentIndex && personas.length > 1);
    dispatch({ type: 'LOAD_DATA', payload: personas[nextIndex] });
    setShowConfirm(false);
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
        <div className="flex-1">
          <LanguageSelector />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowConfirm(true)}
            className="px-3 py-2 rounded font-mono text-xs bg-code-type/10 text-code-type border border-code-type/20 hover:bg-code-type/20 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Shuffle
          </button>
          {showConfirm && (
            <div className="absolute right-0 top-full mt-2 z-50 w-64 p-3 rounded-lg border border-editor-border bg-editor-surface shadow-xl">
              <p className="text-xs text-muted-foreground mb-3 font-mono">
                // This will replace all your current data with a random persona.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleShuffle}
                  className="flex-1 px-3 py-1.5 rounded text-xs font-mono font-semibold bg-code-type text-editor-bg hover:bg-code-type/80 transition-colors"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-3 py-1.5 rounded text-xs font-mono text-muted-foreground border border-editor-border hover:bg-editor-bg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Separator className="bg-editor-border" />
      <PersonalInfoSection />
      <Separator className="bg-editor-border" />
      <SkillsSection />
      <Separator className="bg-editor-border" />
      <LanguagesSection />
      <Separator className="bg-editor-border" />
      <MediaSection />
      <Separator className="bg-editor-border" />
      <PersonalitySection />
      <Separator className="bg-editor-border" />
      <EducationSection />
      <Separator className="bg-editor-border" />
      <ExperienceSection />
    </div>
  );
}
