import React from "React";
import style from './List.less';

class List extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      title: 'List'
    };
  }

  render(){
    return (
      <div className={style.list}>
        Hi {`{${this.state.title}}`} component
      </div>
    );
  }
}

export default List;
