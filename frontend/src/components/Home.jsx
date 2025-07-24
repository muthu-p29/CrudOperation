import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const addNavigate = () => {
    navigate("/postUser");
  };

  const getNavigate = () => {
    navigate("/getUserById");
  };
  const getUser = () => {
    navigate("/getUser");
  };

return (
  <div className="home-container">
    <h2>Welcome to User CRUD</h2>
    <div className="button-group">
      <button onClick={addNavigate} className="nav-button">
        Add User
      </button>
      <button onClick={getNavigate} className="nav-button">
        Get User By ID
      </button>
      <button onClick={getUser} className="nav-button">
        Get User
      </button>
    </div>
  </div>
);
};

export default Home;
