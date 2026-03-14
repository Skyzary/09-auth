import css from './NoteForm.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../lib/api/clientApi';
import { useNoteStore } from '../../lib/store/noteStore';
import { Tag } from '../../types/note';

interface NoteFormProps {
  onNoteSaved: () => void;
  onCancel: () => void;
  onClose?: () => void;
}

export default function NoteForm({
  onNoteSaved,
  onCancel,
  onClose,
}: NoteFormProps) {
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      onNoteSaved();
    },
  });

  const handleAction = (formData: FormData) => {
    createMutation.mutate({
      title: draft.title,
      content: draft.content,
      tag: draft.tag,
    });
  };

  const handleCancel = () => {
    // Draft is NOT cleared on cancel
    onCancel();
  };

  return (
    <form className={css.form} action={handleAction}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          className={css.input}
          value={draft.title}
          onChange={(e) => setDraft({ title: e.target.value })}
          required
          minLength={3}
          maxLength={50}
        />
      </div>
      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={4}
          className={css.input}
          value={draft.content}
          onChange={(e) => setDraft({ content: e.target.value })}
          maxLength={500}
        />
      </div>
      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.input}
          value={draft.tag}
          onChange={(e) => setDraft({ tag: e.target.value as Tag })}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>
      <div className={css.actions}>
        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? 'Creating...' : 'Create Note'}
        </button>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={createMutation.isPending}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
