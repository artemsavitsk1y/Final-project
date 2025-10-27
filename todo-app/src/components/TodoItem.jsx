import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, deleteTodo, updateTodo } from '../features/todoSlice';
import toast from 'react-hot-toast';

const TodoItem = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);
  const dispatch = useDispatch();

  const saveChanges = async (id, text) => {
    await new Promise(resolve => setTimeout(resolve, 700));
    if (text.trim() === '') {
      throw new Error('Task text cannot be empty.');
    }
    dispatch(updateTodo({ id, newText: text }));
  };

  const handleUpdate = () => {
    toast.promise(
      saveChanges(todo.id, newText),
      {
        loading: 'Зберігаємо зміни...',
        success: <b>Зміни збережено!</b>,
        error: <b>Не вдалося зберегти.</b>,
      },
      { position: "bottom-center" }
    );
    setIsEditing(false);
  };

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  return (
    <div className={`flex items-center justify-between p-2 my-1 ${todo.completed ? 'bg-gray-200' : 'bg-white'} border rounded shadow-sm`}>
      {isEditing ? (
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onBlur={handleUpdate} 
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleUpdate();
            if (e.key === 'Escape') setIsEditing(false);
          }}
          className="flex-1 border p-1 rounded"
          autoFocus
        />
      ) : (
        <div className="flex items-center flex-1 min-w-0">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggle}
            className="mr-2 h-5 w-5 text-blue-500 rounded focus:ring-blue-400 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span
              className={`cursor-pointer break-words ${todo.completed ? 'line-through text-gray-500' : ''}`}
              onDoubleClick={() => setIsEditing(true)} 
            >
              {todo.text}
            </span>
            
            {}
            {todo.dueDate && (
              <span className="ml-2 text-xs font-medium text-gray-500">
                (до: {new Date(todo.dueDate).toLocaleDateString()})
              </span>
            )}
          </div>
        </div>
      )}

      {}
      <div className="flex-shrink-0 ml-2">
        <button 
          onClick={() => setIsEditing(true)} 
          className="text-blue-500 mr-2 p-1 rounded hover:bg-blue-100 transition-colors"
          title="Редагувати"
        >
          📝
        </button>
        <button 
          onClick={() => dispatch(deleteTodo(todo.id))} 
          className="text-red-500 p-1 rounded hover:bg-red-100 transition-colors"
          title="Видалити"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
