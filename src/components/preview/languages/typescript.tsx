'use client';

import { CodeLine, BlankLine } from '@/components/preview/CodeLine';
import { Keyword, TypeName, StringLiteral, NumberLiteral, Comment, Variable, Method, Bracket, Punctuation, Plain } from '@/components/preview/tokens';
import type { CVData } from '@/lib/types';
import type { LanguageRenderer } from './types';

function toCamelCase(str: string): string {
  const words = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  return words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

const renderer: LanguageRenderer = {
  renderSummary: (data) => {
    if (!data.summary) return null;
    const lines = data.summary.match(/.{1,60}(\s|$)/g) || [data.summary];
    return (
      <>
        <CodeLine><Comment>{'/**'}</Comment></CodeLine>
        {lines.map((line, i) => (
          <CodeLine key={i}><Comment>{' * '}{line.trim()}</Comment></CodeLine>
        ))}
        <CodeLine><Comment>{' */'}</Comment></CodeLine>
      </>
    );
  },

  renderInfo: (data) => {
    const { personal } = data;
    const fullName = `${personal.firstName} ${personal.lastName}`.trim();
    return (
      <>
        <CodeLine><Keyword>interface</Keyword> <TypeName>PersonalInfo</TypeName> <Bracket>{'{'}</Bracket></CodeLine>
        <CodeLine indent={1}><Variable>name</Variable><Punctuation>:</Punctuation> <TypeName>string</TypeName><Punctuation>;</Punctuation></CodeLine>
        <CodeLine indent={1}><Variable>title</Variable><Punctuation>:</Punctuation> <TypeName>string</TypeName><Punctuation>;</Punctuation></CodeLine>
        <CodeLine indent={1}><Variable>email</Variable><Punctuation>:</Punctuation> <TypeName>string</TypeName><Punctuation>;</Punctuation></CodeLine>
        <CodeLine indent={1}><Variable>phone</Variable><Punctuation>:</Punctuation> <TypeName>string</TypeName><Punctuation>;</Punctuation></CodeLine>
        <CodeLine indent={1}><Variable>location</Variable><Punctuation>:</Punctuation> <TypeName>string</TypeName><Punctuation>;</Punctuation></CodeLine>
        {personal.age !== null && <CodeLine indent={1}><Variable>age</Variable><Punctuation>:</Punctuation> <TypeName>number</TypeName><Punctuation>;</Punctuation></CodeLine>}
        <CodeLine><Bracket>{'}'}</Bracket></CodeLine>
        <BlankLine />
        <CodeLine><Keyword>const</Keyword> <Variable>info</Variable><Punctuation>:</Punctuation> <TypeName>PersonalInfo</TypeName> <Punctuation>=</Punctuation> <Bracket>{'{'}</Bracket></CodeLine>
        {fullName && <CodeLine indent={1}><Variable>name</Variable><Punctuation>:</Punctuation> <StringLiteral value={fullName} /><Punctuation>,</Punctuation></CodeLine>}
        {personal.title && <CodeLine indent={1}><Variable>title</Variable><Punctuation>:</Punctuation> <StringLiteral value={personal.title} /><Punctuation>,</Punctuation></CodeLine>}
        {personal.email && <CodeLine indent={1}><Variable>email</Variable><Punctuation>:</Punctuation> <StringLiteral value={personal.email} /><Punctuation>,</Punctuation></CodeLine>}
        {personal.phone && <CodeLine indent={1}><Variable>phone</Variable><Punctuation>:</Punctuation> <StringLiteral value={personal.phone} /><Punctuation>,</Punctuation></CodeLine>}
        {personal.location && <CodeLine indent={1}><Variable>location</Variable><Punctuation>:</Punctuation> <StringLiteral value={personal.location} /><Punctuation>,</Punctuation></CodeLine>}
        {personal.age !== null && <CodeLine indent={1}><Variable>age</Variable><Punctuation>:</Punctuation> <NumberLiteral value={personal.age} /><Punctuation>,</Punctuation></CodeLine>}
        <CodeLine><Bracket>{'}'}</Bracket><Punctuation>;</Punctuation></CodeLine>
      </>
    );
  },

  renderSidebar: (data) => {
    const { skills, media, languages, personality } = data;
    const renderArray = (name: string, items: string[]) => {
      if (items.length === 0) return null;
      return (
        <>
          <BlankLine />
          <CodeLine><Keyword>const</Keyword> <Variable>{name}</Variable><Punctuation>:</Punctuation> <TypeName>readonly</TypeName> <TypeName>string</TypeName><Bracket>[]</Bracket> <Punctuation>=</Punctuation> <Bracket>[</Bracket></CodeLine>
          {items.map((item, i) => (
            <CodeLine key={i} indent={1}><StringLiteral value={item} /><Punctuation>,</Punctuation></CodeLine>
          ))}
          <CodeLine><Bracket>]</Bracket> <Keyword>as</Keyword> <Keyword>const</Keyword><Punctuation>;</Punctuation></CodeLine>
        </>
      );
    };
    return (
      <>
        {renderArray('platforms', skills.platforms)}
        {renderArray('languages', skills.programmingLanguages)}
        {renderArray('software', skills.software)}
        {media.length > 0 && (
          <>
            <BlankLine />
            <CodeLine><Keyword>const</Keyword> <Variable>links</Variable><Punctuation>:</Punctuation> <TypeName>Record</TypeName><Punctuation>{'<'}</Punctuation><TypeName>string</TypeName><Punctuation>,</Punctuation> <TypeName>string</TypeName><Punctuation>{'>'}</Punctuation> <Punctuation>=</Punctuation> <Bracket>{'{'}</Bracket></CodeLine>
            {media.map((m, i) => (
              <CodeLine key={i} indent={1}><Variable>{toCamelCase(m.platform)}</Variable><Punctuation>:</Punctuation> <StringLiteral value={m.url} /><Punctuation>,</Punctuation></CodeLine>
            ))}
            <CodeLine><Bracket>{'}'}</Bracket><Punctuation>;</Punctuation></CodeLine>
          </>
        )}
        {languages.length > 0 && (
          <>
            <BlankLine />
            <CodeLine><Keyword>type</Keyword> <TypeName>Level</TypeName> <Punctuation>=</Punctuation> {languages.map((l, i) => (<span key={i}><StringLiteral value={l.level} />{i < languages.length - 1 && <Punctuation> | </Punctuation>}</span>))}<Punctuation>;</Punctuation></CodeLine>
            <CodeLine><Keyword>const</Keyword> <Variable>spoken</Variable><Punctuation>:</Punctuation> <TypeName>Record</TypeName><Punctuation>{'<'}</Punctuation><TypeName>string</TypeName><Punctuation>,</Punctuation> <TypeName>Level</TypeName><Punctuation>{'>'}</Punctuation> <Punctuation>=</Punctuation> <Bracket>{'{'}</Bracket></CodeLine>
            {languages.map((lang, i) => (
              <CodeLine key={i} indent={1}><Variable>{toCamelCase(lang.name)}</Variable><Punctuation>:</Punctuation> <StringLiteral value={lang.level} /><Punctuation>,</Punctuation></CodeLine>
            ))}
            <CodeLine><Bracket>{'}'}</Bracket><Punctuation>;</Punctuation></CodeLine>
          </>
        )}
        {renderArray('traits', personality)}
      </>
    );
  },

  renderEducation: (data) => {
    if (data.education.length === 0) return null;
    return (
      <>
        <BlankLine />
        <CodeLine><Keyword>class</Keyword> <TypeName>Education</TypeName> <Bracket>{'{'}</Bracket></CodeLine>
        {data.education.map((edu, idx) => (
          <span key={edu.id}>
            {idx > 0 && <BlankLine />}
            <CodeLine indent={1}><Method>{toCamelCase(edu.school)}</Method><Bracket>()</Bracket><Punctuation>:</Punctuation> <TypeName>void</TypeName> <Bracket>{'{'}</Bracket></CodeLine>
            <CodeLine indent={2}><Keyword>const</Keyword> <Variable>level</Variable> <Punctuation>=</Punctuation> <StringLiteral value={edu.degree} /><Punctuation>;</Punctuation></CodeLine>
            <CodeLine indent={2}><Keyword>const</Keyword> <Variable>period</Variable> <Punctuation>=</Punctuation> <Bracket>[</Bracket><NumberLiteral value={edu.startYear} /><Punctuation>,</Punctuation> <NumberLiteral value={edu.endYear ?? 'Present'} /><Bracket>]</Bracket> <Keyword>as</Keyword> <Keyword>const</Keyword><Punctuation>;</Punctuation></CodeLine>
            <CodeLine indent={2}><Keyword>const</Keyword> <Variable>field</Variable> <Punctuation>=</Punctuation> <StringLiteral value={edu.field} /><Punctuation>;</Punctuation></CodeLine>
            {edu.description && <CodeLine indent={2}><Comment>{'// '}{edu.description}</Comment></CodeLine>}
            <CodeLine indent={1}><Bracket>{'}'}</Bracket></CodeLine>
          </span>
        ))}
        <CodeLine><Bracket>{'}'}</Bracket></CodeLine>
      </>
    );
  },

  renderExperience: (data) => {
    if (data.experience.length === 0) return null;
    return (
      <>
        <BlankLine />
        <CodeLine><Keyword>class</Keyword> <TypeName>Experience</TypeName> <Keyword>implements</Keyword> <TypeName>Professional</TypeName> <Bracket>{'{'}</Bracket></CodeLine>
        {data.experience.map((exp, idx) => (
          <span key={exp.id}>
            {idx > 0 && <BlankLine />}
            <CodeLine indent={1}><Method>{toCamelCase(exp.company)}</Method><Bracket>()</Bracket><Punctuation>:</Punctuation> <TypeName>void</TypeName> <Bracket>{'{'}</Bracket></CodeLine>
            <CodeLine indent={2}><Keyword>const</Keyword> <Variable>duration</Variable> <Punctuation>=</Punctuation> <Bracket>[</Bracket><StringLiteral value={exp.startDate} /><Punctuation>,</Punctuation> <StringLiteral value={exp.endDate ?? 'Present'} /><Bracket>]</Bracket><Punctuation>;</Punctuation></CodeLine>
            <CodeLine indent={2}><Keyword>const</Keyword> <Variable>role</Variable> <Punctuation>=</Punctuation> <StringLiteral value={exp.role} /><Punctuation>;</Punctuation></CodeLine>
            {exp.description && <CodeLine indent={2}><Comment>{'// '}{exp.description}</Comment></CodeLine>}
            {exp.technologies.length > 0 && (
              <CodeLine indent={2}><Keyword>const</Keyword> <Variable>stack</Variable><Punctuation>:</Punctuation> <TypeName>string</TypeName><Bracket>[]</Bracket> <Punctuation>=</Punctuation> <Bracket>[</Bracket>{exp.technologies.map((t, i) => (<span key={i}><StringLiteral value={t} />{i < exp.technologies.length - 1 && <Punctuation>, </Punctuation>}</span>))}<Bracket>]</Bracket><Punctuation>;</Punctuation></CodeLine>
            )}
            <CodeLine indent={1}><Bracket>{'}'}</Bracket></CodeLine>
          </span>
        ))}
        <CodeLine><Bracket>{'}'}</Bracket></CodeLine>
      </>
    );
  },
};

export default renderer;
