'use client';

import { CodeLine, BlankLine } from '@/components/preview/CodeLine';
import { Keyword, TypeName, StringLiteral, NumberLiteral, Comment, Variable, Method, Bracket, Punctuation, Decorator } from '@/components/preview/tokens';
import type { CVData } from '@/lib/types';
import type { LanguageRenderer } from './types';

function toPascalCase(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function toCamelCase(s: string): string {
  const pascal = toPascalCase(s);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
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
        <CodeLine><Keyword>public</Keyword> <Keyword>class</Keyword> <TypeName>Information</TypeName> <Bracket>{'{'}</Bracket></CodeLine>
        {fullName && <><CodeLine indent={1}><Decorator>@Getter</Decorator></CodeLine><CodeLine indent={1}><Keyword>private</Keyword> <TypeName>String</TypeName> <Variable>name</Variable> <Punctuation>=</Punctuation> <StringLiteral value={fullName} /><Punctuation>;</Punctuation></CodeLine></>}
        {personal.title && <CodeLine indent={1}><Keyword>private</Keyword> <TypeName>String</TypeName> <Variable>title</Variable> <Punctuation>=</Punctuation> <StringLiteral value={personal.title} /><Punctuation>;</Punctuation></CodeLine>}
        {personal.email && <CodeLine indent={1}><Keyword>private</Keyword> <TypeName>String</TypeName> <Variable>email</Variable> <Punctuation>=</Punctuation> <StringLiteral value={personal.email} /><Punctuation>;</Punctuation></CodeLine>}
        {personal.phone && <CodeLine indent={1}><Keyword>private</Keyword> <TypeName>String</TypeName> <Variable>phone</Variable> <Punctuation>=</Punctuation> <StringLiteral value={personal.phone} /><Punctuation>;</Punctuation></CodeLine>}
        {personal.location && <CodeLine indent={1}><Keyword>private</Keyword> <TypeName>String</TypeName> <Variable>location</Variable> <Punctuation>=</Punctuation> <StringLiteral value={personal.location} /><Punctuation>;</Punctuation></CodeLine>}
        {personal.age !== null && <CodeLine indent={1}><Keyword>private</Keyword> <TypeName>int</TypeName> <Variable>age</Variable> <Punctuation>=</Punctuation> <NumberLiteral value={personal.age} /><Punctuation>;</Punctuation></CodeLine>}
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
          <BlankLine />
          <CodeLine><Keyword>public</Keyword> <Keyword>enum</Keyword> <TypeName>{name}</TypeName> <Bracket>{'{'}</Bracket></CodeLine>
          {items.map((item, i) => (
            <CodeLine key={i} indent={1}><Variable>{item.toUpperCase().replace(/[^A-Z0-9]/g, '_')}</Variable>{i < items.length - 1 && <Punctuation>,</Punctuation>}</CodeLine>
          ))}
          <CodeLine><Bracket>{'}'}</Bracket></CodeLine>
        </>
      );
    };
    return (
      <>
        {renderEnum('Platforms', skills.platforms)}
        {renderEnum('Languages', skills.programmingLanguages)}
        {renderEnum('Software', skills.software)}
        {media.length > 0 && (
          <>
            <BlankLine />
            <CodeLine><TypeName>Map</TypeName><Punctuation>{'<'}</Punctuation><TypeName>String</TypeName><Punctuation>,</Punctuation> <TypeName>String</TypeName><Punctuation>{'>'}</Punctuation> <Variable>links</Variable> <Punctuation>=</Punctuation> <TypeName>Map</TypeName><Punctuation>.</Punctuation><Method>of</Method><Bracket>(</Bracket></CodeLine>
            {media.map((m, i) => (
              <CodeLine key={i} indent={1}><StringLiteral value={m.platform} /><Punctuation>,</Punctuation> <StringLiteral value={m.url} />{i < media.length - 1 && <Punctuation>,</Punctuation>}</CodeLine>
            ))}
            <CodeLine><Bracket>)</Bracket><Punctuation>;</Punctuation></CodeLine>
          </>
        )}
        {languages.length > 0 && (
          <>
            <BlankLine />
            <CodeLine><TypeName>List</TypeName><Punctuation>{'<'}</Punctuation><TypeName>String</TypeName><Punctuation>{'>'}</Punctuation> <Variable>spoken</Variable> <Punctuation>=</Punctuation> <TypeName>List</TypeName><Punctuation>.</Punctuation><Method>of</Method><Bracket>(</Bracket></CodeLine>
            {languages.map((lang, i) => (
              <CodeLine key={i} indent={1}><StringLiteral value={`${lang.name}: ${lang.level}`} />{i < languages.length - 1 && <Punctuation>,</Punctuation>}</CodeLine>
            ))}
            <CodeLine><Bracket>)</Bracket><Punctuation>;</Punctuation></CodeLine>
          </>
        )}
        {personality.length > 0 && renderEnum('Personality', personality)}
      </>
    );
  },

  renderEducation: (data) => {
    if (data.education.length === 0) return null;
    return (
      <>
        <BlankLine />
        <CodeLine><Keyword>public</Keyword> <Keyword>class</Keyword> <TypeName>Education</TypeName> <Keyword>extends</Keyword> <TypeName>AcademicRecord</TypeName> <Bracket>{'{'}</Bracket></CodeLine>
        {data.education.map((edu, idx) => {
          const years = edu.endYear ? `${edu.startYear}-${edu.endYear}` : `${edu.startYear}-Present`;
          return (
            <span key={edu.id}>
              {idx > 0 && <BlankLine />}
              <CodeLine indent={1}><Keyword>public</Keyword> <Keyword>void</Keyword> <Method>{toCamelCase(edu.school)}</Method><Bracket>()</Bracket> <Bracket>{'{'}</Bracket></CodeLine>
              <CodeLine indent={2}><TypeName>String</TypeName> <Variable>degree</Variable> <Punctuation>=</Punctuation> <StringLiteral value={edu.degree} /><Punctuation>;</Punctuation></CodeLine>
              <CodeLine indent={2}><TypeName>String</TypeName> <Variable>period</Variable> <Punctuation>=</Punctuation> <StringLiteral value={years} /><Punctuation>;</Punctuation></CodeLine>
              {edu.field && <CodeLine indent={2}><TypeName>String</TypeName> <Variable>field</Variable> <Punctuation>=</Punctuation> <StringLiteral value={edu.field} /><Punctuation>;</Punctuation></CodeLine>}
              {edu.description && <CodeLine indent={2}><Comment>{'// '}{edu.description}</Comment></CodeLine>}
              <CodeLine indent={1}><Bracket>{'}'}</Bracket></CodeLine>
            </span>
          );
        })}
        <CodeLine><Bracket>{'}'}</Bracket></CodeLine>
      </>
    );
  },

  renderExperience: (data) => {
    if (data.experience.length === 0) return null;
    return (
      <>
        <BlankLine />
        <CodeLine><Keyword>public</Keyword> <Keyword>final</Keyword> <Keyword>class</Keyword> <TypeName>Experience</TypeName> <Keyword>implements</Keyword> <TypeName>Professional</TypeName> <Bracket>{'{'}</Bracket></CodeLine>
        {data.experience.map((exp, idx) => (
          <span key={exp.id}>
            {idx > 0 && <BlankLine />}
            <CodeLine indent={1}><Decorator>@Override</Decorator></CodeLine>
            <CodeLine indent={1}><Keyword>public</Keyword> <Keyword>void</Keyword> <Method>{toCamelCase(exp.company)}</Method><Bracket>()</Bracket> <Bracket>{'{'}</Bracket></CodeLine>
            <CodeLine indent={2}><TypeName>String</TypeName> <Variable>duration</Variable> <Punctuation>=</Punctuation> <StringLiteral value={`${exp.startDate} - ${exp.endDate ?? 'Present'}`} /><Punctuation>;</Punctuation></CodeLine>
            <CodeLine indent={2}><TypeName>String</TypeName> <Variable>role</Variable> <Punctuation>=</Punctuation> <StringLiteral value={exp.role} /><Punctuation>;</Punctuation></CodeLine>
            {exp.description && <CodeLine indent={2}><Comment>{'// '}{exp.description}</Comment></CodeLine>}
            {exp.technologies.length > 0 && (
              <CodeLine indent={2}><TypeName>List</TypeName><Punctuation>{'<'}</Punctuation><TypeName>String</TypeName><Punctuation>{'>'}</Punctuation> <Variable>stack</Variable> <Punctuation>=</Punctuation> <TypeName>List</TypeName><Punctuation>.</Punctuation><Method>of</Method><Bracket>(</Bracket>{exp.technologies.map((t, i) => (<span key={i}><StringLiteral value={t} />{i < exp.technologies.length - 1 && <Punctuation>, </Punctuation>}</span>))}<Bracket>)</Bracket><Punctuation>;</Punctuation></CodeLine>
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
