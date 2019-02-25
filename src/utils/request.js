import axios from 'axios';
import cookie from './cookie';
import projectRC from '../../.projectrc';

const { mock } = projectRC;
const apiHost = cookie.get('ApiHost') === 'undefined' ? `http://localhost:${eval('mock.port')}` : cookie.get('ApiHost');

/**
 * 请求方法
 * @param options
 * @return {Promise}
 */
export default function request(options) {
  let errCode;
  const defaults = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    withCredentials: true,
    validateStatus: (status) => {
      if (status >= 200 && status < 300) {
        return true;
      } else {
        errCode = status;
        return false;
      }
    },
    timeout: 10000,
  };

  const param = Object.assign(defaults, options);

  if (!mock.ReverseProxy) {
    param.url = apiHost + param.url;
  }

  return axios.request(param)
    .then(response => response.data)
    .catch(() => {
      console.log(errCode);
    });
}
