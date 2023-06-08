import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../common/loading/Loading";
import PrimaryButton from "../../../common/PrimaryButton";
import { organogramSaveUpdate } from "../helper";

// fake data generator

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "#7bed9f" : "#dfe4ea",
  borderRadius: "4px",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "#f1f2f6" : "#ffffff",
  padding: `${grid}px ${grid}px 0 ${grid}px`,
  width: 250,
  borderRadius: "4px",
});
// dummy data

const DragAndDropModule = ({
  setAnchorEl,
  setAnchorElForAction,
  childList,
  getData,
}) => {
  const [data, setData] = useState(childList);
  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const items = reorder(data, result.source.index, result.destination.index);
    setData(items);
  };

  const { buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [loading, setLoading] = useState(false);

  return (
    <div>
      {loading && <Loading />}
      <div
        style={{ marginLeft: "-8px" }}
        className="d-flex justify-content-end w-100"
      >
        <PrimaryButton
          type="button"
          className="btn btn-default mb-1"
          label="Update"
          // icon={
          //   <AddOutlined sx={{ marginRight: "11px" }} />
          // }
          onClick={(e) => {
            organogramSaveUpdate({
              values: {},
              autoId: null,
              parentId: null,
              childList: data,
              employeeId,
              isActive: true,
              buId,
              setLoading,
              cb: () => {
                setAnchorEl(null);
                setAnchorElForAction(null);
                getData();
              },
              sequence: null,
              isDrag: true,
            });
          }}
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {data.map((item, index) => (
                <Draggable
                  key={item.employeeNameDetails}
                  draggableId={item.employeeNameDetails}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      {item?.employeeNameDetails}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default DragAndDropModule;
