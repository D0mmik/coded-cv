import type { CVData } from './types';

export function buildIntentUrl(cvData: CVData): string {
  const name = `${cvData.personal.firstName} ${cvData.personal.lastName}`.trim();
  const title = cvData.personal.title;

  const parts = ['Check out my Coded CV!'];
  if (name) parts.push(`${name} - ${title}`);
  parts.push('\nBuilt with codedcv.com');

  const intentUrl = new URL('https://twitter.com/intent/tweet');
  intentUrl.searchParams.set('text', parts.join(' '));
  intentUrl.searchParams.set('hashtags', 'CodedCV,Developer,Resume');
  return intentUrl.toString();
}
