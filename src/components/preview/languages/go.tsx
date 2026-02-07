'use client';

import React from 'react';
import { CodeLine, BlankLine } from '@/components/preview/CodeLine';
import { Keyword, TypeName, StringLiteral, NumberLiteral, Comment, Variable, Punctuation, Plain } from '@/components/preview/tokens';
import type { CVData } from '@/lib/types';
import type { LanguageRenderer } from './types';

function toPascalCase(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

const renderer: LanguageRenderer = {
  renderSummary: (data) => {
    if (!data.summary) return null;
    const lines = data.summary.match(/.{1,55}(\s|$)/g) || [data.summary];
    return (
      <>
        {lines.map((line, i) => (
          <CodeLine key={i}><Comment>// {line.trim()}</Comment></CodeLine>
        ))}
        <CodeLine><Keyword>package</Keyword> <Plain>cv</Plain></CodeLine>
        <BlankLine />
      </>
    );
  },

  renderInfo: (data) => {
    const { personal } = data;
    const fullName = `${personal.firstName} ${personal.lastName}`.trim();
    return (
      <>
        <CodeLine><Keyword>type</Keyword> <TypeName>PersonalInfo</TypeName> <Keyword>struct</Keyword> <Punctuation>{'{'}</Punctuation></CodeLine>
        <CodeLine indent={1}><Plain>Name     </Plain><TypeName>string</TypeName></CodeLine>
        <CodeLine indent={1}><Plain>Title    </Plain><TypeName>string</TypeName></CodeLine>
        <CodeLine indent={1}><Plain>Email    </Plain><TypeName>string</TypeName></CodeLine>
        <CodeLine indent={1}><Plain>Phone    </Plain><TypeName>string</TypeName></CodeLine>
        <CodeLine indent={1}><Plain>Location </Plain><TypeName>string</TypeName></CodeLine>
        {personal.age !== null && <CodeLine indent={1}><Plain>Age      </Plain><TypeName>int</TypeName></CodeLine>}
        <CodeLine><Punctuation>{'}'}</Punctuation></CodeLine>
        <BlankLine />
        <CodeLine><Keyword>var</Keyword> <Variable>info</Variable> <Punctuation>=</Punctuation> <TypeName>PersonalInfo</TypeName><Punctuation>{'{'}</Punctuation></CodeLine>
        {fullName && <CodeLine indent={1}><Plain>Name:     </Plain><StringLiteral value={fullName} /><Punctuation>,</Punctuation></CodeLine>}
        {personal.title && <CodeLine indent={1}><Plain>Title:    </Plain><StringLiteral value={personal.title} /><Punctuation>,</Punctuation></CodeLine>}
        {personal.email && <CodeLine indent={1}><Plain>Email:    </Plain><StringLiteral value={personal.email} /><Punctuation>,</Punctuation></CodeLine>}
        {personal.phone && <CodeLine indent={1}><Plain>Phone:    </Plain><StringLiteral value={personal.phone} /><Punctuation>,</Punctuation></CodeLine>}
        {personal.location && <CodeLine indent={1}><Plain>Location: </Plain><StringLiteral value={personal.location} /><Punctuation>,</Punctuation></CodeLine>}
        {personal.age !== null && <CodeLine indent={1}><Plain>Age:      </Plain><NumberLiteral value={personal.age} /><Punctuation>,</Punctuation></CodeLine>}
        <CodeLine><Punctuation>{'}'}</Punctuation></CodeLine>
        <BlankLine />
      </>
    );
  },

  renderSidebar: (data) => {
    const { skills, media, languages, personality } = data;
    const renderSlice = (name: string, items: string[]) => {
      if (items.length === 0) return null;
      return (
        <React.Fragment key={name}>
          <CodeLine><Keyword>var</Keyword> <Variable>{name}</Variable> <Punctuation>=</Punctuation> <Punctuation>[]</Punctuation><TypeName>string</TypeName><Punctuation>{'{'}</Punctuation></CodeLine>
          {items.map((item, i) => (
            <CodeLine indent={1} key={i}><StringLiteral value={item} /><Punctuation>,</Punctuation></CodeLine>
          ))}
          <CodeLine><Punctuation>{'}'}</Punctuation></CodeLine>
          <BlankLine />
        </React.Fragment>
      );
    };
    return (
      <>
        {renderSlice('platforms', skills.platforms)}
        {renderSlice('languages', skills.programmingLanguages)}
        {renderSlice('software', skills.software)}
        {media.length > 0 && (
          <>
            <CodeLine><Keyword>var</Keyword> <Variable>links</Variable> <Punctuation>=</Punctuation> <Keyword>map</Keyword><Punctuation>[</Punctuation><TypeName>string</TypeName><Punctuation>]</Punctuation><TypeName>string</TypeName><Punctuation>{'{'}</Punctuation></CodeLine>
            {media.map((m, i) => (
              <CodeLine indent={1} key={i}><StringLiteral value={m.platform} /><Punctuation>: </Punctuation><StringLiteral value={m.url} /><Punctuation>,</Punctuation></CodeLine>
            ))}
            <CodeLine><Punctuation>{'}'}</Punctuation></CodeLine>
            <BlankLine />
          </>
        )}
        {languages.length > 0 && (
          <>
            <CodeLine><Keyword>var</Keyword> <Variable>spoken</Variable> <Punctuation>=</Punctuation> <Keyword>map</Keyword><Punctuation>[</Punctuation><TypeName>string</TypeName><Punctuation>]</Punctuation><TypeName>string</TypeName><Punctuation>{'{'}</Punctuation></CodeLine>
            {languages.map((lang, i) => (
              <CodeLine indent={1} key={i}><StringLiteral value={lang.name} /><Punctuation>: </Punctuation><StringLiteral value={lang.level} /><Punctuation>,</Punctuation></CodeLine>
            ))}
            <CodeLine><Punctuation>{'}'}</Punctuation></CodeLine>
            <BlankLine />
          </>
        )}
        {renderSlice('traits', personality)}
      </>
    );
  },

  renderEducation: (data) => {
    if (data.education.length === 0) return null;
    return (
      <>
        {data.education.map((edu) => {
          const years = edu.endYear ? `${edu.startYear} - ${edu.endYear}` : `${edu.startYear} - Present`;
          return (
            <React.Fragment key={edu.id}>
              <CodeLine><Keyword>func</Keyword> <Punctuation>(</Punctuation><Variable>cv</Variable> <Punctuation>*</Punctuation><TypeName>CV</TypeName><Punctuation>)</Punctuation> <Plain>{toPascalCase(edu.school)}</Plain><Punctuation>()</Punctuation> <TypeName>Education</TypeName> <Punctuation>{'{'}</Punctuation></CodeLine>
              <CodeLine indent={1}><Keyword>return</Keyword> <TypeName>Education</TypeName><Punctuation>{'{'}</Punctuation></CodeLine>
              <CodeLine indent={2}><Plain>School: </Plain><StringLiteral value={edu.school} /><Punctuation>,</Punctuation></CodeLine>
              <CodeLine indent={2}><Plain>Degree: </Plain><StringLiteral value={edu.degree} /><Punctuation>,</Punctuation></CodeLine>
              {edu.field && <CodeLine indent={2}><Plain>Field:  </Plain><StringLiteral value={edu.field} /><Punctuation>,</Punctuation></CodeLine>}
              <CodeLine indent={2}><Plain>Years:  </Plain><StringLiteral value={years} /><Punctuation>,</Punctuation></CodeLine>
              {edu.description && <CodeLine indent={2}><Comment>// {edu.description}</Comment></CodeLine>}
              <CodeLine indent={1}><Punctuation>{'}'}</Punctuation></CodeLine>
              <CodeLine><Punctuation>{'}'}</Punctuation></CodeLine>
              <BlankLine />
            </React.Fragment>
          );
        })}
      </>
    );
  },

  renderExperience: (data) => {
    if (data.experience.length === 0) return null;
    return (
      <>
        {data.experience.map((exp) => {
          const duration = exp.endDate ? `${exp.startDate} - ${exp.endDate}` : `${exp.startDate} - Present`;
          return (
            <React.Fragment key={exp.id}>
              <CodeLine><Keyword>func</Keyword> <Punctuation>(</Punctuation><Variable>cv</Variable> <Punctuation>*</Punctuation><TypeName>CV</TypeName><Punctuation>)</Punctuation> <Plain>{toPascalCase(exp.company)}</Plain><Punctuation>()</Punctuation> <TypeName>Experience</TypeName> <Punctuation>{'{'}</Punctuation></CodeLine>
              <CodeLine indent={1}><Keyword>return</Keyword> <TypeName>Experience</TypeName><Punctuation>{'{'}</Punctuation></CodeLine>
              <CodeLine indent={2}><Plain>Company:  </Plain><StringLiteral value={exp.company} /><Punctuation>,</Punctuation></CodeLine>
              <CodeLine indent={2}><Plain>Role:     </Plain><StringLiteral value={exp.role} /><Punctuation>,</Punctuation></CodeLine>
              <CodeLine indent={2}><Plain>Duration: </Plain><StringLiteral value={duration} /><Punctuation>,</Punctuation></CodeLine>
              {exp.description && <CodeLine indent={2}><Comment>// {exp.description}</Comment></CodeLine>}
              {exp.technologies.length > 0 && (
                <>
                  <CodeLine indent={2}><Plain>Stack: </Plain><Punctuation>[]</Punctuation><TypeName>string</TypeName><Punctuation>{'{'}</Punctuation></CodeLine>
                  {exp.technologies.map((tech, i) => (
                    <CodeLine indent={3} key={i}><StringLiteral value={tech} /><Punctuation>,</Punctuation></CodeLine>
                  ))}
                  <CodeLine indent={2}><Punctuation>{'}'}</Punctuation><Punctuation>,</Punctuation></CodeLine>
                </>
              )}
              <CodeLine indent={1}><Punctuation>{'}'}</Punctuation></CodeLine>
              <CodeLine><Punctuation>{'}'}</Punctuation></CodeLine>
              <BlankLine />
            </React.Fragment>
          );
        })}
      </>
    );
  },
};

export default renderer;
