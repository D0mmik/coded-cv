import type { CVData } from './types';

export function buildIntentUrl(cvData: CVData): string {
  const name = `${cvData.personal.firstName} ${cvData.personal.lastName}`.trim();
  const title = cvData.personal.title;

  let text = 'Check out my Coded CV!';
  if (name) text += `\n${name} - ${title}`;
  text += '\n\nBuilt with codedcv.dstrnadel.dev';

  const intentUrl = new URL('https://twitter.com/intent/tweet');
  intentUrl.searchParams.set('text', text);
  return intentUrl.toString();
}
