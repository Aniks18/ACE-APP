import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../autocontext'; // Adjust the import path as needed
import { auth } from '../components/firebase'; // Adjust the import path as needed
import { signOut } from 'firebase/auth';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout(); // Clear the user from the AuthContext
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-white hover:text-red-400 transition-colors duration-200"
    >
      Logout
    </button>
  );
};

export default Logout;