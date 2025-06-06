import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import clientReducer from './slices/clientSlice';
import projectReducer from './slices/projectSlice';
import noteReducer from './slices/noteSlice';
import dashboardReducer from './slices/dashboardSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    clients: clientReducer,
    projects: projectReducer,
    notes: noteReducer,
    dashboard: dashboardReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
