import React from 'React';
import { Carousel } from 'antd';
import './ReactApp.css';
import style from './ReactApp.less';

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

    this.state = {
      msg: '使用 Ant Design { Carousel }',
      data: [],
    };

    this.getListData();
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
      }
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
   * 渲染
   * @return {XML}
   */
  render() {
    const { msg, data } = this.state;
    return (
      <div className={style.list}>
        <div className="example">{msg}</div>
        <Carousel autoplay>
          {data.map(this.renderList)}
        </Carousel>
      </div>
    );
  }
}

export default ReactApp;
