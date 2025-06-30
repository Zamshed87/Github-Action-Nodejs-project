/* eslint-disable no-useless-computed-key */
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
// import PrimaryButton from "../../../../common/PrimaryButton";
import { AddOutlined } from "@mui/icons-material";
// import FormikTextArea from "../../../../common/FormikTextArea";
import { Form, Formik } from "formik";
// import { customStyles } from "../../../../utility/selectCustomStyle";
// import FormikInput from "../../../../common/FormikInput";
// import TaskStatusPopover from "../../../../saas/taskManagement/taskproject/taskboard/components/TaskStatusPopover";
import FormikInput from "../../../../../common/FormikInput";
import PrimaryButton from "../../../../../common/PrimaryButton";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import TaskStatusPopover from "./TaskStatusPopover";

const itemsFromBackend = [
  { id: "1", content: "First task" },
  { id: "2", content: "Second task" },
  { id: "3", content: "Third task" },
  { id: "4", content: "Fourth task" },
  { id: "5", content: "Fifth task" },
  { id: "11", content: "sixth task" },
  { id: "12", content: "seventh task" },
  { id: "13", content: "eighth task" },
  { id: "14", content: "ninth task" },
];

const columnsFromBackend = {
  ["6"]: {
    name: "Requested",
    items: itemsFromBackend,
  },
  ["7"]: {
    name: "To do",
    items: [],
  },
  ["8"]: {
    name: "In Progress",
    items: [],
  },
  ["9"]: {
    name: "Done",
    items: [],
  },
  ["10"]: {
    name: "Done",
    items: [],
  },
};

const initData = {};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function DragAndDrop() {
  const [columns, setColumns] = useState(columnsFromBackend);
  const [addCard, setAddCard] = useState(true);
  const handleClickk = () => {
    setAddCard(!addCard);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          resetForm(initData);
        }}
      >
        {({
          handleSubmit,
          values,

          setFieldValue,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  height: "100%",
                }}
              >
                <DragDropContext
                  onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
                >
                  {Object.entries(columns).map(([columnId, column]) => {
                    return (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                        key={columnId}
                      >
                        <div style={{ margin: 8 }}>
                          <Droppable droppableId={columnId} key={columnId}>
                            {(provided, snapshot) => {
                              return (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                  style={{
                                    background: snapshot.isDraggingOver
                                      ? "#D4F6DD"
                                      : "#EBECF0",
                                    padding: 15,
                                    width: 314,
                                    maxHeight: 450,
                                    overflow: "auto",

                                    borderRadius: 5,
                                  }}
                                >
                                  <div className="d-flex my-2 justify-content-between">
                                    <p
                                      style={{
                                        backgroundColor: "#EBECF0",
                                        color: "#637381",
                                        fontWeight: "700",
                                        fontSize: "16px",
                                      }}
                                    >
                                      {column.name}
                                    </p>
                                    <button
                                      style={{
                                        backgroundColor: "#EBECF0",
                                        color: "#637381",
                                        border: "none",
                                        fontSize: "14px",
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>

                                  <div
                                    style={{
                                      margin: "5px",
                                      padding: "5px",

                                      MaxHeight: "320px",
                                      // overflow: "auto",
                                      textAlign: "justify",
                                    }}
                                  >
                                    {column.items.map((item, index) => {
                                      return (
                                        <Draggable
                                          key={item.id}
                                          draggableId={item.id}
                                          index={index}
                                        >
                                          {(provided, snapshot) => {
                                            return (
                                              <div
                                                className="d-flex justify-content-between"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                  userSelect: "none",

                                                  boxShadow:
                                                    "0px 1px 1px rgba(0, 0, 0, 0.25)",
                                                  padding: "9px 0px 10px 12px",
                                                  fontSize: "14px",
                                                  fontWeight: "400",

                                                  margin: "0 0 8px 0",
                                                  height: "40px",
                                                  backgroundColor:
                                                    snapshot.isDragging
                                                      ? "#FFFFFF"
                                                      : "#FFFFFF",
                                                  color: "#5C6369",
                                                  borderRadius: "5px",
                                                  ...provided.draggableProps
                                                    .style,
                                                }}
                                              >
                                                <div>{item.content}</div>
                                                <div>
                                                  <MoreVertIcon
                                                    sx={{ cursor: "pointer" }}
                                                    onClick={handleClick}
                                                  />
                                                </div>
                                              </div>
                                            );
                                          }}
                                        </Draggable>
                                      );
                                    })}
                                  </div>
                                  {provided.placeholder}
                                  {addCard ? (
                                    <PrimaryButton
                                      style={{
                                        backgroundColor: "#EBECF0",
                                        color: "#34A853",
                                        margin: "0px auto",
                                        pointer: "cursor",
                                        fontSize: "14px",
                                        fontWeight: "700",
                                        letterSpacing: "1.25px",
                                      }}
                                      type="button"
                                      className="btn flex-center pb-2 "
                                      label={"ADD CARD"}
                                      icon={
                                        <AddOutlined
                                          sx={{ marginRight: "5px" }}
                                        />
                                      }
                                      onClick={handleClickk}
                                    />
                                  ) : (
                                    <div
                                      className="container px-0"
                                      style={{ width: "100%" }}
                                    >
                                      <div style={{ height: "50px" }}>
                                        <FormikInput
                                          name="trainerTypePopup"
                                          placeholder=""
                                          value={values?.trainerTypePopup}
                                          onChange={(e) => {
                                            setFieldValue(
                                              "trainerTypePopup",
                                              e.target.value
                                            );
                                          }}
                                          styles={customStyles}
                                        />
                                      </div>

                                      <div className="master-filter-btn-group d-flex ">
                                        <button
                                          style={{
                                            backgroundColor: "#34A853",
                                            fontSize: "14px",
                                            color: "white",
                                          }}
                                          type="button"
                                          className="btn mt-3"
                                          onClick={handleClickk}
                                        >
                                          Add Card
                                        </button>
                                        <button
                                          style={{
                                            backgroundColor: "#BDBDBD",
                                            color: "white",
                                          }}
                                          type="button"
                                          className="btn  mt-3 ml-3 "
                                          onClick={handleClickk}
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            }}
                          </Droppable>
                        </div>
                      </div>
                    );
                  })}
                </DragDropContext>
              </div>
            </Form>
          </>
        )}
      </Formik>
      <TaskStatusPopover
        propsObj={{
          id,
          open,
          anchorEl,
          handleClose,
        }}
      />
    </>
  );
}

export default DragAndDrop;
