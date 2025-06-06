import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Task, ViewMode } from 'gantt-task-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { RootState, AppDispatch } from '../store';
import { fetchProjectDetail, updateTask, createTask, deleteTask } from '../store/slices/projectSlice';
import GanttChart from '../components/GanttChart2';
import TaskModal from '../components/TaskModal';
import { CalendarIcon, ClockIcon, UsersIcon, PlusIcon, ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentProject, loading } = useSelector((state: RootState) => state.projects);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectDetail(id));
    }
  }, [dispatch, id]);

  if (loading || !currentProject) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Convertir les tâches du projet au format Gantt avec dépendances
  const ganttTasks: Task[] = currentProject.tasks?.map(task => ({
    id: task.id,
    name: task.title,
    start: new Date(task.startDate || currentProject.startDate),
    end: new Date(task.endDate || currentProject.endDate),
    progress: task.progress || 0,
    type: 'task',
    dependencies: task.dependencies?.map((d: any) => d.dependsOnTaskId) || [],
    isDisabled: false,
    styles: {
      progressColor: task.status === 'DONE' ? '#10b981' : '#3b82f6',
      progressSelectedColor: task.status === 'DONE' ? '#059669' : '#1d4ed8',
    }
  })) || [];

  const handleTaskClick = (task: Task) => {
    const originalTask = currentProject.tasks.find(t => t.id === task.id);
    setSelectedTask(originalTask);
    setIsTaskModalOpen(true);
  };

  const handleDateChange = async (task: Task, start: Date, end: Date) => {
    try {
      await dispatch(updateTask({
        projectId: id!,
        taskId: task.id,
        data: {
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        }
      })).unwrap();
      toast.success('Dates mises à jour');
      dispatch(fetchProjectDetail(id!));
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleProgressChange = async (task: Task, progress: number) => {
    try {
      await dispatch(updateTask({
        projectId: id!,
        taskId: task.id,
        data: { progress }
      })).unwrap();
      toast.success('Progression mise à jour');
      dispatch(fetchProjectDetail(id!));
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleCreateTask = async (data: any) => {
    console.log('Creating task with data:', data);
    try {
      const taskData = {
        ...data,
        projectId: id,
        progress: parseInt(data.progress) || 0
      };
      console.log('Formatted task data:', taskData);
      
      await dispatch(createTask(taskData)).unwrap();
      toast.success('Tâche créée avec succès');
      setIsTaskModalOpen(false);
      dispatch(fetchProjectDetail(id!));
    } catch (error: any) {
      console.error('Create task error:', error);
      toast.error(error.message || 'Erreur lors de la création');
    }
  };

  const handleUpdateTask = async (data: any) => {
    try {
      await dispatch(updateTask({
        projectId: id!,
        taskId: selectedTask.id,
        data
      })).unwrap();
      toast.success('Tâche mise à jour');
      setIsTaskModalOpen(false);
      setSelectedTask(null);
      dispatch(fetchProjectDetail(id!));
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        await dispatch(deleteTask({ projectId: id!, taskId })).unwrap();
        toast.success('Tâche supprimée');
        dispatch(fetchProjectDetail(id!));
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const openCreateTaskModal = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  return (
    <div>
      {/* En-tête avec bouton retour */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Retour aux projets
        </button>
      </div>

      {/* En-tête du projet */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentProject.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {currentProject.description}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentProject.status === 'ACTIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            currentProject.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
            currentProject.status === 'ON_HOLD' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}>
            {currentProject.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <CalendarIcon className="h-5 w-5 mr-2" />
            <span>
              {format(new Date(currentProject.startDate), 'dd MMM yyyy', { locale: fr })} - 
              {format(new Date(currentProject.endDate), 'dd MMM yyyy', { locale: fr })}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <ClockIcon className="h-5 w-5 mr-2" />
            <span>Progression: {currentProject.progress || 0}%</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <UsersIcon className="h-5 w-5 mr-2" />
            <span>{currentProject.users?.length || 0} membres</span>
          </div>
        </div>

        {currentProject.budget && (
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Budget: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(currentProject.budget)}
          </div>
        )}
      </div>

      {/* Contrôles du Gantt */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Diagramme de Gantt
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={openCreateTaskModal}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Nouvelle tâche
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode(ViewMode.Day)}
                className={`px-3 py-1 rounded ${
                  viewMode === ViewMode.Day
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Jour
              </button>
              <button
                onClick={() => setViewMode(ViewMode.Week)}
                className={`px-3 py-1 rounded ${
                  viewMode === ViewMode.Week
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Semaine
              </button>
              <button
                onClick={() => setViewMode(ViewMode.Month)}
                className={`px-3 py-1 rounded ${
                  viewMode === ViewMode.Month
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Mois
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Diagramme de Gantt */}
      {ganttTasks.length > 0 ? (
        <GanttChart
          tasks={ganttTasks}
          viewMode={viewMode}
          onTaskClick={handleTaskClick}
          onDateChange={handleDateChange}
          onProgressChange={handleProgressChange}
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Aucune tâche pour ce projet
          </p>
          <button
            onClick={openCreateTaskModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Créer la première tâche
          </button>
        </div>
      )}

      {/* Liste des tâches */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Liste des tâches ({currentProject.tasks?.length || 0})
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {currentProject.tasks?.map((task) => (
            <div key={task.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {task.description}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                    {task.assignedTo && (
                      <span>
                        Assigné à: {task.assignedTo.firstName} {task.assignedTo.lastName}
                      </span>
                    )}
                    {task.estimatedHours && (
                      <span>
                        Temps estimé: {task.estimatedHours}h
                      </span>
                    )}
                    {task.actualHours && (
                      <span>
                        Temps réel: {task.actualHours}h
                      </span>
                    )}
                    {task.dependencies && task.dependencies.length > 0 && (
                      <span className="text-amber-600 dark:text-amber-400">
                        Dépend de: {task.dependencies.map(d => d.dependsOnTask.title).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.status === 'DONE' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    task.status === 'REVIEW' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {task.status}
                  </span>
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${task.progress || 0}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {task.progress || 0}%
                  </span>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:text-red-300"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
        task={selectedTask}
        projectUsers={currentProject.users || []}
        projectTasks={currentProject.tasks || []}
      />
    </div>
  );
};

export default ProjectDetail;
