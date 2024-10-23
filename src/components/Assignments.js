import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { 
  MagnifyingGlassIcon, 
  ChevronRightIcon, 
  XMarkIcon,
  PaperClipIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  EyeIcon,
  DocumentIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const GET_ASSIGNMENTS = gql`
  query GetAssignments($volunteerId: Int!) {
    assignments(where: { volunteer_id: { _is_null: true } }) {
      id
      title
      description
      given_at
      area
      skills_required
      contact_number
      assignment_status
    }
    volunteer_assignments: assignments(where: { volunteer_id: { _eq: $volunteerId } }) {
      id
      title
      description
      given_at
      area
      skills_required
      contact_number
      assignment_status
      submission1
      submission2
      submission3
    }
  }
`;

const ACCEPT_ASSIGNMENT = gql`
  mutation AcceptAssignment($assignmentId: Int!, $volunteerId: Int!) {
    update_assignments_by_pk(
      pk_columns: { id: $assignmentId },
      _set: { volunteer_id: $volunteerId, assignment_status: "Working" }
    ) {
      id
      assignment_status
    }
  }
`;

const UPDATE_ASSIGNMENT = gql`
  mutation UpdateAssignment($assignmentId: Int!, $status: String!, $submission1: String, $submission2: String, $submission3: String) {
    update_assignments_by_pk(
      pk_columns: { id: $assignmentId },
      _set: { assignment_status: $status, submission1: $submission1, submission2: $submission2, submission3: $submission3 }
    ) {
      id
      assignment_status
      submission1
      submission2
      submission3
    }
  }
`;

const VolunteerAssignments = ({ volunteerId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const { loading, error, data, refetch } = useQuery(GET_ASSIGNMENTS, {
    variables: { volunteerId },
  });
  const [acceptAssignment] = useMutation(ACCEPT_ASSIGNMENT);
  const [updateAssignment] = useMutation(UPDATE_ASSIGNMENT);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { assignments, volunteer_assignments } = data;

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAcceptAssignment = async (assignmentId) => {
    try {
      await acceptAssignment({
        variables: { assignmentId, volunteerId },
      });
      refetch();
    } catch (error) {
      console.error('Error accepting assignment:', error);
    }
  };

  const handleUpdateAssignment = async (assignmentId, status, submission1, submission2, submission3) => {
    try {
      await updateAssignment({
        variables: { assignmentId, status, submission1, submission2, submission3 },
      });
      refetch();
      setSelectedAssignment(null);
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'Working':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'Pending':
        return <ExclamationCircleIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <ExclamationCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const renderAssignmentCard = (assignment, isVolunteerAssignment = false) => (
    <div key={assignment.id} className="bg-white shadow-md rounded-lg p-4 mb-4 w-72 flex-shrink-0">
      <h3 className="text-lg font-semibold mb-2">{assignment.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
      <p className="text-sm"><strong>Area:</strong> {assignment.area}</p>
      <p className="text-sm"><strong>Skills Required:</strong> {assignment.skills_required}</p>
      <p className="text-sm"><strong>Contact:</strong> {assignment.contact_number}</p>
      <div className="flex items-center mt-2">
        <strong className="mr-2">Status:</strong>
        {getStatusIcon(assignment.assignment_status)}
        <span className="ml-1">{assignment.assignment_status}</span>
      </div>
      {isVolunteerAssignment ? (
        <button
          onClick={() => setSelectedAssignment(assignment)}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          Update Status
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </button>
      ) : (
        <button
          onClick={() => handleAcceptAssignment(assignment.id)}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
        >
          Accept Assignment
          <CheckCircleIcon className="h-4 w-4 ml-1" />
        </button>
      )}
    </div>
  );

  const renderFilePreview = (file) => {
    if (!file) return null;

    const [fileType, fileData] = file.split(',');
    const isImage = fileType.includes('image');

    if (isImage) {
      return (
        <div className="mt-4">
          <img src={file} alt="Preview" className="max-w-full h-auto" />
        </div>
      );
    } else {
      return (
        <div className="mt-4 flex items-center justify-center">
          <DocumentIcon className="h-16 w-16 text-gray-500" />
          <a
            href={file}
            download="file"
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
          >
            Download File
            <ArrowDownTrayIcon className="h-4 w-4 ml-2" />
          </a>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-4">Available Assignments</h2>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search assignments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md pr-10"
        />
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
      </div>
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
          {filteredAssignments.map(assignment => renderAssignmentCard(assignment))}
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Your Assignments</h2>
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
          {volunteer_assignments.map(assignment => renderAssignmentCard(assignment, true))}
        </div>
      </div>

      {selectedAssignment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{selectedAssignment.title}</h3>
              <button onClick={() => setSelectedAssignment(null)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={selectedAssignment.assignment_status}
                onChange={(e) => {
                  const updatedAssignment = { ...selectedAssignment, assignment_status: e.target.value };
                  handleUpdateAssignment(
                    updatedAssignment.id,
                    updatedAssignment.assignment_status,
                    updatedAssignment.submission1,
                    updatedAssignment.submission2,
                    updatedAssignment.submission3
                  );
                }}
              >
                <option value="Not Started">Not Started</option>
                <option value="Working">Working</option>
                <option value="Pending">Pending</option>
                <option value="Done">Done</option>
              </select>
            </div>
            {['submission1', 'submission2', 'submission3'].map((submission, index) => (
              <div key={submission} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Submission {index + 1}</label>
                <div className="flex items-center">
                  <input
                    type="file"
                    id={`file-${submission}`}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const updatedAssignment = { ...selectedAssignment, [submission]: reader.result };
                        handleUpdateAssignment(
                          updatedAssignment.id,
                          updatedAssignment.assignment_status,
                          updatedAssignment.submission1,
                          updatedAssignment.submission2,
                          updatedAssignment.submission3
                        );
                      };
                      if (file) {
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label
                    htmlFor={`file-${submission}`}
                    className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PaperClipIcon className="h-5 w-5 inline-block mr-2" />
                    Choose File
                  </label>
                  {selectedAssignment[submission] && (
                    <button
                      onClick={() => setPreviewFile(selectedAssignment[submission])}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  )}
                  <span className="ml-3 text-sm text-gray-500">
                    {selectedAssignment[submission] ? 'File uploaded' : 'No file chosen'}
                  </span>
                </div>
              </div>
            ))}
            <button
              onClick={() => setSelectedAssignment(null)}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {previewFile && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">File Preview</h3>
              <button onClick={() => setPreviewFile(null)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            {renderFilePreview(previewFile)}
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerAssignments;