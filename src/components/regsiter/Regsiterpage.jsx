import React, { useState, useEffect } from 'react';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is loaded
import './regsiter.css'; 

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [errors, setErrors] = useState({});
  const [registering, setRegistering] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' }); // New state for alert

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleTypeChange = (e) => setType(e.target.value);

  const handleOutsideClick = (e) => {
    if (!e.target.closest('input')) {
      setErrors({});
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistering(true);
   
    const newErrors = {};
    if (!username) newErrors.username = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email format';
    if (!type) newErrors.type = 'Type is required';
   
    setErrors(newErrors);
   
    if (Object.keys(newErrors).length === 0) {
      const HOSTED_SERVER_URL = 'http://localhost:443';
   
      try {
        const response = await axios.post(`${HOSTED_SERVER_URL}/users`, {
          username,
          email,
          type,
        });
   
        if (response && response.data && response.data.statusCode === 201) {
          setAlert({ type: 'success', message: 'Form Registered successfully' });
          setUsername('');
          setEmail('');
          setType('');
        } else {
          setAlert({ type: 'danger', message: 'Form submission failed' });
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        setAlert({ type: 'danger', message: `Error during form Submission: ${errorMessage}` });
      }
    }
   
    setRegistering(false);
  };

  const handleCloseAlert = () => setAlert({ type: '', message: '' });

  return (
    <>
      <div className='bgReg'>
        <form className='form2' onSubmit={handleSubmit}>
          <h1 className="bebas-neue-regular">Registration</h1>
          
          {alert.message && (
            <div className={`alert-container`}>
              <div className={`alert alert-${alert.type}`} role="alert">
                {alert.message}
                <button type="button" className="alert-close-btn" onClick={handleCloseAlert}>
                  &times;
                </button>
              </div>
            </div>
          )}

          <div>
            <label>Name:</label>
            <input className='regsiterinput' placeholder='Enter Name' type="text" value={username} onChange={handleUsernameChange} />
            {errors.username && <p className='error-message'>{errors.username}</p>}
          </div>
          <div>
            <label>Email:</label>
            <input className='regsiterinput' placeholder='Enter Email' type="email" value={email} onChange={handleEmailChange} />
            {errors.email && <p className='error-message'>{errors.email}</p>}
          </div>
          <div>
            <label>UserType:</label>
            <select className='regsiterinput' name='type' value={type} onChange={handleTypeChange}>
              <option value="" disabled>Please select</option>
              <option value="Buyer">Buyer</option>
              <option value="Seller">Seller</option>
            </select>
            {errors.type && <p className='error-message'>{errors.type}</p>}
          </div>
       
          <button className='but_user' type="submit" disabled={registering}>{registering ? 'Registering...' : 'Register'}</button>
        </form>
      </div>
    </>
  );
}

export default RegisterPage;
