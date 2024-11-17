import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Popup from "../popup_messages/PopupMessage";
import { ClipLoader } from 'react-spinners'; 
import './signin.css';
import Swal from 'sweetalert2';
import { useUserContext } from '../../context/userContext';

function Signinpage() {
  const navigate = useNavigate();
  const { updateUser } = useUserContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPopup, setShowPopup] = useState(false); 
  const [popupType, setPopupType] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      if (!email) setEmailError('Email is required');
      if (!password) setPasswordError('Password is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`http://localhost:443/Signin`, {
        email,
        password,
      });

      const { statusCode, data, user_type, type, user_id, user } = response.data;

      if (statusCode === 200) {
        updateUser(user);

        if (user_type === "65f3d64061496a1395461cf0") {
          navigate(`/AdminPage/${user_id}`);
        } else if (type === "Seller") {
          navigate(`/UsersellerPage/${user_id}`);
        } else {
          navigate(`/UserPage/${user_id}`);
        }

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Sign in completed.',
        });

        localStorage.setItem('accessTocken', data);
        localStorage.setItem('userId', user_id);  // Save user_id to local storage
        localStorage.setItem('userEmail', email);
        
      } else {
        setPopupType('error');
        setPopupMessage('Login Failed');
        setShowPopup(true);
      }
    } catch (error) {
      setPopupType('error');
      setPopupMessage(error.response?.data?.message || 'An error occurred during login');
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePopupOK = () => {
    setShowPopup(false);
  };
  
  const handlePopupTryAgain = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div className='bgform'>
        <form className="form1">
          <h1 className="bebas-neue-regular">Sign In</h1>
          <label htmlFor="email">Email Address:</label>
          <input className="signinput" placeholder='Enter a valid email address' type="text" value={email} onChange={handleEmailChange} required="" />
          {emailError && <p className="error-message">{emailError}</p>}
          <label  htmlFor="password">Password:</label>
          <input className="signinput" placeholder='password' onChange={handlePasswordChange} autoComplete="password" value={password} type="password" required />
          {passwordError && <p className="error-message">{passwordError}</p>}
          <button className="but_admin" onClick={handleLogin} type="button" disabled={loading}>Login</button>
          <p>Forgot <Link to={'/ForgotPassword'} className='register'>Username/Password</Link></p>
          <p>New Customer?<Link to={'/Regsiter'} className='register'>Register</Link> </p>
        </form>
      </div>
      {loading && (
        <div className="spinner-container">
          <ClipLoader color="black" loading={loading} size={50} />
        </div>
      )}
      {showPopup && <Popup type={popupType} message={popupMessage} onOK={handlePopupOK} onTryAgain={handlePopupTryAgain} />}
    </>
  );
}

export default Signinpage;
