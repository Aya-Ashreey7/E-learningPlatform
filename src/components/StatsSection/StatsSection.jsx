import React from 'react';
import { FaCalendarAlt, FaBook, FaUsers, FaGlobe } from 'react-icons/fa';
import { motion } from 'framer-motion';

const StatsSection = () => {
  return (
    <section className="bg-[#071d49] py-6 px-4 md:px-6">
      <div className="max-w-7xl mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-white">
        {/* Years in Operation */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center text-3xl mb-2">
            <FaCalendarAlt className="mr-2" />
          </div>
          <div className="text-4xl font-bold">8+</div>
          <div className="text-sm mt-1">Years in Operation</div>
        </motion.div>

        {/* Programs */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center text-3xl mb-2">
            <FaBook className="mr-2" />
          </div>
          <div className="text-4xl font-bold">90+</div>
          <div className="text-sm mt-1">Courses</div>
        </motion.div>

        {/* Active Students */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center text-3xl mb-2">
            <FaUsers className="mr-2" />
          </div>
          <div className="text-4xl font-bold">10K+</div>
          <div className="text-sm mt-1">Active Students</div>
        </motion.div>

        {/* Student Base Countries */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center text-3xl mb-2">
            <FaGlobe className="mr-2" />
          </div>
          <div className="text-4xl font-bold">82+</div>
          <div className="text-sm mt-1">Student Base Countries</div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;