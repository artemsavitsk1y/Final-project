import React, { useState, useEffect, useRef } from "react"; 
import { useSelector, useDispatch } from "react-redux";
import { addTodo } from "../features/todoSlice";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import TodoItem from "../components/TodoItem"; 
import toast from "react-hot-toast";
import confetti from 'canvas-confetti'; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const MainPage = () => {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState(null); 
  
  const todos = useSelector((state) => state.todos.todos);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const prevTodos = usePrevious(todos);
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn || !user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (prevTodos) {
      todos.forEach(currentTodo => {
        const prevTodo = prevTodos.find(t => t.id === currentTodo.id);
        if (prevTodo && !prevTodo.completed && currentTodo.completed) {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
          });
        }
      });
    }
  }, [todos, prevTodos]);

  const handleAdd = () => {
    if (text.trim()) {
      dispatch(addTodo(text, dueDate)); 
      
      toast.success('Задачу додано', {
        position: "bottom-center"
      });
      setText("");
      setDueDate(null); 
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-5 relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Список справ</h1>
        <button
          onClick={handleLogout}
          className="text-red-500 font-semibold hover:underline"
        >
          Вийти
        </button>
      </div>

      <p className="text-gray-600 mb-2">
        Привіт, <span className="font-medium">{user?.email || "гість"}</span> 👋
      </p>

      {}
      <div className="flex flex-col sm:flex-row mb-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введіть задачу"
          className="flex-1 border p-2 rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
        />
        {}
        <DatePicker
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          placeholderText="Термін"
          isClearable 
          minDate={new Date()} 
          className="w-full sm:w-30  border p-2 f" 
          dateFormat="dd/MM/yyyy"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-b-lg sm:rounded-r-lg sm:rounded-b-none flex-shrink-0"
        >
          Додати
        </button>
      </div>

      {}
      <div>
        {todos.length === 0 ? (
          <p className="text-center text-gray-500">Поки задач немає</p>
        ) : (
          todos
            .slice()
            .sort((a, b) => {
              const dateA = a.dueDate ? new Date(a.dueDate) : null;
              const dateB = b.dueDate ? new Date(b.dueDate) : null;

              if (dateA && dateB) return dateA - dateB; 
              if (dateA) return -1; 
              if (dateB) return 1; 
              return 0; 
            })
            .map((todo) => <TodoItem key={todo.id} todo={todo} />)
        )}
      </div>
    </div>
  );
};

export default MainPage;

