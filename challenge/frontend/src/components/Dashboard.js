import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext.js'; // Import the useAuth hook to access authentication context
import { api } from '../util/api.js'; // Import the centralized API utility

const Dashboard = () => {
  const { logout } = useAuth(); // Access the logout function from AuthContext
  const [allComplaints, setAllComplaints] = useState([]); // State to store all complaints
  const [openComplaints, setOpenComplaints] = useState([]); // State to store open complaints
  const [closedComplaints, setClosedComplaints] = useState([]); // State to store closed complaints
  const [topComplaints, setTopComplaints] = useState([]); // State to store top complaints
  const [constituentsView, setConstituentsView] = useState([]); // State to store constituents view data
  const [error, setError] = useState(''); // State to store error messages
  const [loading, setLoading] = useState(true); // State to track loading status
  const [isConstituentView, setIsConstituentView] = useState(false); // State to track the current view

  // Fetch complaints when the component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all complaints
        const allData = await api.get('allComplaints');
        setAllComplaints(allData);

        // Fetch open complaints
        const openData = await api.get('openCases');
        setOpenComplaints(openData);

        // Fetch closed complaints
        const closedData = await api.get('closedCases');
        setClosedComplaints(closedData);

        // Fetch top 3 complaints
        const topComplaintsData = await api.get('topComplaints');
        setTopComplaints(topComplaintsData);

        // Fetch constituent complaints
        const constituentsViewData = await api.get('constituentComplaints');
        setConstituentsView(constituentsViewData);

        setLoading(false); // Set loading to false after all data is fetched
      } catch (err) {
        setError(err.message); // Set error message if any request fails
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchData(); // Call the function to fetch complaints
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleLogout = () => {
    logout(); // Call the logout function to clear the authToken
  };

  // Reusable function to render a table
  const renderTable = (title, data) => (
    <div className="bg-blue-500 text-white p-4" >
      <h2>{title}</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Unique Key</th>
            <th>Account</th>
            <th>Open Date</th>
            <th>Complaint Type</th>
            <th>Descriptor</th>
            <th>ZIP</th>
            <th>Borough</th>
            <th>City</th>
            <th>Council District</th>
            <th>Community Board</th>
            <th>Close Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((complaint) => (
            <tr key={complaint.unique_key}>
              <td>{complaint.unique_key}</td>
              <td>{complaint.account}</td>
              <td>{complaint.opendate}</td>
              <td>{complaint.complaint_type}</td>
              <td>{complaint.descriptor}</td>
              <td>{complaint.zip}</td>
              <td>{complaint.borough}</td>
              <td>{complaint.city}</td>
              <td>{complaint.council_dist}</td>
              <td>{complaint.community_board}</td>
              <td>{complaint.closedate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTopComplaints = (title, data) => (
    <div>
      <h2>{title}</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Complaint Type</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {data.map((complaint, index) => (
            <tr key={index}>
              <td>{complaint.complaint_type}</td>
              <td>{complaint.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <button onClick={handleLogout}>Logout</button> {/* Logout button */}
      <button onClick={() => setIsConstituentView(!isConstituentView)}>
        {isConstituentView ? 'View All Complaints' : 'View Constituent Complaints'}
      </button>

      {loading && <p>Loading complaints...</p>} {/* Show loading message */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message */}
      {!loading && !error && (
        <div>
          {isConstituentView
            ? renderTable('Constituent Complaints', constituentsView)
            : (
              <>
                {renderTable('All Complaints', allComplaints)}
                {renderTable('Open Complaints', openComplaints)}
                {renderTable('Closed Complaints', closedComplaints)}
                {renderTopComplaints('Top 3 Complaints', topComplaints)}
              </>
            )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
