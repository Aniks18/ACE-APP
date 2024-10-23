import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, HomeIcon, InformationCircleIcon, EnvelopeIcon, UserPlusIcon, UserIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useAuth } from '../autocontext'; // Adjust the import path as needed
import { auth } from '../components/firebase'; // Adjust the import path as needed
import { signOut } from 'firebase/auth';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import logo from '../assets/logo2.png';

const CHECK_CITIZEN = gql`
  query CheckCitizen($email: String!) {
    citizens(where: {email: {_eq: $email}}) {
      id
    }
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { data: citizenData, loading: citizenLoading } = useQuery(CHECK_CITIZEN, {
    variables: { email: user?.email },
    skip: !user?.email,
  });

  const isCitizen = !citizenLoading && citizenData?.citizens.length > 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout(); // Clear the user from the AuthContext
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderUserInfo = () => {
    return (
      <div className="px-4 py-2 text-sm text-gray-700">
        <p className="font-medium text-gray-900">{user.email}</p>
        {user.displayName && <p className="text-gray-600">{user.displayName}</p>}
        <p className="text-gray-600">{isCitizen ? 'Citizen' : 'Non-Citizen'}</p>
      </div>
    );
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="Swasthya Setu Logo" className="h-14 w-14 rounded-full" />
            <span className="text-white text-2xl font-bold">Swasthya Setu</span>
          </Link>

          {/* Hamburger menu for mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none focus:text-red-500"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" icon={<HomeIcon className="h-5 w-5" />}>Home</NavLink>
            <NavLink to="/about" icon={<InformationCircleIcon className="h-5 w-5" />}>About</NavLink>
            <NavLink to="/contact" icon={<EnvelopeIcon className="h-5 w-5" />}>Contact</NavLink>
            {user ? (
              <>
                <NavLink to="/dashboard" icon={<UserIcon className="h-5 w-5" />}>Dashboard</NavLink>
                {isCitizen && (
                  <NavLink to="/swasthyacard" icon={<CreditCardIcon className="h-5 w-5" />}>SwasthyaCard</NavLink>
                )}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleProfile}
                    className="flex items-center text-white hover:text-red-400 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      {renderUserInfo()}
                      <div className="border-t border-gray-100"></div>
                      <div className="px-4 py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink to="/register" icon={<UserPlusIcon className="h-5 w-5" />}>Register</NavLink>
                <NavLink to="/login" icon={<UserIcon className="h-5 w-5" />}>Login</NavLink>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <motion.div
          className="md:hidden overflow-hidden"
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={{
            open: { opacity: 1, height: "auto" },
            closed: { opacity: 0, height: 0 }
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="flex flex-col space-y-2 py-4">
            <NavLink to="/" icon={<HomeIcon className="h-5 w-5" />} mobile>Home</NavLink>
            <NavLink to="/about" icon={<InformationCircleIcon className="h-5 w-5" />} mobile>About</NavLink>
            <NavLink to="/contact" icon={<EnvelopeIcon className="h-5 w-5" />} mobile>Contact</NavLink>
            {user ? (
              <>
                <NavLink to="/dashboard" icon={<UserIcon className="h-5 w-5" />} mobile>Dashboard</NavLink>
                {isCitizen && (
                  <NavLink to="/swasthyacard" icon={<CreditCardIcon className="h-5 w-5" />} mobile>SwasthyaCard</NavLink>
                )}
                <div className="py-2 px-4 text-white">
                  {renderUserInfo()}
                </div>
                <div className="py-2 px-4">
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-red-400 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/register" icon={<UserPlusIcon className="h-5 w-5" />} mobile>Register</NavLink>
                <NavLink to="/login" icon={<UserIcon className="h-5 w-5" />} mobile>Login</NavLink>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, icon, mobile }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 text-white hover:text-red-400 transition-colors duration-200 ${
      mobile ? 'py-2' : 'hover:bg-blue-700 px-3 py-2 rounded-md'
    }`}
  >
    {icon}
    <span>{children}</span>
  </Link>
);

export default Navbar;