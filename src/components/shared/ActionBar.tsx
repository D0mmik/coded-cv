'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { useCV } from '@/lib/cv-context';
import { buildIntentUrl } from '@/lib/share';

export function ActionBar() {
  const { data } = useCV();
  const [exporting, setExporting] = useState(false);
  const [downloadingImage, setDownloadingImage] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareModal, setShareModal] = useState<{ url: string; blob: Blob } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return () => {
      if (shareModal) URL.revokeObjectURL(shareModal.url);
    };
  }, [shareModal]);

  async function handleDownloadPDF() {
    setExporting(true);
    try {
      const { exportToPDF } = await import('@/lib/pdf-export');
      const name = `${data.personal.firstName}_${data.personal.lastName}`.replace(/\s+/g, '_') || 'coded-cv';
      await exportToPDF(data, `${name}_CV.pdf`);
    } finally {
      setExporting(false);
    }
  }

  async function handleDownloadImage() {
    setDownloadingImage(true);
    try {
      const { cvToImage } = await import('@/lib/pdf-export');
      const blob = await cvToImage(data);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const name = `${data.personal.firstName}_${data.personal.lastName}`.replace(/\s+/g, '_') || 'coded-cv';
      a.href = url;
      a.download = `${name}_CV.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingImage(false);
    }
  }

  async function handleShareTwitter() {
    setSharing(true);
    try {
      const { cvToImage } = await import('@/lib/pdf-export');
      const blob = await cvToImage(data);
      const url = URL.createObjectURL(blob);
      setShareModal({ url, blob });
    } catch (e) {
      console.error('Share failed:', e);
      window.open(buildIntentUrl(data), '_blank');
    } finally {
      setSharing(false);
    }
  }

  const handleCopy = useCallback(async () => {
    if (!shareModal) return;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': shareModal.blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const a = document.createElement('a');
      a.href = shareModal.url;
      a.download = 'coded-cv.png';
      a.click();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareModal]);

  function handleOpenX() {
    window.open(buildIntentUrl(data), '_blank');
  }

  function closeModal() {
    if (shareModal) URL.revokeObjectURL(shareModal.url);
    setShareModal(null);
    setCopied(false);
  }

  return (
    <>
      <div className="flex items-center gap-1.5 sm:gap-3">
        <Button
          onClick={handleDownloadPDF}
          disabled={exporting}
          className="bg-code-type hover:bg-code-type/80 text-editor-bg font-semibold font-mono text-xs sm:text-sm px-2.5 sm:px-4"
        >
          {exporting ? (
            <>
              <svg className="animate-spin -ml-1 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="hidden sm:inline">Exporting...</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Download</span> PDF
              <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </>
          )}
        </Button>
        <Button
          onClick={handleDownloadImage}
          disabled={downloadingImage}
          variant="outline"
          className="font-mono text-xs sm:text-sm border-editor-border hover:bg-editor-surface px-2.5 sm:px-4"
        >
          {downloadingImage ? (
            <>
              <svg className="animate-spin -ml-1 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="hidden sm:inline">Exporting...</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Download</span> Image
              <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </>
          )}
        </Button>
        <Button
          onClick={handleShareTwitter}
          disabled={sharing}
          variant="outline"
          className="font-mono text-xs sm:text-sm border-editor-border hover:bg-editor-surface px-2.5 sm:px-4"
        >
          {sharing ? (
            <>
              <svg className="animate-spin -ml-1 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="hidden sm:inline">Generating...</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Share on</span>
              <svg className="w-4 h-4 sm:ml-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </>
          )}
        </Button>
      </div>

      {shareModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md" onClick={closeModal}>
          <div
            className="bg-editor-bg border border-editor-border rounded-lg shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-editor-border">
              <span className="font-mono text-sm text-muted-foreground">// share your coded cv</span>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none">&times;</button>
            </div>

            <div className="p-4">
              <img
                src={shareModal.url}
                alt="CV Preview"
                className="w-full rounded border border-editor-border"
              />
            </div>

            <div className="flex gap-3 px-5 pb-5">
              <Button
                onClick={handleCopy}
                variant="outline"
                className="flex-1 font-mono text-sm border-editor-border hover:bg-editor-surface"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy image
                  </>
                )}
              </Button>
              <Button
                onClick={handleOpenX}
                className="flex-1 font-mono text-sm bg-code-type hover:bg-code-type/80 text-editor-bg font-semibold"
              >
                Open
                <svg className="w-4 h-4 ml-1.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                composer
              </Button>
            </div>

            <p className="text-xs text-code-comment font-mono px-5 pb-4">
              // copy the image, then paste it into your tweet
            </p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
