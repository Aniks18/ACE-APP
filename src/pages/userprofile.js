import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_USER_DETAILS = gql`
  query GetUserDetails($email: String!) {
    hospital_admins(where: {email: {_eq: $email}}) {
      id username email full_name address contact_number
    }
    medical_shop_admins(where: {email: {_eq: $email}}) {
      id username email full_name address contact_number medical_shop_id
    }
    citizens(where: {email: {_eq: $email}}) {
      id username email full_name date_of_birth address phone_number emergency_contact medical_history vaccination_record
    }
    admin_users(where: {email: {_eq: $email}}) {
      id username email full_name role address
    }
    volunteers(where: {email: {_eq: $email}}) {
      id username email full_name date_of_birth address phone_number skills availability
    }
  }
`;

const UPDATE_HOSPITAL_ADMIN = gql`
  mutation UpdateHospitalAdmin($id: Int!, $data: hospital_admins_set_input!) {
    update_hospital_admins_by_pk(pk_columns: {id: $id}, _set: $data) {
      id
    }
  }
`;

const UPDATE_MEDICAL_SHOP_ADMIN = gql`
  mutation UpdateMedicalShopAdmin($id: Int!, $data: medical_shop_admins_set_input!) {
    update_medical_shop_admins_by_pk(pk_columns: {id: $id}, _set: $data) {
      id
    }
  }
`;

const UPDATE_CITIZEN = gql`
  mutation UpdateCitizen($id: Int!, $data: citizens_set_input!) {
    update_citizens_by_pk(pk_columns: {id: $id}, _set: $data) {
      id
    }
  }
`;

const UPDATE_ADMIN_USER = gql`
  mutation UpdateAdminUser($id: Int!, $data: admin_users_set_input!) {
    update_admin_users_by_pk(pk_columns: {id: $id}, _set: $data) {
      id
    }
  }
`;

const UPDATE_VOLUNTEER = gql`
  mutation UpdateVolunteer($id: Int!, $data: volunteers_set_input!) {
    update_volunteers_by_pk(pk_columns: {id: $id}, _set: $data) {
      id
    }
  }
`;

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [editedDetails, setEditedDetails] = useState({});
  const [userType, setUserType] = useState('');
  const [saveMessage, setSaveMessage] = useState({ type: '', message: '' });
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');

  const { loading, error, data, refetch } = useQuery(GET_USER_DETAILS, {
    variables: { email },
  });

  const [updateHospitalAdmin] = useMutation(UPDATE_HOSPITAL_ADMIN);
  const [updateMedicalShopAdmin] = useMutation(UPDATE_MEDICAL_SHOP_ADMIN);
  const [updateCitizen] = useMutation(UPDATE_CITIZEN);
  const [updateAdminUser] = useMutation(UPDATE_ADMIN_USER);
  const [updateVolunteer] = useMutation(UPDATE_VOLUNTEER);

  useEffect(() => {
    if (data) {
      const userTypes = ['hospital_admins', 'medical_shop_admins', 'citizens', 'admin_users', 'volunteers'];
      for (const type of userTypes) {
        if (data[type] && data[type].length > 0) {
          setUserDetails(data[type][0]);
          setEditedDetails(data[type][0]);
          setUserType(type);
          break;
        }
      }
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails({ ...editedDetails, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedDetails({ ...userDetails });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedDetails({ ...userDetails });
    setSaveMessage({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { id, created_at, updated_at, __typename, ...updateData } = editedDetails;
      
      // Check if there are any changes
      const hasChanges = Object.keys(updateData).some(key => updateData[key] !== userDetails[key]);
      
      if (!hasChanges) {
        setSaveMessage({ type: 'info', message: 'No changes were made.' });
        return;
      }

      let updateFunction;
      switch (userType) {
        case 'hospital_admins':
          updateFunction = updateHospitalAdmin;
          break;
        case 'medical_shop_admins':
          updateFunction = updateMedicalShopAdmin;
          break;
        case 'citizens':
          updateFunction = updateCitizen;
          break;
        case 'admin_users':
          updateFunction = updateAdminUser;
          break;
        case 'volunteers':
          updateFunction = updateVolunteer;
          break;
        default:
          throw new Error('Unknown user type');
      }
      
      await updateFunction({
        variables: {
          id: id,
          data: updateData,
        },
      });
      
      setIsEditing(false);
      setUserDetails(editedDetails);
      setSaveMessage({ type: 'success', message: 'Your details have been successfully updated!' });
      refetch();
    } catch (err) {
      console.error('Error updating user details:', err);
      setSaveMessage({ type: 'error', message: 'An error occurred while updating your details. Please try again.' });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const renderFields = () => {
    const excludeFields = ['id', 'created_at', 'updated_at', 'password', '__typename'];
    return Object.entries(userDetails).map(([key, value]) => {
      if (excludeFields.includes(key)) return null;
      return (
        <div key={key} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={key}>
            {key.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </label>
          {isEditing ? (
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id={key}
              type={key.includes('date') ? 'date' : 'text'}
              name={key}
              value={editedDetails[key] || ''}
              onChange={handleInputChange}
            />
          ) : (
            <p className="text-gray-700">{value}</p>
          )}
        </div>
      );
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">User Profile</h2>
      {saveMessage.message && (
        <div className={`mb-4 p-4 rounded ${
          saveMessage.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 
          saveMessage.type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' :
          'bg-blue-100 border border-blue-400 text-blue-700'
        }`}>
          {saveMessage.message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {renderFields()}
        <div className="flex justify-end mt-6">
          {isEditing ? (
            <>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleEdit}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserProfile;