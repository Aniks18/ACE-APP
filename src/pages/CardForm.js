import React, { useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { useAuth } from '../autocontext';
import { motion, AnimatePresence } from 'framer-motion';
import { PencilIcon, XMarkIcon, CheckIcon, EyeIcon, PlusIcon, ClockIcon, BuildingOffice2Icon, UserIcon, CalendarIcon } from '@heroicons/react/24/outline';

const GET_CITIZEN_ID = gql`
  query GetCitizenId($email: String!) {
    citizens(where: {email: {_eq: $email}}) {
      id
    }
  }
`;

const GET_HEALTH_RECORDS = gql`
  query GetHealthRecords($citizenId: Int!) {
    health_records(where: {citizen_id: {_eq: $citizenId}}, order_by: {created_at: desc}) {
      id
      record_type
      record_description
      hospital_or_lab_name
      doctor_name
      visit_date
      additional_notes
      file_path
      created_at
    }
  }
`;

const ADD_HEALTH_RECORD = gql`
  mutation AddHealthRecord($input: health_records_insert_input!) {
    insert_health_records_one(object: $input) {
      id
    }
  }
`;

const UPDATE_HEALTH_RECORD = gql`
  mutation UpdateHealthRecord($id: Int!, $input: health_records_set_input!) {
    update_health_records_by_pk(pk_columns: {id: $id}, _set: $input) {
      id
    }
  }
`;

const CardForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    id: null,
    record_type: '',
    record_description: '',
    hospital_or_lab_name: '',
    doctor_name: '',
    visit_date: '',
    additional_notes: '',
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: citizenData } = useQuery(GET_CITIZEN_ID, {
    variables: { email: user?.email },
    skip: !user?.email,
  });

  const { data: healthRecordsData, refetch: refetchHealthRecords } = useQuery(GET_HEALTH_RECORDS, {
    variables: { citizenId: citizenData?.citizens[0]?.id },
    skip: !citizenData?.citizens[0]?.id,
  });

  const [addHealthRecord] = useMutation(ADD_HEALTH_RECORD, {
    onError: (error) => {
      console.error('Add health record error:', error);
      setError('Failed to add health record. Please try again.');
      setIsSubmitting(false);
    }
  });

  const [updateHealthRecord] = useMutation(UPDATE_HEALTH_RECORD, {
    onError: (error) => {
      console.error('Update health record error:', error);
      setError('Failed to update health record. Please try again.');
      setIsSubmitting(false);
    }
  });

  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError('');

    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        setFile(null);
        setPreviewUrl('');
        return;
      }

      if (!selectedFile.type.startsWith('image/')) {
        setError('Please upload an image file');
        setFile(null);
        setPreviewUrl('');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.onerror = () => {
        setError('Error reading file');
        setFile(null);
        setPreviewUrl('');
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!citizenData?.citizens[0]?.id) {
      setError('User information not found. Please try logging in again.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.record_type || !formData.hospital_or_lab_name || !formData.visit_date) {
      setError('Please fill in all required fields (Record Type, Hospital/Lab Name, and Visit Date)');
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = {
        record_type: formData.record_type.trim(),
        record_description: formData.record_description?.trim(),
        hospital_or_lab_name: formData.hospital_or_lab_name.trim(),
        doctor_name: formData.doctor_name?.trim(),
        visit_date: formData.visit_date,
        additional_notes: formData.additional_notes?.trim(),
        file_path: previewUrl || formData.file_path,
      };

      if (isEditing) {
        await updateHealthRecord({
          variables: {
            id: formData.id,
            input: submitData,
          },
        });
      } else {
        await addHealthRecord({
          variables: {
            input: {
              citizen_id: citizenData.citizens[0].id,
              ...submitData,
            },
          },
        });
      }

      await refetchHealthRecords();
      resetForm();
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error saving health record:', error);
      setError('An error occurred while saving the record');
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      record_type: '',
      record_description: '',
      hospital_or_lab_name: '',
      doctor_name: '',
      visit_date: '',
      additional_notes: '',
    });
    setFile(null);
    setPreviewUrl('');
    setIsEditing(false);
    setError('');
  };

  const handleEdit = (record) => {
    setError('');
    setFormData({
      id: record.id,
      record_type: record.record_type || '',
      record_description: record.record_description || '',
      hospital_or_lab_name: record.hospital_or_lab_name || '',
      doctor_name: record.doctor_name || '',
      visit_date: record.visit_date || '',
      additional_notes: record.additional_notes || '',
    });
    setPreviewUrl(record.file_path || '');
    setIsEditing(true);
  };

  const formFields = [
    { name: 'record_type', label: 'Record Type*', type: 'text', required: true },
    { name: 'record_description', label: 'Record Description', type: 'textarea' },
    { name: 'hospital_or_lab_name', label: 'Hospital/Lab Name*', type: 'text', required: true },
    { name: 'doctor_name', label: 'Doctor Name', type: 'text' },
    { name: 'visit_date', label: 'Visit Date*', type: 'date', required: true },
    { name: 'additional_notes', label: 'Additional Notes', type: 'textarea' },
  ];

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <div className="w-full max-w-7xl flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
        {/* Previous Submissions */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 bg-white rounded-2xl shadow-xl p-6 overflow-hidden"
        >
          <h2 className="text-3xl font-bold text-blue-600 mb-6 flex items-center">
            <ClockIcon className="h-8 w-8 mr-2 text-blue-500" />
            Previous Records
          </h2>
          <div className="overflow-y-auto max-h-[calc(100vh-250px)] pr-4">
            <AnimatePresence>
              {healthRecordsData?.health_records.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-gray-50 p-6 rounded-xl mb-4 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-blue-600 text-lg">{record.record_type}</h3>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(record)}
                        className="text-blue-500 hover:text-blue-600 transition duration-300"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedImage(record.file_path)}
                        className="text-green-500 hover:text-green-600 transition duration-300"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600 flex items-center">
                      <BuildingOffice2Icon className="h-4 w-4 mr-2 text-blue-500" />
                      <strong>Hospital/Lab:</strong> {record.hospital_or_lab_name}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <UserIcon className="h-4 w-4 mr-2 text-blue-500" />
                      <strong>Doctor:</strong> {record.doctor_name}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" />
                      <strong>Date:</strong> {new Date(record.visit_date).toLocaleDateString()}
                    </p>
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 overflow-hidden"
                  >
                    <p className="text-sm text-gray-600"><strong>Description:</strong> {record.record_description}</p>
                    <p className="text-sm text-gray-600"><strong>Notes:</strong> {record.additional_notes}</p>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 bg-white rounded-2xl shadow-xl p-6"
        >
          <h2 className="text-3xl font-bold text-blue-600 mb-6 flex items-center">
            {isEditing ? <PencilIcon className="h-8 w-8 mr-2 text-blue-500" /> : <PlusIcon className="h-8 w-8 mr-2 text-blue-500" />}
            {isEditing ? 'Edit Health Record' : 'Add Health Record'}
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {formFields.map((field) => (
              <motion.div
                key={field.name}
                whileHover={{ scale: 1.02 }}
                className="flex flex-col"
              >
                <label htmlFor={field.name} className="text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    rows="3"
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  />
                )}
              </motion.div>
            ))}
            <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col">
              <label htmlFor="file" className="text-sm font-medium text-gray-700 mb-1">Upload File (Image only)</label>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={handleFileChange}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </motion.div>
            {previewUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <h3 className="text-sm font-medium text-gray-700 mb-2">File Preview:</h3>
                <div className="w-40 h-40 border border-gray-300 rounded-lg overflow-hidden">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              </motion.div>
            )}
            <div className="flex space-x-4">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                className={`flex-1 ${
                  isSubmitting ? 'bg-blue-400' : 'bg-blue-600'
                } text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center text-lg font-semibold`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <CheckIcon className="h-6 w-6 mr-2" />
                    {isEditing ? 'Save Changes' : 'Submit Record'}
                  </>
                )}
              </motion.button>
              {isEditing && (
                <motion.button
                  type="button"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition duration-300 flex items-center justify-center text-lg font-semibold"
                >
                  <XMarkIcon className="h-6 w-6 mr-2" />
                  Cancel
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-6 rounded-xl max-w-3xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedImage} alt="Full size preview" className="max-w-full h-auto rounded-lg shadow-lg" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedImage(null)}
                className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center text-lg font-semibold"
              >
                <XMarkIcon className="h-6 w-6 mr-2" />
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardForm;
