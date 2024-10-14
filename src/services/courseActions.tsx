import React from 'react';
import { deleteCourse } from '../services/api.tsx';

interface CourseActionsProps {
  courseId: string;
  onUpdate: () => void; // Prop para notificar al padre que se debe actualizar
  onEdit: () => void;   // Prop para abrir el formulario de edición
}

const CourseActions: React.FC<CourseActionsProps> = ({ courseId, onUpdate, onEdit }) => {
  const handleDelete = async () => {
    await deleteCourse(courseId);
    onUpdate(); // Notificar al padre que el curso fue eliminado
  };

  return (
    <div className="mt-4">
      <button onClick={onEdit} className="bg-yellow-500 text-white p-2 rounded">
        Editar
      </button>
      <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded ml-2">
        Eliminar
      </button>
    </div>
  );
};

export default CourseActions;
