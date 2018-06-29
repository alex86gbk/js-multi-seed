import React from "React";
import style from './List.less';

class List extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      title: '年级列表',
      data: []
    };

    this.getGradesData();
  }

  /**
   * 获取年级数据
   */
  getGradesData = () => {
    this.props.dispatch.getGrades({
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
   * 渲染年级列表
   */
  renderGradesList = (item) => {
    return (<li key={item.id}>{item.name}</li>);
  };

  render(){
    return (
      <div className={style.list}>
        Hi {`{${this.state.title}}`} component
        <ul>{this.state.data.map(this.renderGradesList)}</ul>
      </div>
    );
  }
}

export default List;
