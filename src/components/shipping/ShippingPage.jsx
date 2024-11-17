import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCartContext } from '../../context/cartContext';
import { useUserContext } from '../../context/userContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './shipping.css';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// Function to save cart items to database
const saveCartItemsToDatabase = async (orderData) => {
    try {
        const token = localStorage.getItem('accessTocken'); // Check the spelling of 'accessTocken'
        orderData.isPaid = true; 
        const response = await axios.post('http://localhost:443/orders', orderData, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        if (response.status !== 201) {
            throw new Error('Failed to save cart items to database');
        }

        const savedOrder = response.data;

        // Clear cart items from local storage
        localStorage.removeItem('cartItems');

        console.log('Cart items successfully saved and local storage cleared');
        return savedOrder;
    } catch (error) {
        console.error('Error:', error);
        // Optionally return or throw the error if needed
        return null;
    }
};


function Message({ content }) {
    return <p>{content}</p>;
}

const ShippingPage = ({ displayData }) => {
    const { cartItems, removeItem, addToCart } = useCartContext() || { cartItems: [] };
    const [users, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [showOrderSummary, setShowOrderSummary] = useState(false);
    const [isPaypalLoaded, setIsPaypalLoaded] = useState(false);
    const [errors, setErrors] = useState({});
    const [billingDetails, setBillingDetails] = useState({
        country: "",
        address: "",
        city: "",
        postcode: "",
        paymentMethod: ""
    });
    const { id } = useParams();
    const navigate = useNavigate();

    const itemsPrice = cartItems.reduce((a, c) => a + c.qty * c.price, 0);
    const shippingPrice = itemsPrice > 2000 ? 0 : 20;
    const taxRate = 0.15;
    const taxPrice = (itemsPrice * taxRate);
    const totalOrderPrice = itemsPrice + shippingPrice + parseFloat(taxPrice);

    const { user } = useUserContext(); 
    const [userId, setUserId] = useState(user?.user_id || localStorage.getItem('userId'));
  
    useEffect(() => {
      if (user?.user_id) {
        setUserId(user.user_id);
        localStorage.setItem('userId', user.user_id);
      }
    }, [user]);
  
    useEffect(() => {
      if (userId) {
        localStorage.setItem('userId', userId);
      }
    }, [userId]);

    const countries = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia",
        "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
        "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
        "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia",
        "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Croatia", "Cuba", "Cyprus",
        "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor (Timor-Leste)", "Ecuador",
        "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
        "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
        "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
        "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South",
        "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
        "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
        "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
        "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
        "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
        "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
        "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
        "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
        "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
        "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
        "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
        "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ];


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

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://sandbox.paypal.com/sdk/js?client-id=Aewk-Nk1SjE4aCuoYYZ-xT--b-4U4aPkOAlKuZwaSBhLBSS3mspwdYON35cJdZt9UQHrNgbE0QtGjVhd';
        script.addEventListener('load', () => {
            setIsPaypalLoaded(true);
        });
        document.body.appendChild(script);

        // Cleanup function
        return () => {
            const existingScript = document.querySelector(`script[src="${script.src}"]`);
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, []);

    const initialOptions = {
        "client-id": "AWQiTNJwh04LGiH6rx1F9muFllKHuaFBMEze_AIHycr1yd8bpFEWu6pEfD6zyYpxjiICfAEitvHW2dDz",
        "enable-funding": "venmo",
        "disable-funding": "",
        country: "US",
        currency: "USD",
        "data-page-type": "product-details",
        components: "buttons",
        "data-sdk-integration-source": "developer-studio",
    };

    const validateFields = () => {
        const newErrors = {};
        const requiredFields = ["country", "address", "city", "postcode", "paymentMethod"];

        requiredFields.forEach(field => {
            const value = billingDetails[field];
            if (!value) {
                newErrors[field] = `${field} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setBillingDetails((prevDetails) => ({
            ...prevDetails,
            [id]: value,
        }));
    };

    const handleOrderSummaryToggle = () => {
        if (validateFields()) {
            setShowOrderSummary(!showOrderSummary);
        } else {
            setMessage("Please fill in all required fields");
        }
    };

    const removeItemFromCart = async (itemToRemove) => {
        try {
            const updatedCartItems = cartItems.filter(item => item._id !== itemToRemove._id);
            setCartItems(updatedCartItems);
            localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
            console.log('Item successfully removed from cart and local storage');
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };
    
    const removeAllItemsFromCart = async () => {
        try {
            if (!Array.isArray(cartItems) || cartItems.length === 0) {
                throw new Error('No items in cart to remove');
            }
    
            // Loop through each item in cartItems and remove them one by one
            for (const item of cartItems) {
                if (item._id === "6638db972623331496ce31a4") { // Replace "6638db972623331496ce31a4" with the _id of the item you want to remove
                    await removeItemFromCart(item);
                }
            }
    
            // After removing from cart, clear cartItems from local storage
            localStorage.removeItem("cartItems");
            console.log('All items successfully removed from cart and local storage');
        } catch (error) {
            console.error('Error removing items from cart:', error);
        }
    };
    
    

    const handleOrderCapture = async (data, actions) => {
        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    _id: item._id,
                    qty: item.qty,
                    image: item.productImages && item.productImages.length > 0 ? item.productImages[0] : null,
                })),
                shippingAddress: {
                    address: billingDetails.address,
                    city: billingDetails.city,
                    postalCode: billingDetails.postcode,
                    country: billingDetails.country,
                },
                paymentMethod: billingDetails.paymentMethod,
                itemsPrice: itemsPrice.toFixed(2),
                taxPrice: taxPrice.toFixed(2),
                shippingPrice: shippingPrice.toFixed(2),
                totalPrice: totalOrderPrice.toFixed(2),
                isPaid: true,
            };
            console.log('Order Data:', orderData); // Debug log
            
            await saveCartItemsToDatabase(orderData); // Save order to database
        
            // Now remove items from cart after the order is saved
            await removeAllItemsFromCart(); // Remove items from the cart
        
            navigate(`/Success/${userId}`); // Navigate to Success page
        } catch (error) {
            console.error('Error capturing order:', error);
            setMessage("Error occurred while processing the order");
        }
    };
    

    
    
    
    
    
    

    return (
        <div className="container">
            <div className="row">
                <div className="col-6">
                    <h2>Billing Details</h2>
                    <form>
                        <div className="form-group">
                            <label htmlFor="address">Address:</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={billingDetails.address}
                                onChange={handleInputChange}
                                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                            />
                            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="city">City:</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={billingDetails.city}
                                onChange={handleInputChange}
                                className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                            />
                            {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="postcode">Postcode:</label>
                            <input
                                type="text"
                                id="postcode"
                                name="postcode"
                                value={billingDetails.postcode}
                                onChange={handleInputChange}
                                className={`form-control ${errors.postcode ? 'is-invalid' : ''}`}
                            />
                            {errors.postcode && <div className="invalid-feedback">{errors.postcode}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="country">Country:</label>
                            <select
                                id="country"
                                name="country"
                                value={billingDetails.country}
                                onChange={handleInputChange}
                                className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                            >
                                <option value="">Select a country</option>
                                {countries.map((country, index) => (
                                    <option key={index} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                            {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="paymentMethod">Select Method:</label>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="radio"
                                    id="paymentMethod"
                                    name="paymentMethod"
                                    value="paypal"
                                    checked={billingDetails.paymentMethod === "paypal"}
                                    onChange={(e) =>
                                        setBillingDetails((prevDetails) => ({
                                            ...prevDetails,
                                            paymentMethod: e.target.value,
                                        }))
                                    }
                                    className={`form-check-input ${errors.paymentMethod ? 'is-invalid' : ''}`}
                                />
                                <label htmlFor="paymentMethod" className="form-check-label ml-2">PayPal or Credit Card</label>
                            </div>
                            {errors.paymentMethod && <div className="invalid-feedback">{errors.paymentMethod}</div>}
                        </div>
                    </form>
                    <button onClick={handleOrderSummaryToggle} className="btn btn-primary mt-3">Continue</button>
                    {message && <div className="mt-3">{message}</div>}
                </div>

                {showOrderSummary && (
                    <div className="col-6">
                        <h2>Order Summary</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th className="product-total">Product</th>
                                    <th className="product-total">ProductName</th>
                                    <th className="product-total">Quantity</th>
                                    <th className="product-total">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <img className='shippingimg' src={item?.productImages[0]} alt="" height="20" />
                                        </td>
                                        <td>{item.name}</td>
                                        <td>
                                            <div className="quantity-buttons">
                                                <span>{item.qty}</span>
                                            </div>
                                        </td>
                                        <td>${itemsPrice.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>Name:</th>
                                    <td>{users?.username}</td>
                                </tr>
                                <tr>
                                    <th>Address:</th>
                                    <td>{billingDetails.address}</td>
                                </tr>
                                <tr>
                                    <th>Email:</th>
                                    <td>{users?.email}</td>
                                </tr>
                                <tr>
                                    <th>Subtotal:</th>
                                    <td>${itemsPrice.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <th>TaxPrice:</th>
                                    <td>${taxPrice.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <th>Shipping:</th>
                                    <td>${shippingPrice.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <th>Total:</th>
                                    <td>${totalOrderPrice.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>

                        {isPaypalLoaded && (
                            <PayPalScriptProvider options={initialOptions}>
                                <PayPalButtons
    createOrder={(data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: totalOrderPrice.toFixed(2),
                    },
                },
            ],
        });
    }}
    onApprove={(data, actions) => {
        return actions.order.capture().then((details) => {
            handleOrderCapture(data, actions); // Pass data and actions here
            setMessage("Transaction completed by " + details.payer.name.given_name);
        });
    }}
/>

                            </PayPalScriptProvider>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShippingPage;
