import React, { useEffect, useState } from 'react';
import { FaHeart, FaStar } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './allproduct.css';


function Allproductpage() {


  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [value, setValue] = useState('all');



  const handleBtn = (btn) => {
    setActive(btn.id);
    setValue(btn.value);
  };
  const params = useParams()

  const getProducts = async () => {
    try {
      const token = localStorage.getItem('accessTocken');
      const res = await axios.get(`http://localhost:443/getAllProduct?category=${value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        setProduct(res.data.data.product);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(product);
  useEffect(() => {
    getProducts()
  }, [value])

  return (
    <>

<section id="sellers">
  <div className="seller container">
    <div className="best-seller">
      <div className="row">
        {
          product?.map((curElem) => (
            <div key={curElem._id} className="col-lg-4 col-md-6 col-sm-12">
              <div className="best-p1">
                <div className="relative mb-3">
                    <img src={curElem.productImages[0]} alt="" />
                  <div className="best-p1-txt">
                    <div className="name-of-p">
                      <p>{curElem.name}</p>
                    </div>
                    <div className="rating">
                      <i className="bx bxs-star" />
                      <i className="bx bxs-star" />
                      <i className="bx bxs-star" />
                      <i className="bx bxs-star" />
                      <i className="bx bx-star" />
                    </div>
                    <div className="price">
                    ₹{curElem.price}
                      <div className="colors">
                        <i className="bx bxs-circle brown" />
                        <i className="bx bxs-circle green" />
                        <i className="bx bxs-circle blue" />
                      </div>
                    </div>
                    <div className="buy-now">
                      <button>
                      <Link to={`/UpdateProduct/${curElem._id}`}>
                          Update Product
                          </Link>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  </div>
</section>

    </>
  );
}

export default Allproductpage;


