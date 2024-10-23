import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { BuildingOfficeIcon, PhoneIcon, MapPinIcon, BeakerIcon, HeartIcon, UserGroupIcon, ShieldExclamationIcon, ClipboardDocumentListIcon, RectangleStackIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

const GET_HOSPITAL_DETAILS = gql`
  query GetHospitalDetails($id: Int!) {
    hospitals_by_pk(id: $id) {
      id
      name
      address
      phone_number
      specialities
      total_icu_beds
      total_general_beds
      emergency_capacity
      equipment_inventory
      specialty_rooms
      main_specialty
      created_at
      updated_at
    }
  }
`;

const UPDATE_HOSPITAL = gql`
  mutation UpdateHospital($id: Int!, $updates: hospitals_set_input!) {
    update_hospitals_by_pk(pk_columns: {id: $id}, _set: $updates) {
      id
      updated_at
    }
  }
`;

const HospitalDetails = ({ hospitalId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const { loading, error, data } = useQuery(GET_HOSPITAL_DETAILS, {
    variables: { id: hospitalId },
    skip: !hospitalId,
  });

  const [updateHospital] = useMutation(UPDATE_HOSPITAL, {
    refetchQueries: [{ query: GET_HOSPITAL_DETAILS, variables: { id: hospitalId } }],
  });

  if (!hospitalId) return null;
  if (loading) return <p>Loading hospital details...</p>;
  if (error) return <p>Error loading hospital details: {error.message}</p>;

  const hospital = data.hospitals_by_pk;

  if (!isEditing && Object.keys(formData).length === 0) {
    setFormData(hospital);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.split(',').map(item => item.trim()) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatableFields = [
      'name', 'address', 'phone_number', 'specialities', 'total_icu_beds',
      'total_general_beds', 'emergency_capacity', 'equipment_inventory',
      'specialty_rooms', 'main_specialty'
    ];
    const updates = Object.fromEntries(
      Object.entries(formData)
        .filter(([key]) => updatableFields.includes(key))
    );

    try {
      await updateHospital({
        variables: {
          id: hospitalId,
          updates: {
            ...updates,
            total_icu_beds: parseInt(updates.total_icu_beds),
            total_general_beds: parseInt(updates.total_general_beds),
            emergency_capacity: parseInt(updates.emergency_capacity),
          },
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating hospital:', error);
    }
  };

  const renderField = (label, field, icon, type = 'text') => {
    const Icon = icon;
    return (
      <div className="mb-4">
        <label className="flex items-center text-gray-700 text-sm font-bold mb-2">
          <Icon className="h-5 w-5 mr-2 text-gray-500" />
          {label}:
        </label>
        {isEditing ? (
          type === 'array' ? (
            <input
              type="text"
              name={field}
              value={formData[field].join(', ')}
              onChange={handleArrayChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          ) : (
            <input
              type={type}
              name={field}
              value={formData[field]}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          )
        ) : (
          <p className="text-gray-800">{Array.isArray(hospital[field]) ? hospital[field].join(", ") : hospital[field]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center">
          <BuildingOfficeIcon className="h-8 w-8 mr-2 text-blue-500" />
          {hospital.name}
        </h2>
        {isEditing ? (
          <button 
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
            Save
          </button>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <WrenchScrewdriverIcon className="h-5 w-5 mr-2" />
            Edit
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField('Name', 'name', BuildingOfficeIcon)}
          {renderField('Address', 'address', MapPinIcon)}
          {renderField('Phone', 'phone_number', PhoneIcon)}
          {renderField('Main Specialty', 'main_specialty', BeakerIcon)}
          {renderField('Total ICU Beds', 'total_icu_beds', HeartIcon, 'number')}
          {renderField('Total General Beds', 'total_general_beds', UserGroupIcon, 'number')}
          {renderField('Emergency Capacity', 'emergency_capacity', ShieldExclamationIcon, 'number')}
          {renderField('Specialities', 'specialities', BeakerIcon, 'array')}
          {renderField('Specialty Rooms', 'specialty_rooms', RectangleStackIcon, 'array')}
          {renderField('Equipment Inventory', 'equipment_inventory', WrenchScrewdriverIcon)}
        </div>
      </form>
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Created At:</strong> {new Date(hospital.created_at).toLocaleString()}</p>
        <p><strong>Last Updated:</strong> {new Date(hospital.updated_at).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default HospitalDetails;