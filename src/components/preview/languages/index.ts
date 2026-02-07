import type { LanguageRenderer } from './types';
import type { CodeLanguage } from '@/lib/types';
import csharp from './csharp';
import python from './python';
import typescript from './typescript';
import go from './go';
import rust from './rust';
import java from './java';

export const renderers: Record<CodeLanguage, LanguageRenderer> = {
  csharp,
  python,
  typescript,
  go,
  rust,
  java,
};

export type { LanguageRenderer };
