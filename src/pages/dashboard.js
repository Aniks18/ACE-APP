import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { useAuth } from '../autocontext'; // Adjust the import path as needed
import HospitalDetails from '../components/HospitalDetails';
import HospitalStaff from '../components/HospitalStaff';
import MedicalShopDetails from '../components/MedicalShopDetails';
import CreateMedicalShop from '../components/CreateMedicalShop';
import MedicalShopInventory from '../components/MedicalShopInventory';
import AdminDashboard from '../components/AdminDashboard';
import VolunteerAssignments from '../components/Assignments'; 
import CitizenDashboardCard from '../components/CitizenDashboardCard'; 
import Lottie from 'lottie-react';
import inventoryAnimation from '../assets/medicine.json';
import BloodDonation from '../components/BloodDonation';
import { UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, BuildingOfficeIcon, SparklesIcon } from '@heroicons/react/24/outline';

const GET_USER_DATA = gql`
  query GetUserData($firebase_uid: String!) {
    hospital_admins(where: {firebase_uid: {_eq: $firebase_uid}}) {
      id username email full_name address contact_number hospital_id
    }
    medical_shop_admins(where: {firebase_uid: {_eq: $firebase_uid}}) {
      id username email full_name address contact_number medical_shop_id
    }
    citizens(where: {firebase_uid: {_eq: $firebase_uid}}) {
      id username email full_name date_of_birth address phone_number emergency_contact medical_history vaccination_record
    }
    volunteers(where: {firebase_uid: {_eq: $firebase_uid}}) {
      id username email full_name date_of_birth address phone_number skills availability
    }
    admin_users(where: {firebase_uid: {_eq: $firebase_uid}}) {
      id username email full_name role address
    }
  }
`;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_USER_DATA, {
    variables: { firebase_uid: user?.uid },
    skip: !user,
  });

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const userTypes = ['hospital_admins', 'medical_shop_admins', 'citizens', 'volunteers', 'admin_users'];
  let userData;
  let userRole;

  for (const type of userTypes) {
    if (data[type] && data[type].length > 0) {
      userData = data[type][0];
      userRole = type === 'admin_users' ? 'admin_user' : type.slice(0, -1);
      break;
    }
  }

  const getUserRoleDisplay = (role) => {
    switch (role) {
      case 'hospital_admin': return 'Hospital Administrator';
      case 'medical_shop_admin': return 'Medical Shop Administrator';
      case 'citizen': return 'Citizen';
      case 'volunteer': return 'Volunteer';
      case 'admin_user': return 'System Administrator';
      default: return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  const renderUserDetails = () => {
    if (!userData) return <p>No user data available.</p>;

    const excludeFields = ['id', 'firebase_uid', 'hospital_id', 'medical_shop_id'];
    const fieldIcons = {
      username: UserIcon,
      email: EnvelopeIcon,
      full_name: UserIcon,
      address: MapPinIcon,
      contact_number: PhoneIcon,
    };

    return (
      <table className="w-full">
        <tbody>
          {Object.entries(userData).map(([key, value]) => {
            if (excludeFields.includes(key)) return null;
            const Icon = fieldIcons[key] || UserIcon;
            return (
              <tr key={key} className="border-b">
                <td className="py-2 pr-2">
                  <Icon className="h-5 w-5 text-gray-500" />
                </td>
                <td className="py-2 font-medium text-gray-700">
                  {key.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
                </td>
                <td className="py-2 pl-2 text-gray-900">{value !== null ? value : 'N/A'}</td>
              </tr>
            );
          })}
          {userRole === 'hospital_admin' && (
            <>
              <tr className="border-b">
                <td className="py-2 pr-2">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-500" />
                </td>
                <td className="py-2 font-medium text-gray-700">Hospital Reg No:</td>
                <td className="py-2 pl-2 text-gray-900">{userData.hospital_id || 'N/A'}</td>
              </tr>
              <tr>
                <td className="py-2 pr-2">
                  <UserIcon className="h-5 w-5 text-gray-500" />
                </td>
                <td className="py-2 font-medium text-gray-700">Role:</td>
                <td className="py-2 pl-2 text-gray-900">Hospital Administrator</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    );
  };

  const renderDetailsComponent = () => {
    switch (userRole) {
      case 'hospital_admin':
        return (
          <>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-4 bg-blue-50">
                <h2 className="text-xl font-semibold text-blue-800">Hospital Details</h2>
              </div>
              <div className="p-4">
                {userData.hospital_id ? (
                  <HospitalDetails hospitalId={userData.hospital_id} />
                ) : (
                  <p>No hospital associated. Please create or link a hospital.</p>
                )}
              </div>
            </div>
            {userData.hospital_id && (
              <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-6">
                <div className="p-4 bg-blue-50">
                  <h2 className="text-xl font-semibold text-blue-800">Hospital Staff</h2>
                </div>
                <div className="p-4">
                  <HospitalStaff hospitalId={userData.hospital_id} />
                </div>
              </div>
            )}
          </>
        );
      case 'medical_shop_admin':
        return (
          <>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
              <div className="p-4 bg-blue-50">
                <h2 className="text-xl font-semibold text-blue-800">Medical Shop Details</h2>
              </div>
              <div className="p-4">
                {userData.medical_shop_id ? (
                  <MedicalShopDetails medicalShopId={userData.medical_shop_id} />
                ) : (
                  <p>No medical shop associated. Please create or link a medical shop.</p>
                )}
              </div>
            </div>
            {userData.medical_shop_id && (
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6 bg-blue-50 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-blue-800">Inventory and Sales</h2>
                <Lottie
                  animationData={inventoryAnimation}
                  style={{ width: 100, height: 100 }}
                  className="ml-4"
                />
              </div>
              <div className="p-4">
                <MedicalShopInventory medical_shop_id={userData.medical_shop_id} />
              </div>
            </div>
            )}
          </>
        );
      case 'admin_user':
        return <AdminDashboard />;
      case 'volunteer':
        return <VolunteerAssignments volunteerId={userData.id} />;
        case 'citizen':
        return (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-4 bg-blue-50">
              <h2 className="text-xl font-semibold text-blue-800">Citizen Dashboard</h2>
            </div>
            <div className="p-4">
              <p className="mb-4">Welcome, {userData.full_name}. This is your citizen dashboard.</p>
              <CitizenDashboardCard citizenId={userData.id} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderAdditionalInfo = () => {
    if (userRole === 'hospital_admin' && !userData.hospital_id) {
      return (
        <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p className="font-bold">Notice:</p>
          <p>You have not created any hospital yet. Please create a hospital to manage.</p>
          <Link 
            to={`/add-hospital?email=${encodeURIComponent(userData.email)}`}
            className="mt-2 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Hospital
          </Link>
        </div>
      );
    } else if (userRole === 'medical_shop_admin' && !userData.medical_shop_id) {
      return (
        <div className="mt-4">
          <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 mb-4">
            <p className="font-bold">Notice:</p>
            <p>You have not created any medical shop yet. Please create a medical shop to manage.</p>
          </div>
          <CreateMedicalShop adminId={userData.id} />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Welcome to Swasthya Setu Control Panel as {getUserRoleDisplay(userRole)}
      </h1>
      <Link
          to="/ai-dashboard"
          className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded-md shadow-2xl bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 active:from-purple-700 active:to-blue-600 transition-all duration-300 ease-out hover:scale-105 focus:outline-none"
        >
          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
          <SparklesIcon className="w-5 h-5 mr-2" />
          <span className="relative">AI Dashboard</span>
        </Link>
      <div className="flex flex-col md:flex-row justify-center items-start space-y-6 md:space-y-0 md:space-x-6 mb-10">
        <div className="w-full md:w-2/3 order-2 md:order-1">
          {renderDetailsComponent()}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-6">
            <div className="p-4 bg-red-50">
              <h2 className="text-xl font-semibold text-red-800">Blood Donation Management</h2>
            </div>
            <div className="p-4">
              <BloodDonation 
                userId={userData.id} 
                userRole={userRole}
              />
            </div>
          </div>
        </div>
        {userData && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full md:w-1/3 order-1 md:order-2">
            <div className="p-4 bg-green-50">
              <h2 className="text-xl font-semibold text-green-800">User Information</h2>
            </div>
            <div className="p-4">
              <div className="max-h-80 overflow-y-auto mb-4">
                {renderUserDetails()}
              </div>
              {renderAdditionalInfo()}
              <Link
                to={`/profile?email=${encodeURIComponent(userData.email)}&role=${encodeURIComponent(userRole)}`}
                className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
              >
                View/Edit Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;