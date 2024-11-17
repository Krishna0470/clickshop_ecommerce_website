import React, { useState, useEffect } from 'react';
import axios from "axios";
import './createproduct.css';
import { Alert } from 'react-bootstrap';

function CreateProductPage() {
  const [images, setImages] = useState({ image1: null, image2: null, image3: null, image4: null });
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
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
    fetchCategories();
  }, []);

  const handleImage = async (e, imageKey) => {
    const file = e.target.files[0]; // Single file input
    setUploading(true);

    try {
      let formData = new FormData();
      formData.append('image', file);
      const response = await axios.post("http://localhost:443/upload-image", formData);
      const uploadedImage = {
        url: response.data.url,
        public_id: response.data.public_id
      };

      setImages(prevState => ({
        ...prevState,
        [imageKey]: uploadedImage
      }));
      setUploading(false);
      setAlert({
        show: true,
        type: 'success',
        message: `Image ${imageKey} successfully uploaded`
      });
    } catch (error) {
      setUploading(false);
      setAlert({
        show: true,
        type: 'warning',
        message: `Warning: Image ${imageKey} upload failed. Please try again.`
      });
      console.log(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const price = form.price.value;
    const category = form.category.value;
    const stock = form.stock.value;
    const location = form.location.value;
    const description = form.description.value;
    const productImages = Object.values(images).map(image => image.url); // Collect all image URLs
    const userId = localStorage.getItem('userId');
    const productData = { name, price, category, stock, location, description, productImages, userId };

    try {
      const token = localStorage.getItem('accessTocken');
      const res = await axios.post("http://localhost:443/addproduct", productData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (res.data.success) {
        setAlert({
          show: true,
          type: 'success',
          message: 'Product successfully created!'
        });
        form.reset();
        setImages({ image1: null, image2: null, image3: null, image4: null }); // Reset images state
      } else {
        setAlert({
          show: true,
          type: 'warning',
          message: res.data.message || 'Warning: Something went wrong.'
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        type: 'warning',
        message: 'Warning: Failed to add product. Please try again.'
      });
      console.log(error);
    }
  }

  return (
    <>
      <div className='addprodectbg'>
        <div className='addproduct'>
          <div className='w-full mx-auto pt-[16vh]'>
            {alert.show && (
              <Alert
                variant={alert.type}
                style={{
                  backgroundColor: alert.type === 'warning' ? '#fff3cd' : 'white',
                  color: alert.type === 'warning' ? '#856404' : 'black',
                  borderColor: alert.type === 'warning' ? '#ffeeba' : 'black'
                }}
                className="top-right-alert"
                onClose={() => setAlert({ ...alert, show: false })}
                dismissible
              >
                {alert.message}
              </Alert>
            )}

            <form className='ease-in duration-300' onSubmit={handleSubmit}>
              <h1 className="bebas-neue-regular">Create Product</h1>
              <div className="grid grid-cols-2 sm:grid-cols-2 items-center gap-4">
                <input type="text" name='name' placeholder='Enter product name' />
                
                {/* Four separate inputs for four images */}
                <input type="file" name='image1' className="file-input" onChange={(e) => handleImage(e, 'image1')} />
                <input type="file" name='image2' className="file-input" onChange={(e) => handleImage(e, 'image2')} />
                <input type="file" name='image3' className="file-input" onChange={(e) => handleImage(e, 'image3')} />
                <input type="file" name='image4' className="file-input" onChange={(e) => handleImage(e, 'image4')} />

                <input type="number" name='price' placeholder='Enter price' />
                <select className="select" name='category' defaultValue="default">
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
                <input type="number" name='stock' placeholder='Enter stock' />
                <input type="text" name='location' placeholder='Enter location' />
                <textarea className="textarea" name='description' placeholder="Enter description"></textarea>
              </div>
              <button className='add-product-btn' type='submit'>Add Product</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateProductPage;
