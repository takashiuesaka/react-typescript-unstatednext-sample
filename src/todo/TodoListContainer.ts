import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';

import { Todo } from './domain/Todo';

const useTodoListContainer = () => {
    const [todoList, setTodoList] = useState<Todo[]>([]);
    const [todaysTaskCount, setTodaysTaskCount] = useState(0);
  
    const addTodo = (todo: Todo): void => {
      setTodoList(current => {
        const newVal = [...current];
  
        if (todo.isValid()) {
          newVal.push(todo);
        }
  
        return newVal;
      })
    }
  
    useEffect(() => {
  
      setTodaysTaskCount(
        todoList.reduce((acum, current) => {
          if (current.isToday()) {
            return acum + 1;
          }
  
          return acum;
        }, 0)
      )
  
    }, [todoList]);
  
    return { todoList, addTodo, todaysTaskCount };
  }
  
  export const TodoListContainer = createContainer(useTodoListContainer);
  