'use client';

import { useCV } from '@/lib/cv-context';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function PersonalInfoSection() {
  const { data, dispatch } = useCV();
  const { personal } = data;

  function updateField(field: string, value: string | number | null) {
    dispatch({ type: 'SET_PERSONAL', payload: { [field]: value } });
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      dispatch({ type: 'SET_PHOTO', payload: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-3">
      <h3 className="font-mono text-code-comment text-sm">// Personal Information</h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-mono text-muted-foreground mb-1 block">firstName</label>
          <Input
            value={personal.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            placeholder="Alex"
            className="font-mono text-sm bg-editor-surface border-editor-border"
          />
        </div>
        <div>
          <label className="text-xs font-mono text-muted-foreground mb-1 block">lastName</label>
          <Input
            value={personal.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            placeholder="Chen"
            className="font-mono text-sm bg-editor-surface border-editor-border"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-mono text-muted-foreground mb-1 block">title</label>
        <Input
          value={personal.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Full Stack Developer"
          className="font-mono text-sm bg-editor-surface border-editor-border"
        />
      </div>

      <div>
        <label className="text-xs font-mono text-muted-foreground mb-1 block">email</label>
        <Input
          value={personal.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="alex@dev.io"
          className="font-mono text-sm bg-editor-surface border-editor-border"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-mono text-muted-foreground mb-1 block">phone</label>
          <Input
            value={personal.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+1 555 0142"
            className="font-mono text-sm bg-editor-surface border-editor-border"
          />
        </div>
        <div>
          <label className="text-xs font-mono text-muted-foreground mb-1 block">age</label>
          <Input
            type="number"
            value={personal.age ?? ''}
            onChange={(e) => updateField('age', e.target.value ? parseInt(e.target.value) : null)}
            placeholder="28"
            className="font-mono text-sm bg-editor-surface border-editor-border"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-mono text-muted-foreground mb-1 block">location</label>
        <Input
          value={personal.location}
          onChange={(e) => updateField('location', e.target.value)}
          placeholder="San Francisco, CA"
          className="font-mono text-sm bg-editor-surface border-editor-border"
        />
      </div>

      <div>
        <label className="text-xs font-mono text-muted-foreground mb-1 block">summary</label>
        <Textarea
          value={data.summary}
          onChange={(e) => dispatch({ type: 'SET_SUMMARY', payload: e.target.value })}
          placeholder="Passionate developer with..."
          rows={3}
          className="font-mono text-sm bg-editor-surface border-editor-border resize-none"
        />
      </div>

      <div>
        <label className="text-xs font-mono text-muted-foreground mb-1 block">photo</label>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="font-mono text-sm bg-editor-surface border-editor-border file:bg-code-keyword/20 file:text-code-keyword file:border-0 file:font-mono file:text-xs"
            />
            {data.photo && (
              <button
                onClick={() => dispatch({ type: 'SET_PHOTO', payload: null })}
                className="text-xs font-mono text-destructive hover:underline shrink-0"
              >
                remove
              </button>
            )}
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground mb-1 block">or paste image URL</label>
            <Input
              value={data.photo && !data.photo.startsWith('data:') ? data.photo : ''}
              onChange={(e) => dispatch({ type: 'SET_PHOTO', payload: e.target.value || null })}
              placeholder="https://example.com/photo.jpg"
              className="font-mono text-sm bg-editor-surface border-editor-border"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
