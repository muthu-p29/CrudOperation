import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/PostUser.css';

const PostUser = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/");
  };

  const [user, setUser] = useState({
    user_id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
    age: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (!user.user_id || !user.name || !user.email || !user.address || !user.phone || !user.age) {
      setMessage("All fields are required!");
      return;
    }

    fetch(import.meta.env.VITE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...user,
        user_id: parseInt(user.user_id),
        age: parseInt(user.age)
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to add user");
        return res.json();
      })
      .then(data => {
        setMessage("User added successfully!");
        setUser({
          user_id: "",
          name: "",
          email: "",
          address: "",
          phone: "",
          age: ""
        });
      })
      .catch(err => setMessage(err.message));
  };

 return (
  <div className="post-user">
    <div className="form-container">
      <h2>Add New User</h2>

      <div className="form-group">
        <input type="number" name="user_id" placeholder="User ID" value={user.user_id} onChange={handleChange} className="form-input" />
        <input type="text" name="name" placeholder="Name" value={user.name} onChange={handleChange} className="form-input" />
        <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} className="form-input" />
        <input type="text" name="address" placeholder="Address" value={user.address} onChange={handleChange} className="form-input" />
        <input type="text" name="phone" placeholder="Phone" value={user.phone} onChange={handleChange} className="form-input" />
        <input type="number" name="age" placeholder="Age" value={user.age} onChange={handleChange} className="form-input" />
      </div>

      <button onClick={handleSubmit} className="submit-button">Add User</button>

      {message && <div className={`message ${message.includes("success") ? "success" : "error"}`}>{message}</div>}

      <button onClick={handleHome} className='backbtn'>Return Home</button>
    </div>
  </div>
);

};

export default PostUser;
