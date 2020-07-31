import React from 'react';
import { TodoListContainer } from '../TodoListContainer';

export const RenderTask: React.FC = () => {

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
                  <td>{element.task}</td>
                  <td>{element.deadline}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </>
    );
  }
  