![image](https://user-images.githubusercontent.com/1990992/48991137-9b5b1600-f16c-11e8-91be-0f2d325f60c8.png)

# 介绍
本项目为多页混合型应用。在支持React、Vue技术和es6新特性的同时，兼容jQuery等传统Web技术的使用。

# 是否兼容IE 8
No !

如需在 IE 系列浏览器下使用请在 **.ejs** 文件中添加（默认已添加）
```html
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE9">
```
以支持条件性注释，启用 `polyfill`。

# 使用

## 工具

建议配合 [jms-cli](https://github.com/alex86gbk/jms-cli) 工具管理项目，简化维护工作量，降低上手成本。

## 启动服务并使用本地数据
```bash
npm run local
```

本地数据服务（api）为 `http://localhost:3000`

## 启动服务并使用联调数据
```bash
npm run dev
```

联调数据服务（api）为（[YApi](https://yapi.ymfe.org/) 提供支持） `http://10.0.2.231:3333/mock/XX` （项目不同 `XX` 需另行配置）

## 发布
```bash
npm run build
```

打包并输出版本到 `dist` 目录

# 目录结构及描述

```
│  .projectrc.js                          # 项目配置文件
│  ...
│  
├─.usr                                    # 框架应用
├─.var                                    # 日志等
├─dist                                    # 生产环境输出目录
├─mock                                    # 模拟数据
│  └─common
│          getList.json
│          ...
│      
├─src                                     # 源文件
│  ├─assets                               # 静态资源
│  │      ...
│  │
│  ├─components                           # 模块化组件 
│  │      ReactApp.jsx
│  │      ReactApp.less
│  │      ReactApp.css
│  │      VueApp.vue
│  │      ...
│  │
│  ├─pages                                # 页面入口
│  │      index.js
│  │      ...
│  │
│  ├─services                             # 接口
│  │      commonServices.js
│  │      ...
│  │      
│  └─utils                                # 工具
│         ...
│
└─templates                                
        index.ejs                         # 页面视图
        _assets.html                      # 全局静态资源依赖
        ...
```

# 页面（资源）规则
- `/templates` 中的 **.ejs** 文件，目录结构（除以_开头的文件）为实际访问地址。
  > `/templates/index.ejs` 对应的访问地址为 `http://localhost:8080/index.html`
- `/templates` 中的 **.ejs** 文件 需与 `/src/pages` 中的 **.js** 文件，在目录结构，文件命名保持**完全一致**。
  > `/templates/`**foo/index.ejs** 对应 `/src/pages/`**foo/index.js**
- `/src/pages` 中的文件为页面入口（一个 **.ejs** 对应一个 **.js** 文件）文件。
  > `/templates/`**index.ejs** 关联的入口文件为 `/src/pages/`**index.js**

传送门：[如何设置/标记页面参数](https://github.com/alex86gbk/js-multi-seed/issues/8)

# 一些约定
对目录结构及描述中未提及的情况进行补充说明。

## 命名
- 位于 `/src/components` 文件夹下的文件一律**首字母大写**（这里面的都是React组件或可复用的类）；
- React 组件，为更好区分以 **.jsx** 为扩展名；
- 其他（文件夹/文件）命名应遵循驼峰式规范。

## 异步请求（接口）
- `/src/services` 文件夹下的文件对应业务模块或者通用模块的异步请求声明；
- 在开发时为了能快速定位并区分业务模块和异步请求模块。`/src/services` 文件夹下的文件以**业务模块命名**开头，**Services**结尾；
  > 如：`/src/services/`**indexServices.js** 对应 `/src/pages/`**index.js**

传送门：[issue 集中式申明，管理异步请求接口](https://github.com/alex86gbk/js-multi-seed/issues/2)

## 文件组织
遵循《**就近原则**》。
- `/src/pages` 文件夹下的页面 **.js** 和 **.css** 文件，应处于同一层级的文件夹下。
  > `/src/pages/`**index.js** 对应 `/src/pages/`**index.css**。（有子目录的情况亦是如此）；
- `/src/components` 文件夹下的页面 **.js** 和 **.css** 文件，应处于同一层级的文件夹下。
  > `/src/components/`**weChat/Order.js** 对应 `/src/components/`**weChat/Order.css**；
- `/src/assets` 包含全局资源和第三方组件，**不受约束**。

## 使用 jQuery 及其插件

### jQuery
```javascript
const $ = require("jQuery");
//或
import $ from "jQuery";

$("#content").html("<h1>hello world</h1>");
```

### jQuery 插件
支持模块化：
```javascript
//引入插件
require("jquery-ui");

//使用插件
$("#accordion").accordion();
```

不支持模块化：在 **.ejs** 文件中直接引入
```javascript
<link rel="stylesheet" href="/assets/vendor/jQuery-ui/1.12.1/themes/base/jquery-ui.css">
<script src="/assets/vendor/jQuery-ui/1.12.1/jquery-ui.js"></script>
```

## JavaScript 库，框架 支持
- jQuery
- React
- Vue

## 样式 支持
- CSS
- Sass
- Less
- CSS Modules

