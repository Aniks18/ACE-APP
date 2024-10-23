import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, ShieldCheckIcon, UserGroupIcon, GlobeAltIcon, BeakerIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const AboutSection = ({ title, description, icon, delay }) => (
  <motion.div
    className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
    </motion.div>
    <h3 className="mt-4 text-xl font-semibold text-primary-600">{title}</h3>
    <p className="mt-2 text-gray-600 text-center">{description}</p>
  </motion.div>
);

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <motion.h1 
          className="text-5xl font-bold text-center text-primary-800 mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Swasthya Setu
        </motion.h1>
        <motion.p 
          className="text-2xl text-center text-gray-700 mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Your Digital Bridge to Health and Safety During Pandemics
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AboutSection 
            title="Pandemic Response" 
            description="Stay informed and prepared with real-time updates, guidelines, and resources tailored for pandemic situations."
            icon={<BeakerIcon className="h-12 w-12 text-red-500" />}
            delay={0.3}
          />
          <AboutSection 
            title="Secure Telemedicine" 
            description="Connect with healthcare professionals remotely, ensuring your safety while receiving expert medical advice."
            icon={<ShieldCheckIcon className="h-12 w-12 text-green-500" />}
            delay={0.4}
          />
          <AboutSection 
            title="Community Support" 
            description="Join a network of volunteers and community members to provide and receive support during challenging times."
            icon={<UserGroupIcon className="h-12 w-12 text-blue-500" />}
            delay={0.5}
          />
          <AboutSection 
            title="Resource Allocation" 
            description="Efficiently distribute medical resources, track inventory, and ensure equitable access to healthcare supplies."
            icon={<ChartBarIcon className="h-12 w-12 text-purple-500" />}
            delay={0.6}
          />
          <AboutSection 
            title="Global Health Network" 
            description="Collaborate with international health organizations and access global pandemic insights and strategies."
            icon={<GlobeAltIcon className="h-12 w-12 text-teal-500" />}
            delay={0.7}
          />
          <AboutSection 
            title="Mental Wellness" 
            description="Access mental health resources, support groups, and stress management tools to maintain emotional well-being."
            icon={<HeartIcon className="h-12 w-12 text-pink-500" />}
            delay={0.8}
          />
        </div>

        <motion.div 
          className="mt-16 bg-white rounded-lg shadow-md p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <h2 className="text-3xl font-semibold text-primary-700 mb-4">Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            At Swasthya Setu, we're committed to revolutionizing pandemic response through innovative technology. 
            Our mission is to create a resilient global community by:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>Providing real-time, accurate information to empower informed decision-making.</li>
            <li>Facilitating seamless connections between patients, healthcare providers, and vital resources.</li>
            <li>Leveraging data analytics to predict and mitigate health crises.</li>
            <li>Fostering a supportive ecosystem that prioritizes both physical and mental well-being.</li>
            <li>Ensuring equitable access to healthcare services and supplies during emergencies.</li>
          </ul>
        </motion.div>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <p className="text-xl text-gray-700 mb-6">
            Join us in our mission to build a healthier, more resilient world. Together, we can overcome any health challenge.
          </p>
          <motion.button 
            className="bg-accent-500 hover:bg-accent-600 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 shadow-md hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Involved Now
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default About;