import React, { useState } from 'react';
import axios from 'axios';
import { Link ,useNavigate} from 'react-router-dom';
import "./ForgotPassword.css";

function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [errorMessage,setErrorMessage] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError(''); 
    };

    const handleForgotPassword = async (e) => {
        setErrorMessage('');

        if (!email) {
            setEmailError("Email is required !");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;

        if(!emailRegex.test(email)) {
            setEmailError('Invalid email format !');
            return;
        }

        const HOSTED_SERVER_URL = "http://localhost:443";

        try { 
            const response = await axios.post(`${HOSTED_SERVER_URL}/forgot-password`,{
                email
            });

            if(response.data.statusCode === 200){
                console.log('Email sent successful');
                alert('Email sent successful ');
                navigate('/Signin');
            } else {
                setErrorMessage('Email sending failed');
                return;
            }
        } catch(error) {
            console.log("error forgetting password : ", error.response.data.message);
        }
    };

    return (
        <>
            <div className="container11">
                <div className="row1">
                    <h1 className="bebas-neue-regular" >Forgot Password</h1>
                    <h6 className="forgottext">Enter your registered email to reset your password.</h6>
                    <div className="form-group">
                        <input type="email" name="user_email" id="user_email" value={email} onChange={handleEmailChange} placeholder='Enter email' />
                        {emailError && <p className="error-message">{emailError}</p>}
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <p></p>
                        <button onClick={handleForgotPassword}>Reset Password</button>
                    </div>
                    <div className="footer">
                        <h5 className='forgottext'>New here? <a href="Regsiter">Sign Up.</a></h5>
                        <h5 className='forgottext'>Already have an account? <Link to={"/Signin"} className='signin' >Sign In.</Link></h5>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotPasswordPage;
