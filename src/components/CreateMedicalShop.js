import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const CREATE_MEDICAL_SHOP = gql`
  mutation CreateMedicalShop(
    $name: String!,
    $address: String!,
    $phoneNumber: String!,
    $licenseNumber: String!,
    $inventoryCapacity: Int,
    $specialization: String,
    $medicalShopAdminId: Int!
  ) {
    insert_medical_shops_one(object: {
      name: $name,
      address: $address,
      phone_number: $phoneNumber,
      license_number: $licenseNumber,
      inventory_capacity: $inventoryCapacity,
      specialization: $specialization,
      medical_shop_admin_id: $medicalShopAdminId
    }) {
      id
      name
    }
  }
`;

const UPDATE_ADMIN = gql`
  mutation UpdateMedicalShopAdmin($adminId: Int!, $medicalShopId: Int!) {
    update_medical_shop_admins_by_pk(
      pk_columns: { id: $adminId },
      _set: { medical_shop_id: $medicalShopId }
    ) {
      id
      medical_shop_id
    }
  }
`;

const CreateMedicalShop = ({ adminId }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    licenseNumber: '',
    inventoryCapacity: '',
    specialization: '',
  });
  const [errors, setErrors] = useState({});

  const [createMedicalShop] = useMutation(CREATE_MEDICAL_SHOP);
  const [updateAdmin] = useMutation(UPDATE_ADMIN);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    // Clear the error for this field when the user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
    if (formData.inventoryCapacity && isNaN(Number(formData.inventoryCapacity))) {
      newErrors.inventoryCapacity = 'Inventory capacity must be a number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { data } = await createMedicalShop({
        variables: {
          ...formData,
          inventoryCapacity: formData.inventoryCapacity ? parseInt(formData.inventoryCapacity) : null,
          medicalShopAdminId: adminId
        }
      });

      if (data && data.insert_medical_shops_one) {
        const medicalShopId = data.insert_medical_shops_one.id;
        await updateAdmin({
          variables: {
            adminId: adminId,
            medicalShopId: medicalShopId
          }
        });
        
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating medical shop:', error);
      setErrors(prevErrors => ({
        ...prevErrors,
        submit: 'Failed to create medical shop. Please try again.'
      }));
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Create Medical Shop</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="address" className="block mb-1">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block mb-1">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
        </div>
        <div>
          <label htmlFor="licenseNumber" className="block mb-1">License Number</label>
          <input
            type="text"
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.licenseNumber && <p className="text-red-500 text-sm">{errors.licenseNumber}</p>}
        </div>
        <div>
          <label htmlFor="inventoryCapacity" className="block mb-1">Inventory Capacity</label>
          <input
            type="number"
            id="inventoryCapacity"
            name="inventoryCapacity"
            value={formData.inventoryCapacity}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.inventoryCapacity && <p className="text-red-500 text-sm">{errors.inventoryCapacity}</p>}
        </div>
        <div>
          <label htmlFor="specialization" className="block mb-1">Specialization</label>
          <input
            type="text"
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        {errors.submit && <p className="text-red-500">{errors.submit}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Create Medical Shop
        </button>
      </form>
    </div>
  );
};

export default CreateMedicalShop;