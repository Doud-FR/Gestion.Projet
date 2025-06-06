import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState, AppDispatch } from '../store';
import { fetchNotes, createNote, updateNote, deleteNote } from '../store/slices/noteSlice';
import { fetchProjects } from '../store/slices/projectSlice';
import { PlusIcon, PencilIcon, TrashIcon, TagIcon } from '@heroicons/react/24/outline';
import NoteModal from '../components/NoteModal';

const Notes: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notes, loading, error } = useSelector((state: RootState) => state.notes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchNotes());
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreate = async (data: any) => {
    try {
      await dispatch(createNote(data)).unwrap();
      toast.success('Note créée avec succès');
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création');
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      await dispatch(updateNote({ id: selectedNote.id, ...data })).unwrap();
      toast.success('Note modifiée avec succès');
      setIsModalOpen(false);
      setSelectedNote(null);
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      try {
        await dispatch(deleteNote(id)).unwrap();
        toast.success('Note supprimée avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const openCreateModal = () => {
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  const openEditModal = (note: any) => {
    setSelectedNote(note);
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

  const notesList = Array.isArray(notes) ? notes : [];

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Notes</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Créez et gérez vos notes de projet
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={openCreateModal}
            className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
          >
            <PlusIcon className="h-5 w-5 inline-block mr-1" />
            Nouvelle note
          </button>
        </div>
      </div>

      {notesList.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Aucune note trouvée
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notesList.map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {note.title}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(note)}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                {note.content}
              </p>
              {note.project && (
                <p className="mt-3 text-sm text-primary-600 dark:text-primary-400">
                  Projet: {note.project.name}
                </p>
              )}
              {note.tags && note.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {note.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      <TagIcon className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Par {note.author?.firstName} {note.author?.lastName}</span>
                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNote(null);
        }}
        onSubmit={selectedNote ? handleUpdate : handleCreate}
        note={selectedNote}
      />
    </div>
  );
};

export default Notes;
