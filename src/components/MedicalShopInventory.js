import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { 
    PlusCircleIcon, 
    MinusCircleIcon, 
    PencilIcon, 
    CurrencyRupeeIcon,
    UserGroupIcon,
    CalendarIcon,
    ClipboardDocumentCheckIcon,
    ChatBubbleBottomCenterTextIcon,
    TrashIcon
  } from '@heroicons/react/24/outline';

const GET_INVENTORY = gql`
  query GetInventory($medical_shop_id: Int!) {
    medical_shop_inventory(where: {medical_shop_id: {_eq: $medical_shop_id}}) {
      id
      medicine_name
      category
      current_stock
      total_sales
    }
  }
`;

const GET_SALES = gql`
  query GetSales($inventory_id: Int!) {
    medical_shop_sales(where: {inventory_id: {_eq: $inventory_id}}) {
      id
      quantity_sold
      sale_date
      total_price
      customer_age_group
      customer_gender
      prescription_required
      remarks
    }
  }
`;

const ADD_INVENTORY = gql`
  mutation AddInventory($medical_shop_id: Int!, $medicine_name: String!, $category: String!, $current_stock: Int!) {
    insert_medical_shop_inventory_one(object: {
      medical_shop_id: $medical_shop_id,
      medicine_name: $medicine_name,
      category: $category,
      current_stock: $current_stock
    }) {
      id
    }
  }
`;

const ADD_SALE = gql`
  mutation AddSale($inventory_id: Int!, $quantity_sold: Int!, $sale_date: date!, $total_price: numeric!, $customer_age_group: String, $customer_gender: String, $prescription_required: Boolean, $remarks: String) {
    insert_medical_shop_sales_one(
      object: {
        inventory_id: $inventory_id,
        quantity_sold: $quantity_sold,
        sale_date: $sale_date,
        total_price: $total_price,
        customer_age_group: $customer_age_group,
        customer_gender: $customer_gender,
        prescription_required: $prescription_required,
        remarks: $remarks
      }
    ) {
      id
    }
  }
`;

const UPDATE_SALE = gql`
  mutation UpdateSale($id: Int!, $quantity_sold: Int!, $sale_date: date!, $total_price: numeric!, $customer_age_group: String, $customer_gender: String, $prescription_required: Boolean, $remarks: String) {
    update_medical_shop_sales_by_pk(
      pk_columns: { id: $id },
      _set: {
        quantity_sold: $quantity_sold,
        sale_date: $sale_date,
        total_price: $total_price,
        customer_age_group: $customer_age_group,
        customer_gender: $customer_gender,
        prescription_required: $prescription_required,
        remarks: $remarks
      }
    ) {
      id
    }
  }
`;

const DELETE_SALE = gql`
  mutation DeleteSale($id: Int!) {
    delete_medical_shop_sales_by_pk(id: $id) {
      id
    }
  }
`;

const MedicalShopInventory = ({ medical_shop_id }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newItem, setNewItem] = useState({ medicine_name: '', category: '', current_stock: '' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingSaleId, setEditingSaleId] = useState(null);
  const [saleData, setSaleData] = useState({
    quantity_sold: '',
    sale_date: new Date().toISOString().split('T')[0],
    total_price: '',
    customer_age_group: '',
    customer_gender: '',
    prescription_required: false,
    remarks: ''
  });
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { loading, error, data, refetch } = useQuery(GET_INVENTORY, {
    variables: { medical_shop_id },
  });

  const { data: salesData, refetch: refetchSales } = useQuery(GET_SALES, {
    variables: { inventory_id: selectedItem?.id },
    skip: !selectedItem,
  });

  const [addInventory] = useMutation(ADD_INVENTORY);
  const [addSale] = useMutation(ADD_SALE);
  const [updateSale] = useMutation(UPDATE_SALE);
  const [deleteSale] = useMutation(DELETE_SALE);

  useEffect(() => {
    if (data) {
      setInventoryItems(data.medical_shop_inventory);
    }
  }, [data]);

  useEffect(() => {
    if (!editingSaleId) {
      setSaleData({
        quantity_sold: '',
        sale_date: new Date().toISOString().split('T')[0],
        total_price: '',
        customer_age_group: '',
        customer_gender: '',
        prescription_required: false,
        remarks: ''
      });
    }
  }, [editingSaleId]);

  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      await addInventory({
        variables: {
          medical_shop_id,
          ...newItem,
          current_stock: parseInt(newItem.current_stock)
        }
      });
      setNewItem({ medicine_name: '', category: '', current_stock: '' });
      setSuccessMessage('Inventory added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowAddInventory(false);
      refetch();
    } catch (err) {
      console.error("Error adding inventory:", err);
    }
  };

  const handleAddOrUpdateSale = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      if (editingSaleId) {
        await updateSale({
          variables: {
            id: editingSaleId,
            ...saleData,
            quantity_sold: parseInt(saleData.quantity_sold),
            total_price: parseFloat(saleData.total_price)
          }
        });
        setSuccessMessage('Sale updated successfully!');
      } else {
        await addSale({
          variables: {
            inventory_id: selectedItem.id,
            ...saleData,
            quantity_sold: parseInt(saleData.quantity_sold),
            total_price: parseFloat(saleData.total_price)
          }
        });
        setSuccessMessage('Sale added successfully!');
      }
      setTimeout(() => setSuccessMessage(''), 3000);
      setEditingSaleId(null);
      refetch();
      refetchSales();
    } catch (err) {
      console.error("Error adding/updating sale:", err);
    }
  };

  const handleDeleteSale = async (saleId) => {
    if (!window.confirm('Are you sure you want to delete this sale?')) return;
    try {
      await deleteSale({
        variables: { id: saleId }
      });
      setSuccessMessage('Sale deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      refetch();
      refetchSales();
    } catch (err) {
      console.error("Error deleting sale:", err);
    }
  };

  const handleSelectItem = (item) => {
    if (selectedItem && selectedItem.id === item.id) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
      setEditingSaleId(null);
    }
  };

  const handleEditSale = (sale) => {
    setEditingSaleId(sale.id);
    setSaleData({
      quantity_sold: sale.quantity_sold.toString(),
      sale_date: sale.sale_date,
      total_price: sale.total_price.toString(),
      customer_age_group: sale.customer_age_group,
      customer_gender: sale.customer_gender,
      prescription_required: sale.prescription_required,
      remarks: sale.remarks || ''
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg shadow-lg">
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded" role="alert">
          <p className="font-bold">Success</p>
          <p>{successMessage}</p>
        </div>
      )}

      <div>
        <button
          onClick={() => setShowAddInventory(!showAddInventory)}
          className="flex items-center justify-center w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          {showAddInventory ? <MinusCircleIcon className="h-5 w-5 mr-2" /> : <PlusCircleIcon className="h-5 w-5 mr-2" />}
          {showAddInventory ? 'Hide Add Inventory Form' : 'Add New Inventory Item'}
        </button>

        {showAddInventory && (
          <form onSubmit={handleAddInventory} className="mt-4 space-y-2 bg-white p-4 rounded-md shadow">
            <input
              type="text"
              placeholder="Medicine Name"
              value={newItem.medicine_name}
              onChange={(e) => setNewItem({...newItem, medicine_name: e.target.value})}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={newItem.category}
              onChange={(e) => setNewItem({...newItem, category: e.target.value})}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              type="number"
              placeholder="Current Stock"
              value={newItem.current_stock}
              onChange={(e) => setNewItem({...newItem, current_stock: e.target.value})}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-300 ease-in-out">
              Add Inventory
            </button>
          </form>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Inventory List</h3>
        {inventoryItems.map((item) => (
          <div key={item.id} className="mb-6 bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold">{item.medicine_name}</h4>
                <p className="text-gray-600">Category: {item.category}</p>
                <p className="text-gray-600">Current Stock: {item.current_stock}</p>
                <p className="text-gray-600">Total Sales: {item.total_sales}</p>
              </div>
              <button
                onClick={() => handleSelectItem(item)}
                className={`flex items-center justify-center px-4 py-2 rounded-md transition duration-300 ease-in-out ${
                  selectedItem?.id === item.id
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {selectedItem?.id === item.id ? (
                  <>
                    <MinusCircleIcon className="h-5 w-5 mr-2" />
                    Hide Sales
                  </>
                ) : (
                  <>
                    <PencilIcon className="h-5 w-5 mr-2" />
                    View/Add Sales
                  </>
                )}
              </button>
            </div>
            {selectedItem?.id === item.id && salesData && (
              <div className="mt-4 bg-gray-100 p-4 rounded-md">
                <h5 className="font-semibold mb-2">Sales Details:</h5>
                {salesData.medical_shop_sales.map((sale) => (
                  <div key={sale.id} className="ml-4 mb-2 p-2 bg-white rounded shadow">
                    <div className="flex justify-between items-center">
                      <div>
                        <p><CalendarIcon className="h-4 w-4 inline mr-2" />Date: {sale.sale_date}</p>
                        <p><CurrencyRupeeIcon className="h-4 w-4 inline mr-2" />Quantity: {sale.quantity_sold}</p>
                        <p><CurrencyRupeeIcon className="h-4 w-4 inline mr-2" />Total Price: ₹{sale.total_price}</p>
                        <p><UserGroupIcon className="h-4 w-4 inline mr-2" />Customer Age Group: {sale.customer_age_group}</p>
                        <p><UserGroupIcon className="h-4 w-4 inline mr-2" />Customer Gender: {sale.customer_gender}</p>
                        <p><ClipboardDocumentCheckIcon className="h-4 w-4 inline mr-2" />Prescription Required: {sale.prescription_required ? 'Yes' : 'No'}</p>
                        <p><ChatBubbleBottomCenterTextIcon className="h-4 w-4 inline mr-2" />Remarks: {sale.remarks}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditSale(sale)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md transition duration-300 ease-in-out"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSale(sale.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition duration-300 ease-in-out"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              )}
              {selectedItem?.id === item.id && (
                <div className="mt-4 bg-gray-100 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">
                    {editingSaleId ? 'Edit' : 'Add'} Sale for {item.medicine_name}
                  </h3>
                  <form onSubmit={handleAddOrUpdateSale} className="space-y-2">
                    <input
                      type="number"
                      placeholder="Quantity Sold"
                      value={saleData.quantity_sold}
                      onChange={(e) => setSaleData({...saleData, quantity_sold: e.target.value})}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="date"
                      value={saleData.sale_date}
                      onChange={(e) => setSaleData({...saleData, sale_date: e.target.value})}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Total Price"
                        value={saleData.total_price}
                        onChange={(e) => setSaleData({...saleData, total_price: e.target.value})}
                        className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <select
                      value={saleData.customer_age_group}
                      onChange={(e) => setSaleData({...saleData, customer_age_group: e.target.value})}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Age Group</option>
                      <option value="0-18">0-18</option>
                      <option value="19-40">19-40</option>
                      <option value="41-60">41-60</option>
                      <option value="60+">60+</option>
                    </select>
                    <select
                      value={saleData.customer_gender}
                      onChange={(e) => setSaleData({...saleData, customer_gender: e.target.value})}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={saleData.prescription_required}
                        onChange={(e) => setSaleData({...saleData, prescription_required: e.target.checked})}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span>Prescription Required</span>
                    </label>
                    <textarea
                      placeholder="Remarks"
                      value={saleData.remarks}
                      onChange={(e) => setSaleData({...saleData, remarks: e.target.value})}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out">
                      {editingSaleId ? 'Update Sale' : 'Add Sale'}
                    </button>
                    {editingSaleId && (
                      <button
                        type="button"
                        onClick={() => setEditingSaleId(null)}
                        className="w-full bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400 transition duration-300 ease-in-out mt-2"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default MedicalShopInventory;