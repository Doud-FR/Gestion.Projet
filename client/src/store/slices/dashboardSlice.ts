import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/axios';

interface DashboardState {
  stats: {
    totalUsers: number;
    totalClients: number;
    activeProjects: number;
    completedTasks: number;
    userGrowth: number;
    clientGrowth: number;
    projectGrowth: number;
    taskCompletionRate: number;
    projectsByStatus: {
      PLANNING: number;
      ACTIVE: number;
      ON_HOLD: number;
      COMPLETED: number;
      CANCELLED: number;
    };
    taskCompletionTrend: number[];
  };
  recentActivities: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: {
    totalUsers: 0,
    totalClients: 0,
    activeProjects: 0,
    completedTasks: 0,
    userGrowth: 0,
    clientGrowth: 0,
    projectGrowth: 0,
    taskCompletionRate: 0,
    projectsByStatus: {
      PLANNING: 0,
      ACTIVE: 0,
      ON_HOLD: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    },
    taskCompletionTrend: [],
  },
  recentActivities: [],
  loading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async () => {
    const [statsResponse, activitiesResponse] = await Promise.all([
      axios.get('/api/dashboard/stats'),
      axios.get('/api/dashboard/activities'),
    ]);
    return {
      stats: statsResponse.data,
      activities: activitiesResponse.data,
    };
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = {
          ...initialState.stats,
          ...action.payload.stats,
          projectsByStatus: {
            ...initialState.stats.projectsByStatus,
            ...(action.payload.stats.projectsByStatus || {})
          }
        };
        state.recentActivities = Array.isArray(action.payload.activities) 
          ? action.payload.activities 
          : [];
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors du chargement';
        // Garder les valeurs par défaut en cas d'erreur
        state.stats = initialState.stats;
        state.recentActivities = [];
      });
  },
});

export default dashboardSlice.reducer;
