'use client';

import { CodeLine, BlankLine } from '@/components/preview/CodeLine';
import { Keyword, TypeName, StringLiteral, NumberLiteral, Comment, Variable, Method, Bracket, Punctuation, Plain, Decorator } from '@/components/preview/tokens';
import type { CVData } from '@/lib/types';
import type { LanguageRenderer } from './types';

function toSnakeCase(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

const renderer: LanguageRenderer = {
  renderSummary: (data) => {
    if (!data.summary) return null;
    const lines = data.summary.match(/.{1,60}(\s|$)/g) || [data.summary];
    return (
      <>
        <CodeLine><StringLiteral value={'""'} /></CodeLine>
        {lines.map((line, i) => (
          <CodeLine key={i}><Plain>{line.trim()}</Plain></CodeLine>
        ))}
        <CodeLine><StringLiteral value={'""'} /></CodeLine>
      </>
    );
  },

  renderInfo: (data) => {
    const { personal } = data;
    const fullName = `${personal.firstName} ${personal.lastName}`.trim();
    return (
      <>
        <BlankLine />
        <CodeLine><Decorator>@dataclass</Decorator></CodeLine>
        <CodeLine><Keyword>class</Keyword> <TypeName>PersonalInfo</TypeName><Punctuation>:</Punctuation></CodeLine>
        {fullName && <CodeLine indent={1}><Variable>name</Variable><Punctuation>:</Punctuation> <TypeName>str</TypeName> <Punctuation>=</Punctuation> <StringLiteral value={fullName} /></CodeLine>}
        {personal.title && <CodeLine indent={1}><Variable>title</Variable><Punctuation>:</Punctuation> <TypeName>str</TypeName> <Punctuation>=</Punctuation> <StringLiteral value={personal.title} /></CodeLine>}
        {personal.email && <CodeLine indent={1}><Variable>email</Variable><Punctuation>:</Punctuation> <TypeName>str</TypeName> <Punctuation>=</Punctuation> <StringLiteral value={personal.email} /></CodeLine>}
        {personal.phone && <CodeLine indent={1}><Variable>phone</Variable><Punctuation>:</Punctuation> <TypeName>str</TypeName> <Punctuation>=</Punctuation> <StringLiteral value={personal.phone} /></CodeLine>}
        {personal.location && <CodeLine indent={1}><Variable>location</Variable><Punctuation>:</Punctuation> <TypeName>str</TypeName> <Punctuation>=</Punctuation> <StringLiteral value={personal.location} /></CodeLine>}
        {personal.age !== null && <CodeLine indent={1}><Variable>age</Variable><Punctuation>:</Punctuation> <TypeName>int</TypeName> <Punctuation>=</Punctuation> <NumberLiteral value={personal.age} /></CodeLine>}
      </>
    );
  },

  renderSidebar: (data) => {
    const { skills, media, languages, personality } = data;
    const renderList = (name: string, items: string[]) => {
      if (items.length === 0) return null;
      return (
        <>
          <BlankLine />
          <CodeLine><Variable>{name}</Variable><Punctuation>:</Punctuation> <TypeName>list</TypeName><Bracket>[</Bracket><TypeName>str</TypeName><Bracket>]</Bracket> <Punctuation>=</Punctuation> <Bracket>[</Bracket></CodeLine>
          {items.map((p, i) => (
            <CodeLine key={i} indent={1}><StringLiteral value={p} /><Punctuation>,</Punctuation></CodeLine>
          ))}
          <CodeLine><Bracket>]</Bracket></CodeLine>
        </>
      );
    };
    return (
      <>
        {renderList('PLATFORMS', skills.platforms)}
        {renderList('LANGUAGES', skills.programmingLanguages)}
        {renderList('SOFTWARE', skills.software)}
        {media.length > 0 && (
          <>
            <BlankLine />
            <CodeLine><Variable>LINKS</Variable><Punctuation>:</Punctuation> <TypeName>dict</TypeName><Bracket>[</Bracket><TypeName>str</TypeName><Punctuation>,</Punctuation> <TypeName>str</TypeName><Bracket>]</Bracket> <Punctuation>=</Punctuation> <Bracket>{'{'}</Bracket></CodeLine>
            {media.map((m, i) => (
              <CodeLine key={i} indent={1}><StringLiteral value={m.platform} /><Punctuation>:</Punctuation> <StringLiteral value={m.url} /><Punctuation>,</Punctuation></CodeLine>
            ))}
            <CodeLine><Bracket>{'}'}</Bracket></CodeLine>
          </>
        )}
        {languages.length > 0 && (
          <>
            <BlankLine />
            <CodeLine><Variable>SPOKEN</Variable> <Punctuation>=</Punctuation> <Bracket>{'{'}</Bracket></CodeLine>
            {languages.map((lang, i) => (
              <CodeLine key={i} indent={1}><StringLiteral value={lang.name} /><Punctuation>:</Punctuation> <StringLiteral value={lang.level} /><Punctuation>,</Punctuation></CodeLine>
            ))}
            <CodeLine><Bracket>{'}'}</Bracket></CodeLine>
          </>
        )}
        {renderList('TRAITS', personality)}
      </>
    );
  },

  renderEducation: (data) => {
    if (data.education.length === 0) return null;
    return (
      <>
        <BlankLine />
        <CodeLine><Keyword>class</Keyword> <TypeName>Education</TypeName><Punctuation>:</Punctuation></CodeLine>
        {data.education.map((edu, idx) => (
          <span key={edu.id}>
            {idx > 0 && <BlankLine />}
            <CodeLine indent={1}><Keyword>def</Keyword> <Method>{toSnakeCase(edu.school)}</Method><Bracket>(</Bracket><Variable>self</Variable><Bracket>)</Bracket> <Punctuation>{'->'}</Punctuation> <TypeName>None</TypeName><Punctuation>:</Punctuation></CodeLine>
            <CodeLine indent={2}><Variable>level</Variable> <Punctuation>=</Punctuation> <StringLiteral value={edu.degree} /></CodeLine>
            <CodeLine indent={2}><Variable>dates</Variable> <Punctuation>=</Punctuation> <Method>range</Method><Bracket>(</Bracket><NumberLiteral value={edu.startYear} /><Punctuation>,</Punctuation> <NumberLiteral value={edu.endYear ?? 'Present'} /><Bracket>)</Bracket></CodeLine>
            <CodeLine indent={2}><Variable>field</Variable> <Punctuation>=</Punctuation> <StringLiteral value={edu.field} /></CodeLine>
            {edu.description && <CodeLine indent={2}><Comment># {edu.description}</Comment></CodeLine>}
          </span>
        ))}
      </>
    );
  },

  renderExperience: (data) => {
    if (data.experience.length === 0) return null;
    return (
      <>
        <BlankLine />
        <CodeLine><Keyword>class</Keyword> <TypeName>Experience</TypeName><Punctuation>:</Punctuation></CodeLine>
        {data.experience.map((exp, idx) => (
          <span key={exp.id}>
            {idx > 0 && <BlankLine />}
            <CodeLine indent={1}><Keyword>def</Keyword> <Method>{toSnakeCase(exp.company)}</Method><Bracket>(</Bracket><Variable>self</Variable><Bracket>)</Bracket> <Punctuation>{'->'}</Punctuation> <TypeName>None</TypeName><Punctuation>:</Punctuation></CodeLine>
            <CodeLine indent={2}><Variable>duration</Variable> <Punctuation>=</Punctuation> <Bracket>(</Bracket><StringLiteral value={exp.startDate} /><Punctuation>,</Punctuation> <StringLiteral value={exp.endDate ?? 'Present'} /><Bracket>)</Bracket></CodeLine>
            <CodeLine indent={2}><Variable>role</Variable> <Punctuation>=</Punctuation> <StringLiteral value={exp.role} /></CodeLine>
            {exp.description && <CodeLine indent={2}><Comment># {exp.description}</Comment></CodeLine>}
            {exp.technologies.length > 0 && (
              <>
                <CodeLine indent={2}><Variable>stack</Variable> <Punctuation>=</Punctuation> <Bracket>[</Bracket></CodeLine>
                {exp.technologies.map((tech, i) => (
                  <CodeLine key={i} indent={3}><StringLiteral value={tech} /><Punctuation>,</Punctuation></CodeLine>
                ))}
                <CodeLine indent={2}><Bracket>]</Bracket></CodeLine>
              </>
            )}
          </span>
        ))}
      </>
    );
  },
};

export default renderer;
