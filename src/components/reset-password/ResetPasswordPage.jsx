import React, { useState } from 'react';
import axios from 'axios';
import "./ResetPassword.css"

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const newError = {};
    if (!newPassword) {
      newError.newPassword = 'New password is required!';
    }

    if (!confirmPassword) {
      newError.confirmPassword = 'Password confirmation is required!';
    }

    if (newPassword !== confirmPassword) {
      newError.passwordMismatch = 'New password and confirm password do not match!';
    }

    console.log("newPassword : ", newPassword)
    console.log("confirmPassword : ", confirmPassword)

    setErrors(newError);

    

   

    const HOSTED_SERVER_URL = 'http://localhost:443';

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
    
      console.log("token : ", token);
    
      const response = await axios.patch(
        `${HOSTED_SERVER_URL}/reset-password`,
        {
          newPassword,
          confirmPassword
        },
        {
          headers: {
            'authorization': `Bearer ${token}`
          }
        }
      );
    
      console.log("response : ", response.data);
    
      if (response.data.statusCode === 200) {
        alert('Password successfully changed!');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        console.error('Password change failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    


  }

  return (
    
    <div className="container" style={{ marginTop: '40px' }}>
      <div className="row">
        <div className="col-sm-12">
          <div className="horizontal-container">
            <div className="progress-bar-container">
              <div className="custom-progress-line" style={{ width: '25%' }}></div>

            

            </div>
            <div className="horizontal-form-box">

              <img className='passwImg' src="../../../public/landing/password.png" alt="Password Reset Icon" />
              <h1 className="horizontal-heading">Reset your password</h1>
              <p className="horizontal-subtitle">Your password needs to be at least 8 characters.</p>

              <form className="horizontal-form" onSubmit={handleResetPassword}>
                <div className="o3-form-group">
                  <label htmlFor="new_password">New password</label>
                  <input type="password" className="o3-form-control o3-input-lg" id="new_password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  {errors.newPassword && <p className='error-message'>{errors.newPassword}</p>}
                </div>
                <div className="o3-form-group">
                  <label htmlFor="confirm_password">Confirm new password</label>
                  <input type="password" className="o3-form-control o3-input-lg" id="confirm_password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  {errors.confirmPassword && <p className='error-message'>{errors.confirmPassword}</p>}
                  {errors.passwordMismatch && <p className='error-message'>{errors.passwordMismatch}</p>}
                </div>
                <button type="submit" className="o3-btn o3-btn-primary o3-btn-block">Set new password</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





