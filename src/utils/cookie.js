/**
 * Cookie
 * @constructor
 */
function Cookie() {
  /**
   * 获取 Cookie 对象
   * @return {{}}
   */
  function getCookiesObj() {
    const cookies = {};

    if (document.cookie) {
      const obj = document.cookie.split('; ');
      for (const i in obj) {
        if ({}.hasOwnProperty.call(obj, i)) {
          const index = obj[i].indexOf('=');
          const name = obj[i].substr(0, index);

          cookies[name] = obj[i].substr(index + 1, obj[i].length);
        }
      }
    }
    return cookies;
  }

  /**
   * 设置 Cookie
   * @param name {String}
   * @param value {String}
   * @param opts {Object}
   * @param opts.maxAge
   * @param opts.path
   * @param opts.domain
   * @param opts.secure
   */
  this.set = function set(name, value, opts) {
    if (name && value) {
      let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

      if (opts) {
        if (opts.maxAge) {
          cookie += `; max-age=${opts.maxAge}`;
        }
        if (opts.path) {
          cookie += `; path=${opts.path}`;
        }
        if (opts.domain) {
          cookie += `; domain=${opts.domain}`;
        }
        if (opts.secure) {
          cookie += '; secure';
        }
      }

      document.cookie = cookie;

      return cookie;
    } else {
      return '';
    }
  };

  /**
   * 获取 Cookie
   * @param {String} name
   * @return {String|null}
   */
  this.get = function get(name) {
    return decodeURIComponent(getCookiesObj()[name]) || null;
  };

  /**
   * 删除 Cookie
   * @param {String} name
   */
  this.remove = function remove(name) {
    if (getCookiesObj()[name]) {
      document.cookie = `${name}=; max-age=0`;
    }
  };

  /**
   * 清除所有 Cookie
   */
  this.clear = function clear() {
    const cookies = getCookiesObj();

    for (const key in cookies) {
      if ({}.hasOwnProperty.call(cookies, key)) {
        document.cookie = `${key}=; max-age=0`;
      }
    }
  };

  /**
   * 获取所有 Cookie
   * @return {Object}
   */
  this.getCookies = function getCookies() {
    return getCookiesObj();
  };
}

export default new Cookie();
