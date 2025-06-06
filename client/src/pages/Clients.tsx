import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState, AppDispatch } from '../store';
import { fetchClients, createClient, updateClient, deleteClient } from '../store/slices/clientSlice';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ClientModal from '../components/ClientModal';

const Clients: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { clients, loading, error } = useSelector((state: RootState) => state.clients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleCreate = async (data: any) => {
    try {
      await dispatch(createClient(data)).unwrap();
      toast.success('Client créé avec succès');
      setIsModalOpen(false);
      dispatch(fetchClients());
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création');
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      await dispatch(updateClient({ id: selectedClient.id, ...data })).unwrap();
      toast.success('Client modifié avec succès');
      setIsModalOpen(false);
      setSelectedClient(null);
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await dispatch(deleteClient(id)).unwrap();
        toast.success('Client supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const openCreateModal = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const openEditModal = (client: any) => {
    setSelectedClient(client);
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

  const clientsList = Array.isArray(clients) ? clients : [];

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Clients</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Gérez vos clients et leurs informations
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={openCreateModal}
            className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
          >
            <PlusIcon className="h-5 w-5 inline-block mr-1" />
            Nouveau client
          </button>
        </div>
      </div>

      {clientsList.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Aucun client trouvé
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clientsList.map((client) => (
            <div
              key={client.id}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {client.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {client.email}
                </p>
                {client.phone && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {client.phone}
                  </p>
                )}
                <div className="mt-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {client._count?.projects || 0} projet(s)
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 flex justify-between">
                <button
                  onClick={() => openEditModal(client)}
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  <PencilIcon className="h-5 w-5 inline" />
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                >
                  <TrashIcon className="h-5 w-5 inline" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClient(null);
        }}
        onSubmit={selectedClient ? handleUpdate : handleCreate}
        client={selectedClient}
      />
    </div>
  );
};

export default Clients;
