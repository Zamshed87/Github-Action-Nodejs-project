// import { CreateOutlined, DeleteOutlined } from "@mui/icons-material";
import React from "react";

const CardTable = ({ landing }) => {
  return (
    <div className="table-card-styled pt-3 pb-3 border-bottom">
      <table className="table">
        <tbody>
          {landing?.map((item) => (
            <tr>
              <td width="20%">{item?.LeaveMovementTypeName}</td>
              <td>
                <div className="pipeline-stepper">
                  <ul className="stepper">
                    {item?.FlowList?.map((item, index) => (
                      <li className="stepper__item" key={index}>
                        <div>{item?.SequenceName}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </td>
              {/* <td className="m-0 p-0" width="15%">
                <button
                  type="button"
                  className="iconButton"
                  onClick={() => {
                    // demoPopup(data);
                  }}
                >
                  <CreateOutlined />
                </button>
                <button
                  type="button"
                  className="iconButton mt-0 mt-md-2 mt-lg-0"
                  onClick={() => {
                    // demoPopup(data);
                  }}
                >
                  <DeleteOutlined />
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CardTable;
