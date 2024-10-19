import axios from 'axios';
import { useEffect } from 'react';

// Usamos la variable de entorno o una URL por defecto
const API_URL = `${process.env.REACT_APP_API_URL}/api/courses`;

export interface Course {
  id: string;
  nombre: string;
  precio: number;
  categoria: 'Tecnología' | 'Matemáticas' | 'Inglés' ;
  autor: string;
}

// Sincronización de datos cuando vuelve la conexión
export const syncData = async () => {
  const unsyncedChanges = JSON.parse(localStorage.getItem('unsyncedChanges') || '[]');

  // Iterar por los cambios no sincronizados
  for (const change of unsyncedChanges) {
    try {
      if (change.type === 'create') {
        await axios.post(API_URL, change.data); // Crear curso
      } else if (change.type === 'update') {
        await axios.put(`${API_URL}/${change.data.id}`, change.data); // Editar curso
      } else if (change.type === 'delete') {
        await axios.delete(`${API_URL}/${change.data.id}`); // Eliminar curso
      }
      console.log(`Successfully synced: ${change.type}`);
    } catch (error) {
      console.error('Error syncing:', error);
    }
  }

  // Limpiar el localStorage después de sincronizar
  localStorage.setItem('unsyncedChanges', JSON.stringify([]));
};

// Detectar cuando la aplicación vuelve a estar online
window.addEventListener('online', syncData);

// Función para agregar cambios al localStorage si está offline
const addToLocalStorage = (change: any) => {
  const unsyncedChanges = JSON.parse(localStorage.getItem('unsyncedChanges') || '[]');
  unsyncedChanges.push(change);
  localStorage.setItem('unsyncedChanges', JSON.stringify(unsyncedChanges));
};

// Obtener cursos (manejo offline incluido)
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

// Crear curso (con manejo offline)
export const createCourse = async (course: Omit<Course, 'id'>): Promise<Course> => {
  if (navigator.onLine) {
    const response = await axios.post<Course>(API_URL, course);
    return response.data;
  } else {
    // Si no hay conexión, almacenamos la creación en localStorage
    addToLocalStorage({ type: 'create', data: course });
    console.log('Course added to localStorage for later sync');
    return { id: Date.now().toString(), ...course } as Course;
  }
};

// Editar curso (con manejo offline)
export const updateCourse = async (courseId: string, updatedCourse: Partial<Course>): Promise<Course> => {
  if (navigator.onLine) {
    const response = await axios.put<Course>(`${API_URL}/${courseId}`, updatedCourse);
    return response.data;
  } else {
    // Si no hay conexión, almacenamos la actualización en localStorage
    addToLocalStorage({ type: 'update', data: { id: courseId, ...updatedCourse } });
    console.log('Course update added to localStorage for later sync');
    return { id: courseId, ...updatedCourse } as Course;
  }
};

// Eliminar curso (con manejo offline)
export const deleteCourse = async (id: string): Promise<void> => {
  if (navigator.onLine) {
    await axios.delete(`${API_URL}/${id}`);
  } else {
    // Si no hay conexión, almacenamos la eliminación en localStorage
    addToLocalStorage({ type: 'delete', data: { id } });
    console.log('Course delete added to localStorage for later sync');
  }
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
