import React from 'react';
import _ from 'lodash';
import { rewriteDotHtml } from '../../.projectrc.js';

/**
 * JMS导航组件
 * 使用方式和 a 标签一样
 * @param {*} props
 * @example
 *   <JMSLink href={`${JMSPublicPath}/Admin/index.html`}>统计分析</JMSLink>
 */
export const JMSLink = ({ children, ...props }) => {
  const allProps = { ...props };

  _.forEach(allProps, (value, key) => {
    if (key === 'href') {
      allProps[key] = rewriteDotHtml ? value.replace(/.html/i, '') : value;
    }
  });

  return (
    <a {...allProps}>
      {children}
    </a>
  );
};

/**
 * JMS导航处理组件
 * 处理配置型导航
 * @param {object|array} config
 * @param {string} key
 * @return {object|array}
 * @example
 *   以 Ant design Menu导航菜单组件配置项为例
 *   const menuDataMap = {
 *     '5': {
 *       name: '导航菜单A',
 *       menuData: [
 *         {
 *           'Key': 'NavMenuA',
 *           'Name': '导航菜单A',
 *           'Icon': 'bar-chart',
 *           'Children': [
 *             {
 *               'Key': 'NavMenuA.SubA',
 *               'Name': '菜单A',
 *               'Link': 'Admin/pageA.html',
 *             },
 *             {
 *               'Key': 'NavMenuA.SubB',
 *               'Name': '菜单B',
 *               'Link': 'Admin/pageB.html',
 *             },
 *           ],
 *         },
 *       ],
 *     },
 *   };
 *   console.log(JSMLinkHandler(menuDataMap, 'Link'));
 *   {
 *     '5': {
 *       name: '导航菜单A',
 *       menuData: [
 *         {
 *           'Key': 'NavMenuA',
 *           'Name': '导航菜单A',
 *           'Icon': 'bar-chart',
 *           'Children': [
 *             {
 *               'Key': 'NavMenuA.SubA',
 *               'Name': '菜单A',
 *               'Link': 'Admin/pageA',
 *             },
 *             {
 *               'Key': 'NavMenuA.SubB',
 *               'Name': '菜单B',
 *               'Link': 'Admin/pageB',
 *             },
 *           ],
 *         },
 *       ],
 *     },
 *   };
 */
export const JSMLinkHandler = (config, key) => {
  const handler = {
    'object': ObjHandle,
    'array': ArrHandle,
    'other': () => {
      console.error('请传入正确的导航配置', 3);
    },
  };
  /**
   * 获取类型
   * @param {object|array} params
   */
  function getType(params) {
    return _.isPlainObject(params)
      ? 'object'
      : _.isArray(params)
        ? 'array'
        : 'other';
  }
  /**
   * 对象处理
   * @param {object} params
   * @return {object}
   */
  function ObjHandle(params, matchKey) {
    let newParams;
    _.forEach(params, (value, ObjKey) => {
      if (getType(value) === 'other') {
        if (_.isString(value) && ObjKey === matchKey) {
          params[ObjKey] = params[ObjKey].replace(/.html/i, '');
        }
      } else {
        newParams = handler[getType(value)](value, matchKey);
      }
    });
    newParams = params;

    return newParams;
  }
  /**
   * 数组处理
   * @param {array} params
   * @return {array}
   */
  function ArrHandle(params, matchKey) {
    return _.map(params, (value) => {
      if (getType(value) === 'other') {
        if (_.isString(value)) {
          return value.replace(/.html/i, '');
        }
      } else {
        return handler[getType(value)](value, matchKey);
      }
    });
  }

  if (rewriteDotHtml) {
    return handler[getType(config)](config, key);
  } else {
    return config;
  }
};
