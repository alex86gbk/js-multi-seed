import React, { Fragment } from 'React';
import { Carousel, Button, message } from 'antd';
import './ReactApp.css';
import style from './ReactApp.less';

/**
 * 加载脚本
 * @param src
 * @return {Promise}
 */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * 加载样式
 * @param href
 * @return {Promise}
 */
function loadLink(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet/less';
    link.type = 'text/css';
    link.href = href;
    link.onerror = reject;
    document.head.appendChild(link);
    resolve();
  });
}

/**
 * 无 mock-server 响应时使用
 * @type {{returnEntity: [*]}}
 */
const mock = {
  returnEntity: [
    {
      id: '000001',
      name: '1',
    },
    {
      id: '000002',
      name: '2',
    },
    {
      id: '000003',
      name: '3',
    },
    {
      id: '000004',
      name: '4',
    },
    {
      id: '000005',
      name: '5',
    },
    {
      id: '000006',
      name: '6',
    },
  ],
};

/**
 * ReactApp
 */
class ReactApp extends React.Component {
  /**
   * 构造方法
   * @param props
   */
  constructor(props) {
    super(props);

    this.lessLoaded = false;

    this.state = {
      msg: '使用 Ant Design { Carousel }',
      msg2: '自定义主题示例：Ant Design { Button }',
      data: [],
      changing: false,
    };

    this.getListData();

    message.config({
      top: 100,
    });
  }

  /**
   * 获取列表数据
   */
  getListData() {
    const { dispatch } = this.props;

    dispatch.getList({
      payload: {
        id: 123,
      },
    }).then((data) => {
      if (data) {
        this.setState({
          data: data.returnEntity,
        });
      } else {
        this.setState({
          msg: '请检查 Mock 数据服务!',
        });
      }
    }).catch(() => {
      this.setState({
        data: mock.returnEntity,
      });
    });
  }

  /**
   * 渲染列表
   */
  renderList = (item) => {
    return (
      <div key={item.id}>
        <h3>{item.name}</h3>
      </div>
    );
  };

  /**
   * 点击切换颜色
   */
  handleColorChange = () => {
    /**
     * 改变颜色
     */
    const changeColor = () => {
      window.less
        .modifyVars({
          '@primary-color': '#F5222D',
          '@border-radius-base': '2px',
        })
        .then(() => {
          this.setState({
            changing: false,
          });
          message.success('修改颜色成功');
        });
    };

    const scriptUrl = 'https://alex86gbk.github.io/js-multi-seed/Content/less/less.min.js';
    const lessUrl = 'https://alex86gbk.github.io/js-multi-seed/Content/less/color.less';

    if (this.lessLoaded) {
      changeColor();
    } else {
      this.setState({
        changing: true,
      });
      window.less = {
        async: true,
        javascriptEnabled: true,
      };
      loadLink(lessUrl).then(() => {
        loadScript(scriptUrl).then(() => {
          this.lessLoaded = true;
          changeColor();
        });
      });
    }
  };

  /**
   * 渲染
   * @return {XML}
   */
  render() {
    const { msg, data, msg2, changing } = this.state;
    return (
      <Fragment>
        <div className={style.list}>
          <div className="example">{msg}</div>
          <Carousel autoplay>
            {data.map(this.renderList)}
          </Carousel>
        </div>
        <div className="example" style={{ marginTop: '20px' }}>{msg2}</div>
        <div className={style.customStyle}>
          <Button type="primary">Primary</Button>
          <Button>Default</Button>
          <Button type="dashed">Dashed</Button>
          <Button type="danger">Danger</Button>
        </div>
        <p>全局主色：primary-color（默认值：#1890ff）、边框圆角：border-radius-base（默认值：4px）</p>
        <Button onClick={this.handleColorChange} loading={changing}>动态修改主要颜色</Button>
        <div style={{ marginTop: '15px' }}>
          <span style={{ backgroundColor: '#1DA57A', width: '70px', height: '20px', display: 'inline-block' }}>#1DA57A</span>
          &nbsp;======&gt;&nbsp;
          <span style={{ backgroundColor: '#F5222D', width: '70px', height: '20px', display: 'inline-block' }}>#F5222D</span>
        </div>
      </Fragment>
    );
  }
}

export default ReactApp;
