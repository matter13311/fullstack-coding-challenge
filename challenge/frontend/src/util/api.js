//API utility file to handle API requests for complaints

const BASE_URL = "http://127.0.0.1:8000/api/complaints/";

// authentication token is stored in localStorage.
const getToken = () => {
  return localStorage.getItem("authToken");
};

// reuseable function to make GET requests
const getRequest = async (endpoint) => {
  const headers = {
    "Content-Type": "application/json",
  };


  const token = getToken();
  console.log("token: ", token);
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  const config = {
    method: "GET",
    headers,
  };

  console.log('config: ', config);

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "API request failed");
  }

  return data; 
};

export const api = {
  get: getRequest, 
};
