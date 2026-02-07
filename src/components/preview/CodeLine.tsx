import type { ReactNode } from 'react';

interface CodeLineProps {
  children?: ReactNode;
  indent?: number;
}

const INDENT_STEP = 14;

export function CodeLine({ children, indent = 0 }: CodeLineProps) {
  return (
    <div className="code-line relative" style={{ paddingLeft: indent * INDENT_STEP }}>
      {Array.from({ length: indent }, (_, i) => (
        <span
          key={i}
          className="indent-guide"
          style={{ left: i * INDENT_STEP + 4 }}
        />
      ))}
      <span className="flex-1">{children}</span>
    </div>
  );
}

export function BlankLine() {
  return <div className="code-line"><span>&nbsp;</span></div>;
}
