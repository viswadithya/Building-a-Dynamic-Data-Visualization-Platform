import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at'); 
  const [sortOrder, setSortOrder] = useState('ASC'); 

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, sortBy, sortOrder]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/api/customers?page=${currentPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      const sortedCustomers = response.data.sort((a, b) => a.sno - b.sno);
      setCustomers(sortedCustomers);
    } catch (error) {
      console.error('Error fetching customers', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortBy = (sortByValue) => {
    if (sortByValue === sortBy) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC'); 
    } else {
      setSortBy(sortByValue);
      setSortOrder('ASC'); 
    }
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.date) - new Date(b.date);
    } else if (sortBy === 'time') {
      return new Date('1970/01/01 ' + a.time) - new Date('1970/01/01 ' + b.time);
    } else {
      return a.sno - b.sno; 
    }
  });

  const filteredCustomers = sortedCustomers.filter(customer =>
    customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <input 
        type="text" 
        placeholder="Search by name or location" 
        value={searchTerm} 
        onChange={handleSearchChange} 
      />
      <div>
        <button onClick={() => handleSortBy('date')}>Sort by Date</button>
        <button onClick={() => handleSortBy('time')}>Sort by Time</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Customer Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.sno}</td>
                <td>{customer.customer_name}</td>
                <td>{customer.age}</td>
                <td>{customer.phone}</td>
                <td>{customer.location}</td>
                <td>{customer.date}</td>
                <td>{customer.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
      <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
    </div>
  );
}

export default App;
