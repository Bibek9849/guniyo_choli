import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../CSS/Profile.css';
import { getUserOrdersApi } from '../../apis/Api';
import Footer from '../../components/Footer';
// Assume you create this API function to call your backend
import { changePasswordApi } from '../../apis/Api';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileImage: '',
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // For Change Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchOrders = async () => {
      try {
        const response = await getUserOrdersApi();
        if (response.data.success) {
          const originalOrders = response.data.orders.filter(order => !order.isFake);
          setOrders(originalOrders);
          if (originalOrders.length === 0) {
            setError(null); 
          }
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError(null); 
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Simulate a successful profile update
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify(user));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    }, 500);
  };

  // Change Password Handler
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all the password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    setChangingPassword(true);

    try {
      const response = await changePasswordApi({
        currentPassword,
        newPassword,
      });

      if (response.data.success) {
        toast.success('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(response.data.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Error occurred while changing password');
    }

    setChangingPassword(false);
  };

  const handleShopNow = () => {
    navigate('/');
  };

  return (
    <div className="main-container">
      <ToastContainer />
      <div className="profile-container">
        <div className="profile-content">
          <div className="profile-left">
            <div className="profile-image">
              <img
                src={user.profileImage || 'https://via.placeholder.com/150'}
                alt="Profile"
              />
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              )}
            </div>
            <h2 className="user-name">{user.firstName} {user.lastName}</h2>
          </div>

          <div className="profile-right">
            <div className="profile-form">
              <h2>Profile Information</h2>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={user.phone}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="text"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>

              {isEditing ? (
                <button onClick={handleSave} className="save-btn">Save</button>
              ) : (
                <button onClick={handleEditToggle} className="edit-btn">Edit</button>
              )}
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="change-password-section" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', maxWidth: '600px', margin: 'auto', marginBottom: '2rem' }}>
          <h2>Change Password</h2>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
            <button type="submit" className="save-btn" disabled={changingPassword}>
              {changingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

        <div className="orders-section">
          <h2>My Orders</h2>
          {loading ? (
            <div className="loading">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="no-orders">
              <p>No original orders found</p>
              <button onClick={handleShopNow} className="shop-now-btn">
                Shop Now
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <span className="order-id">Order #{order._id}</span>
                    <span className={`order-status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-details">
                    <div className="order-info">
                      <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p>Total Amount: Rs. {order.amount}</p>
                      <p>Delivery Address: {order.address}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;

