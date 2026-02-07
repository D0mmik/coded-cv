import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet, pdf, Font } from '@react-pdf/renderer';
import type { CVData, CodeLanguage } from './types';

Font.register({
  family: 'JetBrains Mono',
  src: '/fonts/JetBrainsMono-Regular.ttf',
});

const C = {
  bg: '#1e1e1e',
  keyword: '#569cd6',
  type: '#4ec9b0',
  string: '#ce9178',
  number: '#b5cea8',
  comment: '#6a9955',
  variable: '#9cdcfe',
  method: '#dcdcaa',
  decorator: '#d7ba7d',
  punctuation: '#d4d4d4',
  plain: '#d4d4d4',
  xmlTag: '#808080',
  guide: '#3e3e3e',
};

const FONT_SIZE = 9;
const LINE_HEIGHT = 1.35;
const INDENT = 10;

const s = StyleSheet.create({
  page: {
    backgroundColor: C.bg,
    padding: 30,
    fontFamily: 'JetBrains Mono',
    fontSize: FONT_SIZE,
    lineHeight: LINE_HEIGHT,
  },
  columns: { flexDirection: 'row', gap: 14 },
  left: { width: '33%' },
  right: { flex: 1 },
  line: {
    minHeight: FONT_SIZE * LINE_HEIGHT,
  },
  blank: { minHeight: FONT_SIZE * LINE_HEIGHT },
  photo: {
    width: 75,
    height: 90,
    objectFit: 'cover',
    marginVertical: 2,
    borderRadius: 3,
  },
  photoPlaceholder: {
    width: 75,
    height: 90,
    borderWidth: 1,
    borderColor: C.guide,
    borderStyle: 'dashed',
    borderRadius: 3,
    marginVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mb: { marginBottom: 6 },
});

type Token = { text: string; color: string };

const kw = (t: string): Token => ({ text: t, color: C.keyword });
const ty = (t: string): Token => ({ text: t, color: C.type });
const str = (v: string): Token => ({ text: `"${v}"`, color: C.string });
const num = (v: string | number): Token => ({ text: String(v), color: C.number });
const cmt = (t: string): Token => ({ text: t, color: C.comment });
const vr = (t: string): Token => ({ text: t, color: C.variable });
const mt = (t: string): Token => ({ text: t, color: C.method });
const dec = (t: string): Token => ({ text: t, color: C.decorator });
const pn = (t: string): Token => ({ text: t, color: C.punctuation });
const pl = (t: string): Token => ({ text: t, color: C.plain });
const xml = (t: string): Token => ({ text: t, color: C.xmlTag });

function Line({ tokens, indent = 0 }: { tokens: Token[]; indent?: number }) {
  return (
    <View style={[s.line, { paddingLeft: indent * INDENT, position: 'relative' }]}>
      {Array.from({ length: indent }, (_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: i * INDENT + 3,
            width: 0.5,
            borderLeft: '0.5px dashed #555',
          }}
        />
      ))}
      <Text>
        {tokens.map((t, i) => (
          <Text key={i} style={{ color: t.color }}>{t.text}</Text>
        ))}
      </Text>
    </View>
  );
}

function PyLine({ tokens, indent = 0 }: { tokens: Token[]; indent?: number }) {
  return (
    <View style={[s.line, { paddingLeft: indent * INDENT }]}>
      <Text>
        {tokens.map((t, i) => (
          <Text key={i} style={{ color: t.color }}>{t.text}</Text>
        ))}
      </Text>
    </View>
  );
}

function Blank() {
  return <View style={s.blank} />;
}


function strip(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function sanitize(str: string) {
  return strip(str).replace(/[^a-zA-Z0-9]/g, '');
}

function toCamel(str: string) {
  const words = strip(str).replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  return words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

function toPascal(str: string) {
  return strip(str).replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function toSnake(str: string) {
  return strip(str).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

interface PdfLangRenderer {
  summary: (data: CVData) => React.ReactNode;
  info: (data: CVData) => React.ReactNode;
  sidebar: (data: CVData) => React.ReactNode;
  education: (data: CVData) => React.ReactNode;
  experience: (data: CVData) => React.ReactNode;
}

function wrapSummary(text: string, maxLen: number): string[] {
  return text.match(new RegExp(`.{1,${maxLen}}(\\s|$)`, 'g'))?.map(l => l.trim()) || [text];
}

const csharpPdf: PdfLangRenderer = {
  summary: (data) => {
    if (!data.summary) return null;
    const lines = wrapSummary(data.summary, 55);
    return (
      <>
        <Line tokens={[cmt('/// '), xml('<summary>')]} />
        {lines.map((l, i) => <Line key={i} tokens={[cmt(`/// ${l}`)]} />)}
        <Line tokens={[cmt('/// '), xml('</summary>')]} />
      </>
    );
  },
  info: (data) => {
    const { personal } = data;
    const name = `${personal.firstName} ${personal.lastName}`.trim();
    return (
      <>
        <Line tokens={[kw('public '), kw('class '), ty('INFORMATION')]} />
        <Line tokens={[pn('{')]} />
        {name && <Line indent={1} tokens={[kw('public '), ty('string '), vr('NAME '), pn('= '), str(name), pn(';')]} />}
        {personal.title && <Line indent={1} tokens={[kw('public '), ty('string '), vr('TITLE '), pn('= '), str(personal.title), pn(';')]} />}
        {personal.email && <Line indent={1} tokens={[kw('public '), ty('string '), vr('EMAIL '), pn('= '), str(personal.email), pn(';')]} />}
        {personal.phone && <Line indent={1} tokens={[kw('public '), ty('int '), vr('PHONE '), pn('= '), num(personal.phone), pn(';')]} />}
        {personal.location && <Line indent={1} tokens={[kw('public '), ty('string[] '), vr('LOCATION '), pn('= { '), str(personal.location), pn(' };')]} />}
        {personal.age !== null && <Line indent={1} tokens={[kw('public '), ty('int '), vr('AGE '), pn('= '), num(personal.age), pn(';')]} />}
        <Line tokens={[pn('}')]} />
      </>
    );
  },
  sidebar: (data) => {
    const { skills, media, languages, personality } = data;
    const enumBlock = (name: string, items: string[]) => {
      if (!items.length) return null;
      return (
        <React.Fragment key={name}>
          <Line tokens={[kw('public '), kw('enum '), ty(name)]} />
          <Line tokens={[pn('{')]} />
          {items.map((it, i) => <Line key={i} indent={1} tokens={[vr(it), ...(i < items.length - 1 ? [pn(',')] : [])]} />)}
          <Line tokens={[pn('}')]} />
          <Blank />
        </React.Fragment>
      );
    };
    return (
      <>
        {enumBlock('PLATFORMS', skills.platforms)}
        {enumBlock('LANGUAGES', skills.programmingLanguages)}
        {enumBlock('SOFTWARE', skills.software)}
        {media.length > 0 && (
          <>
            <Line tokens={[kw('public '), kw('enum '), ty('MEDIA')]} />
            <Line tokens={[pn('{')]} />
            {media.map((m, i) => <Line key={i} indent={1} tokens={[vr(m.platform), ...(i < media.length - 1 ? [pn(',')] : []), cmt(` // ${m.url}`)]} />)}
            <Line tokens={[pn('}')]} />
            <Blank />
          </>
        )}
        {languages.length > 0 && (
          <>
            <Line tokens={[kw('public '), kw('enum '), ty('SPOKEN')]} />
            <Line tokens={[pn('{')]} />
            {languages.map((l, i) => <Line key={i} indent={1} tokens={[vr(l.name), ...(i < languages.length - 1 ? [pn(',')] : []), cmt(` // ${l.level}`)]} />)}
            <Line tokens={[pn('}')]} />
            <Blank />
          </>
        )}
        {personality.length > 0 && enumBlock('TRAITS', personality)}
      </>
    );
  },
  education: (data) => {
    if (!data.education.length) return null;
    return (
      <>
        <Line tokens={[kw('public '), kw('partial '), kw('class '), ty('EDUCATION'), pn(' : '), ty('HigherEducation')]} />
        <Line tokens={[pn('{')]} />
        {data.education.map((edu, i) => (
          <React.Fragment key={edu.id}>
            {i > 0 && <Blank />}
            <Line indent={1} tokens={[kw('private '), kw('void '), mt(sanitize(edu.school)), pn('()')]} />
            <Line indent={1} tokens={[pn('{')]} />
            <Line indent={2} tokens={[kw('var '), vr('_Level'), pn(' = '), str(edu.degree), pn(';')]} />
            <Line indent={2} tokens={[kw('var '), vr('_Period'), pn(' = '), mt('Range'), pn('('), num(edu.startYear), pn(', '), num(edu.endYear ?? 'Present'), pn(');')]} />
            {edu.field && <Line indent={2} tokens={[kw('var '), vr('_Field'), pn(' = '), str(edu.field), pn(';')]} />}
            {edu.description && <Line indent={2} tokens={[cmt(`// ${edu.description}`)]} />}
            <Line indent={1} tokens={[pn('}')]} />
          </React.Fragment>
        ))}
        <Line tokens={[pn('}')]} />
      </>
    );
  },
  experience: (data) => {
    if (!data.experience.length) return null;
    return (
      <>
        <Blank />
        <Line tokens={[kw('public '), kw('static '), kw('class '), ty('EXPERIENCE')]} />
        <Line tokens={[pn('{')]} />
        {data.experience.map((exp, i) => (
          <React.Fragment key={exp.id}>
            {i > 0 && <Blank />}
            <Line indent={1} tokens={[kw('public '), kw('void '), mt(sanitize(exp.company)), pn('()')]} />
            <Line indent={1} tokens={[pn('{')]} />
            <Line indent={2} tokens={[kw('var '), vr('_Duration'), pn(' = '), mt('Range'), pn('('), str(exp.startDate), pn(', '), str(exp.endDate ?? 'Present'), pn(');')]} />
            <Line indent={2} tokens={[kw('var '), vr('_Role'), pn(' = '), kw('new '), str(exp.role), pn(';')]} />
            {exp.technologies.length > 0 && (
              <Line indent={2} tokens={[kw('var '), vr('_Stack'), pn(' = '), kw('new '), ty('[] '), pn('{ '), ...exp.technologies.flatMap((t, ti) => ti < exp.technologies.length - 1 ? [str(t), pn(', ')] : [str(t)]), pn(' };')]} />
            )}
            {exp.description && <Line indent={2} tokens={[cmt(`/* ${exp.description} */`)]} />}
            <Line indent={1} tokens={[pn('}')]} />
          </React.Fragment>
        ))}
        <Line tokens={[pn('}')]} />
      </>
    );
  },
};

const pythonPdf: PdfLangRenderer = {
  summary: (data) => {
    if (!data.summary) return null;
    const lines = wrapSummary(data.summary, 55);
    return (
      <>
        <PyLine tokens={[str('""')]} />
        {lines.map((l, i) => <PyLine key={i} tokens={[pl(l)]} />)}
        <PyLine tokens={[str('""')]} />
      </>
    );
  },
  info: (data) => {
    const { personal } = data;
    const name = `${personal.firstName} ${personal.lastName}`.trim();
    return (
      <>
        <Blank />
        <PyLine tokens={[dec('@dataclass')]} />
        <PyLine tokens={[kw('class '), ty('PersonalInfo'), pn(':')]} />
        {name && <PyLine indent={1} tokens={[vr('name'), pn(': '), ty('str'), pn(' = '), str(name)]} />}
        {personal.title && <PyLine indent={1} tokens={[vr('title'), pn(': '), ty('str'), pn(' = '), str(personal.title)]} />}
        {personal.email && <PyLine indent={1} tokens={[vr('email'), pn(': '), ty('str'), pn(' = '), str(personal.email)]} />}
        {personal.phone && <PyLine indent={1} tokens={[vr('phone'), pn(': '), ty('str'), pn(' = '), str(personal.phone)]} />}
        {personal.location && <PyLine indent={1} tokens={[vr('location'), pn(': '), ty('str'), pn(' = '), str(personal.location)]} />}
        {personal.age !== null && <PyLine indent={1} tokens={[vr('age'), pn(': '), ty('int'), pn(' = '), num(personal.age)]} />}
      </>
    );
  },
  sidebar: (data) => {
    const { skills, media, languages, personality } = data;
    const listBlock = (name: string, items: string[]) => {
      if (!items.length) return null;
      return (
        <React.Fragment key={name}>
          <Blank />
          <PyLine tokens={[vr(name), pn(': '), ty('list'), pn('['), ty('str'), pn('] = [')]} />
          {items.map((it, i) => <PyLine key={i} indent={1} tokens={[str(it), pn(',')]} />)}
          <PyLine tokens={[pn(']')]} />
        </React.Fragment>
      );
    };
    return (
      <>
        {listBlock('PLATFORMS', skills.platforms)}
        {listBlock('LANGUAGES', skills.programmingLanguages)}
        {listBlock('SOFTWARE', skills.software)}
        {media.length > 0 && (
          <>
            <Blank />
            <PyLine tokens={[vr('LINKS'), pn(': '), ty('dict'), pn('['), ty('str'), pn(', '), ty('str'), pn('] = {')]} />
            {media.map((m, i) => <PyLine key={i} indent={1} tokens={[str(m.platform), pn(': '), str(m.url), pn(',')]} />)}
            <PyLine tokens={[pn('}')]} />
          </>
        )}
        {languages.length > 0 && (
          <>
            <Blank />
            <PyLine tokens={[vr('SPOKEN'), pn(' = {')]} />
            {languages.map((l, i) => <PyLine key={i} indent={1} tokens={[str(l.name), pn(': '), str(l.level), pn(',')]} />)}
            <PyLine tokens={[pn('}')]} />
          </>
        )}
        {listBlock('TRAITS', personality)}
      </>
    );
  },
  education: (data) => {
    if (!data.education.length) return null;
    return (
      <>
        <Blank />
        <PyLine tokens={[kw('class '), ty('Education'), pn(':')]} />
        {data.education.map((edu, i) => (
          <React.Fragment key={edu.id}>
            {i > 0 && <Blank />}
            <PyLine indent={1} tokens={[kw('def '), mt(toSnake(edu.school)), pn('('), vr('self'), pn(') -> '), ty('None'), pn(':')]} />
            <PyLine indent={2} tokens={[vr('level'), pn(' = '), str(edu.degree)]} />
            <PyLine indent={2} tokens={[vr('dates'), pn(' = '), mt('range'), pn('('), num(edu.startYear), pn(', '), num(edu.endYear ?? 'Present'), pn(')')]} />
            <PyLine indent={2} tokens={[vr('field'), pn(' = '), str(edu.field)]} />
            {edu.description && <PyLine indent={2} tokens={[cmt(`# ${edu.description}`)]} />}
          </React.Fragment>
        ))}
      </>
    );
  },
  experience: (data) => {
    if (!data.experience.length) return null;
    return (
      <>
        <Blank />
        <PyLine tokens={[kw('class '), ty('Experience'), pn(':')]} />
        {data.experience.map((exp, i) => (
          <React.Fragment key={exp.id}>
            {i > 0 && <Blank />}
            <PyLine indent={1} tokens={[kw('def '), mt(toSnake(exp.company)), pn('('), vr('self'), pn(') -> '), ty('None'), pn(':')]} />
            <PyLine indent={2} tokens={[vr('duration'), pn(' = ('), str(exp.startDate), pn(', '), str(exp.endDate ?? 'Present'), pn(')')]} />
            <PyLine indent={2} tokens={[vr('role'), pn(' = '), str(exp.role)]} />
            {exp.description && <PyLine indent={2} tokens={[cmt(`# ${exp.description}`)]} />}
            {exp.technologies.length > 0 && (
              <>
                <PyLine indent={2} tokens={[vr('stack'), pn(' = [')]} />
                {exp.technologies.map((t, ti) => <PyLine key={ti} indent={3} tokens={[str(t), pn(',')]} />)}
                <PyLine indent={2} tokens={[pn(']')]} />
              </>
            )}
          </React.Fragment>
        ))}
      </>
    );
  },
};

const typescriptPdf: PdfLangRenderer = {
  summary: (data) => {
    if (!data.summary) return null;
    const lines = wrapSummary(data.summary, 55);
    return (
      <>
        <Line tokens={[cmt('/**')]} />
        {lines.map((l, i) => <Line key={i} tokens={[cmt(` * ${l}`)]} />)}
        <Line tokens={[cmt(' */')]} />
      </>
    );
  },
  info: (data) => {
    const { personal } = data;
    const name = `${personal.firstName} ${personal.lastName}`.trim();
    return (
      <>
        <Line tokens={[kw('interface '), ty('PersonalInfo'), pn(' {')]} />
        <Line indent={1} tokens={[vr('name'), pn(': '), ty('string'), pn(';')]} />
        <Line indent={1} tokens={[vr('title'), pn(': '), ty('string'), pn(';')]} />
        <Line indent={1} tokens={[vr('email'), pn(': '), ty('string'), pn(';')]} />
        <Line indent={1} tokens={[vr('phone'), pn(': '), ty('string'), pn(';')]} />
        <Line indent={1} tokens={[vr('location'), pn(': '), ty('string'), pn(';')]} />
        {personal.age !== null && <Line indent={1} tokens={[vr('age'), pn(': '), ty('number'), pn(';')]} />}
        <Line tokens={[pn('}')]} />
        <Blank />
        <Line tokens={[kw('const '), vr('info'), pn(': '), ty('PersonalInfo'), pn(' = {')]} />
        {name && <Line indent={1} tokens={[vr('name'), pn(': '), str(name), pn(',')]} />}
        {personal.title && <Line indent={1} tokens={[vr('title'), pn(': '), str(personal.title), pn(',')]} />}
        {personal.email && <Line indent={1} tokens={[vr('email'), pn(': '), str(personal.email), pn(',')]} />}
        {personal.phone && <Line indent={1} tokens={[vr('phone'), pn(': '), str(personal.phone), pn(',')]} />}
        {personal.location && <Line indent={1} tokens={[vr('location'), pn(': '), str(personal.location), pn(',')]} />}
        {personal.age !== null && <Line indent={1} tokens={[vr('age'), pn(': '), num(personal.age), pn(',')]} />}
        <Line tokens={[pn('};')]} />
      </>
    );
  },
  sidebar: (data) => {
    const { skills, media, languages, personality } = data;
    const arrBlock = (name: string, items: string[]) => {
      if (!items.length) return null;
      return (
        <React.Fragment key={name}>
          <Blank />
          <Line tokens={[kw('const '), vr(name), pn(' = [')]} />
          {items.map((it, i) => <Line key={i} indent={1} tokens={[str(it), pn(',')]} />)}
          <Line tokens={[pn('];')]} />
        </React.Fragment>
      );
    };
    return (
      <>
        {arrBlock('platforms', skills.platforms)}
        {arrBlock('languages', skills.programmingLanguages)}
        {arrBlock('software', skills.software)}
        {media.length > 0 && (
          <>
            <Blank />
            <Line tokens={[kw('const '), vr('links'), pn(' = {')]} />
            {media.map((m, i) => <Line key={i} indent={1} tokens={[vr(toCamel(m.platform)), pn(': '), str(m.url), pn(',')]} />)}
            <Line tokens={[pn('};')]} />
          </>
        )}
        {languages.length > 0 && (
          <>
            <Blank />
            <Line tokens={[kw('const '), vr('spoken'), pn(' = {')]} />
            {languages.map((l, i) => <Line key={i} indent={1} tokens={[vr(toCamel(l.name)), pn(': '), str(l.level), pn(',')]} />)}
            <Line tokens={[pn('};')]} />
          </>
        )}
        {arrBlock('traits', personality)}
      </>
    );
  },
  education: (data) => {
    if (!data.education.length) return null;
    return (
      <>
        <Blank />
        <Line tokens={[kw('class '), ty('Education'), pn(' {')]} />
        {data.education.map((edu, i) => (
          <React.Fragment key={edu.id}>
            {i > 0 && <Blank />}
            <Line indent={1} tokens={[mt(toCamel(edu.school)), pn('(): '), ty('void'), pn(' {')]} />
            <Line indent={2} tokens={[kw('const '), vr('level'), pn(' = '), str(edu.degree), pn(';')]} />
            <Line indent={2} tokens={[kw('const '), vr('period'), pn(' = ['), num(edu.startYear), pn(', '), num(edu.endYear ?? 'Present'), pn('] '), kw('as '), kw('const'), pn(';')]} />
            <Line indent={2} tokens={[kw('const '), vr('field'), pn(' = '), str(edu.field), pn(';')]} />
            {edu.description && <Line indent={2} tokens={[cmt(`// ${edu.description}`)]} />}
            <Line indent={1} tokens={[pn('}')]} />
          </React.Fragment>
        ))}
        <Line tokens={[pn('}')]} />
      </>
    );
  },
  experience: (data) => {
    if (!data.experience.length) return null;
    return (
      <>
        <Blank />
        <Line tokens={[kw('class '), ty('Experience'), kw(' implements '), ty('Professional'), pn(' {')]} />
        {data.experience.map((exp, i) => (
          <React.Fragment key={exp.id}>
            {i > 0 && <Blank />}
            <Line indent={1} tokens={[mt(toCamel(exp.company)), pn('(): '), ty('void'), pn(' {')]} />
            <Line indent={2} tokens={[kw('const '), vr('duration'), pn(' = ['), str(exp.startDate), pn(', '), str(exp.endDate ?? 'Present'), pn('];')]} />
            <Line indent={2} tokens={[kw('const '), vr('role'), pn(' = '), str(exp.role), pn(';')]} />
            {exp.description && <Line indent={2} tokens={[cmt(`// ${exp.description}`)]} />}
            {exp.technologies.length > 0 && (
              <Line indent={2} tokens={[kw('const '), vr('stack'), pn(': '), ty('string'), pn('[] = ['), ...exp.technologies.flatMap((t, ti) => ti < exp.technologies.length - 1 ? [str(t), pn(', ')] : [str(t)]), pn('];')]} />
            )}
            <Line indent={1} tokens={[pn('}')]} />
          </React.Fragment>
        ))}
        <Line tokens={[pn('}')]} />
      </>
    );
  },
};

const goPdf: PdfLangRenderer = {
  summary: (data) => {
    if (!data.summary) return null;
    const lines = wrapSummary(data.summary, 50);
    return (
      <>
        {lines.map((l, i) => <Line key={i} tokens={[cmt(`// ${l}`)]} />)}
        <Line tokens={[kw('package '), pl('cv')]} />
        <Blank />
      </>
    );
  },
  info: (data) => {
    const { personal } = data;
    const name = `${personal.firstName} ${personal.lastName}`.trim();
    return (
      <>
        <Line tokens={[kw('type '), ty('PersonalInfo'), kw(' struct'), pn(' {')]} />
        <Line indent={1} tokens={[pl('Name     '), ty('string')]} />
        <Line indent={1} tokens={[pl('Title    '), ty('string')]} />
        <Line indent={1} tokens={[pl('Email    '), ty('string')]} />
        <Line indent={1} tokens={[pl('Phone    '), ty('string')]} />
        <Line indent={1} tokens={[pl('Location '), ty('string')]} />
        {personal.age !== null && <Line indent={1} tokens={[pl('Age      '), ty('int')]} />}
        <Line tokens={[pn('}')]} />
        <Blank />
        <Line tokens={[kw('var '), vr('info'), pn(' = '), ty('PersonalInfo'), pn('{')]} />
        {name && <Line indent={1} tokens={[pl('Name:     '), str(name), pn(',')]} />}
        {personal.title && <Line indent={1} tokens={[pl('Title:    '), str(personal.title), pn(',')]} />}
        {personal.email && <Line indent={1} tokens={[pl('Email:    '), str(personal.email), pn(',')]} />}
        {personal.phone && <Line indent={1} tokens={[pl('Phone:    '), str(personal.phone), pn(',')]} />}
        {personal.location && <Line indent={1} tokens={[pl('Location: '), str(personal.location), pn(',')]} />}
        {personal.age !== null && <Line indent={1} tokens={[pl('Age:      '), num(personal.age), pn(',')]} />}
        <Line tokens={[pn('}')]} />
        <Blank />
      </>
    );
  },
  sidebar: (data) => {
    const { skills, media, languages, personality } = data;
    const sliceBlock = (name: string, items: string[]) => {
      if (!items.length) return null;
      return (
        <React.Fragment key={name}>
          <Line tokens={[kw('var '), vr(name), pn(' = []'), ty('string'), pn('{')]} />
          {items.map((it, i) => <Line key={i} indent={1} tokens={[str(it), pn(',')]} />)}
          <Line tokens={[pn('}')]} />
          <Blank />
        </React.Fragment>
      );
    };
    return (
      <>
        {sliceBlock('platforms', skills.platforms)}
        {sliceBlock('languages', skills.programmingLanguages)}
        {sliceBlock('software', skills.software)}
        {media.length > 0 && (
          <>
            <Line tokens={[kw('var '), vr('links'), pn(' = '), kw('map'), pn('['), ty('string'), pn(']'), ty('string'), pn('{')]} />
            {media.map((m, i) => <Line key={i} indent={1} tokens={[str(m.platform), pn(': '), str(m.url), pn(',')]} />)}
            <Line tokens={[pn('}')]} />
            <Blank />
          </>
        )}
        {languages.length > 0 && (
          <>
            <Line tokens={[kw('var '), vr('spoken'), pn(' = '), kw('map'), pn('['), ty('string'), pn(']'), ty('string'), pn('{')]} />
            {languages.map((l, i) => <Line key={i} indent={1} tokens={[str(l.name), pn(': '), str(l.level), pn(',')]} />)}
            <Line tokens={[pn('}')]} />
            <Blank />
          </>
        )}
        {sliceBlock('traits', personality)}
      </>
    );
  },
  education: (data) => {
    if (!data.education.length) return null;
    return (
      <>
        {data.education.map((edu) => {
          const years = edu.endYear ? `${edu.startYear} - ${edu.endYear}` : `${edu.startYear} - Present`;
          return (
            <React.Fragment key={edu.id}>
              <Line tokens={[kw('func '), pn('('), vr('cv'), pn(' *'), ty('CV'), pn(') '), pl(toPascal(edu.school)), pn('() '), ty('Education'), pn(' {')]} />
              <Line indent={1} tokens={[kw('return '), ty('Education'), pn('{')]} />
              <Line indent={2} tokens={[pl('School: '), str(edu.school), pn(',')]} />
              <Line indent={2} tokens={[pl('Degree: '), str(edu.degree), pn(',')]} />
              {edu.field && <Line indent={2} tokens={[pl('Field:  '), str(edu.field), pn(',')]} />}
              <Line indent={2} tokens={[pl('Years:  '), str(years), pn(',')]} />
              {edu.description && <Line indent={2} tokens={[cmt(`// ${edu.description}`)]} />}
              <Line indent={1} tokens={[pn('}')]} />
              <Line tokens={[pn('}')]} />
              <Blank />
            </React.Fragment>
          );
        })}
      </>
    );
  },
  experience: (data) => {
    if (!data.experience.length) return null;
    return (
      <>
        {data.experience.map((exp) => {
          const dur = exp.endDate ? `${exp.startDate} - ${exp.endDate}` : `${exp.startDate} - Present`;
          return (
            <React.Fragment key={exp.id}>
              <Line tokens={[kw('func '), pn('('), vr('cv'), pn(' *'), ty('CV'), pn(') '), pl(toPascal(exp.company)), pn('() '), ty('Experience'), pn(' {')]} />
              <Line indent={1} tokens={[kw('return '), ty('Experience'), pn('{')]} />
              <Line indent={2} tokens={[pl('Company:  '), str(exp.company), pn(',')]} />
              <Line indent={2} tokens={[pl('Role:     '), str(exp.role), pn(',')]} />
              <Line indent={2} tokens={[pl('Duration: '), str(dur), pn(',')]} />
              {exp.description && <Line indent={2} tokens={[cmt(`// ${exp.description}`)]} />}
              {exp.technologies.length > 0 && (
                <>
                  <Line indent={2} tokens={[pl('Stack: []'), ty('string'), pn('{')]} />
                  {exp.technologies.map((t, i) => <Line key={i} indent={3} tokens={[str(t), pn(',')]} />)}
                  <Line indent={2} tokens={[pn('},')]} />
                </>
              )}
              <Line indent={1} tokens={[pn('}')]} />
              <Line tokens={[pn('}')]} />
              <Blank />
            </React.Fragment>
          );
        })}
      </>
    );
  },
};

const rustPdf: PdfLangRenderer = {
  summary: (data) => {
    if (!data.summary) return null;
    const lines = wrapSummary(data.summary, 50);
    return <>{lines.map((l, i) => <Line key={i} tokens={[cmt(`/// ${l}`)]} />)}</>;
  },
  info: (data) => {
    const { personal } = data;
    const name = `${personal.firstName} ${personal.lastName}`.trim();
    return (
      <>
        <Blank />
        <Line tokens={[dec('#[derive(Debug, Clone)]')]} />
        <Line tokens={[kw('struct '), ty('PersonalInfo'), pn(' {')]} />
        <Line indent={1} tokens={[vr('name'), pn(': '), ty('String'), pn(',')]} />
        <Line indent={1} tokens={[vr('title'), pn(': '), ty('String'), pn(',')]} />
        <Line indent={1} tokens={[vr('email'), pn(': '), ty('String'), pn(',')]} />
        <Line indent={1} tokens={[vr('phone'), pn(': '), ty('String'), pn(',')]} />
        <Line indent={1} tokens={[vr('location'), pn(': '), ty('String'), pn(',')]} />
        {personal.age !== null && <Line indent={1} tokens={[vr('age'), pn(': '), ty('u32'), pn(',')]} />}
        <Line tokens={[pn('}')]} />
        <Blank />
        <Line tokens={[kw('impl '), ty('PersonalInfo'), pn(' {')]} />
        <Line indent={1} tokens={[kw('fn '), mt('new'), pn('() -> '), ty('Self'), pn(' {')]} />
        <Line indent={2} tokens={[ty('Self'), pn(' {')]} />
        {name && <Line indent={3} tokens={[vr('name'), pn(': '), str(name), pn('.into(),')]} />}
        {personal.title && <Line indent={3} tokens={[vr('title'), pn(': '), str(personal.title), pn('.into(),')]} />}
        {personal.email && <Line indent={3} tokens={[vr('email'), pn(': '), str(personal.email), pn('.into(),')]} />}
        {personal.phone && <Line indent={3} tokens={[vr('phone'), pn(': '), str(personal.phone), pn('.into(),')]} />}
        {personal.location && <Line indent={3} tokens={[vr('location'), pn(': '), str(personal.location), pn('.into(),')]} />}
        {personal.age !== null && <Line indent={3} tokens={[vr('age'), pn(': '), num(personal.age), pn(',')]} />}
        <Line indent={2} tokens={[pn('}')]} />
        <Line indent={1} tokens={[pn('}')]} />
        <Line tokens={[pn('}')]} />
      </>
    );
  },
  sidebar: (data) => {
    const { skills, media, languages, personality } = data;
    const constBlock = (name: string, items: string[]) => {
      if (!items.length) return null;
      return (
        <React.Fragment key={name}>
          <Blank />
          <Line tokens={[kw('const '), vr(name), pn(': &[&'), ty('str'), pn('] = &[')]} />
          {items.map((it, i) => <Line key={i} indent={1} tokens={[str(it), pn(',')]} />)}
          <Line tokens={[pn('];')]} />
        </React.Fragment>
      );
    };
    return (
      <>
        {constBlock('PLATFORMS', skills.platforms)}
        {constBlock('LANGUAGES', skills.programmingLanguages)}
        {constBlock('SOFTWARE', skills.software)}
        {media.length > 0 && (
          <>
            <Blank />
            <Line tokens={[kw('fn '), mt('links'), pn('() -> '), ty('Links'), pn(' {')]} />
            <Line indent={1} tokens={[ty('HashMap'), pn('::'), mt('from'), pn('([')]} />
            {media.map((m, i) => <Line key={i} indent={2} tokens={[pn('('), str(m.platform), pn(', '), str(m.url), pn('),')]} />)}
            <Line indent={1} tokens={[pn('])')]} />
            <Line tokens={[pn('}')]} />
          </>
        )}
        {languages.length > 0 && (
          <>
            <Blank />
            <Line tokens={[kw('enum '), ty('Level'), pn(' { '), ...languages.flatMap((l, i) => i < languages.length - 1 ? [vr(l.level), pn(', ')] : [vr(l.level)]), pn(' }')]} />
          </>
        )}
        {constBlock('TRAITS', personality)}
      </>
    );
  },
  education: (data) => {
    if (!data.education.length) return null;
    return (
      <>
        <Blank />
        <Line tokens={[kw('impl '), ty('CV'), pn(' {')]} />
        {data.education.map((edu, i) => {
          const years = edu.endYear ? `${edu.startYear}-${edu.endYear}` : `${edu.startYear}-present`;
          return (
            <React.Fragment key={edu.id}>
              {i > 0 && <Blank />}
              <Line indent={1} tokens={[kw('fn '), mt(toSnake(edu.school)), pn('(&'), vr('self'), pn(') -> '), ty('Education'), pn(' {')]} />
              <Line indent={2} tokens={[ty('Education'), pn(' {')]} />
              <Line indent={3} tokens={[vr('school'), pn(': '), str(edu.school), pn('.into(),')]} />
              <Line indent={3} tokens={[vr('degree'), pn(': '), str(edu.degree), pn('.into(),')]} />
              {edu.field && <Line indent={3} tokens={[vr('field'), pn(': '), str(edu.field), pn('.into(),')]} />}
              <Line indent={3} tokens={[vr('years'), pn(': '), str(years), pn('.into(),')]} />
              {edu.description && <Line indent={3} tokens={[cmt(`// ${edu.description}`)]} />}
              <Line indent={2} tokens={[pn('}')]} />
              <Line indent={1} tokens={[pn('}')]} />
            </React.Fragment>
          );
        })}
        <Line tokens={[pn('}')]} />
      </>
    );
  },
  experience: (data) => {
    if (!data.experience.length) return null;
    return (
      <>
        <Blank />
        <Line tokens={[kw('impl '), ty('Professional'), kw(' for '), ty('CV'), pn(' {')]} />
        {data.experience.map((exp, i) => {
          const dur = exp.endDate ? `${exp.startDate} - ${exp.endDate}` : `${exp.startDate} - present`;
          return (
            <React.Fragment key={exp.id}>
              {i > 0 && <Blank />}
              <Line indent={1} tokens={[kw('fn '), mt(toSnake(exp.company)), pn('(&'), vr('self'), pn(') -> '), ty('Experience'), pn(' {')]} />
              <Line indent={2} tokens={[ty('Experience'), pn(' {')]} />
              <Line indent={3} tokens={[vr('company'), pn(': '), str(exp.company), pn('.into(),')]} />
              <Line indent={3} tokens={[vr('role'), pn(': '), str(exp.role), pn('.into(),')]} />
              <Line indent={3} tokens={[vr('duration'), pn(': '), str(dur), pn('.into(),')]} />
              {exp.description && <Line indent={3} tokens={[cmt(`// ${exp.description}`)]} />}
              {exp.technologies.length > 0 && (
                <Line indent={3} tokens={[vr('stack'), pn(': '), kw('vec!'), pn('['), ...exp.technologies.flatMap((t, ti) => ti < exp.technologies.length - 1 ? [str(t), pn(', ')] : [str(t)]), pn('],')]} />
              )}
              <Line indent={2} tokens={[pn('}')]} />
              <Line indent={1} tokens={[pn('}')]} />
            </React.Fragment>
          );
        })}
        <Line tokens={[pn('}')]} />
      </>
    );
  },
};

const javaPdf: PdfLangRenderer = {
  summary: typescriptPdf.summary,
  info: (data) => {
    const { personal } = data;
    const name = `${personal.firstName} ${personal.lastName}`.trim();
    return (
      <>
        <Line tokens={[kw('public '), kw('class '), ty('Information'), pn(' {')]} />
        {name && <><Line indent={1} tokens={[dec('@Getter')]} /><Line indent={1} tokens={[kw('private '), ty('String '), vr('name'), pn(' = '), str(name), pn(';')]} /></>}
        {personal.title && <Line indent={1} tokens={[kw('private '), ty('String '), vr('title'), pn(' = '), str(personal.title), pn(';')]} />}
        {personal.email && <Line indent={1} tokens={[kw('private '), ty('String '), vr('email'), pn(' = '), str(personal.email), pn(';')]} />}
        {personal.phone && <Line indent={1} tokens={[kw('private '), ty('String '), vr('phone'), pn(' = '), str(personal.phone), pn(';')]} />}
        {personal.location && <Line indent={1} tokens={[kw('private '), ty('String '), vr('location'), pn(' = '), str(personal.location), pn(';')]} />}
        {personal.age !== null && <Line indent={1} tokens={[kw('private '), ty('int '), vr('age'), pn(' = '), num(personal.age), pn(';')]} />}
        <Line tokens={[pn('}')]} />
      </>
    );
  },
  sidebar: (data) => {
    const { skills, media, languages, personality } = data;
    const enumBlock = (name: string, items: string[]) => {
      if (!items.length) return null;
      return (
        <React.Fragment key={name}>
          <Blank />
          <Line tokens={[kw('public '), kw('enum '), ty(name), pn(' {')]} />
          {items.map((it, i) => <Line key={i} indent={1} tokens={[vr(it.toUpperCase().replace(/[^A-Z0-9]/g, '_')), ...(i < items.length - 1 ? [pn(',')] : [])]} />)}
          <Line tokens={[pn('}')]} />
        </React.Fragment>
      );
    };
    return (
      <>
        {enumBlock('Platforms', skills.platforms)}
        {enumBlock('Languages', skills.programmingLanguages)}
        {enumBlock('Software', skills.software)}
        {media.length > 0 && (
          <>
            <Blank />
            <Line tokens={[kw('var '), vr('links'), pn(' = '), ty('Map'), pn('.'), mt('of'), pn('(')]} />
            {media.map((m, i) => <Line key={i} indent={1} tokens={[str(m.platform), pn(', '), str(m.url), ...(i < media.length - 1 ? [pn(',')] : [])]} />)}
            <Line tokens={[pn(');')]} />
          </>
        )}
        {languages.length > 0 && (
          <>
            <Blank />
            <Line tokens={[kw('var '), vr('spoken'), pn(' = '), ty('List'), pn('.'), mt('of'), pn('(')]} />
            {languages.map((l, i) => <Line key={i} indent={1} tokens={[str(`${l.name}: ${l.level}`), ...(i < languages.length - 1 ? [pn(',')] : [])]} />)}
            <Line tokens={[pn(');')]} />
          </>
        )}
        {personality.length > 0 && enumBlock('Personality', personality)}
      </>
    );
  },
  education: (data) => {
    if (!data.education.length) return null;
    return (
      <>
        <Blank />
        <Line tokens={[kw('public '), kw('class '), ty('Education'), kw(' extends '), ty('AcademicRecord'), pn(' {')]} />
        {data.education.map((edu, i) => {
          const years = edu.endYear ? `${edu.startYear}-${edu.endYear}` : `${edu.startYear}-Present`;
          return (
            <React.Fragment key={edu.id}>
              {i > 0 && <Blank />}
              <Line indent={1} tokens={[kw('public '), kw('void '), mt(toCamel(edu.school)), pn('() {')]} />
              <Line indent={2} tokens={[ty('String '), vr('degree'), pn(' = '), str(edu.degree), pn(';')]} />
              <Line indent={2} tokens={[ty('String '), vr('period'), pn(' = '), str(years), pn(';')]} />
              {edu.field && <Line indent={2} tokens={[ty('String '), vr('field'), pn(' = '), str(edu.field), pn(';')]} />}
              {edu.description && <Line indent={2} tokens={[cmt(`// ${edu.description}`)]} />}
              <Line indent={1} tokens={[pn('}')]} />
            </React.Fragment>
          );
        })}
        <Line tokens={[pn('}')]} />
      </>
    );
  },
  experience: (data) => {
    if (!data.experience.length) return null;
    return (
      <>
        <Blank />
        <Line tokens={[kw('public '), kw('final '), kw('class '), ty('Experience'), kw(' implements '), ty('Professional'), pn(' {')]} />
        {data.experience.map((exp, i) => (
          <React.Fragment key={exp.id}>
            {i > 0 && <Blank />}
            <Line indent={1} tokens={[dec('@Override')]} />
            <Line indent={1} tokens={[kw('public '), kw('void '), mt(toCamel(exp.company)), pn('() {')]} />
            <Line indent={2} tokens={[ty('String '), vr('duration'), pn(' = '), str(`${exp.startDate} - ${exp.endDate ?? 'Present'}`), pn(';')]} />
            <Line indent={2} tokens={[ty('String '), vr('role'), pn(' = '), str(exp.role), pn(';')]} />
            {exp.description && <Line indent={2} tokens={[cmt(`// ${exp.description}`)]} />}
            {exp.technologies.length > 0 && (
              <Line indent={2} tokens={[ty('List'), pn('<'), ty('String'), pn('> '), vr('stack'), pn(' = '), ty('List'), pn('.'), mt('of'), pn('('), ...exp.technologies.flatMap((t, ti) => ti < exp.technologies.length - 1 ? [str(t), pn(', ')] : [str(t)]), pn(');')]} />
            )}
            <Line indent={1} tokens={[pn('}')]} />
          </React.Fragment>
        ))}
        <Line tokens={[pn('}')]} />
      </>
    );
  },
};

const pdfRenderers: Record<CodeLanguage, PdfLangRenderer> = {
  csharp: csharpPdf,
  python: pythonPdf,
  typescript: typescriptPdf,
  go: goPdf,
  rust: rustPdf,
  java: javaPdf,
};

function CVDocument({ data, photoDataUrl }: { data: CVData; photoDataUrl?: string | null }) {
  const r = pdfRenderers[data.codeLanguage];
  const photoSrc = photoDataUrl || data.photo || null;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.columns}>
          <View style={s.left}>
            <View style={s.mb}>
              <Text style={{ color: C.xmlTag }}>&lt;img&gt;</Text>
              {photoSrc ? (
                <Image src={photoSrc} style={s.photo} cache={false} />
              ) : (
                <View style={s.photoPlaceholder}>
                  <Text style={{ color: C.comment, fontSize: 6 }}>// photo</Text>
                </View>
              )}
              <Text style={{ color: C.xmlTag }}>&lt;/img&gt;</Text>
            </View>
            {r.sidebar(data)}
          </View>

          <View style={s.right}>
            {r.summary(data)}
            {r.info(data)}
            {r.education(data)}
            {r.experience(data)}
          </View>
        </View>
      </Page>
    </Document>
  );
}


async function toDataUrl(url: string): Promise<string | null> {
  if (!url || url.startsWith('data:') || url.startsWith('blob:')) return url;
  try {
    const fetchUrl = url.startsWith('/') ? url : `/api/image-proxy?url=${encodeURIComponent(url)}`;
    const res = await fetch(fetchUrl);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    const mime = res.headers.get('content-type') || 'image/jpeg';
    return `data:${mime};base64,${btoa(binary)}`;
  } catch {
    return null;
  }
}

async function generatePdfBlob(data: CVData): Promise<Blob> {
  const photoDataUrl = data.photo ? await toDataUrl(data.photo) : null;
  return pdf(<CVDocument data={data} photoDataUrl={photoDataUrl} />).toBlob();
}

export async function exportToPDF(data: CVData, fileName: string): Promise<void> {
  const blob = await generatePdfBlob(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export async function cvToImage(data: CVData): Promise<Blob> {
  const pdfBlob = await generatePdfBlob(data);
  const res = await fetch('/api/pdf-to-png', { method: 'POST', body: pdfBlob });
  if (!res.ok) throw new Error('PDF to PNG conversion failed');
  return res.blob();
}
