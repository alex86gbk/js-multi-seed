import request from '../utils/request';

/**
 * 获取所有年级
 * @param params
 * @return {Promise.<Object>}
 */
export async function getGrades(params) {
  return request({
    url: '/api/common/getGrades',
    method: "POST",
    data: params.payload
  });
}
