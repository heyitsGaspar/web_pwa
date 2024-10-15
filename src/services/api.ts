import axios from 'axios';
import { useEffect } from 'react';
const API_URL = 'http://localhost:3000/api/courses'; // Cambia la URL según sea necesario

export interface Course {
  id: string;
  nombre: string;
  precio: number;
  categoria: 'Tecnología' | 'Matemáticas' | 'Inglés' | 'Sociales' | 'Diseño' | 'Marketing';
  autor: string;
}

  
export const getCourses = async (): Promise<Course[]> => {
  // Si el navegador está offline, usa el localStorage
  if (!navigator.onLine) {
    const cachedCourses = localStorage.getItem('courses');
    
    if (cachedCourses) {
      console.log('Returning courses from localStorage (offline)');
      return JSON.parse(cachedCourses);
    } else {
      console.error('No courses available in localStorage and offline.');
      throw new Error('No courses available and offline.');
    }
  }

  // Si el navegador está online, obtenemos los cursos de la API
  try {
    const response = await axios.get<Course[]>(API_URL);
    const courses = response.data;

    // Actualizamos los datos en el localStorage para uso offline posterior
    localStorage.setItem('courses', JSON.stringify(courses));

    console.log('Returning courses from API (online)');
    return courses; // Retornar los cursos obtenidos de la API
  } catch (error) {
    console.error('Error fetching courses from API:', error);
    throw new Error('Error fetching courses from API.');
  }
};



// export const getCourses = async (): Promise<Course[]> => {
//   const cachedCourses = localStorage.getItem('courses'); // Verificar si ya hay cursos almacenados

//   try {
//     // Intentar obtener los cursos desde la API
//     const response = await axios.get<Course[]>(API_URL);
//     const courses = response.data;

//     // Almacenar los cursos obtenidos en el localStorage
//     localStorage.setItem('courses', JSON.stringify(courses));

//     return courses; // Retornar los cursos obtenidos de la API
//   } catch (error) {
//     console.error('Error fetching courses:', error);

//     // Si ocurre un error, verificar si hay datos en el localStorage
//     if (cachedCourses) {
//       // Retornar los cursos almacenados previamente en el localStorage si existen
//       return JSON.parse(cachedCourses);
//     }

//     // Lanzar el error si no hay nada en el localStorage y la API falla
//     throw new Error('No courses available and failed to fetch from API.');
//   }
// };


export const createCourse = async (course: Omit<Course, 'id'>): Promise<Course> => {
  const response = await axios.post<Course>(API_URL, course);
  return response.data;
};

// Método para actualizar un curso
export const updateCourse = async (courseId: string, updatedCourse: Partial<Course>): Promise<Course> => {
  console.log('Datos que se están enviando para la actualización:', updatedCourse);
  const response = await axios.put<Course>(`${API_URL}/${courseId}`, updatedCourse);
  return response.data;
};

// Método para eliminar un curso
export const deleteCourse = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};


// Hook para monitorear si la app vuelve a estar en línea
export const useOnlineStatus = (fetchCourses: () => void) => {
  useEffect(() => {
    const updateOnlineStatus = () => {
      if (navigator.onLine) {
        console.log("You're back online! Fetching courses from API...");
        fetchCourses(); // Llamar la función para obtener los cursos desde la API al estar online
      }
    };

    // Monitorear eventos de cambio de conexión
    window.addEventListener('online', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
    };
  }, [fetchCourses]);
};