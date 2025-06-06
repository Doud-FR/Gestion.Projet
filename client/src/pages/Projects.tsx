import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RootState, AppDispatch } from '../store';
import { fetchProjects, createProject, updateProject, deleteProject } from '../store/slices/projectSlice';
import { PlusIcon, CalendarIcon, UsersIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ProjectModal from '../components/ProjectModal';

const Projects: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading, error } = useSelector((state: RootState) => state.projects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreate = async (data: any) => {
    try {
      await dispatch(createProject(data)).unwrap();
      toast.success('Projet créé avec succès');
      setIsModalOpen(false);
      dispatch(fetchProjects());
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création');
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      await dispatch(updateProject({ id: selectedProject.id, ...data })).unwrap();
      toast.success('Projet modifié avec succès');
      setIsModalOpen(false);
      setSelectedProject(null);
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await dispatch(deleteProject(id)).unwrap();
        toast.success('Projet supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const openCreateModal = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  if (loading) {
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

  const projectsList = Array.isArray(projects) ? projects : [];

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Projets</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Gérez tous vos projets et suivez leur progression
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={openCreateModal}
            className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
          >
            <PlusIcon className="h-5 w-5 inline-block mr-1" />
            Nouveau projet
          </button>
        </div>
      </div>

      {projectsList.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Aucun projet trouvé
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {projectsList.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'ACTIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {project.status}
                    </span>
                    <button
                      onClick={() => openEditModal(project)}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Client: {project.client?.name}
                </p>
                
                <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>
                    {new Date(project.startDate).toLocaleDateString()} - 
                    {new Date(project.endDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <UsersIcon className="h-4 w-4 mr-1" />
                  <span>{project.users?.length || 0} membres</span>
                </div>
                
                <div className="mt-4">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {project.progress}% complété
                  </p>
                </div>
                
                <div className="mt-6">
                  <Link
                    to={`/projects/${project.id}`}
                    className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm"
                  >
                    Voir détails →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
        onSubmit={selectedProject ? handleUpdate : handleCreate}
        project={selectedProject}
      />
    </div>
  );
};

export default Projects;
