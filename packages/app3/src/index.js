import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';






import singleSpaReact from 'single-spa-react'

// 主应用注册成功后会在window下挂载singleSpaNavigate方法
// 为了独立运行，避免子项目页面为空，
// 判断如果不在微前端环境下进行独立渲染html
if (!window.singleSpaNavigate) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}




const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App,
  domElementGetter,
})

export const bootstrap = [
  reactLifecycles.bootstrap,
]

export const mount = [
  reactLifecycles.mount,
]

export const unmount = [
  reactLifecycles.unmount,
]

export const unload = [
  reactLifecycles.unload,
]

function domElementGetter() {
  let el = document.getElementById("app3");
  if (!el) {
    el = document.createElement('div');
    el.id = 'app3';
    document.body.appendChild(el);
  }

  return el;
}



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


