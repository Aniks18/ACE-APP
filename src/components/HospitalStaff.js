import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_HOSPITAL_STAFF = gql`
  query GetHospitalStaff($hospitalId: Int!) {
    hospital_staff(where: {hospital_id: {_eq: $hospitalId}}) {
      id
      full_name
      role
      years_of_experience
      speciality
      contact_number
      email
      address
      qualifications
      availability
    }
  }
`;

const ADD_HOSPITAL_STAFF = gql`
  mutation AddHospitalStaff($input: hospital_staff_insert_input!) {
    insert_hospital_staff_one(object: $input) {
      id
    }
  }
`;

const UPDATE_HOSPITAL_STAFF = gql`
  mutation UpdateHospitalStaff($id: Int!, $input: hospital_staff_set_input!) {
    update_hospital_staff_by_pk(pk_columns: {id: $id}, _set: $input) {
      id
    }
  }
`;

const HospitalStaff = ({ hospitalId }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    speciality: '',
    role: '',
    contact_number: '',
    email: '',
    address: '',
    years_of_experience: '',
    qualifications: [],
    availability: ''
  });

  const { loading, error, data, refetch } = useQuery(GET_HOSPITAL_STAFF, {
    variables: { hospitalId },
    skip: !hospitalId,
  });

  const [addStaff] = useMutation(ADD_HOSPITAL_STAFF);
  const [updateStaff] = useMutation(UPDATE_HOSPITAL_STAFF);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQualificationsChange = (e) => {
    const qualifications = e.target.value.split(',').map(q => q.trim());
    setFormData(prev => ({ ...prev, qualifications }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        await updateStaff({
          variables: {
            id: editingStaff.id,
            input: {
              ...formData,
              years_of_experience: parseInt(formData.years_of_experience),
            },
          },
        });
      } else {
        await addStaff({
          variables: {
            input: {
              ...formData,
              hospital_id: hospitalId,
              years_of_experience: parseInt(formData.years_of_experience),
            },
          },
        });
      }
      setShowForm(false);
      setEditingStaff(null);
      setFormData({
        full_name: '',
        speciality: '',
        role: '',
        contact_number: '',
        email: '',
        address: '',
        years_of_experience: '',
        qualifications: [],
        availability: ''
      });
      refetch();
    } catch (error) {
      console.error('Error saving staff:', error);
    }
  };

  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setFormData({
      full_name: staff.full_name,
      speciality: staff.speciality || '',
      role: staff.role,
      contact_number: staff.contact_number || '',
      email: staff.email || '',
      address: staff.address || '',
      years_of_experience: staff.years_of_experience.toString(),
      qualifications: staff.qualifications || [],
      availability: staff.availability || ''
    });
    setShowForm(true);
  };

  if (loading) return <p>Loading staff information...</p>;
  if (error) return <p>Error loading staff information: {error.message}</p>;

  const staffMembers = data?.hospital_staff || [];

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Hospital Staff</h3>
      {staffMembers.length > 0 ? (
        <div className="mb-4">
          <h4 className="text-lg font-medium mb-2">Current Staff:</h4>
          <ul className="space-y-2">
            {staffMembers.map(staff => (
              <li key={staff.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <span>{staff.full_name} - {staff.role} ({staff.years_of_experience} years of experience)</span>
                <button
                  onClick={() => handleEdit(staff)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                >
                  View/Edit
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mb-4">No staff members added yet.</p>
      )}
      
      {!showForm ? (
        <button
          onClick={() => {
            setShowForm(true);
            setEditingStaff(null);
            setFormData({
              full_name: '',
              speciality: '',
              role: '',
              contact_number: '',
              email: '',
              address: '',
              years_of_experience: '',
              qualifications: [],
              availability: ''
            });
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Staff Member
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-4 rounded">
          <h4 className="text-lg font-medium mb-2">{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</h4>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            placeholder="Full Name"
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="speciality"
            value={formData.speciality}
            onChange={handleInputChange}
            placeholder="Speciality"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            placeholder="Role"
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleInputChange}
            placeholder="Contact Number"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full px-3 py-2 border rounded"
          />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Address"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="number"
            name="years_of_experience"
            value={formData.years_of_experience}
            onChange={handleInputChange}
            placeholder="Years of Experience"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="qualifications"
            value={formData.qualifications.join(', ')}
            onChange={handleQualificationsChange}
            placeholder="Qualifications (comma-separated)"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="availability"
            value={formData.availability}
            onChange={handleInputChange}
            placeholder="Availability"
            className="w-full px-3 py-2 border rounded"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingStaff(null);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {editingStaff ? 'Update Staff' : 'Add Staff'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default HospitalStaff;