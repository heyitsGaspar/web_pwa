import React, { useEffect, useState } from 'react';
import { getCourses, Course,useOnlineStatus, syncData  } from '../services/api.ts';
import CourseCard from '../components/courseCard.tsx';
import CourseForm from '../components/courseForm.tsx';

const Home: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  useEffect(() => {
    fetchCourses();

    // Verificar si hay datos por sincronizar cuando la app se monta
    if (navigator.onLine) {
      syncData();
    }
  }, []);

  useOnlineStatus(fetchCourses); 

  const handleCourseCreated = () => {
    fetchCourses(); // Refrescar la lista de cursos
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cursos</h1>
      <CourseForm onCourseCreated={handleCourseCreated} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} onUpdate={handleCourseCreated} />
        ))}
      </div>
    </div>
  );
};

export default Home;
