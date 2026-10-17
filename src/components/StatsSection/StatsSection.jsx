import React from "react";
import { FaCalendarAlt, FaBook, FaUsers, FaGlobe } from "react-icons/fa";
import { motion } from "framer-motion";

const stats = [
  { icon: FaCalendarAlt, value: "8+", label: "Years in Operation" },
  { icon: FaBook, value: "90+", label: "Courses" },
  { icon: FaUsers, value: "10K+", label: "Active Students" },
  { icon: FaGlobe, value: "82+", label: "Student Base Countries" },
];

const StatsSection = () => {
  return (
    <section className="relative -mt-8 md:-mt-12 z-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto rounded-2xl md:rounded-3xl bg-white border border-[rgba(7,29,73,0.08)] shadow-[0_20px_50px_rgba(7,29,73,0.12)] py-8 px-4 md:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="text-center px-2"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#071d49] text-[#ffd100]">
                  <Icon size={20} />
                </div>
                <div className="font-display text-3xl md:text-4xl font-bold text-[#071d49]">
                  {stat.value}
                </div>
                <div className="text-sm mt-1 text-slate-500 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
