import React from "React";
import { Carousel } from 'antd';
import './ReactApp.css';
import style from './ReactApp.less';

class ReactApp extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      msg: '使用 Ant Design { Carousel }',
      data: []
    };

    this.getListData();
  }

  /**
   * 获取列表数据
   */
  getListData = () => {
    this.props.dispatch.getList({
      payload: {
        id: 123
      }
    }).then((data) => {
      if (data) {
        this.setState({
          data: data.returnEntity
        });
      }
    })
  };

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

  render(){
    return (
      <div className={style.list}>
        <div className="example">{this.state.msg}</div>
        <Carousel autoplay>
          {this.state.data.map(this.renderList)}
        </Carousel>
      </div>
    );
  }
}

export default ReactApp;
