import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { gray300 } from "../../../../utility/customColor";
import { Close } from "@mui/icons-material";

const DroppableActivityContainers = ({
  priorities,
  activities,
  handleRemove,
  isDraggable,
}) => {
  const isEmpty = (priorityId) => {
    return activities?.filter((activity) => activity.priorityId === priorityId)
      .length;
  };
  return (
    <div className="row col-md-8 p-0">
      {priorities?.map((priority, index) => {
        return (
          <>
            {index === 2 && <div className="w-100 h-0"></div>}
            <Droppable droppableId={priority} key={priority}>
              {(provided, snapshot) => {
                return (
                  <div
                    style={{
                      background: snapshot.isDraggingOver
                        ? "lightblue"
                        : `white`,
                      width: "50%",
                      height: "50%",
                    }}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="col card-style with-form-card m-0 p-0 ml-1 mb-1"
                  >
                    <h2 className="ml-2 pt-2">{priority}</h2>
                    <div
                      style={{
                        margin: 8,
                        position: "relative",
                      }}
                    >
                      <div>
                        {isEmpty(index + 1) === 0 ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              minHeight: "150px",
                              width: "100%",
                              color: `${gray300}`,
                              fontWeight: 600,
                            }}
                          >
                            Drop Here..
                          </div>
                        ) : (
                          activities?.map((item, i) => {
                            if (item?.priorityId === index + 1) {
                              return (
                                <Draggable
                                  key={item.rowId}
                                  draggableId={item.rowId.toString()}
                                  index={i}
                                  isDragDisabled={isDraggable}
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        key={index}
                                        style={{
                                          backgroundColor: "#EEEEEE",
                                          border: 0,
                                          ...provided.draggableProps.style,
                                        }}
                                        className="chips success relative chips-two mr-1 mb-2"
                                      >
                                        {item.activity}
                                        <span
                                          className="pointer cross-chips-icon white"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isDraggable) {
                                              handleRemove(i);
                                            }
                                          }}
                                        >
                                          <Close
                                            sx={{
                                              fontSize: "12px",
                                            }}
                                          />
                                        </span>
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              );
                            } else return <></>;
                          })
                        )}
                        {provided.placeholder}
                      </div>
                    </div>
                  </div>
                );
              }}
            </Droppable>
          </>
        );
      })}
    </div>
  );
};

export default DroppableActivityContainers;
