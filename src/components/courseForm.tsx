import React, { useState } from 'react'
import { createCourse, Course } from '../services/api.tsx'

interface CourseFormProps {
  onCourseCreated: () => void
}

const CourseForm: React.FC<CourseFormProps> = ({ onCourseCreated }) => {
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState<number | ''>('')
  const [categoria, setCategoria] = useState<
    'Tecnología' | 'Matemáticas' | 'Inglés' | 'Sociales' | 'Diseño' | 'Marketing'
  >('Tecnología')
  const [autor, setAutor] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newCourse: Omit<Course, 'id'> = {
      nombre,
      precio: Number(precio),
      categoria,
      autor
    }
    await createCourse(newCourse)
    onCourseCreated() // Notificar a Home que se ha creado un curso
    setNombre('')
    setPrecio('')
    setAutor('')
  }

  return (
    <form onSubmit={handleSubmit} className='bg-gray-200 p-4 rounded-md'>
      <h2 className='text-xl font-bold mb-2'>Crear Curso</h2>
      <input
        type='text'
        placeholder='Nombre'
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        required
        className='border rounded p-2 mb-2 w-full'
      />
      <input
        type='number'
        placeholder='Precio'
        value={precio}
        onChange={e => {
          const value = e.target.value
          setPrecio(value === '' ? '' : Number(value)) // Convierte a número o establece como cadena vacía
        }}
        required
        className='border rounded p-2 mb-2 w-full'
      />

      <select
        value={categoria}
        onChange={e =>
          setCategoria(
            e.target.value as 'Tecnología' | 'Matemáticas' | 'Inglés'| 'Sociales' | 'Diseño' | 'Marketing'
          )
        }
        className='border rounded p-2 mb-2 w-full'
      >
        <option value='Tecnología'>Tecnología</option>
        <option value='Matemáticas'>Matemáticas</option>
        <option value='Inglés'>Inglés</option>
        <option value='Inglés'>Sociales</option>
        <option value='Inglés'>Diseño</option>
        <option value='Inglés'>Marketing</option>
      </select>
      <input
        type='text'
        placeholder='Autor'
        value={autor}
        onChange={e => setAutor(e.target.value)}
        required
        className='border rounded p-2 mb-2 w-full'
      />
      <button
        type='submit'
        className='bg-blue-500 text-white rounded p-2 w-full'
      >
        Crear Curso
      </button>
    </form>
  )
}

export default CourseForm
