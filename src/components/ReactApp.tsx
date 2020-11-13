import React, { ReactNode } from 'React';
import { Carousel, message } from 'antd';
import './ReactApp.css';
import style from './ReactApp.less';

interface Props {
  dispatch: {
    getList<T>(payload: any): Promise<T>
  }
}

interface State {
  msg: string;
  data: MockData[]
}

interface MockData {
  id: string,
  name: string,
};

/**
 * 无 mock-server 响应时使用
 * @type {{returnEntity: [*]}}
 */
const mock: { returnEntity: MockData[] } = {
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
class ReactApp extends React.Component<Props, State> {
  readonly state: Readonly<State> = {
    msg: '使用 Ant Design { Carousel }',
    data: [],
  }

  lessLoaded: boolean = false;
  /**
   * 构造方法
   * @param props
   */
  constructor(props: Props) {
    super(props);
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
    }).then((data: { returnEntity: MockData[] }) => {
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
  renderList = (item: MockData) => {
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
  render(): ReactNode {
    const { msg, data } = this.state;
    return (
      <>
        <div className={style.list}>
          <div className="example">{msg}</div>
          <Carousel autoplay>
            {data.map(this.renderList)}
          </Carousel>
        </div>
      </>
    );
  }
}

export default ReactApp;
