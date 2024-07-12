import React, { useState } from "react";
import CIcon from '@coreui/icons-react';
import { cilCursorMove, cilNoteAdd, cilTrash } from '@coreui/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';

function App() {
  const initialData = {
    "next-up": [
      {
        id: '1',
        title: "Banana",
        text: "It's a fruit and has a yellow label outside",
        droppableId: "next-up"
      }
    ],
    "in-progress": [
      {
        id: '2',
        title: "Apple",
        text: "It's a fruit and has yellow, red and green label outside",
        droppableId: "next-up"
      }],
    "completed": [
      {
        id: '3',
        title: "Orange",
        text: "It's a citrus fruit and has an orange peel",
        droppableId: "next-up"
      }]
  };

  const [itemId, setItemId] = useState(0);
  const [columns, setColumns] = useState(initialData);
  const [hoverItem, setHoverItem] = useState(null);
  const [editTitle, setEditTitle] = useState(false);
  const [editText, setEditText] = useState(false);

  const handleTitleChange = (column, index, event) => {
    const newColumns = { ...columns };
    newColumns[column][index].title = event.target.value;
    setColumns(newColumns);
  };

  const handleTextChange = (column, index, event) => {
    const newColumns = { ...columns };
    newColumns[column][index].text = event.target.value;
    setColumns(newColumns);
  };

  const handleOver = (item) => {
    setHoverItem(item.id);
  };

  const handleOut = () => {
    setEditTitle(false);
    setEditText(false);
    setHoverItem(null);
  };

  const editTitleButton = () => {
    setEditTitle(true);
  };

  const editTextButton = () => {
    setEditText(true);
  };

  const removeItem = (column, index) => {
    const newColumns = { ...columns };
    newColumns[column].splice(index, 1);
    setColumns(newColumns);
  };

  const addItem = (column) => {
    if (columns["next-up"].length < 3) {
      const newItem = {
        id: `${column}-${itemId}`,
        title: "New To-Do",
        text: "Fill here with your task",
        droppableId: column
      };
      
      setItemId(itemId+1);

      setColumns({ ...columns, [column]: [...columns[column], newItem] });
    } else {
      alert("'Next Up' listesi doluyken yeni item ekleyemezsin.");
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];
    const draggedItem = sourceColumn[source.index];

    if (source.droppableId === destination.droppableId) {
      // Moving within the same column
      const newColumn = [...sourceColumn];
      newColumn.splice(source.index, 1);
      newColumn.splice(destination.index, 0, draggedItem);

      setColumns({ ...columns, [source.droppableId]: newColumn });
    } else {
      // Moving to a different column
      if (columns[destination.droppableId].length < 3) {
        const newSourceColumn = [...sourceColumn];
        newSourceColumn.splice(source.index, 1);
        const newDestinationColumn = [...destinationColumn];
        newDestinationColumn.splice(destination.index, 0, { ...draggedItem, droppableId: destination.droppableId });  
      
        setColumns({
          ...columns,
          [source.droppableId]: newSourceColumn,
          [destination.droppableId]: newDestinationColumn
        });
      }
    }
  };

  return (
    <>
      <header>
        <CIcon className="add-button" icon={cilNoteAdd} onClick={() => addItem("next-up")} />
        <h1>To-Do List</h1>
      </header>
      <body>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="main">
            {Object.keys(columns).map((columnId) => (
              <Droppable key={columnId} droppableId={columnId}>
                {(provided) => (
                  <div className="main-col" id={columnId}>
                    <div className="main-header">
                      <p className="main-header-title">{columnId.replace(/-/g, " ").toUpperCase()}</p>
                    </div>
                    <div className="main-body" ref={provided.innerRef} {...provided.droppableProps}>
                      {columns[columnId].map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="card"
                              onMouseOver={() => handleOver(item)}
                            >
                              <div className="card-header">
                                {hoverItem === item.id && editTitle === true ? (
                                  <input
                                    type="text"
                                    className="titleInp"
                                    value={item.title}
                                    onMouseLeave={handleOut}
                                    onChange={(event) => handleTitleChange(columnId, index, event)}
                                    autoFocus
                                  />
                                ) : (
                                  <p className="card-title" onClick={editTitleButton}>{item.title}</p>
                                )}
                                <CIcon icon={cilCursorMove} />
                              </div>
                              <div className="card-body">
                                {hoverItem === item.id && editText === true ? (
                                  <textarea
                                    type="text"
                                    className="textInp"
                                    value={item.text}
                                    onMouseLeave={handleOut}
                                    onChange={(event) => handleTextChange(columnId, index, event)}
                                    autoFocus
                                  />
                                ) : (
                                  <p className="card-text" onClick={editTextButton}>{item.text}</p>
                                )}
                              </div>
                              <div className="card-footer">
                                <CIcon icon={cilTrash} onClick={() => removeItem(columnId, index)} />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </body>
    </>
  );
}

export default App;
