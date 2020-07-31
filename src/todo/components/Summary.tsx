import React from 'react';
import { TodoListContainer } from '../TodoListContainer';

export const Summary: React.FC = () => {

    const todoContainer = TodoListContainer.useContainer();
  
    return (
      <div>
        <span>今日締め切りのタスク数：{todoContainer.todaysTaskCount}</span>
      </div>
    );
  }
  
