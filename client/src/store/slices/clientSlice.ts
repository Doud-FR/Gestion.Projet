import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/axios';

interface ClientState {
  clients: any[];
  currentClient: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ClientState = {
  clients: [],
  currentClient: null,
  loading: false,
  error: null,
};

export const fetchClients = createAsyncThunk('clients/fetchAll', async () => {
  const response = await axios.get('/api/clients');
  return response.data;
});

export const createClient = createAsyncThunk('clients/create', async (clientData: any) => {
  const response = await axios.post('/api/clients', clientData);
  return response.data;
});

export const updateClient = createAsyncThunk('clients/update', async ({ id, ...data }: any) => {
  const response = await axios.put(`/api/clients/${id}`, data);
  return response.data;
});

export const deleteClient = createAsyncThunk('clients/delete', async (id: string) => {
  await axios.delete(`/api/clients/${id}`);
  return id;
});

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur';
        state.clients = [];
      })
      // Create client
      .addCase(createClient.fulfilled, (state, action) => {
        state.clients.push(action.payload);
      })
      // Update client
      .addCase(updateClient.fulfilled, (state, action) => {
        const index = state.clients.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
      })
      // Delete client
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.clients = state.clients.filter(c => c.id !== action.payload);
      });
  },
});

export default clientSlice.reducer;
