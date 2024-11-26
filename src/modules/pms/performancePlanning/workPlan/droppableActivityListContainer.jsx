import { Close } from "@mui/icons-material";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { gray300 } from "../../../../utility/customColor";

const DroppableActivityListContainer = ({
  requestedActivities,
  handleRemove,
  isDraggable,
}) => {
  const isEmpty = () => {
    return requestedActivities?.filter((activity) => activity.priorityId === 0)
      .length;
  };
  return (
    <div className="card-style with-form-card col-md-4 m-0 p-0 mr-3">
      <Droppable droppableId="RequestedActivities">
        {(provided, snapshot) => {
          return (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                background: snapshot.isDraggingOver ? "lightblue" : `white`,
                width: "100%",
              }}
            >
              <h2 className="ml-2 pt-2">Requested</h2>
              <div
                style={{
                  margin: 8,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    padding: 4,
                    width: "100%",
                    minHeight: "335px",
                  }}
                >
                  {isEmpty() === 0 ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "250px",
                        width: "100%",
                        color: `${gray300}`,
                        fontWeight: 600,
                      }}
                    >
                      Add Activity..
                    </div>
                  ) : (
                    requestedActivities?.map((item, index) => {
                      if (item.priorityId === 0) {
                        return (
                          <Draggable
                            key={item.rowId}
                            draggableId={item.rowId.toString()}
                            index={index}
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
                                  // className="mr-1 mb-2"
                                >
                                  {item.activity}
                                  <span
                                    className="pointer cross-chips-icon white"
                                    onClick={(e) => {
                                      if (!isDraggable) handleRemove(index);
                                    }}
                                  >
                                    <Close
                                      sx={{
                                        fontSize: "12px",
                                      }}
                                    />
                                  </span>
                                </div>
                                //   </ul>
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
    </div>
  );
};

export default DroppableActivityListContainer;
