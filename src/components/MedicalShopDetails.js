import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { BuildingStorefrontIcon, PhoneIcon, MapPinIcon, IdentificationIcon, CubeIcon, BeakerIcon, ClipboardDocumentListIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

const GET_MEDICAL_SHOP_DETAILS = gql`
  query GetMedicalShopDetails($id: Int!) {
    medical_shops_by_pk(id: $id) {
      id
      name
      address
      phone_number
      license_number
      inventory_capacity
      specialization
      created_at
      updated_at
    }
  }
`;

const UPDATE_MEDICAL_SHOP = gql`
  mutation UpdateMedicalShop($id: Int!, $updates: medical_shops_set_input!) {
    update_medical_shops_by_pk(pk_columns: {id: $id}, _set: $updates) {
      id
      updated_at
    }
  }
`;

const MedicalShopDetails = ({ medicalShopId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const { loading, error, data } = useQuery(GET_MEDICAL_SHOP_DETAILS, {
    variables: { id: medicalShopId },
    skip: !medicalShopId,
  });

  const [updateMedicalShop] = useMutation(UPDATE_MEDICAL_SHOP, {
    refetchQueries: [{ query: GET_MEDICAL_SHOP_DETAILS, variables: { id: medicalShopId } }],
  });

  if (!medicalShopId) return null;
  if (loading) return <p>Loading medical shop details...</p>;
  if (error) return <p>Error loading medical shop details: {error.message}</p>;

  const medicalShop = data.medical_shops_by_pk;

  if (!isEditing && Object.keys(formData).length === 0) {
    setFormData(medicalShop);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatableFields = [
      'name', 'address', 'phone_number', 'license_number',
      'inventory_capacity', 'specialization'
    ];
    const updates = Object.fromEntries(
      Object.entries(formData)
        .filter(([key]) => updatableFields.includes(key))
    );

    try {
      await updateMedicalShop({
        variables: {
          id: medicalShopId,
          updates: {
            ...updates,
            inventory_capacity: parseInt(updates.inventory_capacity),
          },
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating medical shop:', error);
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
          <input
            type={type}
            name={field}
            value={formData[field]}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        ) : (
          <p className="text-gray-800">{medicalShop[field]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center">
          <BuildingStorefrontIcon className="h-8 w-8 mr-2 text-blue-500" />
          {medicalShop.name}
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
          {renderField('Name', 'name', BuildingStorefrontIcon)}
          {renderField('Address', 'address', MapPinIcon)}
          {renderField('Phone', 'phone_number', PhoneIcon)}
          {renderField('License Number', 'license_number', IdentificationIcon)}
          {renderField('Inventory Capacity', 'inventory_capacity', CubeIcon, 'number')}
          {renderField('Specialization', 'specialization', BeakerIcon)}
        </div>
      </form>
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Created At:</strong> {new Date(medicalShop.created_at).toLocaleString()}</p>
        <p><strong>Last Updated:</strong> {new Date(medicalShop.updated_at).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default MedicalShopDetails;