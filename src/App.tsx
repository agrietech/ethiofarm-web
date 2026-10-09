import { useState } from 'react';
import './App.css';

export function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <svg className="logo" viewBox="0 0 32 32" width="96" height="96">
            <path fill="#41D1FF" d="M29.5 5.5l-13.8 24.8c-.3.6-1.1.6-1.4 0L.5 5.5c-.4-.7.2-1.5 1-.1.4l13.1 7.4c.5.3 1.1.3 1.6 0l13.1-7.4c.8-.5 1.4.3.2 1.1z"/>
            <path fill="#BD34FE" d="M19.8 1.2L6.3 8.8c-.4.2-.6.7-.4 1.1l5.5 14.7c.2.6 1 .7 1.4.2l3.4-4.5c.3-.4.8-.5 1.3-.2l2.6 1.5c.6.3 1.3-.1 1.4-.7l3.3-17.7c.1-.8-.8-1.5-1.6-1.1l-3.5 1.9"/>
            <path fill="#FFEA83" d="M17.4 3.7l-7.7 8.5c-.3.3-.1.8.3.8h4.6l-2.4 6.8c-.2.6.5 1 .9.5l7.9-9.3c.3-.4 0-.9-.5-.9h-4.4l2.4-5.6c.2-.5-.4-.9-.8-.4z"/>
          </svg>
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <svg className="logo react" viewBox="-11.5 -10.23174 23 20.46348" width="96" height="96">
            <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
            <g stroke="#61dafb" strokeWidth="1" fill="none">
              <ellipse rx="11" ry="4.2"/>
              <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
              <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
            </g>
          </svg>
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
