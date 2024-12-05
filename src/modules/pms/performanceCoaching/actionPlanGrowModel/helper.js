import { DeleteOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { dateFormatter } from "../../../../utility/dateFormatter";

export const actionPlanGrowModelCol = (scrollRef, rowDto, setRowDto) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => <div>{index + 1}</div>,
      className: "text-center",
    },
    {
      title: "LIST OF TASKS/ACTIVITIES/BEHAVIOR TO ACHIEVE RESULT",
      dataIndex: "activity",
      render: (data) => <div>{data}</div>,
    },
    {
      title: "START DATE",
      dataIndex: "stardDate",
      render: (data) => <div>{dateFormatter(data)}</div>,
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      render: (data) => <div>{dateFormatter(data)}</div>,
    },
    {
      title: "ACTION",
      dataIndex: "",
      render: (data, record, index) => (
        <>
          <div className="d-flex align-items-center">
            <Tooltip title="Delete" arrow>
              <button
                type="button"
                className="iconButton mt-0 mt-md-2 mt-lg-0"
                onClick={() => {
                  let updatedData = rowDto?.row?.filter(
                    (item, i) => index !== i
                  );
                  setRowDto({
                    ...rowDto,
                    row: updatedData,
                  });
                }}
              >
                <DeleteOutlined />
              </button>
            </Tooltip>
          </div>
        </>
      ),
    },
  ];
};
