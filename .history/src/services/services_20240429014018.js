import axios from 'axios';
const BACKEND_APP_URL = "http://localhost:8080/api";

export const loginUser = (username, password) => {
  return axios({
    url: BACKEND_APP_URL + "/auth/login",
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
      "email": username,
      "password": password
    })
  });
}

export const getAllUsers = () => {
  return axios({
    url: BACKEND_APP_URL + "/users_with_status",
    headers: { 'Content-Type': 'application/json', 'token': localStorage.getItem('token') },
    method: "GET"
  });
}

export const getAllUsersWithUserRole = () => {
  return axios({
    url: BACKEND_APP_URL + "/users_with_user_role",
    headers: { 'Content-Type': 'application/json', 'token': localStorage.getItem('token') },
    method: "GET"
  });
}

export const getUserById = (userId) => {
  return axios({
    url: BACKEND_APP_URL + "/users/" + userId,
    headers: { 'Content-Type': 'application/json', 'token': localStorage.getItem('token') },
    method: "GET"
  });
}

export const logoutUser = (userId) => {
  return axios({
    url: BACKEND_APP_URL + "/auth/signout/" + userId,
    method: "POST",
    headers: { 'Content-Type': 'application/json' }
  });
}

export const csvFileUpload = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios({
    url: BACKEND_APP_URL + "/file/upload/" + localStorage.getItem("userId"),
    method: "POST",
    headers: { 'Content-Type': 'multipart/form-data', 'token': localStorage.getItem('token') },
    data: formData
  });
}

export const registerUser = (fname, lname, email, password) => {
  return fetch(BACKEND_APP_URL + "/auth/register", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "firstName": fname,
      "lastName": lname,
      "password": password,
      "email": email
    })
  });
}

export const readData = () => {
  return axios({
    url: BACKEND_APP_URL + "/file",
    method: "GET",
    headers: { 'Content-Type': 'application/json', 'token': localStorage.getItem('token') },
  });
}

export const updatePassword = (email, password) => {
  return fetch(BACKEND_APP_URL + "/auth/reset-password", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "password": password,
      "email": email
    })
  });
}

// Method to update account details
export const updateAccount = (accountId, accountDetails) => {
  return axios({
    url: BACKEND_APP_URL + "/file/account/"+ accountId,
    method: "PUT",
    headers: { 'Content-Type': 'application/json', 'token': localStorage.getItem('token') },
    data: accountDetails
  });
}

// Method to delete an account
export const deleteAccount = async (accountId) => {
  try {
    return await axios({
      url: BACKEND_APP_URL + "/file/account/" + accountId,
      method: "DELETE",
      headers: { 'Content-Type': 'application/json', 'token': localStorage.getItem('token') },
    });
  } catch (error) {
    console.error("Delete operation failed:", error.response ? error.response.data : "No response data");
    throw error; // Re-throw the error if you need further error handling by the caller
  }
};
