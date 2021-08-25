import axios from "axios";

// const url = "http://localhost:5000/api"; localhost
const url = "https://freedom-health.dreamscom.tech/api";

export default class FormsApi {
  async post(i, data) {
    try {
      const res = await axios.post(`${url}${i}`, data);
      return res.data;
    } catch (error) {
      console.log(error);
      return "Error";
    }
  }
}
