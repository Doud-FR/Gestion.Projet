import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { RootState, AppDispatch } from '../store';
import { fetchDashboardData } from '../store/slices/dashboardSlice';
import StatCard from '../components/StatCard';
import { 
  UsersIcon, 
  BriefcaseIcon, 
  FolderIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, recentActivities, loading, error } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
    
    const interval = setInterval(() => {
      dispatch(fetchDashboardData());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  if (loading && !stats.totalUsers) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">Erreur: {error}</p>
      </div>
    );
  }

  const projectProgressData = {
    labels: ['Planification', 'Actif', 'En pause', 'Terminé', 'Annulé'],
    datasets: [
      {
        data: [
          stats.projectsByStatus?.PLANNING || 0,
          stats.projectsByStatus?.ACTIVE || 0,
          stats.projectsByStatus?.ON_HOLD || 0,
          stats.projectsByStatus?.COMPLETED || 0,
          stats.projectsByStatus?.CANCELLED || 0,
        ],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#6366F1',
          '#EF4444',
        ],
      },
    ],
  };

  const taskCompletionData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Tâches terminées',
        data: stats.taskCompletionTrend || [0, 0, 0, 0, 0, 0],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      },
    ],
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Utilisateurs"
          value={stats.totalUsers}
          icon={UsersIcon}
          trend={stats.userGrowth}
          color="blue"
        />
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          icon={BriefcaseIcon}
          trend={stats.clientGrowth}
          color="green"
        />
        <StatCard
          title="Projets Actifs"
          value={stats.activeProjects}
          icon={FolderIcon}
          trend={stats.projectGrowth}
          color="purple"
        />
        <StatCard
          title="Tâches Terminées"
          value={stats.completedTasks}
          icon={CheckCircleIcon}
          trend={stats.taskCompletionRate}
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Répartition des projets
          </h3>
          <div className="h-64">
            <Doughnut data={projectProgressData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Évolution des tâches terminées
          </h3>
          <div className="h-64">
            <Line data={taskCompletionData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Activités récentes
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {Array.isArray(recentActivities) && recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div key={activity.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.user?.firstName} {activity.user?.lastName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.description}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
              Aucune activité récente
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
