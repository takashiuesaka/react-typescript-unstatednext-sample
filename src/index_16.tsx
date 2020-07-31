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
// 15. 型Deadlineを使うように修正
// 16. そろそろ型がないと辛いのでtypescript対応する
//   16-1. development server起動中なら一度停止(ctrl+c)
//   16-2. yarn add -D typescript @types/node @types/react @types/react-dom @types/jest
//   16-3. index.js を index.tsxへ変更
//   16-4. yarn start これだけで必要なファイルは自動的に生成される。
//   16-5. typeエラーが出まくるので必要最低限だけを修正

class Deadline {
  rawDateString: string;
  private rawDate: Date;
  constructor(rawDateString: string) {
    if (!rawDateString) throw new Error("dateが未定義です。");
    this.rawDateString = rawDateString;

    if (!this.isValid()) {
      console.error(`rawDateString の書式が不正です。rawDateString=${rawDateString}`);
      throw new Error(`rawDateString の書式が不正です。rawDateString=${rawDateString}`);
    }

    this.rawDate = new Date(`${this.rawDateString} 00:00:00`);
  }

  today() {
    return new Date(new Date().toLocaleDateString());
  }

  isToday() {
    if (this.today().getTime() === this.rawDate.getTime()) {
      return true;
    }

    return false;
  }

  isPast() {
    if (this.today().getTime() > this.rawDate.getTime()) {
      return true;
    }

    return false;
  }

  isValid() {
    const a = this.rawDateString.match(/^(\d+)-(\d+)-(\d+)$/);
    if (a) {
      const y = parseInt(a[1]);
      const m = parseInt(a[2]) - 1;
      const d = parseInt(a[3]);
      const x = new Date(y, m, d);
      return (y === x.getFullYear() && m === x.getMonth() && d === x.getDate());
    }

    return false;
  }
}

const useTodoListContainer = () => {
  const [todoList, setTodoList] = useState<{todo: string, deadline: Deadline}[]>([]);
  const [todaysTaskCount, setTodaysTaskCount] = useState(0);

  const addTodo = (todo: string, deadline: Deadline): void => {
    setTodoList(current => {
      const newVal = [...current];

      if (deadline.isValid()) {
        newVal.push({ todo: todo, deadline: deadline });
      }

      return newVal;
    })
  }

  useEffect(() => {

    setTodaysTaskCount(
      todoList.reduce((acum, current) => {
        if (current.deadline.isToday()) {
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

  const [newTodo, setNewTodo] = useState<string>();
  const [newDate, setNewDate] = useState<Deadline>();
  const [isDateError, setIsDateError] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const todoContainer = TodoListContainer.useContainer();

  const buttonClick = () => {
    if (!newTodo || !newDate) {
      console.error(`新規タスク確定時にタスクもしくは期限のどちらかが未入力です。`);
      throw new Error();
    }

    todoContainer.addTodo(newTodo, newDate);
  }

  const inputTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  }

  const inputDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentDeadline = new Deadline(e.target.value);

    if (currentDeadline.isPast()) {
      setIsDateError(true);
      return;
    }

    setNewDate(currentDeadline);
    setIsDateError(false);

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
      {(isDateError ? <span style={{ color: 'red' }}>過去の日付は入力できません</span> : '')}
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
                <td>{element.deadline.rawDateString}</td>
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
  </React.StrictMode >,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
