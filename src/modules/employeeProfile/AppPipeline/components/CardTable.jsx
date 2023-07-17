// import { CreateOutlined, DeleteOutlined } from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import { dateFormatterForInput } from "../../../../utility/dateFormatter";

const CardTable = ({ landing, setOpenModal, setSingleData, permission }) => {
  return (
    <div className="table-card-styled tableOne">
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: "30px" }}>
              <div>SL</div>
            </th>
            <th>Pipeline Name</th>
            <th>Remarks</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {landing?.map((item, index) => (
            <tr key={index}>
              <td>
                <div style={{ width: "30px" }} className="pl-1 tableBody-title">
                  {index + 1}
                </div>
              </td>
              <td>
                <div className="content tableBody-title">
                  {item?.strPipelineName || "N/A"}
                </div>
              </td>
              <td>
                <div className="content tableBody-title">
                  {item?.strRemarks || "N/A"}
                </div>
              </td>
              <td>
                <div className="content tableBody-title">
                  {dateFormatterForInput(item?.dteCreatedAt)}
                </div>
              </td>
              <td>
                <Tooltip title="Edit" arrow>
                  <button className="iconButton content tableBody-title">
                    <EditOutlinedIcon
                      sx={{ color: "#637381", fontSize: "20px" }}
                      onClick={(e) => {
                        if (!permission?.isEdit)
                          return toast.warn("You don't have permission");
                        setSingleData({
                          pipelineName: {
                            value: item?.strApplicationType,
                            label: item?.strPipelineName,
                          },
                          remarks: item?.strRemarks,
                          intPipelineHeaderId: item?.intPipelineHeaderId,
                          sequence: "",
                          approver: "",
                          userGroup: "",
                        });
                        setOpenModal(true);
                      }}
                    />
                  </button>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CardTable;
