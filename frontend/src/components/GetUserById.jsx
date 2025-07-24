import React, { useState } from 'react';
import '../components/GetUserById.css';
import { useNavigate } from 'react-router-dom';

const GetUserById = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  const handleHome = () => {
    navigate("/");
  };

  const baseUrl = import.meta.env.VITE_API_URL;

  const handleFetch = () => {
    if (!userId) {
      setError("Please enter a User ID");
      return;
    }

    fetch(`${baseUrl}/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then(data => {
        setUser(data);
        setEditedUser({
          name: data.name,
          email: data.email,
          age: data.age,
          phone: data.phone,
          address: data.address
        });
        setError("");
      })
      .catch(err => {
        setUser(null);
        setError(err.message);
      });
  };

  const handleEdit = () => setIsEditing(true);

  const handleUpdate = () => {
    fetch(`${baseUrl}/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedUser)
    })
      .then(res => {
        if (!res.ok) throw new Error("Update failed");
        return res.json();
      })
      .then(() => {
        setUser({ ...user, ...editedUser });
        setIsEditing(false);
        setError("User updated successfully!");
      })
      .catch(err => setError(err.message));
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      fetch(`${baseUrl}/${userId}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok) throw new Error("Delete failed");
          return res.json();
        })
        .then(() => {
          setUser(null);
          setUserId("");
          setError("User deleted successfully!");
        })
        .catch(err => setError(err.message));
    }
  };

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  return (
    <div className="user-crud-container">
      <h2>User CRUD</h2>

      <div className="search-section">
        <input type='number' placeholder='Enter User ID' value={userId} onChange={e => setUserId(e.target.value)} className="search-input" />
        <button onClick={handleFetch} className="fetch-button">Fetch User</button>
      </div>

      {error && <div className={`message ${error.includes("success") ? "success" : "error"}`}>{error}</div>}

      {user && !isEditing && (
        <div className="user-card">
          <div className="user-info">
            <div className="info-item"><span className="info-label">User ID</span><span className="info-value">{user.user_id}</span></div>
            <div className="info-item"><span className="info-label">Name</span><span className="info-value">{user.name}</span></div>
            <div className="info-item"><span className="info-label">Email</span><span className="info-value">{user.email}</span></div>
            <div className="info-item"><span className="info-label">Age</span><span className="info-value">{user.age}</span></div>
            <div className="info-item"><span className="info-label">Phone</span><span className="info-value">{user.phone}</span></div>
            <div className="info-item"><span className="info-label">Address</span><span className="info-value">{user.address}</span></div>
          </div>

          <div className="action-buttons">
            <button onClick={handleEdit} className="edit-button">Edit</button>
            <button onClick={handleDelete} className="delete-button">Delete</button>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="edit-form">
          <h3>Edit User</h3>
          <div className="form-group">
            <input type="text" name="name" value={editedUser.name} onChange={handleChange} placeholder="Name" className="form-input" />
            <input type="email" name="email" value={editedUser.email} onChange={handleChange} placeholder="Email" className="form-input" />
            <input type="number" name="age" value={editedUser.age} onChange={handleChange} placeholder="Age" className="form-input" />
            <input type="text" name="phone" value={editedUser.phone} onChange={handleChange} placeholder="Phone" className="form-input" />
            <input type="text" name="address" value={editedUser.address} onChange={handleChange} placeholder="Address" className="form-input" />
          </div>

          <div className="form-buttons">
            <button onClick={handleUpdate} className="update-button">Submit Update</button>
            <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
          </div>
        </div>
      )}

      <button onClick={handleHome} className='backbtn'>Return Home</button>
    </div>
  );
};

export default GetUserById;
