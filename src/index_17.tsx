import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import { TodoListContainer } from './todo/TodoListContainer';
import { InputTask } from './todo/components/InputTask';
import { Summary } from './todo/components/Summary';
import { RenderTask } from './todo/components/RenderTask';

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
// 17. そろそろファイルを分割して整理する

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
