import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery, gql } from '@apollo/client';
import { 
  signInWithEmailAndPassword,
  signInWithPopup, 
  GoogleAuthProvider, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { auth } from '../components/firebase';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { useAuth } from '../autocontext'; // Adjust the import path as needed

const GET_USER_BY_FIREBASE_UID = gql`
  query GetUserByFirebaseUID($firebase_uid: String!) {
    hospital_admins(where: {firebase_uid: {_eq: $firebase_uid}}) {
      id
      username
      email
      full_name
    }
    medical_shop_admins(where: {firebase_uid: {_eq: $firebase_uid}}) {
      id
      username
      email
      full_name
    }
    citizens(where: {firebase_uid: {_eq: $firebase_uid}}) {
      id
      username
      email
      full_name
    }
    volunteers(where: {firebase_uid: {_eq: $firebase_uid}}) {
      id
      username
      email
      full_name
    }
    admin_users(where: {firebase_uid: {_eq: $firebase_uid}}) {
      id
      username
      email
      full_name
      role
    }
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Use the auth context
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [getUserByFirebaseUID] = useLazyQuery(GET_USER_BY_FIREBASE_UID);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (loginFunction, credentials) => {
    setError('');
    setLoading(true);
    try {
      const userCredential = await loginFunction(...credentials);
      const user = userCredential.user;

      const { data } = await getUserByFirebaseUID({
        variables: { firebase_uid: user.uid }
      });

      const userTypes = ['hospital_admins', 'medical_shop_admins', 'citizens', 'volunteers', 'admin_users'];
      let userData;
      let userRole;

      for (const type of userTypes) {
        if (data[type] && data[type].length > 0) {
          userData = data[type][0];
          userRole = type === 'admin_users' ? userData.role : type.slice(0, -1);
          break;
        }
      }

      if (userData) {
        console.log('Login successful:', { ...userData, role: userRole });
        navigate('/dashboard', { state: { email: userData.email } });
      } else {
        throw new Error('User not found in custom database');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    handleLogin(signInWithEmailAndPassword, [auth, formData.email, formData.password]);
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    handleLogin(signInWithPopup, [auth, provider]);
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setError('Password reset email sent. Please check your inbox.');
    } catch (err) {
      console.error('Error sending password reset email:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if user is already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto mt-10 px-4"
    >
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold mb-6 text-primary text-center"
        >
          Welcome Back
        </motion.h2>
        
        <form onSubmit={handleEmailPasswordLogin}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-5 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </motion.div>
          <motion.button
            type="submit"
            className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-dark transition duration-300 mb-4"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? 'Logging in...' : 'Login with Email'}
          </motion.button>
        </form>

        <motion.button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 transition duration-300 mb-4 flex items-center justify-center"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FaGoogle className="mr-2" />
          {loading ? 'Logging in...' : 'Login with Google'}
        </motion.button>

        <motion.button
          onClick={handleForgotPassword}
          className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-300 transition duration-300"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Forgot Password?
        </motion.button>

        {error && (
          <motion.p 
            className="text-red-500 mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default Login;