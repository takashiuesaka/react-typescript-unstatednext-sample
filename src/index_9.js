import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'unstated-next';
import * as serviceWorker from './serviceWorker';

// 1. まずはHTMLをべた書き
// 2. 3つのコンポーネントにわける
// 3. とりあえずState管理のカスタムフックを作成
// 4. カスタムフックをunstated-nextでコンテナ化する
// 5. Providerで囲って、3つのコンポーネントをInjection対象にする
// 6. ボタンクリックで新しいTodoの入力を受け付けるためのとりあえずの実装
// 7. 新しいTodoの入力と期日の入力が両方されている時だけボタンを使用可能にする
// 8. 新しいTodoのボタンクリック時にコンテナにTodoを保管する
// 9. Todo一覧を表示する

const useTodoListContainer = () => {
  const [todoList, setTodoList] = useState([]);

  return { todoList, setTodoList };
}

const TodoListContainer = createContainer(useTodoListContainer);

const Summary = () => {
  return (
    <div>
      <span>今日締め切りのタスク数：2</span>
    </div>
  );
}

const InputTask = () => {

  const [newTodo, setNewTodo] = useState(null);
  const [newDate, setNewDate] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const todoContainer = TodoListContainer.useContainer();

  const buttonClick = () => {
    todoContainer.setTodoList(current => {
      const newVal = [...current];
      newVal.push({ todo: newTodo, date: newDate });

      newVal.forEach(element => {
        console.log(`newTodo = ${element.todo}, newDate = ${element.date}`);
      });

      return newVal;
    })
  }

  const inputTaskChange = (e) => {
    setNewTodo(e.target.value);
  }

  const inputDateChange = (e) => {
    setNewDate(e.target.value);
  }

  useEffect(() => {
    if (!newTodo || !newDate) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false)
    }
  }, [newTodo, newDate])

  return (
    <div>
      <span>タスク:</span><input type="textbox" onChange={inputTaskChange} />
      <span>期日：</span><input type="date" onChange={inputDateChange} />
      <button onClick={buttonClick} disabled={buttonDisabled}>入力</button>
    </div>
  );
}

const RenderTask = () => {

  const todoContainer = TodoListContainer.useContainer();

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>タスク</th><th>期日</th>
          </tr>
        </thead>
        <tbody>
          {
            todoContainer.todoList.map((element, i) =>
              <tr key={i}>
                <td>{element.todo}</td>
                <td>{element.date}</td>
              </tr>
            )
          }
        </tbody>
      </table>
    </>
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
