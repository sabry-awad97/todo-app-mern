import { useEffect, useRef, useState } from 'react';
import { createTodo, deleteTodo, getTodoList, TodoList } from './api/api';
import { getCurrentDay, toTitleCase } from './helpers';

const App = () => {
  const [appTitle, setAppTitle] = useState(getCurrentDay());
  const [listName, setListName] = useState('Todos');

  const [todoTitle, setTodoTitle] = useState('');
  const [todos, setTodos] = useState<TodoList['todos']>([]);

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const { pathname } = location;

    getTodoList(pathname === '/' ? '/todos' : pathname).then(
      ({ name, todos }) => {
        name = toTitleCase(name);

        document.title = name;

        !['/', '/todos'].includes(pathname) && setAppTitle(name);
        !['/', '/todos'].includes(pathname) && setListName(name);

        setTodos(todos);
      }
    );
  }, []);

  return (
    <>
      <div className="box" id="heading">
        <h1>{appTitle}</h1>
      </div>
      <div className="box">
        {todos.map(({ title, id }) => (
          <form ref={formRef} key={id}>
            <div className="item">
              <input
                type="checkbox"
                onChange={() => {
                  deleteTodo(listName, id);
                  formRef.current?.submit();
                }}
              />
              <p>{title}</p>
            </div>
          </form>
        ))}

        <form
          onSubmit={event => {
            event.preventDefault();
            createTodo(listName, todoTitle);
          }}
        >
          <input
            type="text"
            name="newItem"
            placeholder="New Item"
            autoComplete="off"
            value={todoTitle}
            onChange={e => setTodoTitle(e.target.value)}
          />
          <button type="submit" name="list" value={todoTitle}>
            +
          </button>
        </form>
      </div>

      <footer>Copyright</footer>
    </>
  );
};

export default App;
