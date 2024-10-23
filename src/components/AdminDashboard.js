import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { 
  BuildingOffice2Icon, 
  ShoppingBagIcon, 
  UserGroupIcon, 
  HomeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const GET_HOSPITALS_AND_SHOPS = gql`
  query GetHospitalsAndShops {
    hospitals {
      id
      name
      main_specialty
      total_icu_beds
      total_general_beds
      phone_number
      address
    }
    medical_shops {
      id
      name
      specialization
      inventory_capacity
      phone_number
      address
    }
  }
`;

const GET_TOP_MEDICINES = gql`
  query GetTopMedicines {
    medical_shop_inventory(order_by: {total_sales: desc}, limit: 10) {
      id
      medicine_name
      category
      current_stock
      total_sales
    }
  }
`;

const SEARCH_MEDICINES = gql`
  query SearchMedicines($searchTerm: String!, $category: String, $minStock: Int, $maxStock: Int, $minSales: Int, $maxSales: Int) {
    medical_shop_inventory(
      where: {
        _and: [
          { medicine_name: { _ilike: $searchTerm } },
          { category: { _ilike: $category } },
          { current_stock: { _gte: $minStock } },
          { current_stock: { _lte: $maxStock } },
          { total_sales: { _gte: $minSales } },
          { total_sales: { _lte: $maxSales } }
        ]
      }
    ) {
      id
      medicine_name
      category
      current_stock
      total_sales
    }
  }
`;

const AdminDashboard = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemType, setItemType] = useState(null);
  const [medicineSearchTerm, setMedicineSearchTerm] = useState('');
  const [debouncedMedicineSearchTerm, setDebouncedMedicineSearchTerm] = useState('');
  const [showMedicineFilters, setShowMedicineFilters] = useState(false);
  const [medicineFilters, setMedicineFilters] = useState({
    category: '',
    minStock: '',
    maxStock: '',
    minSales: '',
    maxSales: '',
  });
  const [hospitalSearchTerm, setHospitalSearchTerm] = useState('');
  const [medicalShopSearchTerm, setMedicalShopSearchTerm] = useState('');

  const { loading: loadingHospitalsAndShops, error: errorHospitalsAndShops, data: dataHospitalsAndShops } = useQuery(GET_HOSPITALS_AND_SHOPS);
  const { loading: loadingTopMedicines, error: errorTopMedicines, data: dataTopMedicines } = useQuery(GET_TOP_MEDICINES);
  const { loading: loadingSearchMedicines, error: errorSearchMedicines, data: dataSearchMedicines } = useQuery(SEARCH_MEDICINES, {
    variables: { 
      searchTerm: `%${debouncedMedicineSearchTerm}%`,
      category: medicineFilters.category ? `%${medicineFilters.category}%` : '%',
      minStock: medicineFilters.minStock ? parseInt(medicineFilters.minStock) : 0,
      maxStock: medicineFilters.maxStock ? parseInt(medicineFilters.maxStock) : 2147483647,
      minSales: medicineFilters.minSales ? parseInt(medicineFilters.minSales) : 0,
      maxSales: medicineFilters.maxSales ? parseInt(medicineFilters.maxSales) : 2147483647,
    },
    skip: debouncedMedicineSearchTerm.length < 1 && Object.values(medicineFilters).every(v => v === ''),
  });

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedMedicineSearchTerm(medicineSearchTerm);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [medicineSearchTerm]);

  if (loadingHospitalsAndShops || loadingTopMedicines) return <p>Loading...</p>;
  if (errorHospitalsAndShops || errorTopMedicines) return <p>Error: {errorHospitalsAndShops?.message || errorTopMedicines?.message}</p>;

  const { hospitals, medical_shops } = dataHospitalsAndShops;

  const filteredHospitals = hospitals.filter(hospital => 
    hospital.name.toLowerCase().includes(hospitalSearchTerm.toLowerCase()) ||
    hospital.main_specialty.toLowerCase().includes(hospitalSearchTerm.toLowerCase()) ||
    (hospital.total_icu_beds + hospital.total_general_beds).toString().includes(hospitalSearchTerm)
  );

  const filteredMedicalShops = medical_shops.filter(shop => 
    shop.name.toLowerCase().includes(medicalShopSearchTerm.toLowerCase()) ||
    shop.specialization.toLowerCase().includes(medicalShopSearchTerm.toLowerCase()) ||
    shop.inventory_capacity.toString().includes(medicalShopSearchTerm)
  );

  const renderSummary = (items, type) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {type === 'hospital' ? (
            <BuildingOffice2Icon className="h-8 w-8 text-blue-500 mr-2" />
          ) : (
            <ShoppingBagIcon className="h-8 w-8 text-green-500 mr-2" />
          )}
          <h2 className="text-2xl font-bold">
            Total {type === 'hospital' ? 'Hospitals' : 'Medical Shops'}: {items.length}
          </h2>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder={`Search ${type === 'hospital' ? 'hospitals' : 'medical shops'}...`}
            value={type === 'hospital' ? hospitalSearchTerm : medicalShopSearchTerm}
            onChange={(e) => type === 'hospital' ? setHospitalSearchTerm(e.target.value) : setMedicalShopSearchTerm(e.target.value)}
            className="pl-8 pr-4 py-2 border rounded-md"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-flex space-x-4 pb-4">
          {items.map((item) => (
            <div key={item.id} className="w-64 flex-shrink-0 border rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-2">
                {type === 'hospital' ? item.main_specialty : item.specialization}
              </p>
              <div className="flex items-center text-gray-500 mb-2">
                {type === 'hospital' ? (
                  <HomeIcon className="h-5 w-5 mr-2" />
                ) : (
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                )}
                <span>
                  {type === 'hospital'
                    ? `${item.total_icu_beds + item.total_general_beds} beds`
                    : `Capacity: ${item.inventory_capacity}`}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedItem(item);
                  setItemType(type);
                }}
                className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
              >
                View Details
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDetails = () => {
    if (!selectedItem) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
          <h2 className="text-2xl font-bold mb-4">{selectedItem.name}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
              <p>{selectedItem.address}</p>
            </div>
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 text-gray-500 mr-2" />
              <p>{selectedItem.phone_number}</p>
            </div>
            {itemType === 'hospital' ? (
              <>
                <div className="flex items-center">
                  <HomeIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <p>ICU Beds: {selectedItem.total_icu_beds}</p>
                </div>
                <div className="flex items-center">
                  <HomeIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <p>General Beds: {selectedItem.total_general_beds}</p>
                </div>
              </>
            ) : (
              <div className="flex items-center col-span-2">
                <UserGroupIcon className="h-5 w-5 text-gray-500 mr-2" />
                <p>Inventory Capacity: {selectedItem.inventory_capacity}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSelectedItem(null)}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const renderMedicineSearch = () => {
    const medicines = medicineSearchTerm.length > 0 || Object.values(medicineFilters).some(v => v !== '') 
      ? dataSearchMedicines?.medical_shop_inventory 
      : dataTopMedicines?.medical_shop_inventory;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Medicine Inventory</h2>
        <div className="mb-4 relative flex items-center">
          <input
            type="text"
            placeholder="Search for medicines..."
            value={medicineSearchTerm}
            onChange={(e) => setMedicineSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md pr-20"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute right-12 top-1/2 transform -translate-y-1/2" />
          <button
            onClick={() => setShowMedicineFilters(!showMedicineFilters)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <AdjustmentsHorizontalIcon className="h-6 w-6" />
          </button>
        </div>
        {showMedicineFilters && (
          <div className="mb-4 p-4 border rounded-md bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setMedicineFilters({ category: '', minStock: '', maxStock: '', minSales: '', maxSales: '' })}>
                <XMarkIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Category"
                value={medicineFilters.category}
                onChange={(e) => setMedicineFilters({ ...medicineFilters, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min Stock"
                  value={medicineFilters.minStock}
                  onChange={(e) => setMedicineFilters({ ...medicineFilters, minStock: e.target.value })}
                  className="w-1/2 px-3 py-2 border rounded-md"
                />
                <input
                  type="number"
                  placeholder="Max Stock"
                  value={medicineFilters.maxStock}
                  onChange={(e) => setMedicineFilters({ ...medicineFilters, maxStock: e.target.value })}
                  className="w-1/2 px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min Sales"
                  value={medicineFilters.minSales}
                  onChange={(e) => setMedicineFilters({ ...medicineFilters, minSales: e.target.value })}
                  className="w-1/2 px-3 py-2 border rounded-md"
                />
                <input
                  type="number"
                  placeholder="Max Sales"
                  value={medicineFilters.maxSales}
                  onChange={(e) => setMedicineFilters({ ...medicineFilters, maxSales: e.target.value })}
                  className="w-1/2 px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        )}
        {loadingSearchMedicines ? (
          <p>Searching...</p>
        ) : errorSearchMedicines ? (
          <p>Error: {errorSearchMedicines.message}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sales</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medicines?.map((medicine) => (
                  <tr key={medicine.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{medicine.medicine_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{medicine.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{medicine.current_stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{medicine.total_sales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderSummary(filteredHospitals, 'hospital')}
      {renderSummary(filteredMedicalShops, 'medical_shop')}
      {renderMedicineSearch()}
      {renderDetails()}
    </div>
  );
};

export default AdminDashboard;