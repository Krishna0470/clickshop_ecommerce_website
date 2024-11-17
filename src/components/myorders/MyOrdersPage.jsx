import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './myorders.css';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(2); 
    
    const [userId, setUserId] = useState(localStorage.getItem('userId') || '');

    useEffect(() => {
        if (userId) {
            localStorage.setItem('userId', userId);
        }
    }, [userId]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('accessTocken');
                const response = await axios.get(`http://localhost:443/user/${userId}/orders`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [userId]);
    console.log(orders); // Check the structure of order


    // Calculate total pages based on the number of orders and page size
    const totalPages = Math.ceil(orders.length / pageSize);

    // Function to handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Slice the orders array to display only the orders for the current page
    const paginatedOrders = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className='bguserli'>
        <div className="container">
          <h2 className="list">My Orders</h2>
          <div className="header_wrap">
            <div className="num_rows">
            </div>
         
          </div>
          <table className="table table-striped table-class" id="table-id">
            <thead>
              <tr>
                <th>Order Items</th>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Total Price</th>
                <th>Paid</th>
                <th>Delivered</th>
              </tr>
            </thead>
            <tbody>
              
              {paginatedOrders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {order.orderItems.map(item => (
                        <img
                          key={item._id}
                          src={item.image}
                          alt={item.name}
                          style={{ maxWidth: '50px', borderRadius: '5px' }}
                        />
                      ))}
                    </div>
                  </td>
                  <td>{order._id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    <button type="button" className={`btnn ${order.isPaid ? 'paid' : 'pending'}`}>
                      {order.isPaid ? 'Completed' : 'Pending'}
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`btnn ${order.isDelivered ? 'paid' : 'pending'}`}
                      onClick={() => handleUpdateDeliveryStatus(order._id)}
                    >
                      {order.isDelivered ? 'Completed' : 'Pending'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ToastContainer />
          <div className="pagination">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        <span className="material-symbols-outlined">arrow_back_ios</span>
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
        </div>
        </div>
    );
};

export default MyOrdersPage;
