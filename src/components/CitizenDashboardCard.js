import React, { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useQuery, gql } from '@apollo/client';
import { UserCircleIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import html2canvas from 'html2canvas';

const GET_CITIZEN = gql`
  query GetCitizen($id: Int!) {
    citizens_by_pk(id: $id) {
      id
      full_name
      phone_number
    }
  }
`;

const CitizenDashboardCard = ({ citizenId }) => {
  const { loading, error, data } = useQuery(GET_CITIZEN, {
    variables: { id: citizenId },
  });
  const [qrValue, setQrValue] = useState('');
  const cardRef = useRef(null);

  useEffect(() => {
    if (data && data.citizens_by_pk) {
      setQrValue(`http://localhost:3000/card/${data.citizens_by_pk.id}`);
    }
  }, [data]);

  const handleDownload = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
      });
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.download = 'SwasthyaCard.png';
      link.href = image;
      link.click();
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  const { full_name, phone_number } = data.citizens_by_pk;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-4">
      <div ref={cardRef} className="bg-white rounded-3xl shadow-2xl p-8 m-4 max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 opacity-50 z-0"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-blue-800">Swasthya Card</h2>
            <div className="w-20 h-20 rounded-full bg-blue-500 shadow-lg flex items-center justify-center">
              <UserCircleIcon className="h-16 w-16 text-white" />
            </div>
          </div>
          <div className="mb-8 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Name - {full_name}</h3>
            <p className="text-gray-600">Contact - {phone_number}</p>
          </div>
          <div className="flex justify-center mb-6">
            <div className="p-2 bg-white rounded-lg shadow-md">
              <QRCodeSVG
                value={qrValue}
                size={200}
                level={"H"}
                includeMargin={true}
              />
            </div>
          </div>
          <p className="text-center text-sm text-gray-500">
            Scan to view full health record
          </p>
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-300 to-purple-300 rounded-tl-full z-0 opacity-50"></div>
      </div>
      <button
        onClick={handleDownload}
        className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out flex items-center"
      >
        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
        Download Card
      </button>
    </div>
  );
};

export default CitizenDashboardCard;