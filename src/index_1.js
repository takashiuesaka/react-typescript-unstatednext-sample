import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

// 1. まずはHTMLをべた書き

ReactDOM.render(
  <React.StrictMode>
    <div>
      <span>今日締め切りのタスク数：2</span>
    </div>
    <hr />
    <div>
      <span>タスク:</span><input type="text" />
      <span>期日：</span><input type="date" />
      <button>入力</button>
    </div>
    <hr />
    <table>
    <thead>
        <tr>
          <th>タスク</th><th>期日</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>〇社へ状況確認連絡</td><td>2020/7/15</td>
        </tr>
        <tr>
          <td>△社提案資料作成</td><td>2020/7/15</td>
        </tr>
        <tr>
          <td>稟議作成</td><td>2020/7/16</td>
        </tr>
      </tbody>
    </table>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
