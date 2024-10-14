import React, { useState } from 'react';
import { Course } from '../services/api.tsx';
import CourseActions from '../services/courseActions.tsx';
import EditCourseForm from '../components/editCourseForm.tsx';

interface CourseCardProps {
  course: Course;
  onUpdate: () => void; // Prop para notificar a la lista de cursos que se debe actualizar
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 m-4">
      {isEditing ? (
        <EditCourseForm
          course={course}
          onUpdate={onUpdate}
          onCancel={() => setIsEditing(false)} // Cierra el formulario de edición
        />
      ) : (
        <div>
          <h2 className="text-xl font-bold">{course.nombre}</h2>
          <p className="text-gray-700">Precio: ${course.precio}</p>
          <p className="text-gray-600">Categoría: {course.categoria}</p>
          <p className="text-gray-500">Autor: {course.autor}</p>
          <CourseActions
            courseId={course.id}
            onUpdate={onUpdate}
            onEdit={() => setIsEditing(true)} // Abre el formulario de edición
          />
        </div>
      )}
    </div>
  );
};

export default CourseCard;
