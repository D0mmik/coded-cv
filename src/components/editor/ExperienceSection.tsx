'use client';

import { useState } from 'react';
import { useCV } from '@/lib/cv-context';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function ExperienceSection() {
  const { data, dispatch } = useCV();

  function addExperience() {
    dispatch({
      type: 'ADD_EXPERIENCE',
      payload: {
        id: crypto.randomUUID(),
        company: '',
        role: '',
        startDate: '',
        endDate: null,
        description: '',
        technologies: [],
      },
    });
  }

  function updateExperience(id: string, field: string, value: string | string[] | null) {
    dispatch({ type: 'UPDATE_EXPERIENCE', payload: { id, [field]: value } });
  }

  function removeExperience(id: string) {
    dispatch({ type: 'REMOVE_EXPERIENCE', payload: id });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-code-comment text-sm">// Work Experience</h3>
        <Button
          onClick={addExperience}
          variant="ghost"
          size="sm"
          className="font-mono text-xs text-code-type hover:text-code-type/70 hover:bg-code-type/10"
        >
          +add
        </Button>
      </div>

      {data.experience.map((exp) => (
        <ExperienceEntry
          key={exp.id}
          exp={exp}
          onUpdate={(field, value) => updateExperience(exp.id, field, value)}
          onRemove={() => removeExperience(exp.id)}
        />
      ))}
    </div>
  );
}

function ExperienceEntry({
  exp,
  onUpdate,
  onRemove,
}: {
  exp: { id: string; company: string; role: string; startDate: string; endDate: string | null; description: string; technologies: string[] };
  onUpdate: (field: string, value: string | string[] | null) => void;
  onRemove: () => void;
}) {
  const [techInput, setTechInput] = useState('');

  function addTech() {
    if (!techInput.trim()) return;
    onUpdate('technologies', [...exp.technologies, techInput.trim()]);
    setTechInput('');
  }

  function removeTech(index: number) {
    onUpdate('technologies', exp.technologies.filter((_, i) => i !== index));
  }

  return (
    <div className="p-3 bg-editor-surface/50 rounded border border-editor-border space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-code-method">{exp.company || 'New Entry'}</span>
        <button onClick={onRemove} className="font-mono text-xs text-destructive hover:underline">
          delete
        </button>
      </div>
      <Input
        value={exp.company}
        onChange={(e) => onUpdate('company', e.target.value)}
        placeholder="Company name"
        className="font-mono text-sm bg-editor-surface border-editor-border"
      />
      <Input
        value={exp.role}
        onChange={(e) => onUpdate('role', e.target.value)}
        placeholder="Role / Position"
        className="font-mono text-sm bg-editor-surface border-editor-border"
      />
      <div className="grid grid-cols-2 gap-2">
        <Input
          value={exp.startDate}
          onChange={(e) => onUpdate('startDate', e.target.value)}
          placeholder="Start (MM/YYYY)"
          className="font-mono text-sm bg-editor-surface border-editor-border"
        />
        <Input
          value={exp.endDate ?? ''}
          onChange={(e) => onUpdate('endDate', e.target.value || null)}
          placeholder="End (empty = Present)"
          className="font-mono text-sm bg-editor-surface border-editor-border"
        />
      </div>
      <Textarea
        value={exp.description}
        onChange={(e) => onUpdate('description', e.target.value)}
        placeholder="What did you do?"
        rows={2}
        className="font-mono text-sm bg-editor-surface border-editor-border resize-none"
      />
      <div>
        <div className="flex gap-2 mb-2">
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTech();
              }
            }}
            placeholder="Tech stack (Enter to add)"
            className="font-mono text-sm bg-editor-surface border-editor-border"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {exp.technologies.map((tech, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="font-mono text-xs cursor-pointer hover:opacity-70 bg-code-type/20 text-code-type"
              onClick={() => removeTech(i)}
            >
              {tech} <span className="ml-1 opacity-60">&times;</span>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
