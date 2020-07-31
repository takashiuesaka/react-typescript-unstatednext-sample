import React, { useState, useEffect } from 'react';
import { TodoListContainer } from '../TodoListContainer';
import { Todo } from '../domain/Todo';

export const InputTask: React.FC = () => {

    const [newTodo, setNewTodo] = useState<Todo>();
    const [isDeadlineError, setIsDeadlineError] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const todoContainer = TodoListContainer.useContainer();

    const buttonClick = () => {
        if (!newTodo) {
            console.error(`新規タスク確定時にタスクもしくは期限のどちらかが未入力です。`);
            throw new Error();
        }

        todoContainer.addTodo(newTodo);
    }

    // const inputTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setNewTodo(e.target.value);
    // }

    const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "task") {
            setNewTodo(val => {
                const newVal = Object.assign({}, val);
                newVal.task = e.target.value;
                return newVal;
            });
        }

        if (e.target.name === "deadline") {
            setNewTodo(val2 => {
                const newVal = Object.assign({}, val2);
                newVal.deadline = e.target.value;
                return newVal;
            });
        }
    }

    useEffect(() => {
        setIsDeadlineError(false);
        setButtonDisabled(false);

        if (!newTodo.isValid()) {
            setButtonDisabled(true);
        }

        if (newTodo.isValid() && newTodo.isPast()) {
            setIsDeadlineError(true);
            setButtonDisabled(true);
        }

    }, [newTodo])

    return (
        <div>
            <span>タスク:</span><input type="textbox" name="task" onChange={inputChange} value={newTodo.task} />
            <span>期日：</span><input type="date" name="deadline" onChange={inputChange} />
            <button onClick={buttonClick} disabled={buttonDisabled}>入力</button>
            {(isDeadlineError ? <span style={{ color: 'red' }}>過去の日付は入力できません</span> : '')}
        </div>
    );
}