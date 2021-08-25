import axios from "axios";

// const url = "http://localhost:5000/api"; localhost
const url = "https://freedom-health.dreamscom.tech/api";

export default class UsersApi {
  ///new Login
  static async login(data) {
    try {
      const res = await axios.post(`${url}/user/admin/login`, data);
      return res.data;
    } catch (error) {
      console.error(error);
      return "Error";
    }
  }
  static async data(i) {
    try {
      const res = await axios.get(`${url}${i}`);
      return res.data;
    } catch (error) {
      console.error(error);
      return "Error";
    }
  }
}
