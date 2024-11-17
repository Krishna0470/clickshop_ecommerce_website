import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Alert } from 'react-bootstrap';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [search, setSearch] = useState('');
  const [value, setValue] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // State for alert notifications
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  const token = localStorage.getItem('accessTocken');

  if (!token) {
    return null;
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:443/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const categoriesArray = response.data;
      const categoriesObject = {};
      categoriesArray.forEach(category => {
        categoriesObject[category._id] = category.name;
      });
      setCategoriesMap(categoriesObject);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:443/getAllProduct`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          category: value,
          search: search
        }
      });
      const responseData = response.data.data;
      setProducts(responseData.product);
      setTotalPages(Math.ceil(responseData.product.length / pageSize)); // Total pages based on product length
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchData();
  }, [search, value, pageSize]);

  const handleBlockProduct = async (productId) => {
    try {
      const response = await axios.patch(`http://localhost:443/blockproduct/${productId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response && response.status === 200) {
        setAlert({ show: true, message: 'Product blocked successfully', variant: 'success' });
        fetchData(); // Refresh the product list
      } else {
        setAlert({ show: true, message: 'Failed to block product', variant: 'danger' });
      }
    } catch (error) {
      console.error("Error blocking product:", error);
      setAlert({ show: true, message: 'Error blocking product', variant: 'danger' });
    }
  };

  const handleUnblockProduct = async (productId) => {
    try {
      const response = await axios.patch(`http://localhost:443/unblockproduct/${productId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response && response.status === 200) {
        setAlert({ show: true, message: 'Product unblocked successfully', variant: 'success' });
        fetchData(); // Refresh the product list
      } else {
        setAlert({ show: true, message: 'Failed to unblock product', variant: 'danger' });
      }
    } catch (error) {
      console.error("Error unblocking product:", error);
      setAlert({ show: true, message: 'Error unblocking product', variant: 'danger' });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:443/deleteproduct/${selectedProductId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response && response.status === 200) {
        setAlert({ show: true, message: 'Product deleted successfully', variant: 'success' });
        fetchData(); // Refresh the product list
        setShowModal(false); // Close the modal
      } else {
        setAlert({ show: true, message: 'Failed to delete product', variant: 'danger' });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setAlert({ show: true, message: 'Error deleting product', variant: 'danger' });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to the first page when searching
    fetchData();
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.description.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate paginated products
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <div className='container py-5'>
        <h2 className='text-center mb-4 list'>Product List</h2>

        {alert.show && (
        <Alert
          variant={alert.type}
          style={{
            backgroundColor: alert.type === 'danger' ? '#f8d7da' : '#d4edda',
            color: alert.type === 'danger' ? '#721c24' : '#155724', // Custom colors for danger and success
            borderColor: alert.type === 'danger' ? '#f5c6cb' : '#c3e6cb', // Custom border colors
          }}
          className="top-right-alert"
          onClose={() => setAlert({ ...alert, show: false })}
          dismissible
        >
          {alert.message}
        </Alert>
      )}

        <div className="row mb-4">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select className="form-control" value={pageSize} onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1); // Reset to the first page when changing page size
            }}>
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={0}>Show ALL Rows</option>
            </select>
          </div>
        </div>

        <div className="row">
          {paginatedProducts.map((product) => (
            <div key={product._id} className="col-md-4 mb-4">
              <div className="card h-100">
                <img src={product.productImages[0]} className="card-img-top" alt={product.name} />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">Price: ${product.price}</p>
                  <p className="card-text">
                    Category: {categoriesMap[product.category] || "Unknown Category"}
                  </p>
                  <p className="card-text">Stock: {product.stock}</p>
                  <p className="card-text">Location: {product.location}</p>
                  <p className="card-text">Description: {product.description}</p>
                </div>
                <div className="card-footer">
                  <div className="btn-group" role="group" aria-label="Product actions">
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setSelectedProductId(product._id);
                        setShowModal(true);
                      }}>
                      Delete
                    </button>
                    {product.isBlocked ? (
                      <button
                        className="btn btn-success"
                        onClick={() => handleUnblockProduct(product._id)}>
                        Unblock
                      </button>
                    ) : (
                      <button
                        className="btn btn-warning"
                        onClick={() => handleBlockProduct(product._id)}>
                        Block
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button
            className="btn btn-secondary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            className="btn btn-secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Bootstrap Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductListPage;
