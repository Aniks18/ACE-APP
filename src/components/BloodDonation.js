import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { 
  PlusIcon, 
  HeartIcon, 
  MagnifyingGlassIcon, 
  XMarkIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
const GET_BLOOD_DONATIONS = gql`
  query GetBloodDonations {
    blood_donation {
      id
      blood_group
      area
      contact
      specific_requirement
      created_at
      volunteer_id
      admin_id
      hospital_admin_id
      citizen_id
      donor_id
      requireduser_id
    }
  }
`;

const ADD_BLOOD_DONATION = gql`
  mutation AddBloodDonation(
    $blood_group: String!, 
    $area: String!, 
    $contact: String!, 
    $specific_requirement: String,
    $volunteer_id: Int,
    $admin_id: Int,
    $hospital_admin_id: Int,
    $citizen_id: Int,
    $donor_id: Int,
    $requireduser_id: Int
  ) {
    insert_blood_donation_one(object: {
      blood_group: $blood_group,
      area: $area,
      contact: $contact,
      specific_requirement: $specific_requirement,
      volunteer_id: $volunteer_id,
      admin_id: $admin_id,
      hospital_admin_id: $hospital_admin_id,
      citizen_id: $citizen_id,
      donor_id: $donor_id,
      requireduser_id: $requireduser_id
    }) {
      id
    }
  }
`;

const UPDATE_BLOOD_DONATION = gql`
  mutation UpdateBloodDonation($id: Int!, $donor_id: Int!) {
    update_blood_donation_by_pk(
      pk_columns: { id: $id },
      _set: { donor_id: $donor_id }
    ) {
      id
    }
  }
`;

const BloodDonation = ({ userId, userRole }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    blood_group: '',
    area: '',
    contact: '',
    specific_requirement: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { loading, error, data, refetch } = useQuery(GET_BLOOD_DONATIONS);
  const [addBloodDonation] = useMutation(ADD_BLOOD_DONATION);
  const [updateBloodDonation] = useMutation(UPDATE_BLOOD_DONATION);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const variables = {
      ...formData,
      [userRole === 'admin_user' ? 'admin_id' : `${userRole}_id`]: userId,
      [e.target.id === 'donate' ? 'donor_id' : 'requireduser_id']: userId,
    };

    try {
      await addBloodDonation({ variables });
      setShowForm(false);
      setFormData({ blood_group: '', area: '', contact: '', specific_requirement: '' });
      refetch();
    } catch (err) {
      console.error('Error adding blood donation:', err);
    }
  };

  const handleDonate = async (id) => {
    try {
      await updateBloodDonation({ variables: { id, donor_id: userId } });
      refetch();
    } catch (err) {
      console.error('Error updating blood donation:', err);
    }
  };

  const filteredDonations = data?.blood_donation.filter(donation =>
    donation.blood_group.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.area.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Blood Donation Management</h1>
      
      <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:justify-between sm:items-center">
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded inline-flex items-center justify-center transition duration-300 ease-in-out"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Request/Donation
        </button>
        <div className="relative w-full sm:w-64 md:w-80">
          <input
            type="text"
            placeholder="Search by blood group or area"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary">Add Blood Donation Request/Offer</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700 transition duration-300 ease-in-out">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="blood_group">
                  Blood Group
                </label>
                <select
                  id="blood_group"
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="area">
                  Area
                </label>
                <input
                  type="text"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact">
                  Contact
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="specific_requirement">
                  Specific Requirement
                </label>
                <textarea
                  id="specific_requirement"
                  name="specific_requirement"
                  value={formData.specific_requirement}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  type="submit"
                  id="request"
                  className="w-full sm:w-1/2 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                >
                  Submit Request
                </button>
                <button
                  type="submit"
                  id="donate"
                  className="w-full sm:w-1/2 bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                >
                  Offer Donation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDonations.map(donation => (
          <div key={donation.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300 ease-in-out">
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2 flex items-center text-primary">
                <HeartIcon className="h-6 w-6 text-red-500 mr-2" />
                {donation.blood_group}
              </div>
              <p className="text-gray-700 text-base mb-2 flex items-center">
                <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
                {donation.area}
              </p>
              <p className="text-gray-700 text-base mb-2 flex items-center">
                <PhoneIcon className="h-5 w-5 text-gray-500 mr-2" />
                {donation.contact}
              </p>
              {donation.specific_requirement && (
                <p className="text-gray-700 text-base mb-2 flex items-center">
                  <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500 mr-2" />
                  {donation.specific_requirement}
                </p>
              )}
              <p className="text-gray-600 text-sm mb-2 flex items-center">
                <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                {donation.requireduser_id ? 'Request' : 'Donation offer'}
              </p>
            </div>
            <div className="px-6 py-4">
              {!donation.donor_id && userId !== donation.requireduser_id && (
                <button
                  onClick={() => handleDonate(donation.id)}
                  className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded inline-flex items-center justify-center transition duration-300 ease-in-out"
                >
                  <HeartIcon className="h-5 w-5 mr-2" />
                  Donate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BloodDonation;