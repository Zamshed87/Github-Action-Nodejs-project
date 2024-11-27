import { DeleteOutlineOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import html2pdf from "html2pdf.js";
import {
  dateFormatter,
  dateFormatterForInput,
} from "../../../../utility/dateFormatter";
import DefaultInput from "../../../../common/DefaultInput";

export const actionPlanColumnData = (activities, setActivities) => {
  return [
    {
      title: "SL",
      render: (_, __, index) => index + 1,
    },
    {
      title: "LIST OF TASKS/ACTIVITIES",
      dataIndex: "activity",
    },
    {
      title: "Start Date",
      render: (_, record) => dateFormatter(record?.stardDate),
    },
    {
      title: "End Date",
      render: (_, record) => dateFormatter(record?.endDate),
    },
    {
      title: "Actual Start Date",
      render: (_, record, index) => (
        <div className="d-flex align-items-center">
          <DefaultInput
            classes="input-sm"
            value={
              record?.actualStardDate === null
                ? ""
                : dateFormatterForInput(record?.actualStardDate)
            }
            name="actualStardDate"
            type="date"
            className="form-control"
            onChange={(e) => {
              const newData = [...activities];
              newData[index].actualStardDate = e.target.value;
              setActivities(newData);
            }}
          />
        </div>
      ),
    },
    {
      title: "Actual End Date",
      render: (_, record, index) => (
        <div className="d-flex align-items-center">
          <DefaultInput
            classes="input-sm"
            value={
              record?.actualEndDate === null
                ? ""
                : dateFormatterForInput(record?.actualEndDate)
            }
            name="actualEndDate"
            type="date"
            className="form-control"
            onChange={(e) => {
              const newData = [...activities];
              newData[index].actualEndDate = e.target.value;
              setActivities(newData);
            }}
          />
        </div>
      ),
    },
    {
      title: "Action",
      render: (_, data, idx) => {
        return (
          <div className="d-flex justify-content-between justify-items-center">
            <IconButton
              title="Delete Procedure"
              onClick={() => {
                const newData =
                  activities?.length > 0 &&
                  activities.filter((item, index) => index !== idx);
                setActivities(newData);
              }}
            >
              <DeleteOutlineOutlined />
            </IconButton>
          </div>
        );
      },
    },
  ];
};

export const pdfExport = (fileName) => {
  var element = document.getElementById("pdf-section");

  var clonedElement = element.cloneNode(true);
  clonedElement.classList.add("d-block");

  var opt = {
    margin: 20,
    filename: `${fileName}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 5, dpi: 300, letterRendering: true },
    jsPDF: {
      unit: "px",
      hotfixes: ["px_scaling"],
      orientation: "portrait",
    },
  };
  html2pdf().set(opt).from(clonedElement).save();
};
