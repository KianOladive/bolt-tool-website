import React from 'react';

const Nav = () => {
  return (
    <div className='tool-container'>
      <div className='tool-name'>[TOOL NAME]</div>
      <div className='links'>
        <a href="#">[Other bolt tool/s]</a>
        <a href="#">Home</a>
      </div>
      <style jsx>{`
        .tool-container {
          background-color: #F6B700;
          display: flex;
          height: 60px;
          justify-content: space-between;
          align-items: center;
          padding: 0 60px;
        }

        .links {
          display: flex;
          flex-direction: row;
          width: 250px;
          justify-content: space-between;
        }

        a {
          text-decoration: none;
          color: black;
          border: 1px solid transparent;
          padding: 5px 10px;
          border-radius: 5px;
        }

        a:hover {
          border-color: black;
          background-color: #d9d9d98a;
        }
      `}</style>
    </div>
  )
}

export default Nav;
