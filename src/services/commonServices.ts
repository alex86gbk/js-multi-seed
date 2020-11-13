import request from '../utils/request';

/**
 * 获取列表
 * @param params
 * @return {Promise.<Object>}
 */
export async function getList<T>(params: any): Promise<T> {
  return request({
    url: '/common/getList',
    method: 'POST',
    data: params.payload,
  });
}
