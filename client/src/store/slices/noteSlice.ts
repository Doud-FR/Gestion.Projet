import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/axios';

interface NoteState {
  notes: any[];
  loading: boolean;
  error: string | null;
}

const initialState: NoteState = {
  notes: [],
  loading: false,
  error: null,
};

export const fetchNotes = createAsyncThunk('notes/fetchAll', async () => {
  const response = await axios.get('/api/notes');
  return response.data;
});

export const createNote = createAsyncThunk('notes/create', async (noteData: any) => {
  const response = await axios.post('/api/notes', noteData);
  return response.data;
});

export const updateNote = createAsyncThunk('notes/update', async ({ id, ...data }: any) => {
  const response = await axios.put(`/api/notes/${id}`, data);
  return response.data;
});

export const deleteNote = createAsyncThunk('notes/delete', async (id: string) => {
  await axios.delete(`/api/notes/${id}`);
  return id;
});

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur';
        state.notes = [];
      })
      // Create note
      .addCase(createNote.fulfilled, (state, action) => {
        state.notes.unshift(action.payload);
      })
      // Update note
      .addCase(updateNote.fulfilled, (state, action) => {
        const index = state.notes.findIndex(n => n.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })
      // Delete note
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter(n => n.id !== action.payload);
      });
  },
});

export default noteSlice.reducer;
