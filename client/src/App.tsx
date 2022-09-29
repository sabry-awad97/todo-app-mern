import { useEffect, useState } from 'react';
import { createTodo, getAll, Todo } from './api/api';
import { getCurrentDay } from './helpers';

const App = () => {
  const [day, setDay] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [data, setData] = useState<Todo[]>([]);

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
        {data.map(({ title }, idx) => (
          <div key={idx} className="item">
            <input type="checkbox" />
            <p>{title}</p>
          </div>
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
