import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert } from 'react-bootstrap';
import './category.css';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editedCategoryName, setEditedCategoryName] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const token = localStorage.getItem('accessTocken');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:443/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setAlert({
        show: true,
        type: 'danger',
        message: 'Failed to fetch categories'
      });
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await axios.post(
        'http://localhost:443/categories',
        { name: newCategoryName },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setAlert({
          show: true,
          type: 'success',
          message: 'Category added successfully'
        });
        fetchCategories(); // Refresh categories list
        setNewCategoryName(''); // Clear input field after successful addition
      } else {
        setAlert({
          show: true,
          type: 'danger',
          message: 'Failed to add category'
        });
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setAlert({
        show: true,
        type: 'danger',
        message: 'Error adding category'
      });
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category._id);
    setEditedCategoryName(category.name);
  };

  const handleSaveEdit = async () => {
    if (!editingCategoryId) {
      setAlert({
        show: true,
        type: 'danger',
        message: 'No category selected for editing'
      });
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:443/category/${editingCategoryId}`,
        { name: editedCategoryName },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setAlert({
          show: true,
          type: 'success',
          message: 'Category updated successfully'
        });
        setEditingCategoryId(null); // Clear editing state after successful update
        setEditedCategoryName(''); // Clear edited name input
        fetchCategories(); // Refresh the category list
      } else {
        setAlert({
          show: true,
          type: 'danger',
          message: 'Failed to update category'
        });
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setAlert({
        show: true,
        type: 'danger',
        message: 'Error updating category'
      });
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await axios.delete(
        `http://localhost:443/category/${categoryId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setAlert({
          show: true,
          type: 'success',
          message: 'Category deleted successfully'
        });
        fetchCategories(); // Refresh the category list
      } else {
        setAlert({
          show: true,
          type: 'danger',
          message: 'Failed to delete category'
        });
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setAlert({
        show: true,
        type: 'danger',
        message: 'Error deleting category'
      });
    }
  };

  return (
    <div className='container py-5'>
      <h2 className='text-center mb-4'>Category Management</h2>

      <div className='mb-4'>
        <input
          type='text'
          className='form-control mb-2'
          placeholder='Add new category'
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button className='btn btn-primary' onClick={handleAddCategory}>
          Add Category
        </button>
      </div>

      <div className='list-group'>
        {categories.map((category) => (
          <div key={category._id} className='list-group-item d-flex justify-content-between align-items-center'>
            {editingCategoryId === category._id ? (
              <input
                type='text'
                className='form-control'
                value={editedCategoryName}
                onChange={(e) => setEditedCategoryName(e.target.value)}
              />
            ) : (
              <span>{category.name}</span>
            )}
            <div>
              {editingCategoryId === category._id ? (
                <button className='btn btn-success' onClick={handleSaveEdit}>
                  Save
                </button>
              ) : (
                <button className='btn btn-warning' onClick={() => handleEditCategory(category)}>
                  Edit
                </button>
              )}
              <button
                className='btn btn-danger ms-2'
                onClick={() => handleDeleteCategory(category._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

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
    </div>
  );
};

export default CategoryPage;
