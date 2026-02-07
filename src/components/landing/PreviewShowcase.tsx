'use client';

import { defaultCVData } from '@/lib/default-data';
import { CVProvider } from '@/lib/cv-context';
import { CVPreview } from '@/components/preview/CVPreview';

const landingData = {
  ...defaultCVData,
  codeLanguage: 'csharp' as const,
  photo: 'https://randomuser.me/api/portraits/men/32.jpg',
};

export function PreviewShowcase() {
  return (
    <CVProvider initialData={landingData}>
      <div className="relative [perspective:1200px] pt-6 lg:pt-12">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-code-type/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative [transform:rotateY(-2deg)] origin-top animate-fade-in-up delay-200 [zoom:0.55] sm:[zoom:0.7] md:[zoom:0.8] lg:[zoom:0.9] xl:[zoom:1] lg:max-h-[80vh] aspect-[210/297] overflow-hidden rounded-lg">
          <CVPreview fullHeight compact />
        </div>
      </div>
    </CVProvider>
  );
}
