import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'; // Import axios if not already imported
import successGif from '../../../public/landing/tick-verify.gif';
import './success.css';

function SuccessPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log("userId:", id); // Check if id is correctly fetched
                const token = localStorage.getItem('accessToken');
                const response = await axios.get(`http://localhost:443/getData/${id}`, {
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
                });
                console.log("response:", response);

                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);

    const handleGoBack = () => {
        if (user) {
            const { user_type, type, _id } = user;
            if (user_type === "65f3d64061496a1395461cf0") {
                navigate(`/AdminPage/${_id}`);
            } else if (type === "Seller") {
                navigate(`/UsersellerPage/${_id}`);
            } else {
                navigate(`/UserPage/${_id}`);
            }
            // Reload the page after navigation (optional)
            window.location.reload();
        }
    };

    return (
        <div className='pt-[18vh]'>
            <div className="bg-gray-100 h-screen">
                <div className="bg-white p-6 md:mx-auto text-center">
                    <img className='successimg' src={successGif} alt="Tick Verify" />
                    <div className="text-center">
                        <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Order Placed</h3>
                        <p className="text-gray-600 my-2">Thank you for completing your secure online payment.</p>
                        <p> Have a great day!  </p>
                        <div className="py-10 text-center">
                            <button onClick={handleGoBack} className="px-12 bg-red-600 hover:bg-red-500 text-white font-semibold py-3">
                                GO BACK
                            </button> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SuccessPage;
