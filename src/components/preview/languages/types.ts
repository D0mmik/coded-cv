import type { ReactNode } from 'react';
import type { CVData } from '@/lib/types';

export interface LanguageRenderer {
  renderSummary: (data: CVData) => ReactNode;
  renderInfo: (data: CVData) => ReactNode;
  renderSidebar: (data: CVData) => ReactNode;
  renderEducation: (data: CVData) => ReactNode;
  renderExperience: (data: CVData) => ReactNode;
}
