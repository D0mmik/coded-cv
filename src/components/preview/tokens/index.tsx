import type { ReactNode } from 'react';

export function Keyword({ children }: { children: ReactNode }) {
  return <span className="text-code-keyword">{children}</span>;
}

export function TypeName({ children }: { children: ReactNode }) {
  return <span className="text-code-type">{children}</span>;
}

export function StringLiteral({ value }: { value: string }) {
  return <span className="text-code-string">&quot;{value}&quot;</span>;
}

export function NumberLiteral({ value }: { value: number | string }) {
  return <span className="text-code-number">{value}</span>;
}

export function Comment({ children }: { children: ReactNode }) {
  return <span className="text-code-comment">{children}</span>;
}

export function Variable({ children }: { children: ReactNode }) {
  return <span className="text-code-variable">{children}</span>;
}

export function Method({ children }: { children: ReactNode }) {
  return <span className="text-code-method">{children}</span>;
}

export function Bracket({ children }: { children: ReactNode }) {
  return <span className="text-code-punctuation">{children}</span>;
}

export function Punctuation({ children }: { children: ReactNode }) {
  return <span className="text-code-punctuation">{children}</span>;
}

export function Decorator({ children }: { children: ReactNode }) {
  return <span className="text-code-decorator">{children}</span>;
}

export function Plain({ children }: { children: ReactNode }) {
  return <span className="text-code-plain">{children}</span>;
}

export function XmlTag({ children }: { children: ReactNode }) {
  return <span className="text-code-xml-tag">{children}</span>;
}
