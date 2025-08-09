// src/pages/CoursesPage.jsx
import React from 'react';
import CourseCard from '../components/CourseCard';
import { Link } from 'react-router-dom';

const dummyCourses =[
  {
    id: 1,
    title: 'React Fundamentals',
    description: 'Learn the basics of React.',
    price: 49,
    image: 'https://reactjs.org/logo-og.png',
  },
  {
    id: 2,
    title: 'Tailwind CSS',
    description: 'Build fast UIs with Tailwind.',
    price: 39,
    image: 'https://tailwindcss.com/_next/static/media/social-card.68b3b7a1.jpg',
  },
  {
    id: 3,
    title: 'JavaScript Mastery',
    description: 'Deep dive into modern JS.',
    price: 59,
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png',
  },
];

const CoursesPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Courses</h1>
        <Link to="/cart" className="text-indigo-600 hover:underline font-semibold">Go to Cart</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {dummyCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
