'use client';

import { CodeLine, BlankLine } from '@/components/preview/CodeLine';
import { Keyword, TypeName, StringLiteral, NumberLiteral, Comment, Variable, Method, Bracket, Punctuation, XmlTag } from '@/components/preview/tokens';
import type { CVData } from '@/lib/types';
import type { LanguageRenderer } from './types';

function sanitize(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '');
}

const renderer: LanguageRenderer = {
  renderSummary: (data) => {
    if (!data.summary) return null;
    const lines = data.summary.match(/.{1,60}(\s|$)/g) || [data.summary];
    return (
      <>
        <CodeLine><Comment>{'/// '}</Comment><XmlTag>{'<summary>'}</XmlTag></CodeLine>
        {lines.map((line, i) => (
          <CodeLine key={i}><Comment>{'/// '}{line.trim()}</Comment></CodeLine>
        ))}
        <CodeLine><Comment>{'/// '}</Comment><XmlTag>{'</summary>'}</XmlTag></CodeLine>
      </>
    );
  },

  renderInfo: (data) => {
    const { personal } = data;
    const fullName = `${personal.firstName} ${personal.lastName}`.trim();
    return (
      <>
        <CodeLine><Keyword>public</Keyword> <Keyword>class</Keyword> <TypeName>INFORMATION</TypeName></CodeLine>
        <CodeLine><Bracket>{'{'}</Bracket></CodeLine>
        {fullName && <CodeLine indent={1}><Keyword>public</Keyword> <TypeName>string</TypeName> <Variable>NAME</Variable> <Punctuation>=</Punctuation> <StringLiteral value={fullName} /><Punctuation>;</Punctuation></CodeLine>}
        {personal.title && <CodeLine indent={1}><Keyword>public</Keyword> <TypeName>string</TypeName> <Variable>TITLE</Variable> <Punctuation>=</Punctuation> <StringLiteral value={personal.title} /><Punctuation>;</Punctuation></CodeLine>}
        {personal.email && <CodeLine indent={1}><Keyword>public</Keyword> <TypeName>string</TypeName> <Variable>EMAIL</Variable> <Punctuation>=</Punctuation> <StringLiteral value={personal.email} /><Punctuation>;</Punctuation></CodeLine>}
        {personal.phone && <CodeLine indent={1}><Keyword>public</Keyword> <TypeName>int</TypeName> <Variable>PHONE</Variable> <Punctuation>=</Punctuation> <NumberLiteral value={personal.phone} /><Punctuation>;</Punctuation></CodeLine>}
        {personal.location && <CodeLine indent={1}><Keyword>public</Keyword> <TypeName>string[]</TypeName> <Variable>LOCATION</Variable> <Punctuation>=</Punctuation> <Bracket>{'{ '}</Bracket><StringLiteral value={personal.location} /><Bracket>{' }'}</Bracket><Punctuation>;</Punctuation></CodeLine>}
        {personal.age !== null && <CodeLine indent={1}><Keyword>public</Keyword> <TypeName>int</TypeName> <Variable>AGE</Variable> <Punctuation>=</Punctuation> <NumberLiteral value={personal.age} /><Punctuation>;</Punctuation></CodeLine>}
        <CodeLine><Bracket>{'}'}</Bracket></CodeLine>
      </>
    );
  },

  renderSidebar: (data) => {
    const { skills, media, languages, personality } = data;
    const renderEnum = (name: string, items: string[]) => {
      if (items.length === 0) return null;
      return (
        <>
          <CodeLine><Keyword>public</Keyword> <Keyword>enum</Keyword> <TypeName>{name}</TypeName></CodeLine>
          <CodeLine><Bracket>{'{'}</Bracket></CodeLine>
          {items.map((item, i) => (
            <CodeLine key={i} indent={1}><Variable>{item}</Variable>{i < items.length - 1 && <Punctuation>,</Punctuation>}</CodeLine>
          ))}
          <CodeLine><Bracket>{'}'}</Bracket></CodeLine>
          <BlankLine />
        </>
      );
    };
    return (
      <>
        {renderEnum('PLATFORMS', skills.platforms)}
        {renderEnum('LANGUAGES', skills.programmingLanguages)}
        {renderEnum('SOFTWARE', skills.software)}
        {media.length > 0 && (
          <>
            <CodeLine><Keyword>public</Keyword> <Keyword>enum</Keyword> <TypeName>MEDIA</TypeName></CodeLine>
            <CodeLine><Bracket>{'{'}</Bracket></CodeLine>
            {media.map((link, i) => (
              <CodeLine key={i} indent={1}><Variable>{link.platform}</Variable>{i < media.length - 1 && <Punctuation>,</Punctuation>} <Comment>{'// '}{link.url}</Comment></CodeLine>
            ))}
            <CodeLine><Bracket>{'}'}</Bracket></CodeLine>
            <BlankLine />
          </>
        )}
        {languages.length > 0 && (
          <>
            <CodeLine><Keyword>public</Keyword> <Keyword>enum</Keyword> <TypeName>SPOKEN</TypeName></CodeLine>
            <CodeLine><Bracket>{'{'}</Bracket></CodeLine>
            {languages.map((lang, i) => (
              <CodeLine key={i} indent={1}><Variable>{lang.name}</Variable>{i < languages.length - 1 && <Punctuation>,</Punctuation>} <Comment>{'// '}{lang.level}</Comment></CodeLine>
            ))}
            <CodeLine><Bracket>{'}'}</Bracket></CodeLine>
            <BlankLine />
          </>
        )}
        {personality.length > 0 && renderEnum('TRAITS', personality)}
      </>
    );
  },

  renderEducation: (data) => {
    if (data.education.length === 0) return null;
    return (
      <>
        <CodeLine><Keyword>public</Keyword> <Keyword>partial</Keyword> <Keyword>class</Keyword> <TypeName>EDUCATION</TypeName> <Punctuation>:</Punctuation> <TypeName>HigherEducation</TypeName></CodeLine>
        <CodeLine><Bracket>{'{'}</Bracket></CodeLine>
        {data.education.map((edu, i) => (
          <span key={edu.id}>
            {i > 0 && <BlankLine />}
            <CodeLine indent={1}><Keyword>private</Keyword> <Keyword>void</Keyword> <Method>{sanitize(edu.school)}</Method><Bracket>(</Bracket><Bracket>)</Bracket></CodeLine>
            <CodeLine indent={1}><Bracket>{'{'}</Bracket></CodeLine>
            <CodeLine indent={2}><Keyword>var</Keyword> <Variable>_Level</Variable> <Punctuation>=</Punctuation> <StringLiteral value={edu.degree} /><Punctuation>;</Punctuation></CodeLine>
            <CodeLine indent={2}><Keyword>var</Keyword> <Variable>_Period</Variable> <Punctuation>=</Punctuation> <Method>Range</Method><Bracket>(</Bracket><NumberLiteral value={edu.startYear} /><Punctuation>,</Punctuation> <NumberLiteral value={edu.endYear ?? 'Present'} /><Bracket>)</Bracket><Punctuation>;</Punctuation></CodeLine>
            {edu.field && <CodeLine indent={2}><Keyword>var</Keyword> <Variable>_Field</Variable> <Punctuation>=</Punctuation> <StringLiteral value={edu.field} /><Punctuation>;</Punctuation></CodeLine>}
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
        <CodeLine><Keyword>public</Keyword> <Keyword>static</Keyword> <Keyword>class</Keyword> <TypeName>EXPERIENCE</TypeName></CodeLine>
        <CodeLine><Bracket>{'{'}</Bracket></CodeLine>
        {data.experience.map((exp, i) => (
          <span key={exp.id}>
            {i > 0 && <BlankLine />}
            <CodeLine indent={1}><Keyword>public</Keyword> <Keyword>void</Keyword> <Method>{sanitize(exp.company)}</Method><Bracket>(</Bracket><Bracket>)</Bracket></CodeLine>
            <CodeLine indent={1}><Bracket>{'{'}</Bracket></CodeLine>
            <CodeLine indent={2}><Keyword>var</Keyword> <Variable>_Duration</Variable> <Punctuation>=</Punctuation> <Method>Range</Method><Bracket>(</Bracket><StringLiteral value={exp.startDate} /><Punctuation>,</Punctuation> <StringLiteral value={exp.endDate ?? 'Present'} /><Bracket>)</Bracket><Punctuation>;</Punctuation></CodeLine>
            <CodeLine indent={2}><Keyword>var</Keyword> <Variable>_Role</Variable> <Punctuation>=</Punctuation> <Keyword>new</Keyword> <StringLiteral value={exp.role} /><Punctuation>;</Punctuation></CodeLine>
            {exp.technologies.length > 0 && (
              <CodeLine indent={2}><Keyword>var</Keyword> <Variable>_Stack</Variable> <Punctuation>=</Punctuation> <Keyword>new</Keyword> <TypeName>[]</TypeName> <Bracket>{'{ '}</Bracket>{exp.technologies.map((t, ti) => (<span key={ti}><StringLiteral value={t} />{ti < exp.technologies.length - 1 && <Punctuation>, </Punctuation>}</span>))}<Bracket>{' }'}</Bracket><Punctuation>;</Punctuation></CodeLine>
            )}
            {exp.description && <CodeLine indent={2}><Comment>{'/* '}{exp.description}{' */'}</Comment></CodeLine>}
            <CodeLine indent={1}><Bracket>{'}'}</Bracket></CodeLine>
          </span>
        ))}
        <CodeLine><Bracket>{'}'}</Bracket></CodeLine>
      </>
    );
  },
};

export default renderer;
