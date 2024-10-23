import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { PlusIcon, PencilIcon, TrashIcon, UserIcon, CalendarIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';

const GET_ASSIGNMENTS = gql`
  query GetAssignments {
    assignments(order_by: { created_at: desc }) {
      id
      title
      description
      given_at
      area
      skills_required
      contact_number
      admin_id
      volunteer_id
      assignment_status
    }
  }
`;

const GET_VOLUNTEER = gql`
  query GetVolunteer($id: Int!) {
    volunteers_by_pk(id: $id) {
      username
      phone_number
      availability
    }
  }
`;

const CREATE_ASSIGNMENT = gql`
  mutation CreateAssignment($input: assignments_insert_input!) {
    insert_assignments_one(object: $input) {
      id
    }
  }
`;

const UPDATE_ASSIGNMENT = gql`
  mutation UpdateAssignment($id: Int!, $input: assignments_set_input!) {
    update_assignments_by_pk(pk_columns: { id: $id }, _set: $input) {
      id
    }
  }
`;

const DELETE_ASSIGNMENT = gql`
  mutation DeleteAssignment($id: Int!) {
    delete_assignments_by_pk(id: $id) {
      id
    }
  }
`;

const AssignmentManager = () => {
  const [assignments, setAssignments] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    area: '',
    skills_required: '',
    contact_number: '',
  });
  const [editingId, setEditingId] = useState(null);

  const { loading, error, data, refetch } = useQuery(GET_ASSIGNMENTS);
  const [createAssignment] = useMutation(CREATE_ASSIGNMENT);
  const [updateAssignment] = useMutation(UPDATE_ASSIGNMENT);
  const [deleteAssignment] = useMutation(DELETE_ASSIGNMENT);

  useEffect(() => {
    if (data) {
      setAssignments(data.assignments);
    }
  }, [data]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateAssignment({
          variables: {
            id: editingId,
            input: formData,
          },
        });
      } else {
        await createAssignment({
          variables: {
            input: {
              ...formData,
              admin_id: 1, // Replace with actual admin ID
              assignment_status: 'Pending',
            },
          },
        });
      }
      refetch();
      setFormData({
        title: '',
        description: '',
        area: '',
        skills_required: '',
        contact_number: '',
      });
      setEditingId(null);
    } catch (err) {
      console.error('Error submitting assignment:', err);
    }
  };

  const handleEdit = (assignment) => {
    setFormData({
      title: assignment.title,
      description: assignment.description,
      area: assignment.area,
      skills_required: assignment.skills_required,
      contact_number: assignment.contact_number,
    });
    setEditingId(assignment.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment({ variables: { id } });
        refetch();
      } catch (err) {
        console.error('Error deleting assignment:', err);
      }
    }
  };

  const VolunteerInfo = ({ volunteerId }) => {
    const { loading, error, data } = useQuery(GET_VOLUNTEER, {
      variables: { id: volunteerId },
      skip: !volunteerId,
    });

    if (loading) return <p>Loading volunteer info...</p>;
    if (error) return <p>Error loading volunteer info</p>;
    if (!data || !data.volunteers_by_pk) return null;

    const volunteer = data.volunteers_by_pk;

    return (
      <div className="mt-4 bg-green-100 p-4 rounded-md">
        <h5 className="font-semibold text-green-700">Assigned Volunteer:</h5>
        <p className="text-sm text-green-600 flex items-center mt-2">
          <UserIcon className="h-4 w-4 mr-2" /> {volunteer.username}
        </p>
        <p className="text-sm text-green-600 flex items-center mt-1">
          <PhoneIcon className="h-4 w-4 mr-2" /> {volunteer.phone_number}
        </p>
        <p className="text-sm text-green-600 flex items-center mt-1">
          <CalendarIcon className="h-4 w-4 mr-2" /> Available: {volunteer.availability}
        </p>
      </div>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="bg-blue-50 shadow-lg rounded-lg overflow-hidden">
      <div className="p-6 bg-blue-100">
        <h2 className="text-2xl font-semibold text-blue-800">Assignment Management</h2>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Assignment Title"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              placeholder="Area"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="text"
              name="skills_required"
              value={formData.skills_required}
              onChange={handleInputChange}
              placeholder="Skills Required"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="text"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleInputChange}
              placeholder="Contact Number"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Assignment Description"
            className="w-full px-3 py-2 border rounded-md mt-4 focus:ring-2 focus:ring-blue-300"
            rows="4"
            required
          ></textarea>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
          >
            {editingId ? 'Update Assignment' : 'Create Assignment'}
          </button>
        </form>

        <div className="space-y-6">
          {['Pending', 'Working', 'Done'].map((status) => (
            <div key={status} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-blue-800">{status} Assignments</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
                {assignments
                  .filter((a) => a.assignment_status === status)
                  .map((assignment) => (
                    <div key={assignment.id} className="bg-blue-50 p-6 rounded-md shadow-sm hover:shadow-md transition-shadow duration-300">
                      <h4 className="text-lg font-semibold text-blue-700">{assignment.title}</h4>
                      <p className="text-gray-600 mt-2">{assignment.description}</p>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2" /> Area: {assignment.area}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <UserIcon className="h-4 w-4 mr-2" /> Skills: {assignment.skills_required}
                        </p>
                      </div>
                      {assignment.volunteer_id ? (
                        <VolunteerInfo volunteerId={assignment.volunteer_id} />
                      ) : (
                        <p className="mt-4 text-yellow-600">Not taken by any volunteer yet. Please wait.</p>
                      )}
                      <div className="mt-4 flex justify-end space-x-2">
                        {status === 'Pending' && (
                          <button
                            onClick={() => handleEdit(assignment)}
                            className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(assignment.id)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-300"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentManager;