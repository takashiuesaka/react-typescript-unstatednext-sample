import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { createContainer, useContainer } from 'unstated-next';
import * as serviceWorker from './serviceWorker';

// 1. まずはHTMLをべた書き
// 2. 3つのコンポーネントにわける
// 3. とりあえずState管理のカスタムフックを作成
// 4. カスタムフックをunstated-nextでコンテナ化する
// 5. Providerで囲って、3つのコンポーネントをInjection対象にする
// 6. ボタンクリックで新しいTodoの入力を受け付けるためのとりあえずの実装

const useTodoListState = () => {
  const [todoList, setTodoList] = useState([]);

  return {todoList, setTodoList};
}

const TodoListContainer = createContainer(useTodoListState);

const Summary = () => {
  return (
    <div>
      <span>今日締め切りのタスク数：2</span>
    </div>
  );
}

const InputTask = () => {

  let newTodo = ""
  let newDate = new Date(0);

  const buttonClick = () => {
    console.log(`newtodo = ${newTodo}, newDate = ${newDate}`);
  }

  const inputTaskChange = (e) => {
    newTodo = e.target.value;
  }

  const inputDateChange = (e) => {
    newDate = e.target.value;
  }

  return (
    <div>
      <span>タスク:</span><input type="textbox" onChange={inputTaskChange} />
      <span>期日：</span><input type="date" onChange={inputDateChange} />
      <button onClick={buttonClick}>入力</button>
    </div>
  );
}

const RenderTask = () => {
  return (
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
  );
}

ReactDOM.render(
  <React.StrictMode>
    <TodoListContainer.Provider>
      <Summary />
      <hr />
      <InputTask />
      <hr />
      <RenderTask />
    </TodoListContainer.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
