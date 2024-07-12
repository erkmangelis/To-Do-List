import { React, useState } from "react";
import CIcon  from '@coreui/icons-react';
import { cilCursorMove, cilNoteAdd, cilTrash } from '@coreui/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';


function App() {
  const data = [
    {
      id: 1,
      title: "Banana",
      text: "It's a fruit and has a yellow label outside"
    },
    {
      id: 2,
      title: "Apple",
      text: ""
    },
    { 
      id: 3,
      title: "Orange",
      text: "It's a citrus fruit and has an orange peel"
    }
  ];

  const [items, setItems] = useState(data);
  const [hoverItem, setHoverItem] = useState(null);
  const [editTitle, setEditTitle] = useState(false);
  const [editText, setEditText] = useState(false);

  const handleTitleChange = (index, event) => {
    const newItems = [...items];
    newItems[index].title = event.target.value;
    setItems(newItems);
  };

  const handleTextChange = (index, event) => {
    const newItems = [...items];
    newItems[index].text = event.target.value;
    setItems(newItems);
  };

  function handleOver(index) {
    setHoverItem(index);
  }

  function handleOut() {
    setEditTitle(false);
    setEditText(false);
    setHoverItem(null);
  }

  function editTitleButton() {
    setEditTitle(true);
  }

  function editTextButton() {
    setEditText(true);
  }

  function removeItem(index) {
    const newItems = [...items];
    newItems[index].title = "";
    newItems[index].text = "";
    setItems(newItems);
  }

  function addItem() {
    const newItem = {
      id : items.length+1,
      title : "New To-Do",
      text : "Fill here with your do"
    };
    setItems([...items, newItem]);
  }


  return (
    <>
      <header>
        <CIcon className="add-button" icon={cilNoteAdd} onClick={() => addItem()} />
        <h1>To-Do List</h1>
      </header>
      <body>
        <div className="main">
          <div className="main-col" id="next-up">
            <div className="main-header">
              <p className="main-header-title">Next Up</p>
            </div>
            <div className="main-body">
              {items.map((item, index) => (
                item.text !== "" ?
                (
                  <div key={index} className="card" onMouseOver={() => handleOver(index)}>
                    <div className="card-header">
                      {hoverItem === index && editTitle === true ?
                      <input type="text" className="titleInp" value={item.title} onMouseLeave={() => handleOut()} onChange={(event) => handleTitleChange(index, event)} autoFocus></input> :
                      <p className="card-title" onClick={() => editTitleButton()}>{item.title}</p>
                      }
                      <CIcon icon={cilCursorMove} />
                    </div>
                    <div className="card-body">
                      {hoverItem === index && editText === true ?
                      <textarea type="text" className="textInp" value={item.text} onMouseLeave={() => handleOut()} onChange={(event) => handleTextChange(index, event)} autoFocus></textarea> :
                      <p className="card-text" onClick={() => editTextButton()}>{item.text}</p>
                      }
                    </div>
                    <div className="card-footer">
                      <CIcon icon={cilTrash} onClick={() => removeItem(index)}/>
                    </div>
                  </div>
                ) : ""
              ))}
              
            </div>
          </div>
          <div className="main-col" id="in-progress">
            <div className="main-header">
              <p className="main-header-title">In Progress</p>
            </div>
            <div className="main-body">
            </div>
          </div>
          <div className="main-col" id="completed">
            <div className="main-header">
              <p className="main-header-title">Completed</p>
            </div>
            <div className="main-body">

            </div>
          </div>
        </div>
      </body>
    </>
  );
}

export default App;
