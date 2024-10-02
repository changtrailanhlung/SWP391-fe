import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7130/api",
});

// Request Interceptor to include Authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Handle 401 Unauthorized error, possibly redirect to login
        alert("Unauthorized access. Please log in again.");
        window.location.href = "/admin/login"; // Adjust to your login route
      } else if (error.response.status >= 400) {
        // Handle other errors globally
        alert(
          "An error occurred: " +
            (error.response.data?.message || "Unknown error")
        );
      }
    } else {
      // Handle network errors
      alert("Network error. Please check your internet connection.");
    }
    return Promise.reject(error);
  }
);

// GET without Authorization (public routes)
export const get = async (path) => {
  try {
    const response = await api.get(path);
    return response.data;
  } catch (error) {
    // console.error("Error in GET request:", error);
    throw error;
  }
};

// GET with Authorization (protected routes)
export const gets = async (path) => {
  try {
    const response = await api.get(path);
    return response.data;
  } catch (error) {
    // console.error("Error in authorized GET request:", error);
    throw error;
  }
};

// POST with Authorization
export const post = async (path, values) => {
  try {
    const response = await api.post(path, values);
    return response.data;
  } catch (error) {
    // console.error("Error in POST request:", error);
    throw error;
  }
};

// POST without Authorization (public routes)
export const pay = async (path, values) => {
  try {
    const response = await api.post(path, values);
    return response.data;
  } catch (error) {
    // console.error("Error in payment POST request:", error);
    throw error;
  }
};

// PUT with Authorization
export const put = async (path, values) => {
  try {
    const response = await api.put(path, values);
    return response.data;
  } catch (error) {
    // console.error("Error in PUT request:", error);
    throw error;
  }
};

// PATCH with Authorization
export const patch = async (path, values) => {
  try {
    const response = await api.patch(path, values);
    return response.data;
  } catch (error) {
    // console.error("Error in PATCH request:", error);
    throw error;
  }
};

// DELETE with Authorization
export const remove = async (path) => {
  try {
    const response = await api.delete(path);
    return response.data;
  } catch (error) {
    // console.error("Error in DELETE request:", error);
    throw error;
  }
};

export default api;
