import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/axios';

interface ProjectState {
  projects: any[];
  currentProject: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk('projects/fetchAll', async () => {
  const response = await axios.get('/api/projects');
  return response.data;
});

export const fetchProjectDetail = createAsyncThunk(
  'projects/fetchById',
  async (id: string) => {
    const response = await axios.get(`/api/projects/${id}`);
    return response.data;
  }
);

export const createTask = createAsyncThunk(
  'projects/createTask',
  async (taskData: any) => {
    const response = await axios.post('/api/tasks', taskData);
    return response.data;
  }
);

export const updateTask = createAsyncThunk(
  'projects/updateTask',
  async ({ projectId, taskId, data }: any) => {
    const response = await axios.put(`/api/tasks/${taskId}`, data);
    return response.data;
  }
);

export const deleteTask = createAsyncThunk(
  'projects/deleteTask',
  async ({ projectId, taskId }: any) => {
    await axios.delete(`/api/tasks/${taskId}`);
    return taskId;
  }
);

export const createProject = createAsyncThunk('projects/create', async (projectData: any) => {
  const response = await axios.post('/api/projects', projectData);
  return response.data;
});

export const updateProject = createAsyncThunk('projects/update', async ({ id, ...data }: any) => {
  const response = await axios.put(`/api/projects/${id}`, data);
  return response.data;
});

export const deleteProject = createAsyncThunk('projects/delete', async (id: string) => {
  await axios.delete(`/api/projects/${id}`);
  return id;
});

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur';
        state.projects = [];
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p.id !== action.payload);
      })
      .addCase(fetchProjectDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur';
      });
  },
});

export default projectSlice.reducer;
