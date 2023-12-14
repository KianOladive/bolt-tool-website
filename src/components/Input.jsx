import React from 'react';

const App = (props) => {
  return (
    <div className="input-container">
        <label for={props.id} className='input-label'><div className="tooltip">{props.hover}</div>{props.label}</label>
        <input id={props.id} name="text" type="text"></input>
    <style jsx>
    {
      `
        .input-container {
          position: relative;
        }
        .tooltip {
          visibility: hidden;
          position: absolute;
          top: -30px;
          border: 1px solid black;
          border-radius: 4px;
          padding: 2px 4px;
          background-color: #D9D9D9;
          font-size: 12px;
        }

        .input-label:hover .tooltip {
          visibility: visible;
        }

      `
    }
    </style>
    </div>
  );
}

export default App;
