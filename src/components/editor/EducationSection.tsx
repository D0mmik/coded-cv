'use client';

import { useCV } from '@/lib/cv-context';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function EducationSection() {
  const { data, dispatch } = useCV();

  function addEducation() {
    dispatch({
      type: 'ADD_EDUCATION',
      payload: {
        id: crypto.randomUUID(),
        school: '',
        degree: '',
        field: '',
        startYear: new Date().getFullYear(),
        endYear: null,
        description: '',
      },
    });
  }

  function updateEducation(id: string, field: string, value: string | number | null) {
    dispatch({ type: 'UPDATE_EDUCATION', payload: { id, [field]: value } });
  }

  function removeEducation(id: string) {
    dispatch({ type: 'REMOVE_EDUCATION', payload: id });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-code-comment text-sm">// Education</h3>
        <Button
          onClick={addEducation}
          variant="ghost"
          size="sm"
          className="font-mono text-xs text-code-type hover:text-code-type/70 hover:bg-code-type/10"
        >
          +add
        </Button>
      </div>

      {data.education.map((edu) => (
        <div key={edu.id} className="p-3 bg-editor-surface/50 rounded border border-editor-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-code-method">{edu.school || 'New Entry'}</span>
            <button
              onClick={() => removeEducation(edu.id)}
              className="font-mono text-xs text-destructive hover:underline"
            >
              delete
            </button>
          </div>
          <Input
            value={edu.school}
            onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
            placeholder="School name"
            className="font-mono text-sm bg-editor-surface border-editor-border"
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={edu.degree}
              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
              placeholder="Degree (Master, Bachelor)"
              className="font-mono text-sm bg-editor-surface border-editor-border"
            />
            <Input
              value={edu.field}
              onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
              placeholder="Field of study"
              className="font-mono text-sm bg-editor-surface border-editor-border"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              value={edu.startYear}
              onChange={(e) => updateEducation(edu.id, 'startYear', parseInt(e.target.value) || 0)}
              placeholder="Start year"
              className="font-mono text-sm bg-editor-surface border-editor-border"
            />
            <Input
              type="number"
              value={edu.endYear ?? ''}
              onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="End year (empty = present)"
              className="font-mono text-sm bg-editor-surface border-editor-border"
            />
          </div>
          <Textarea
            value={edu.description}
            onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
            placeholder="Description"
            rows={2}
            className="font-mono text-sm bg-editor-surface border-editor-border resize-none"
          />
        </div>
      ))}
    </div>
  );
}
