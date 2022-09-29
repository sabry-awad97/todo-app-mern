import { useEffect, useState } from 'react';
import { createTodo, getAll } from './api/api';

const App = () => {
  const [title, setTitle] = useState('');
  const [todo, setTodo] = useState('');
  const [data, setData] = useState<string[]>([]);

  const { pathname } = location;

  useEffect(() => {
    getAll(pathname === '/work' ? pathname : '/').then(({ title, items }) => {
      setTitle(title);
      setData(items);
    });
  }, []);

  return (
    <>
      <div className="box" id="heading">
        <h1>{title}</h1>
      </div>
      <div className="box">
        {data.map((item, idx) => (
          <div key={idx} className="item">
            <input type="checkbox" />
            <p>{item}</p>
          </div>
        ))}

        <form
          onSubmit={() => {
            pathname === '/work'
              ? createTodo(pathname, todo)
              : createTodo('/', todo);
          }}
        >
          <input
            type="text"
            name="newItem"
            placeholder="New Item"
            autoComplete="off"
            value={todo}
            onChange={e => setTodo(e.target.value)}
          />
          <button type="submit" name="list" value={title}>
            +
          </button>
        </form>
      </div>

      <footer>Copyright</footer>
    </>
  );
};

export default App;
