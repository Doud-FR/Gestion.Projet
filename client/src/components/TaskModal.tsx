import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  task?: any;
  projectUsers: any[];
  projectTasks: any[]; // Ajouter les tâches du projet pour les dépendances
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, task, projectUsers, projectTasks }) => {
  const [selectedDependencies, setSelectedDependencies] = useState<string[]>(task?.dependencies?.map((d: any) => d.dependsOnTaskId) || []);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: task || {
      title: '',
      description: '',
      assignedToId: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'TODO',
      progress: 0,
      estimatedHours: '',
      actualHours: ''
    }
  });

  const startDate = watch('startDate');
  const estimatedHours = watch('estimatedHours');

  // Calculer automatiquement la date de fin basée sur les heures estimées
  useEffect(() => {
    if (startDate && estimatedHours) {
      const start = new Date(startDate);
      const workDays = Math.ceil(parseFloat(estimatedHours) / 8); // 8 heures par jour
      const endDate = new Date(start);
      endDate.setDate(start.getDate() + workDays);
      // Exclure les weekends si nécessaire
      // ...
    }
  }, [startDate, estimatedHours]);

  if (!isOpen) return null;

  const availableTasks = projectTasks.filter(t => t.id !== task?.id);

  const toggleDependency = (taskId: string) => {
    setSelectedDependencies(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const onSubmitForm = (data: any) => {
    onSubmit({
      ...data,
      dependencies: selectedDependencies,
      estimatedHours: parseFloat(data.estimatedHours) || null,
      actualHours: parseFloat(data.actualHours) || null
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                {task ? 'Modifier la tâche' : 'Nouvelle tâche'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmitForm)} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Titre
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Titre requis' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Assigné à
                  </label>
                  <select
                    {...register('assignedToId')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="">Non assigné</option>
                    {projectUsers.map(pu => (
                      <option key={pu.user.id} value={pu.user.id}>
                        {pu.user.firstName} {pu.user.lastName} ({pu.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date de début
                    </label>
                    <input
                      type="date"
                      {...register('startDate', { required: 'Date de début requise' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      {...register('endDate', { required: 'Date de fin requise' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Statut
                    </label>
                    <select
                      {...register('status')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="TODO">À faire</option>
                      <option value="IN_PROGRESS">En cours</option>
                      <option value="REVIEW">En révision</option>
                      <option value="DONE">Terminé</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Progression (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      {...register('progress', { min: 0, max: 100 })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Temps estimé (heures)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      {...register('estimatedHours', { min: 0 })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Ex: 8"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Temps réel (heures)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      {...register('actualHours', { min: 0 })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Ex: 10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dépendances (cette tâche dépend de :)
                  </label>
                  {availableTasks.length > 0 ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-2">
                      {availableTasks.map(t => (
                        <label key={t.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedDependencies.includes(t.id)}
                            onChange={() => toggleDependency(t.id)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {t.title}
                            {t.status === 'DONE' && (
                              <span className="ml-2 text-xs text-green-600 dark:text-green-400">✓ Terminée</span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Aucune autre tâche disponible
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Une tâche avec des dépendances ne peut commencer que lorsque toutes ses dépendances sont terminées.
                  </p>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto"
                  >
                    {task ? 'Modifier' : 'Créer'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
