import { useEffect, useRef, useState } from 'react';
import { createTodo, deleteTodo, getAll, Todo } from './api/api';
import { getCurrentDay } from './helpers';

const App = () => {
  const [day, setDay] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [data, setData] = useState<Todo[]>([]);

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    setDay(getCurrentDay());
    getAll().then(setData);
  }, []);

  return (
    <>
      <div className="box" id="heading">
        <h1>{day}</h1>
      </div>
      <div className="box">
        {data.map(({ title, id }) => (
          <form ref={formRef} key={id}>
            <div className="item">
              <input
                type="checkbox"
                onChange={() => {
                  deleteTodo(id);
                  formRef.current?.submit();
                }}
              />
              <p>{title}</p>
            </div>
          </form>
        ))}

        <form
          onSubmit={() => {
            createTodo(todoTitle);
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
