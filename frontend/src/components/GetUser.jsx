import { useEffect, useState } from 'react';
import '../components/GetUser.css';
import { useNavigate } from 'react-router-dom';

function GetUser() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5; // Number of users per page
  const [loading, setLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);

  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/");
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();

      setUsers(data);
      setIsLastPage(data.length < limit); // If fewer results than limit, likely last page
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (!isLastPage) setPage(prev => prev + 1);
  };

  return (
    <div className="get-user-container">
      <h2>User List</h2>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-state"></div>}

      {!loading && users.length === 0 && !error ? (
        <div className="empty-state">
          <h3>No Users Found</h3>
          <p>There are no users to display at the moment.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td data-label="User ID">{user.user_id}</td>
                  <td data-label="Name">{user.name}</td>
                  <td data-label="Email">{user.email}</td>
                  <td data-label="Address">{user.address}</td>
                  <td data-label="Phone">{user.phone}</td>
                  <td data-label="Age">{user.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button onClick={handlePrev} disabled={page === 1}>Previous</button>
        <span style={{ margin: "0 1rem" }}>Page {page}</span>
        <button onClick={handleNext} disabled={isLastPage}>Next</button>
      </div>

      <button onClick={handleHome} className='backbtn'>Return Home</button>
    </div>
  );
}

export default GetUser;
