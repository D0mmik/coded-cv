'use client';

import React from 'react';
import { CodeLine, BlankLine } from '@/components/preview/CodeLine';
import { Keyword, TypeName, StringLiteral, NumberLiteral, Comment, Variable, Method, Bracket, Punctuation, Decorator } from '@/components/preview/tokens';
import type { CVData } from '@/lib/types';
import type { LanguageRenderer } from './types';

function toSnakeCase(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

const renderer: LanguageRenderer = {
  renderSummary: (data) => {
    if (!data.summary) return null;
    const lines = data.summary.match(/.{1,55}(\s|$)/g) || [data.summary];
    return (
      <>
        {lines.map((line, i) => (
          <CodeLine key={i}><Comment>/// {line.trim()}</Comment></CodeLine>
        ))}
      </>
    );
  },

  renderInfo: (data) => {
    const { personal } = data;
    const fullName = `${personal.firstName} ${personal.lastName}`.trim();
    return (
      <>
        <BlankLine />
        <CodeLine><Decorator>#[derive(Debug, Clone)]</Decorator></CodeLine>
        <CodeLine><Keyword>struct</Keyword> <TypeName>PersonalInfo</TypeName> <Bracket>{'{'}</Bracket></CodeLine>
        <CodeLine indent={1}><Variable>name</Variable><Punctuation>:</Punctuation> <TypeName>String</TypeName><Punctuation>,</Punctuation></CodeLine>
        <CodeLine indent={1}><Variable>title</Variable><Punctuation>:</Punctuation> <TypeName>String</TypeName><Punctuation>,</Punctuation></CodeLine>
        <CodeLine indent={1}><Variable>email</Variable><Punctuation>:</Punctuation> <TypeName>String</TypeName><Punctuation>,</Punctuation></CodeLine>
        <CodeLine indent={1}><Variable>phone</Variable><Punctuation>:</Punctuation> <TypeName>String</TypeName><Punctuation>,</Punctuation></CodeLine>
        <CodeLine indent={1}><Variable>location</Variable><Punctuation>:</Punctuation> <TypeName>String</TypeName><Punctuation>,</Punctuation></CodeLine>
        {personal.age !== null && <CodeLine indent={1}><Variable>age</Variable><Punctuation>:</Punctuation> <TypeName>u32</TypeName><Punctuation>,</Punctuation></CodeLine>}
        <CodeLine><Bracket>{'}'}</Bracket></CodeLine>
        <BlankLine />
        <CodeLine><Keyword>impl</Keyword> <TypeName>PersonalInfo</TypeName> <Bracket>{'{'}</Bracket></CodeLine>
        <CodeLine indent={1}><Keyword>fn</Keyword> <Method>new</Method><Bracket>()</Bracket> <Punctuation>{'->'}</Punctuation> <TypeName>Self</TypeName> <Bracket>{'{'}</Bracket></CodeLine>
        <CodeLine indent={2}><TypeName>Self</TypeName> <Bracket>{'{'}</Bracket></CodeLine>
        {fullName && <CodeLine indent={3}><Variable>name</Variable><Punctuation>:</Punctuation> <StringLiteral value={fullName} /><Punctuation>.into(),</Punctuation></CodeLine>}
        {personal.title && <CodeLine indent={3}><Variable>title</Variable><Punctuation>:</Punctuation> <StringLiteral value={personal.title} /><Punctuation>.into(),</Punctuation></CodeLine>}
        {personal.email && <CodeLine indent={3}><Variable>email</Variable><Punctuation>:</Punctuation> <StringLiteral value={personal.email} /><Punctuation>.into(),</Punctuation></CodeLine>}
        {personal.phone && <CodeLine indent={3}><Variable>phone</Variable><Punctuation>:</Punctuation> <StringLiteral value={personal.phone} /><Punctuation>.into(),</Punctuation></CodeLine>}
        {personal.location && <CodeLine indent={3}><Variable>location</Variable><Punctuation>:</Punctuation> <StringLiteral value={personal.location} /><Punctuation>.into(),</Punctuation></CodeLine>}
        {personal.age !== null && <CodeLine indent={3}><Variable>age</Variable><Punctuation>:</Punctuation> <NumberLiteral value={personal.age} /><Punctuation>,</Punctuation></CodeLine>}
        <CodeLine indent={2}><Bracket>{'}'}</Bracket></CodeLine>
        <CodeLine indent={1}><Bracket>{'}'}</Bracket></CodeLine>
        <CodeLine><Bracket>{'}'}</Bracket></CodeLine>
      </>
    );
  },

  renderSidebar: (data) => {
    const { skills, media, languages, personality } = data;
    const renderConst = (name: string, items: string[]) => {
      if (items.length === 0) return null;
      return (
        <React.Fragment key={name}>
          <BlankLine />
          <CodeLine><Keyword>const</Keyword> <Variable>{name}</Variable><Punctuation>:</Punctuation> <Punctuation>&amp;</Punctuation><Bracket>[</Bracket><Punctuation>&amp;</Punctuation><TypeName>str</TypeName><Bracket>]</Bracket> <Punctuation>=</Punctuation> <Punctuation>&amp;</Punctuation><Bracket>[</Bracket></CodeLine>
          {items.map((item, i) => (
            <CodeLine indent={1} key={i}><StringLiteral value={item} /><Punctuation>,</Punctuation></CodeLine>
          ))}
          <CodeLine><Bracket>]</Bracket><Punctuation>;</Punctuation></CodeLine>
        </React.Fragment>
      );
    };
    return (
      <>
        {renderConst('PLATFORMS', skills.platforms)}
        {renderConst('LANGUAGES', skills.programmingLanguages)}
        {renderConst('SOFTWARE', skills.software)}
        {media.length > 0 && (
          <>
            <BlankLine />
            <CodeLine><Keyword>fn</Keyword> <Method>links</Method><Bracket>()</Bracket> <Punctuation>{'->'}</Punctuation> <TypeName>HashMap</TypeName><Punctuation>{'<'}</Punctuation><Punctuation>&amp;</Punctuation><TypeName>str</TypeName><Punctuation>,</Punctuation> <Punctuation>&amp;</Punctuation><TypeName>str</TypeName><Punctuation>{'>'}</Punctuation> <Bracket>{'{'}</Bracket></CodeLine>
            <CodeLine indent={1}><TypeName>HashMap</TypeName><Punctuation>::</Punctuation><Method>from</Method><Bracket>(</Bracket><Bracket>[</Bracket></CodeLine>
            {media.map((m, i) => (
              <CodeLine indent={2} key={i}><Bracket>(</Bracket><StringLiteral value={m.platform} /><Punctuation>,</Punctuation> <StringLiteral value={m.url} /><Bracket>)</Bracket><Punctuation>,</Punctuation></CodeLine>
            ))}
            <CodeLine indent={1}><Bracket>]</Bracket><Bracket>)</Bracket></CodeLine>
            <CodeLine><Bracket>{'}'}</Bracket></CodeLine>
          </>
        )}
        {languages.length > 0 && (
          <>
            <BlankLine />
            <CodeLine><Keyword>enum</Keyword> <TypeName>Level</TypeName> <Bracket>{'{'}</Bracket> {languages.map((l, i) => (<span key={i}><Variable>{l.level}</Variable>{i < languages.length - 1 && <Punctuation>, </Punctuation>}</span>))} <Bracket>{'}'}</Bracket></CodeLine>
          </>
        )}
        {renderConst('TRAITS', personality)}
      </>
    );
  },

  renderEducation: (data) => {
    if (data.education.length === 0) return null;
    return (
      <>
        <BlankLine />
        <CodeLine><Keyword>impl</Keyword> <TypeName>CV</TypeName> <Bracket>{'{'}</Bracket></CodeLine>
        {data.education.map((edu, idx) => {
          const years = edu.endYear ? `${edu.startYear}-${edu.endYear}` : `${edu.startYear}-present`;
          return (
            <React.Fragment key={edu.id}>
              {idx > 0 && <BlankLine />}
              <CodeLine indent={1}><Keyword>fn</Keyword> <Method>{toSnakeCase(edu.school)}</Method><Bracket>(</Bracket><Punctuation>&amp;</Punctuation><Variable>self</Variable><Bracket>)</Bracket> <Punctuation>{'->'}</Punctuation> <TypeName>Education</TypeName> <Bracket>{'{'}</Bracket></CodeLine>
              <CodeLine indent={2}><TypeName>Education</TypeName> <Bracket>{'{'}</Bracket></CodeLine>
              <CodeLine indent={3}><Variable>school</Variable><Punctuation>:</Punctuation> <StringLiteral value={edu.school} /><Punctuation>.into(),</Punctuation></CodeLine>
              <CodeLine indent={3}><Variable>degree</Variable><Punctuation>:</Punctuation> <StringLiteral value={edu.degree} /><Punctuation>.into(),</Punctuation></CodeLine>
              {edu.field && <CodeLine indent={3}><Variable>field</Variable><Punctuation>:</Punctuation> <StringLiteral value={edu.field} /><Punctuation>.into(),</Punctuation></CodeLine>}
              <CodeLine indent={3}><Variable>years</Variable><Punctuation>:</Punctuation> <StringLiteral value={years} /><Punctuation>.into(),</Punctuation></CodeLine>
              {edu.description && <CodeLine indent={3}><Comment>// {edu.description}</Comment></CodeLine>}
              <CodeLine indent={2}><Bracket>{'}'}</Bracket></CodeLine>
              <CodeLine indent={1}><Bracket>{'}'}</Bracket></CodeLine>
            </React.Fragment>
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
        <CodeLine><Keyword>impl</Keyword> <TypeName>Professional</TypeName> <Keyword>for</Keyword> <TypeName>CV</TypeName> <Bracket>{'{'}</Bracket></CodeLine>
        {data.experience.map((exp, idx) => {
          const duration = exp.endDate ? `${exp.startDate} - ${exp.endDate}` : `${exp.startDate} - present`;
          return (
            <React.Fragment key={exp.id}>
              {idx > 0 && <BlankLine />}
              <CodeLine indent={1}><Keyword>fn</Keyword> <Method>{toSnakeCase(exp.company)}</Method><Bracket>(</Bracket><Punctuation>&amp;</Punctuation><Variable>self</Variable><Bracket>)</Bracket> <Punctuation>{'->'}</Punctuation> <TypeName>Experience</TypeName> <Bracket>{'{'}</Bracket></CodeLine>
              <CodeLine indent={2}><TypeName>Experience</TypeName> <Bracket>{'{'}</Bracket></CodeLine>
              <CodeLine indent={3}><Variable>company</Variable><Punctuation>:</Punctuation> <StringLiteral value={exp.company} /><Punctuation>.into(),</Punctuation></CodeLine>
              <CodeLine indent={3}><Variable>role</Variable><Punctuation>:</Punctuation> <StringLiteral value={exp.role} /><Punctuation>.into(),</Punctuation></CodeLine>
              <CodeLine indent={3}><Variable>duration</Variable><Punctuation>:</Punctuation> <StringLiteral value={duration} /><Punctuation>.into(),</Punctuation></CodeLine>
              {exp.description && <CodeLine indent={3}><Comment>// {exp.description}</Comment></CodeLine>}
              {exp.technologies.length > 0 && (
                <CodeLine indent={3}><Variable>stack</Variable><Punctuation>:</Punctuation> <Keyword>vec!</Keyword><Bracket>[</Bracket>{exp.technologies.map((t, i) => (<span key={i}><StringLiteral value={t} />{i < exp.technologies.length - 1 && <Punctuation>, </Punctuation>}</span>))}<Bracket>]</Bracket><Punctuation>,</Punctuation></CodeLine>
              )}
              <CodeLine indent={2}><Bracket>{'}'}</Bracket></CodeLine>
              <CodeLine indent={1}><Bracket>{'}'}</Bracket></CodeLine>
            </React.Fragment>
          );
        })}
        <CodeLine><Bracket>{'}'}</Bracket></CodeLine>
      </>
    );
  },
};

export default renderer;
