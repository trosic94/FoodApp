import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL+"/foody/";

class AuthService {
   async login(credential) {
     const res = await axios
      .post(API_URL+'signin', {
        credential
      })
      .then(response => {
        if (response.data) {
          if (response.status === 200 || response.status === 201) {
            if (response.data.accessToken) {
              localStorage.setItem("foody-user", JSON.stringify(response.data));
            }
            return response.data;
          }
        }
      }).catch(
        function (error) {
          if(error.response && (error.response.status === 404 || error.response.status === 403 ||  error.response.status === 401 || error.response.status === 500)) {
            console.clear();
            return Promise.reject(error);
          }
        }
      );
      return await res;
  }

  logout() {
    localStorage.removeItem("foody-user");
  }

  async register(username,email, password) {
    const res = await axios.post(API_URL + "signup", {
      username,
      email,
      password
    }).then(response => {
      if (response.data) {
        if (response.status === 200 || response.status === 201) {
          return response.data;
        }
      }
    }).catch(
      function (error) {
        if(error.response && (error.response.status === 400 || error.response.status === 500)) {
          console.clear();
          return Promise.reject(error);
        }
      }
    );
    return await res;
  }

  async resend(email) {
    const res = await axios.post(API_URL + "resend", {email})
    .then(response => {
      if (response.data) {
        if (response.status === 200 || response.status === 201) {
          return response.data;
        }
      }
    }).catch(
      function (error) {
        if(error.response && (error.response.status === 500 || error.response.status === 400)) {
          console.clear();
          return Promise.reject(error);
        }
      }
    );
    return await res;
  }

  async resetPassword(email) {
    const res = await axios.post(API_URL + "reset", {email})
    .then(response => {
      if (response.data) {
        if (response.status === 200 || response.status === 201) {
          return response.data;
        }
      }
    }).catch(
      function (error) {
        if(error.response && (error.response.status === 500 || error.response.status === 400)) {
          console.clear();
          return Promise.reject(error);
        }
      }
    );
    return await res;
  }

  async setNewPassword(password,token) {
    const res = await axios.post(API_URL + "setnewpassword", {password,token})
    .then(response => {
      if (response.data) {
        if (response.status === 200 || response.status === 201) {
          return response.data;
        }
      }
    }).catch(
      function (error) {
        if(error.response && (error.response.status === 500 || error.response.status === 400)) {
          console.clear();
          return Promise.reject(error);
        }
      }
    );
    return await res;
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}




export default new AuthService();