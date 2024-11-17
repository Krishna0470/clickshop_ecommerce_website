import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';
import { useNavigate, Link } from "react-router-dom";
import './updateprofile.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Swal from 'sweetalert2';


function Updateprofilepage() {

    const { id } = useParams(); 
    const [user, setUser] = useState(null);
    const [editableUser , setEditableUser] = useState(null);
    const [profileImage, setProfileImage] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');

    const handlePhotoChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoUrl(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const [removeProfileImage,setRemoveProfileImage] = useState(false);

    const token = !!localStorage.getItem('accessTocken')
  
    if(!token){
      return null
    }

    useEffect(() => {
        const fetchUser = async () => {
          try {
            console.log("userId : ", id); 
            const token = localStorage.getItem('accessTocken');
            const response = await axios.get(`http://localhost:443/getData/${id}`, {
              headers: {
                'authorization': `Bearer ${token}`
              }
            });
            console.log("response : ", response);
            
            setUser(response.data);
            setEditableUser(response.data);    
            setProfileImage(response.data.profileImage || ''); 

            
          } catch (error) {
            console.error('Error fetching user:', error);
          }
        };
    
        fetchUser();
      }, [id]);

          
      const handleEdit = () => {
        console.log('Edit clicked');
        setEditableUser({...user});
      };

      
  const handleInputChange =(e) => {
    setEditableUser({
      ...editableUser,
      [e.target.name]:e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
      convertToBase64(file);
    }
  };

  const handleRemoveProfileImage = async () => {
    try {
      const token = localStorage.getItem('accessTocken');
      const response = await axios.put(
        `http://localhost:443/editData/${id}`,
        { removeProfileImage: true }, 
        {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        }
      );
  
      console.log('Profile image removed successfully:', response.data);
    //   Swal.fire({
    //     title: 'Are you Sure',
    //     text: 'Delete item',
    //     icon: 'Warning',
    //     showCancleButton:true,
    //     confirmButtonText:'Yes, Delete it',
    //     cnacelButtonText:'cancle it'

    // });
      
      setProfileImage('');
    } catch (error) {
      console.error('Error removing profile image:', error);
     
    }
  };
  
  const readURL = (input) => {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const imagePreview = document.getElementById('imagePreview');
        if (imagePreview) {
          imagePreview.style.backgroundImage = 'url(' + e.target.result + ')';
          imagePreview.style.display = 'none';
          imagePreview.style.display = 'block'; // This line replaces fadeIn()
        } else {
          console.error('Element with id "imagePreview" not found');
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  };
  

  $("#imageUpload").change(function() {
    readURL(this);
  });

  const handleSave = async () => {
    console.log('Save clicked');
    try {
      const token = localStorage.getItem('accessTocken');
      
      const formData = new FormData();
      for (const key in editableUser) {
        formData.append(key, editableUser[key]);
      }
      formData.append('profileImage', profileImage);
      // alert('saved successfully')

   
      const response = await axios.put(`http://localhost:443/editData/${id}`,editableUser,
     { 
      headers : {
        'authorization' : `Bearer ${token}`,
      }
      });
      setUser(response.data);
      // alert("Updated successfully");
      toast.success('UpdatedSuccessful',{
        className: 'custom-toast' });
      console.log("user updated successfully",response.data);
      setUser(response.data);
    } catch(error) {
      console.error('error updating user : ',error);
    }
  };

  const convertToBase64 = (file)=>{
    const reader = new FileReader();
    reader.onloadend =()=>{
      const base64String = reader.result.split(',')[1];
    //   console.log("base64String : ",base64String)
      setEditableUser({
        ...editableUser,
        profileImage: base64String
      });
    };
    reader.readAsDataURL(file);
  }


  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bgrg'>
      <div className="container">
      <h2 className="list_1">Update Profile</h2>
        {/* <h3 className="uphead">Update Profile</h3> */}
        <hr />

        <div className="row">
          <div className="col-md-3">
          <div className="container">
  <div className="avatar-upload">
    <div className="avatar-edit">
      <input type="file" id="imageUpload" accept=".png, .jpg, .jpeg"  onChange={handleImageChange}  />
      <label htmlFor="imageUpload" />
    </div>
    <div className="avatar-preview">
      <div
        id="imagePreview"
        style={{ backgroundImage: 'url("../../../public/landing/user.png")' }}  >{profileImage ? (
            <img src={`http://localhost:443/${profileImage}`} alt="Profile" className="avatar-preview" />
          ) : (
            <img src=""  className="rounded-circle" />
          )}
      </div>
    </div>
    <button onClick={handleRemoveProfileImage} type="button" className="btnn btn-primary1"><span className="material-symbols-outlined">delete</span></button>
  </div>
</div>

          </div>

          <div className="col-md-9 personal-info">
            <form className="form-horizontal" role="form">
              <div className="form-group">
                <label className="col-md-3 control-label">Username:</label>
                <div className="col-md-8">
                  {editableUser ? (
                    <input className='personalinput' type="text" name="username" value={editableUser.username} onChange={handleInputChange} />
                  ) : (
                    <input className='personalinput' type="text" value={user.username} disabled={true} />
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-3 control-label">Email:</label>
                <div className="col-lg-8">
                  {editableUser ? (
                    <input className='personalinput' type="email" name="email" value={editableUser.email} onChange={handleInputChange} />
                  ) : (
                    <input className='personalinput' type="email" value={user.email} disabled={true} />
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label" />
                <div className="col-md-8">
                  <input
                    type="button"
                    className="btn btn-primary"
                    defaultValue="Save Changes"
                    onClick={handleSave}
                  />
                </div>
                <ToastContainer />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Updateprofilepage;
