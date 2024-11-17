import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import './userlist.css';

const UserListPage = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const token = !!localStorage.getItem('accessTocken');

  if (!token) {
    return null;
  }

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessTocken');
      const response = await axios.get(`http://localhost:443/getData?page=${currentPage}&pageSize=${pageSize}&search=${search}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const responseData = response.data.data;
      setData(responseData.datas);
      setTotalPages(responseData.totalPages);
      setCurrentPage(responseData.currentPage);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, search]);

  const handleEditUser = (userId) => {
    setSelectedUserId(userId);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessTocken');
      const response = await axios.delete(`http://localhost:443/deleteData/${selectedUserId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response && response.status === 200) {
        toast.success('User deleted successfully', {
          className: 'custom-toast'
        });
        fetchData();
      } else {
        console.error("Failed to delete user. Response:", response);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      console.log("No more pages available");
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      console.log("No more pages available");
    }
  };

  const handleSearch = () => {
    fetchData();
  };

  return (
    <>
      <div className="container py-5">
        <h2 className="text-center mb-5 list1">User List</h2>
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <input
                type="search"
                className="form-control"
                placeholder="Search user by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-outline-secondary" onClick={handleSearch}>
                <span className="material-icons">search</span>
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          {data.map((userData) => (
            <div key={userData._id} className="col-md-4 mb-4">
              <div className="card h-100">
                <img
                  src={userData.profileImage ? `http://localhost:443/${userData.profileImage}` : "../../../public/landing/user.webp"}
                  className="card-img-top"
                  alt={userData.username}
                />
                <div className="card-body">
                  <h2 className="card-title">{userData.username}</h2>
                  <p className="card-text">{userData.email}</p>
                  <p className="card-name">{userData.type === "Admin" ? "Admin" : (userData.type === "Seller" ? "Seller" : "Buyer")}</p>
                  <button 
                    onClick={() => {
                      setSelectedUserId(userData._id);
                      setShowModal(true);
                    }} 
                    className="btn btn-danger">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={handlePreviousPage} aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(page)}>
                  {page}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={handleNextPage} aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
        {loading && <div className="text-center">Loading...</div>}
      </div>

      {/* Bootstrap Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </>
  );
};

export default UserListPage;
