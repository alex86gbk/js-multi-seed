import axios from 'axios';

export default function request(options) {
  let errCode;
  let defaults = {
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    validateStatus: function (status) {
      if (status >= 200 && status < 300) {
        return true
      } else {
        errCode = status;
        return false;
      }
    }
  };

  options = Object.assign(defaults, options);

  return axios.request(options)
    .then(response => response.data)
    .catch(() => {
      console.log(errCode)
    });
}
