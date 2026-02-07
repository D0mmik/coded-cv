'use client';

import { useState } from 'react';
import { useCV } from '@/lib/cv-context';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Skills } from '@/lib/types';

function TagInput({
  label,
  items,
  onAdd,
  onRemove,
  color,
}: {
  label: string;
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
  color: string;
}) {
  const [value, setValue] = useState('');

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault();
      onAdd(value.trim());
      setValue('');
    }
  }

  return (
    <div>
      <label className="text-xs font-mono text-muted-foreground mb-1 block">{label}</label>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type + Enter"
        className="font-mono text-sm bg-editor-surface border-editor-border mb-2"
      />
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <Badge
            key={i}
            variant="secondary"
            className={`font-mono text-xs cursor-pointer hover:opacity-70 ${color}`}
            onClick={() => onRemove(i)}
          >
            {item} <span className="ml-1 opacity-60">&times;</span>
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function SkillsSection() {
  const { data, dispatch } = useCV();

  function updateSkills(field: keyof Skills, items: string[]) {
    dispatch({ type: 'SET_SKILLS', payload: { [field]: items } });
  }

  function addTo(field: keyof Skills) {
    return (item: string) => {
      updateSkills(field, [...data.skills[field], item]);
    };
  }

  function removeFrom(field: keyof Skills) {
    return (index: number) => {
      updateSkills(field, data.skills[field].filter((_, i) => i !== index));
    };
  }

  return (
    <div className="space-y-4">
      <h3 className="font-mono text-code-comment text-sm">// Skills &amp; Tools</h3>

      <TagInput
        label="platforms"
        items={data.skills.platforms}
        onAdd={addTo('platforms')}
        onRemove={removeFrom('platforms')}
        color="bg-code-keyword/20 text-code-keyword"
      />

      <TagInput
        label="programmingLanguages"
        items={data.skills.programmingLanguages}
        onAdd={addTo('programmingLanguages')}
        onRemove={removeFrom('programmingLanguages')}
        color="bg-code-type/20 text-code-type"
      />

      <TagInput
        label="software"
        items={data.skills.software}
        onAdd={addTo('software')}
        onRemove={removeFrom('software')}
        color="bg-code-string/20 text-code-string"
      />
    </div>
  );
}

export function LanguagesSection() {
  const { data, dispatch } = useCV();
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');

  function addLanguage() {
    if (!name.trim()) return;
    dispatch({
      type: 'SET_LANGUAGES',
      payload: [...data.languages, { name: name.trim(), level: level.trim() || 'Basic' }],
    });
    setName('');
    setLevel('');
  }

  function removeLanguage(index: number) {
    dispatch({
      type: 'SET_LANGUAGES',
      payload: data.languages.filter((_, i) => i !== index),
    });
  }

  return (
    <div>
      <h3 className="font-mono text-code-comment text-sm mb-3">// Spoken Languages</h3>
      <div className="flex gap-2 mb-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Language"
          className="font-mono text-sm bg-editor-surface border-editor-border"
        />
        <Input
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          placeholder="Level"
          className="font-mono text-sm bg-editor-surface border-editor-border w-28"
        />
        <button
          onClick={addLanguage}
          className="shrink-0 px-3 font-mono text-sm text-code-type hover:text-code-type/70"
        >
          +add
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {data.languages.map((lang, i) => (
          <Badge
            key={i}
            variant="secondary"
            className="font-mono text-xs cursor-pointer hover:opacity-70 bg-code-comment/20 text-code-comment"
            onClick={() => removeLanguage(i)}
          >
            {lang.name}: {lang.level} <span className="ml-1 opacity-60">&times;</span>
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function PersonalitySection() {
  const { data, dispatch } = useCV();

  return (
    <TagInput
      label="// Personality Traits"
      items={data.personality}
      onAdd={(item) => dispatch({ type: 'SET_PERSONALITY', payload: [...data.personality, item] })}
      onRemove={(i) => dispatch({ type: 'SET_PERSONALITY', payload: data.personality.filter((_, idx) => idx !== i) })}
      color="bg-code-method/20 text-code-method"
    />
  );
}

export function MediaSection() {
  const { data, dispatch } = useCV();
  const [platform, setPlatform] = useState('');
  const [url, setUrl] = useState('');

  function addMedia() {
    if (!platform.trim() || !url.trim()) return;
    dispatch({
      type: 'SET_MEDIA',
      payload: [...data.media, { platform: platform.trim(), url: url.trim() }],
    });
    setPlatform('');
    setUrl('');
  }

  function removeMedia(index: number) {
    dispatch({
      type: 'SET_MEDIA',
      payload: data.media.filter((_, i) => i !== index),
    });
  }

  return (
    <div>
      <h3 className="font-mono text-code-comment text-sm mb-3">// Online Presence</h3>
      <div className="flex gap-2 mb-2">
        <Input
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          placeholder="Platform"
          className="font-mono text-sm bg-editor-surface border-editor-border w-28"
        />
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
          className="font-mono text-sm bg-editor-surface border-editor-border"
        />
        <button
          onClick={addMedia}
          className="shrink-0 px-3 font-mono text-sm text-code-type hover:text-code-type/70"
        >
          +add
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {data.media.map((m, i) => (
          <Badge
            key={i}
            variant="secondary"
            className="font-mono text-xs cursor-pointer hover:opacity-70 bg-code-variable/20 text-code-variable"
            onClick={() => removeMedia(i)}
          >
            {m.platform}: {m.url} <span className="ml-1 opacity-60">&times;</span>
          </Badge>
        ))}
      </div>
    </div>
  );
}
