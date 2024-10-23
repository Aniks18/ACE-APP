import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../components/firebase';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const INSERT_HOSPITAL_ADMIN = gql`
  mutation InsertHospitalAdmin($object: hospital_admins_insert_input!) {
    insert_hospital_admins_one(object: $object) {
      id
      username
      email
      firebase_uid
    }
  }
`;

const INSERT_MEDICAL_SHOP_ADMIN = gql`
  mutation InsertMedicalShopAdmin($object: medical_shop_admins_insert_input!) {
    insert_medical_shop_admins_one(object: $object) {
      id
      username
      email
      firebase_uid
    }
  }
`;

const INSERT_CITIZEN = gql`
  mutation InsertCitizen($object: citizens_insert_input!) {
    insert_citizens_one(object: $object) {
      id
      username
      email
      firebase_uid
    }
  }
`;

const INSERT_VOLUNTEER = gql`
  mutation InsertVolunteer($object: volunteers_insert_input!) {
    insert_volunteers_one(object: $object) {
      id
      username
      email
      firebase_uid
    }
  }
`;

const INSERT_ADMIN_USER = gql`
  mutation InsertAdminUser($object: admin_users_insert_input!) {
    insert_admin_users_one(object: $object) {
      id
      username
      email
      firebase_uid
    }
  }
`;

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: '',
    username: '',
    password: '',
    email: '',
    fullName: '',
    dateOfBirth: '',
    address: '',
    phoneNumber: '',
    emergencyContact: '',
    medicalHistory: '',
    vaccinationRecord: '',
    skills: '',
    availability: '',
    adminRole: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [insertHospitalAdmin] = useMutation(INSERT_HOSPITAL_ADMIN);
  const [insertMedicalShopAdmin] = useMutation(INSERT_MEDICAL_SHOP_ADMIN);
  const [insertCitizen] = useMutation(INSERT_CITIZEN);
  const [insertVolunteer] = useMutation(INSERT_VOLUNTEER);
  const [insertAdminUser] = useMutation(INSERT_ADMIN_USER);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const commonFields = {
        username: formData.username,
        email: formData.email,
        full_name: formData.fullName,
        address: formData.address,
        firebase_uid: user.uid,
      };

      let result;
      switch (formData.role) {
        case 'hospital_admin':
          result = await insertHospitalAdmin({
            variables: { 
              object: {
                ...commonFields,
                contact_number: formData.phoneNumber,
              }
            }
          });
          break;
        case 'medical_shop_admin':
          result = await insertMedicalShopAdmin({
            variables: { 
              object: {
                ...commonFields,
                contact_number: formData.phoneNumber,
              }
            }
          });
          break;
        case 'citizen':
          result = await insertCitizen({
            variables: { 
              object: {
                ...commonFields,
                date_of_birth: formData.dateOfBirth,
                phone_number: formData.phoneNumber,
                emergency_contact: formData.emergencyContact,
                medical_history: formData.medicalHistory,
                vaccination_record: formData.vaccinationRecord,
              }
            }
          });
          break;
        case 'volunteer':
          result = await insertVolunteer({
            variables: { 
              object: {
                ...commonFields,
                date_of_birth: formData.dateOfBirth,
                phone_number: formData.phoneNumber,
                skills: formData.skills,
                availability: formData.availability,
              }
            }
          });
          break;
        case 'admin_user':
          result = await insertAdminUser({
            variables: { 
              object: {
                ...commonFields,
                role: formData.adminRole,
              }
            }
          });
          break;
        default:
          throw new Error('Invalid role selected');
      }

      console.log('Registration successful:', result);
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'citizen':
        return (
          <>
            <motion.div className="flex space-x-4 mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="Emergency Contact"
                className="w-1/2 px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                name="vaccinationRecord"
                value={formData.vaccinationRecord}
                onChange={handleChange}
                placeholder="Vaccination Record"
                className="w-1/2 px-3 py-2 border rounded-md"
              />
            </motion.div>
            <motion.textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              placeholder="Medical History"
              className="w-full px-3 py-2 mb-3 border rounded-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            />
          </>
        );
      case 'volunteer':
        return (
          <motion.div className="flex space-x-4 mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Skills"
              className="w-1/2 px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              placeholder="Availability"
              className="w-1/2 px-3 py-2 border rounded-md"
            />
          </motion.div>
        );
      case 'admin_user':
        return (
          <motion.input
            type="text"
            name="adminRole"
            value={formData.adminRole}
            onChange={handleChange}
            placeholder="Admin Role"
            className="w-full px-3 py-2 mb-3 border rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4 flex flex-col md:flex-row items-center">
      <motion.div 
        className="md:w-1/2 mb-8 md:mb-0"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img src="/Register_page_1.png" alt="Register" className="w-full h-auto rounded-lg shadow-lg" />
      </motion.div>
      <div className="md:w-1/2 md:pl-8">
        <motion.div 
          className="bg-white p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-primary text-center">Register</h2>
          
          <form onSubmit={handleSubmit}>
            <motion.select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 mb-3 border rounded-md"
              required
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <option value="">Select Role</option>
              <option value="citizen">Citizen</option>
              <option value="volunteer">Volunteer</option>
              <option value="hospital_admin">Hospital Admin</option>
              <option value="medical_shop_admin">Medical Shop Admin</option>
              <option value="admin_user">Admin User</option>
            </motion.select>

            <motion.input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full px-3 py-2 mb-3 border rounded-md"
              required
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            />

            <motion.input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-3 py-2 mb-3 border rounded-md"
              required
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            />

            <motion.div 
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-3 py-2 mb-3 border rounded-md pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-1 pr-3 flex items-center justify-center text-sm leading-5 w-8 h-10"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </motion.div>

            <motion.input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-3 py-2 mb-3 border rounded-md"
              required
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            />

            <motion.input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              style={{ color: ' #9CA3AF' }}
              className="w-full px-3 py-2 mb-3 border rounded-md f"
              required
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            />

            <motion.textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full px-3 py-2 mb-3 border rounded-md"
              required
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            />

            <motion.input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full px-3 py-2 mb-3 border rounded-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            />

            {renderRoleSpecificFields()}

            <motion.button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition duration-300 mb-3"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? 'Registering...' : 'Register'}
            </motion.button>
          </form>

          {error && (
            <motion.p 
              className="text-red-500 mt-3 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              Error: {error}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Register;