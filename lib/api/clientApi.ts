import { api } from './api';
import { Note, NoteCreationPayload } from '../../types/note';
import { User } from '../../types/user';

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  search?: string,
  page: number = 1,
  tag?: string
): Promise<FetchNotesResponse> => {
  const { data } = await api.get('/notes', {
    params: {
      ...(search ? { search } : {}),
      ...(tag && tag !== 'all' ? { tag } : {}),
      page,
      perPage: 12,
    },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get(`/notes/${id}`);
  return data;
};

export const createNote = async (note: NoteCreationPayload): Promise<Note> => {
  const { data } = await api.post('/notes', note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete(`/notes/${id}`);
  return data;
};

export const register = async (credentials: any): Promise<User> => {
  const { data } = await api.post('/auth/register', credentials);
  return data;
};

export const login = async (credentials: any): Promise<User> => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const { data } = await api.get('/auth/session');
    if (!data || Object.keys(data).length === 0) return null;
    return data;
  } catch (err) {
    return null;
  }
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get('/users/me');
  return data;
};

export const updateMe = async (userUpdate: { username: string }): Promise<User> => {
  const { data } = await api.patch('/users/me', userUpdate);
  return data;
};
