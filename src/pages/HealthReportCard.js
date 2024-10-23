import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { 
  UserIcon, 
  PhoneIcon, 
  CalendarIcon, 
  MapPinIcon, 
  UserCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const GET_CITIZEN_AND_HEALTH_RECORDS = gql`
  query GetCitizenAndHealthRecords($citizenId: Int!) {
    citizens_by_pk(id: $citizenId) {
      id
      full_name
      date_of_birth
      address
      phone_number
      emergency_contact
      medical_history
      vaccination_record
    }
    health_records(where: {citizen_id: {_eq: $citizenId}}, order_by: {visit_date: desc}) {
      id
      record_type
      record_description
      hospital_or_lab_name
      doctor_name
      visit_date
      file_path
      additional_notes
      created_at
    }
  }
`;

const HealthRecordCard = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_CITIZEN_AND_HEALTH_RECORDS, {
    variables: { citizenId: parseInt(id) },
  });
  const [selectedFile, setSelectedFile] = useState(null);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen">Error: {error.message}</div>;

  const citizen = data.citizens_by_pk;
  const healthRecords = data.health_records;

  if (!citizen) return <div className="flex justify-center items-center h-screen">Citizen not found</div>;

  const renderFileContent = (fileContent) => {
    if (fileContent.startsWith('data:image')) {
      return <img src={fileContent} alt="Medical Record" className="max-w-full h-auto" />;
    } else {
      return <div className="whitespace-pre-wrap">{fileContent}</div>;
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-2xl rounded-lg overflow-hidden border-t-8 border-blue-600">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6">
          <h1 className="text-3xl font-bold">Medical Report Card</h1>
          <p className="text-lg mt-2">Swasthya Setu Health Services</p>
        </div>
        
        {/* Citizen Details */}
        <div className="p-6 bg-white">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Patient Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-semibold mr-2">Name:</span> {citizen.full_name}
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-semibold mr-2">Date of Birth:</span> {new Date(citizen.date_of_birth).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-semibold mr-2">Address:</span> {citizen.address}
            </div>
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-semibold mr-2">Phone:</span> {citizen.phone_number}
            </div>
            <div className="flex items-center">
              <UserCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-semibold mr-2">Emergency Contact:</span> {citizen.emergency_contact}
            </div>
          </div>
        </div>

        {/* Medical History and Vaccination Record */}
        <div className="p-6 bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Medical History</h2>
          <p className="mb-4 text-gray-700">{citizen.medical_history}</p>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Vaccination Record</h2>
          <p className="text-gray-700">{citizen.vaccination_record}</p>
        </div>

        {/* Health Records */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Health Records</h2>
          {healthRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Type</th>
                    <th className="py-3 px-4 text-left">Description</th>
                    <th className="py-3 px-4 text-left">Hospital/Lab</th>
                    <th className="py-3 px-4 text-left">Doctor</th>
                    <th className="py-3 px-4 text-left">Visit Date</th>
                    <th className="py-3 px-4 text-left">File</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {healthRecords.map((record, index) => (
                    <tr key={record.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                      <td className="py-3 px-4 border-b">{record.record_type}</td>
                      <td className="py-3 px-4 border-b">{record.record_description}</td>
                      <td className="py-3 px-4 border-b">{record.hospital_or_lab_name}</td>
                      <td className="py-3 px-4 border-b">{record.doctor_name}</td>
                      <td className="py-3 px-4 border-b">{new Date(record.visit_date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 border-b">
                        {record.file_path && (
                          <button
                            onClick={() => setSelectedFile(record.file_path)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                          >
                            View File
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 italic">No health records found for this citizen.</p>
          )}
        </div>
      </div>

      {/* File Viewer Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">File Viewer</h3>
              <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-gray-700 transition duration-300 ease-in-out">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            {renderFileContent(selectedFile)}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthRecordCard;