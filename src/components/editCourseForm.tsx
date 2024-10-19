import React, { useState } from 'react';
import { Course, updateCourse } from '../services/api.ts';

interface EditCourseFormProps {
  course: Course;
  onUpdate: () => void; // Para notificar al padre que el curso fue actualizado
  onCancel: () => void; // Para cerrar el formulario de edición
}

const EditCourseForm: React.FC<EditCourseFormProps> = ({ course, onUpdate, onCancel }) => {
  const [nombre, setNombre] = useState(course.nombre);
  const [precio, setPrecio] = useState(course.precio);
  const [categoria, setCategoria] = useState(course.categoria);
  const [autor, setAutor] = useState(course.autor);

  const handleUpdate = async () => {
    const updatedCourse = {
      nombre,
      precio,
      categoria,
      autor,
    };

    await updateCourse(course.id, updatedCourse);
    onUpdate(); // Notificar al padre que el curso fue actualizado
    onCancel(); // Cerrar el formulario
  };

  return (
    <div className="bg-gray-200 p-4 rounded-md">
      <h2 className="text-xl font-bold">Editar Curso</h2>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="border rounded p-2 mb-2 w-full"
      />
      <input
        type="number"
        value={precio}
        onChange={(e) => setPrecio(Number(e.target.value))}
        className="border rounded p-2 mb-2 w-full"
      />
      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value as 'Tecnología' | 'Matemáticas' | 'Inglés')}
        className="border rounded p-2 mb-2 w-full"
      >
        <option value="Tecnología">Tecnología</option>
        <option value="Matemáticas">Matemáticas</option>
        <option value="Inglés">Inglés</option>
      </select>
      <input
        type="text"
        value={autor}
        onChange={(e) => setAutor(e.target.value)}
        className="border rounded p-2 mb-2 w-full"
      />
      <button onClick={handleUpdate} className="bg-blue-500 text-white p-2 rounded">
        Guardar
      </button>
      <button onClick={onCancel} className="bg-gray-500 text-white p-2 rounded ml-2">
        Cancelar
      </button>
    </div>
  );
};

export default EditCourseForm;
