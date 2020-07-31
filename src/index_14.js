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
// 10. 今日のタスク数を判定して表示する
// 11. 新しいTodoの入力ロジックをコンテナに移動する
// 12. 今日のタスク数判定ロジックをコンテナに移動する
// 13. 新しいTodoの期日が今日より前だったらエラーとする
// 14. 期日のロジックが重複したので期日の型Deadlineを作成

class Deadline{
  rawDateString;
  #rawDate;
  constructor(date){
    if (!date) throw new Error("dateが未定義です。");
    this.rawDateString = date;
    if (this.isValidDate())
      this.#rawDate = new Date(`${this.rawDateString} 00:00:00`);
  }

  today() {
    return new Date(new Date().toLocaleDateString());
  }

  isToday() {
    if (this.today().getTime() === this.#rawDate.getTime()) {
      return true;
    }

    return false;
}

  isPast() {
    if (this.today().getTime() > this.#rawDate.getTime()) {
      return true;
    }

    return false;
  }

  isValidDate(){
    const reg = new RegExp(/\D+(\d+)-(\d+)-(\d+)/);
    return reg.test(this.rawDateString);
  }
}

const useTodoListContainer = () => {
  const [todoList, setTodoList] = useState([]);
  const [todaysTaskCount, setTodaysTaskCount] = useState(0);

  const addTodo = (todo, date) => {
    setTodoList(current => {
      const newVal = [...current];
      newVal.push({ todo: todo, date: date });

      newVal.forEach(element => {
        console.log(`newTodo = ${element.todo}, newDate = ${element.date}`);
      });

      return newVal;
    })
  }

  useEffect(() => {

    setTodaysTaskCount(
      todoList.reduce((acum, current) => {
        const currenetDate = new Date(`${current.date} 00:00:00`);
        const today = new Date(new Date().toLocaleDateString());

        if (today.getTime() === currenetDate.getTime()) {
          return acum + 1;
        }

        return acum;
      }, 0)
    )

  }, [todoList]);
  
  return { todoList, addTodo, todaysTaskCount };
}

const TodoListContainer = createContainer(useTodoListContainer);

const Summary = () => {

  const todoContainer = TodoListContainer.useContainer();

  return (
    <div>
      <span>今日締め切りのタスク数：{todoContainer.todaysTaskCount}</span>
    </div>
  );
}

const InputTask = () => {

  const [newTodo, setNewTodo] = useState(null);
  const [newDate, setNewDate] = useState(null);
  const [isDateError, setIsDateError] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const todoContainer = TodoListContainer.useContainer();

  const buttonClick = () => {
    todoContainer.addTodo(newTodo, newDate);
  }

  const inputTaskChange = (e) => {
    setNewTodo(e.target.value);
  }

  const inputDateChange = (e) => {
    const currenetDate = new Date(`${e.target.value} 00:00:00`);
    const today = new Date(new Date().toLocaleDateString());

    if (today.getTime() <= currenetDate.getTime()) {
      setNewDate(e.target.value);
      setIsDateError(false);
    } else {
      setIsDateError(true)
    }
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
      {(isDateError ? <span style={{color: 'red'}}>過去の日付は入力できません</span> : '')}
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
