import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext.js'; 
import { api } from '../util/api.js';
import './Dashboard.css';

const Dashboard = () => {
  const { logout } = useAuth(); 
  const [allComplaints, setAllComplaints] = useState([]);
  const [openComplaints, setOpenComplaints] = useState([]); 
  const [closedComplaints, setClosedComplaints] = useState([]);
  const [topComplaints, setTopComplaints] = useState([]);
  const [constituentComplaints, setConstituentComplaints] = useState([]); 
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('allComplaints'); 

  // array of tab information
  const tabs = [
    { name: 'All Complaints', key: 'allComplaints', data: allComplaints },
    { name: 'Open Complaints', key: 'openComplaints', data: openComplaints },
    { name: 'Closed Complaints', key: 'closedComplaints', data: closedComplaints },
    { name: 'Top Complaints', key: 'topComplaints', data: topComplaints },
    { name: 'Constituent Complaints', key: 'constituentComplaints', data: constituentComplaints },
  ];

  // fetch all complaints as soon as page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allData = await api.get('allComplaints');
        setAllComplaints(allData);

        const openData = await api.get('openCases');
        setOpenComplaints(openData);

        const closedData = await api.get('closedCases');
        setClosedComplaints(closedData);

        const topComplaintsData = await api.get('topComplaints');
        setTopComplaints(topComplaintsData);

        const constituentData = await api.get('constituentComplaints');
        setConstituentComplaints(constituentData);

        setLoading(false); 
      } catch (err) {
        setError(err.message); 
        setLoading(false); 
      }
    };
    fetchData(); 
  }, []); 

  const handleLogout = () => {
    logout(); 
  };

  const renderTable = (data) => (
    <div>
      {data.length === 0 ? (
        <p className="no-rows-message">No rows available for this table.</p>
      ) : (
        <table className="complaints-table">
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
      )}
    </div>
  );

  const renderTopComplaints = (title, data) => (
    <div>
      <h2 className="table-title">{title}</h2>
      {data.length === 0 ? (
        <p className="no-rows-message">No rows available for this table.</p>
      ) : (
        <table className="complaints-table">
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
      )}
    </div>
  );

  return (
    <div className="dashboard">
      <nav className="navbar">
        <a href="/" className="navbar-logo">
          <img
            alt="NYC Council Seal"
            src="https://council.nyc.gov/wp-content/themes/wp-nycc/assets/images/nyc-seal-blue.png"
          />
          <div className="navbar-text">New York City Council</div>
        </a>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {loading && <p className="loading-message">Loading complaints...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <div>
          {/* Tabs */}
          <ul className="tabs-container">
            {tabs.map((tab) => (
              <li key={tab.key} className="tab-item">
                <button
                  onClick={() => setActiveTab(tab.key)}
                  className={`tab-button ${
                    activeTab === tab.key ? 'active-tab' : ''
                  }`}
                >
                  {tab.name} ({tab.data.length})
                </button>
              </li>
            ))}
          </ul>

          {/* Render the active tab */}
          {activeTab === 'allComplaints' && renderTable(allComplaints)}
          {activeTab === 'openComplaints' && renderTable(openComplaints)}
          {activeTab === 'closedComplaints' && renderTable(closedComplaints)}
          {activeTab === 'topComplaints' && renderTopComplaints('Top 3 Complaints', topComplaints)}
          {activeTab === 'constituentComplaints' &&
            renderTable(constituentComplaints)}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
