import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './profile.css'; 

const Profile = () => {
  const { user, fetchUser, updateUser } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [dob, setDob] = useState(''); 
  const [contact, setContact] = useState('');
  const [gender, setGender] = useState(''); 
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Fetch user data and set state
  const initializeUserData = async () => {
    try {
      await fetchUser(); // Fetch user data
      if (user) {
        setUsername(user.username || '');
        setEmail(user.email || '');
        setAge(user.age || '');
        setDob(user.dob ? user.dob.split('T')[0] : '');
        setContact(user.contact || '');
        setGender(user.gender || '');
      }
    } catch (error) {
      setErrorMessage('Failed to fetch user data.');
    }
  };

  useEffect(() => {
    initializeUserData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        username,
        email,
        age,
        dob,
        contact,
        gender,
        password
      };
      console.log('User data being sent:', userData); 
      await updateUser(userData); 
      await fetchUser(); 
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

      if (password) {
        localStorage.removeItem('token');
        navigate('/');
      }
    } catch (error) {
      setErrorMessage('Failed to update profile.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="text-center">Profile</h2>
            </div>
            <div className="card-body">
              {user ? (
                <div>
                  {successMessage && (
                    <div className="alert alert-success text-center">
                      {successMessage}
                    </div>
                  )}
                  {errorMessage && (
                    <div className="alert alert-danger text-center">
                      {errorMessage}
                    </div>
                  )}
                  <form onSubmit={handleUpdate}>
                    <div className="form-group mb-3">
                      <label htmlFor="username">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Enter New Password (leave empty if not changing)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="age">Age</label>
                      <input
                        type="number"
                        className="form-control"
                        id="age"
                        placeholder="Enter Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="dob">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control"
                        id="dob"
                        placeholder="Enter Date of Birth"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="contact">Contact</label>
                      <input
                        type="text"
                        className="form-control"
                        id="contact"
                        placeholder="Enter Contact"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="gender">Gender</label>
                      <select
                        className="form-control"
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Update</button>
                  </form>
                  <button className="btn btn-danger w-100 mt-3" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-center">No user data available</p>
                  <Link to="/login" className="btn btn-primary w-100 mt-3">
                    Go to Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
