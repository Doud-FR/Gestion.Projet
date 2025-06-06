import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useAuth = () => {
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  
  return {
    user,
    isAuthenticated,
    loading,
    isAdmin: user?.role === 'ADMIN',
    isProjectManager: user?.role === 'PROJECT_MANAGER' || user?.role === 'ADMIN',
  };
};
