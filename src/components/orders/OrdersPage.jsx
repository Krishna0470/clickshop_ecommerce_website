import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Modal, Button } from 'react-bootstrap';
import './orders.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [search, setSearch] = useState('');

  // State for alert notifications
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  // State for confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('accessTocken');
        const response = await axios.get('http://localhost:443/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setOrders(response.data);
        setTotalPages(Math.ceil(response.data.length / pageSize));
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [currentPage, pageSize]);

  const handleDelete = async (id) => {
    setOrderToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      const token = localStorage.getItem('accessTocken');
      const response = await axios.delete(`http://localhost:443/deleteorders/${orderToDelete}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response && response.status === 200) {
        setAlert({ show: true, message: 'Order deleted successfully', variant: 'success' });
        setOrders((prevOrders) => prevOrders.filter(order => order._id !== orderToDelete));
      } else {
        setAlert({ show: true, message: 'Failed to delete order', variant: 'danger' });
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      setAlert({ show: true, message: 'Error deleting order', variant: 'danger' });
    } finally {
      setShowConfirm(false);
      setOrderToDelete(null);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      console.log('No more pages available');
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      console.log('No more pages available');
    }
  };

  const handleUpdateDeliveryStatus = async (id) => {
    try {
      const token = localStorage.getItem('accessTocken');
      const response = await axios.put(
        `http://localhost:443/orders/${id}/deliver`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setAlert({ show: true, message: 'Order marked as delivered', variant: 'success' });
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id ? { ...order, isDelivered: true } : order
          )
        );
      } else {
        setAlert({ show: true, message: 'Failed to update delivery status', variant: 'danger' });
      }
    } catch (error) {
      console.error('Error updating delivery status:', error);
      setAlert({ show: true, message: 'Error updating delivery status', variant: 'danger' });
    }
  };

  const filteredOrders = orders.filter((order) => {
    return order.user?.username.toLowerCase().includes(search.toLowerCase());
  });

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className='bguserli'>
      <div className="container">
        <h2 className="list">All Orders</h2>
        <div className="header_wrap">
          <div className="num_rows">
            <div className="form-group">
              <select
                className="form-control"
                name="state"
                id="maxRows"
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value))}
              >
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
                <option value={8}>8</option>
                <option value={10}>10</option>
                <option value={12}>12</option>
                <option value={100}>Show ALL Rows</option>
              </select>
            </div>
          </div>
          <div className="tb_search">
            <input
              type="text"
              id="search_input_all"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search.."
              className="form-control"
            />
          </div>
        </div>
        <table className="table table-striped table-class" id="table-id">
          <thead>
            <tr>
              <th>Order Items</th>
              <th>Order ID</th>
              <th>User</th>
              <th>Order Date</th>
              <th>Total Price</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th>Actions</th> {/* Added Actions column for delete functionality */}
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
                <td>{order.user?.username || 'Unknown User'}</td>
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
                <td> {/* Added delete button */}
                  <button
                    type="button"
                    className="btnn delete"
                    onClick={() => handleDelete(order._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Custom Alert Notification */}
        {alert.show && (
          <Alert
            variant={alert.variant}
            style={{
              backgroundColor: alert.variant === 'danger' ? '#f8d7da' : '#d4edda',
              color: alert.variant === 'danger' ? '#721c24' : '#155724',
              borderColor: alert.variant === 'danger' ? '#f5c6cb' : '#c3e6cb',
            }}
            className="top-right-alert"
            onClose={() => setAlert({ ...alert, show: false })}
            dismissible
          >
            {alert.message}
          </Alert>
        )}

        {/* Confirmation Modal */}
        <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this order?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="pagination">
          <button onClick={handlePreviousPage}><span className="material-symbols-outlined">arrow_back_ios</span></button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNextPage}><span className="material-symbols-outlined">chevron_right</span></button>
        </div>
        <div className="rows_count">
          Showing {Math.min((currentPage - 1) * pageSize + 1, filteredOrders.length)} to{' '}
          {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length}{' '}
          entries
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
