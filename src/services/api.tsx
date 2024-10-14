import axios from 'axios';

const API_URL = 'http://localhost:3000/api/courses'; // Cambia la URL según sea necesario

export interface Course {
  id: string;
  nombre: string;
  precio: number;
  categoria: 'Tecnología' | 'Matemáticas' | 'Inglés' | 'Sociales' | 'Diseño' | 'Marketing';
  autor: string;
}

export const getCourses = async (): Promise<Course[]> => {
  const cachedCourses = localStorage.getItem('courses'); 

  if (cachedCourses) {
    return JSON.parse(cachedCourses);
  }

  try {
    // Intentar obtener los cursos desde la API
    const response = await axios.get<Course[]>(API_URL);
    const courses = response.data;

    // Almacenar los cursos obtenidos en el localStorage
    localStorage.setItem('courses', JSON.stringify(courses));

    return courses; // Retornar los cursos obtenidos de la API
  } catch (error) {
    console.error('Error fetching courses:', error);

    // Si ocurre un error, verificar si hay datos en el localStorage
    if (cachedCourses) {
      // Retornar los cursos almacenados previamente en el localStorage si existen
      return JSON.parse(cachedCourses);
    }

    // Lanzar el error si no hay nada en el localStorage y la API falla
    throw new Error('No courses available and failed to fetch from API.');
  }
};

export const createCourse = async (course: Omit<Course, 'id'>): Promise<Course> => {
  const response = await axios.post<Course>(API_URL, course);
  return response.data;
};

// Método para actualizar un curso
export const updateCourse = async (id: string, course: Omit<Course, 'id'>): Promise<Course> => {
  const response = await axios.put<Course>(`${API_URL}/${id}`, course);
  return response.data;
};

// Método para eliminar un curso
export const deleteCourse = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
