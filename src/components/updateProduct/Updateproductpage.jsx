import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './updateproduct.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Updateproductpage() {
  const params = useParams();
  const [productDetails, setProductDetails] = useState({});
  const [editableUser, setEditableUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const handleInputChange = (e) => {
    setEditableUser({
      ...editableUser,
      [e.target.name]: e.target.value
    });
  };

  const getProductDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:443/getProduct/${params.id}`);
      if (res.data.success) {
        setProductDetails(res.data.data.product);
        setEditableUser(res.data.data.product);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('accessTocken');
      const response = await axios.get('http://localhost:443/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCategories(response.data);
      setLoadingCategories(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    getProductDetails();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const price = form.price.value;
    const category = form.category.value;
    const stock = form.stock.value;
    const location = form.location.value;
    const description = form.description.value;
    const productData = { name, price, category, stock, location, description };

    try {
      const token = localStorage.getItem('accessTocken');
      const res = await axios.put(`http://localhost:443/editProduct/${params.id}`, productData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (res.data.success) {
        toast.success('Product updated successfully');
        form.reset();
      } else {
        console.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      console.error("Failed to update product", error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div className='bgrg'>
      <div className='py-3 px-10 sm:px-4 md:px-6 lg:px-6'>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 pb-14 gap-8">
            <div className="row">
              <div className="col-md-3">
                <div className="container">
                  <div className='rounded-md mb-5 p-4'>
                    {productDetails.productImages && productDetails.productImages.length > 0 ? (
                      <img src={productDetails.productImages[0]} alt="" className='cursor-pointer1' />
                    ) : (
                      <p>No Image Available</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-9 personal-info">
                <form className="form-horizontal" role="form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="col-md-3 control-label">Name:</label>
                    <div className="col-md-8">
                      <input className='productupinput' type="text" name="name" value={editableUser ? editableUser.name : ''} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-lg-3 control-label">Price:</label>
                    <div className="col-lg-8">
                      <input className='productupinput' type="number" name="price" value={editableUser ? editableUser.price : ''} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-lg-3 control-label">Description:</label>
                    <div className="col-lg-8">
                      <input className='productupinput' type="text" name="description" value={editableUser ? editableUser.description : ''} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-lg-3 control-label">Category:</label>
                    <div className="col-lg-8">
                      <select className="select" name='category' value={editableUser ? editableUser.category : ''} onChange={handleInputChange} defaultValue="default">
                        <option value="default" disabled>Category</option>
                        {loadingCategories ? (
                          <option>Loading categories...</option>
                        ) : (
                          categories.length > 0 ? (
                            categories.map(category => (
                              <option key={category._id} value={category._id}>{category.name}</option>
                            ))
                          ) : (
                            <option>No categories available</option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-lg-3 control-label">Location:</label>
                    <div className="col-lg-8">
                      <input className='productupinput' type="text" name="location" value={editableUser ? editableUser.location : ''} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-lg-3 control-label">Stock:</label>
                    <div className="col-lg-8">
                      <input className='productupinput' type="number" name="stock" value={editableUser ? editableUser.stock : ''} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-3 control-label" />
                    <div className="col-md-8">
                      <input type='submit' className="btn btn-primary" defaultValue="Save Changes" />
                      <ToastContainer />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Updateproductpage;
