import React, { useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';

const GET_ADMIN_ID = gql`
  query GetAdminId($email: String!) {
    hospital_admins(where: {email: {_eq: $email}}) {
      id
    }
  }
`;

const ADD_HOSPITAL = gql`
  mutation AddHospital($hospital: hospitals_insert_input!) {
    insert_hospitals_one(object: $hospital) {
      id
    }
  }
`;

const ADD_HOSPITAL_ASSOCIATION = gql`
  mutation AddHospitalAssociation($admin_id: Int!, $hospital_id: Int!) {
    insert_hospital_admin_associations_one(object: {admin_id: $admin_id, hospital_id: $hospital_id}) {
      admin_id
      hospital_id
    }
  }
`;

const UPDATE_HOSPITAL_ADMIN = gql`
  mutation UpdateHospitalAdmin($admin_id: Int!, $hospital_id: Int!) {
    update_hospital_admins_by_pk(pk_columns: {id: $admin_id}, _set: {hospital_id: $hospital_id}) {
      id
      hospital_id
    }
  }
`;

const AddHospital = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone_number: '',
    specialities: [],
    total_icu_beds: '',
    total_general_beds: '',
    emergency_capacity: '',
    equipment_inventory: '',
    specialty_rooms: [],
    main_specialty: '',
  });

  const { data: adminData } = useQuery(GET_ADMIN_ID, {
    variables: { email },
    skip: !email,
  });

  const [addHospital] = useMutation(ADD_HOSPITAL);
  const [addHospitalAssociation] = useMutation(ADD_HOSPITAL_ASSOCIATION);
  const [updateHospitalAdmin] = useMutation(UPDATE_HOSPITAL_ADMIN);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value.split(',').map(item => item.trim())
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminData || !adminData.hospital_admins || adminData.hospital_admins.length === 0) {
      console.error('Admin not found');
      return;
    }
    const admin_id = adminData.hospital_admins[0].id;
    try {
      const hospitalResult = await addHospital({
        variables: {
          hospital: {
            ...formData,
            total_icu_beds: parseInt(formData.total_icu_beds) || 0,
            total_general_beds: parseInt(formData.total_general_beds) || 0,
            emergency_capacity: parseInt(formData.emergency_capacity) || 0,
          },
        },
      });
      
      const hospital_id = hospitalResult.data.insert_hospitals_one.id;
      
      await addHospitalAssociation({
        variables: {
          admin_id,
          hospital_id
        },
      });

      await updateHospitalAdmin({
        variables: {
          admin_id,
          hospital_id
        },
      });

      console.log('Hospital added successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding hospital:', error);
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Add New Hospital</h1>
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Hospital Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone_number" className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="specialities" className="block text-gray-700 text-sm font-bold mb-2">Specialities (comma-separated)</label>
          <input
            type="text"
            id="specialities"
            name="specialities"
            value={formData.specialities.join(', ')}
            onChange={handleArrayChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="total_icu_beds" className="block text-gray-700 text-sm font-bold mb-2">Total ICU Beds</label>
          <input
            type="number"
            id="total_icu_beds"
            name="total_icu_beds"
            value={formData.total_icu_beds}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="total_general_beds" className="block text-gray-700 text-sm font-bold mb-2">Total General Beds</label>
          <input
            type="number"
            id="total_general_beds"
            name="total_general_beds"
            value={formData.total_general_beds}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="emergency_capacity" className="block text-gray-700 text-sm font-bold mb-2">Emergency Capacity</label>
          <input
            type="number"
            id="emergency_capacity"
            name="emergency_capacity"
            value={formData.emergency_capacity}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="equipment_inventory" className="block text-gray-700 text-sm font-bold mb-2">Equipment Inventory</label>
          <textarea
            id="equipment_inventory"
            name="equipment_inventory"
            value={formData.equipment_inventory}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="specialty_rooms" className="block text-gray-700 text-sm font-bold mb-2">Specialty Rooms (comma-separated)</label>
          <input
            type="text"
            id="specialty_rooms"
            name="specialty_rooms"
            value={formData.specialty_rooms.join(', ')}
            onChange={handleArrayChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="main_specialty" className="block text-gray-700 text-sm font-bold mb-2">Main Specialty</label>
          <input
            type="text"
            id="main_specialty"
            name="main_specialty"
            value={formData.main_specialty}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Hospital
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHospital;