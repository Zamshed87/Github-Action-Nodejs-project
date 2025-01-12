import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import './style.css';

const DraggableTable = ({ tableData, setTableData, header }) => {
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tableData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Recalculate sequence order dynamically
    const updatedItems = items.map((item, index) => ({
      ...item,
      intShortOrder: index + 1, // Update sequence based on new position
    }));

    setTableData(updatedItems); // Update the state with the reordered data
  };

  return (
    <table className="table">
      {/* Render the table header */}
      <thead>
        <tr>
          {header.map((col, idx) => (
            <th key={idx} style={{ width: col.width, textAlign: col.align }}>
              {col.title}
            </th>
          ))}
        </tr>
      </thead>

      {/* Render the draggable table rows */}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="table-body">
          {(provided) => (
            <tbody {...provided.droppableProps} ref={provided.innerRef}>
              {tableData.map((item, index) => (
                <Draggable
                  key={item.intPipelineRowId || index}
                  draggableId={String(item.intPipelineRowId || index)}
                  index={index}
                >
                  {(provided) => (
                    <tr
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className="draggable-row"
                    >
                      {header.map((col, colIdx) => (
                        <td key={colIdx} style={{ textAlign: col.align }}>
                          {col.dataIndex === "intShortOrder"
                            ? index + 1 // Use the row index + 1 for the sequence
                            : col.render
                            ? col.render(null, item, index)
                            : item[col.dataIndex]}
                        </td>
                      ))}
                    </tr>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </tbody>
          )}
        </Droppable>
      </DragDropContext>
    </table>
  );
};

export default DraggableTable;
