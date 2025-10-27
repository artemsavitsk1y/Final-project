import { createSlice, nanoid } from '@reduxjs/toolkit';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('todos');
    if (serializedState === null) {
      return { todos: [] };
    }
    // При завантаженні, переконуємось, що дати знову стануть об'єктами Date
    const state = JSON.parse(serializedState);
    state.todos = state.todos.map(todo => ({
      ...todo,
      dueDate: todo.dueDate ? new Date(todo.dueDate) : null
    }));
    return state;
  } catch (err) {
    console.error("Could not load state from localStorage", err);
    return { todos: [] };
  }
};

const saveState = (state) => {
  try {
    // Дати будуть автоматично конвертовані в рядки
    const serializedState = JSON.stringify(state);
    localStorage.setItem('todos', serializedState);
  } catch (err) {
    console.error("Could not save state to localStorage", err);
  }
};

const initialState = loadState();

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action) {
        state.todos.push(action.payload);
        saveState(state);
      },
      // 🔥 ЗМІНА ТУТ: Додаємо dueDate в prepare
      prepare(text, dueDate) {
        return {
          payload: {
            id: nanoid(),
            text,
            completed: false,
            dueDate: dueDate ? dueDate.toISOString() : null, // Зберігаємо в ISO форматі
          },
        };
      },
    },
    toggleTodo: (state, action) => {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveState(state);
      }
    },
    updateTodo: (state, action) => {
      const { id, newText } = action.payload;
      const todo = state.todos.find(t => t.id === id);
      if (todo) {
        todo.text = newText;
        saveState(state);
      }
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter(t => t.id !== action.payload);
      saveState(state);
    },
  },
});

export const { addTodo, toggleTodo, updateTodo, deleteTodo } = todoSlice.actions;
export default todoSlice.reducer;
