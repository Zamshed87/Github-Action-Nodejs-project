import { AttachmentOutlined, DeleteOutlined } from '@mui/icons-material';
import { Tooltip } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getDownlloadFileView_Action } from "../../../commonRedux/auth/actions";

const CardTable = ({
  rowDto,
  remover,
  setFieldValue,
  setImageFile,
  setSingleData,
  imageFile,
  permission,
}) => {
  const dispatch = useDispatch();

  return (
    <div className="table-card-styled employee-table-card tableOne">
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: "30px" }}>SL</th>
            <th>
              <div className="sortable">
                <span>Policy Title</span>
              </div>
            </th>
            <th>
              <div className="sortable">
                <span>Policy Category</span>
              </div>
            </th>
            <th>
              <div className="sortable">
                <span>Business Unit</span>
              </div>
            </th>
            <th>
              <div className="sortable">
                <span>Department</span>
              </div>
            </th>
            <th>
              <div className="sortable">
                <span>Acknowledged</span>
              </div>
            </th>
            <th>
              <div className="sortable">
                <span>Attachment File</span>
              </div>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.length > 0 &&
            rowDto?.map((data, index) => (
              <tr key={index}>
                <td className="text-center">
                  <div>{index + 1}</div>
                </td>
                <td>{data?.policyTitle}</td>
                <td>{data?.policyCategoryName}</td>
                <td>{data?.businessUnitList}</td>
                <td>{data?.departmentList}</td>
                <td>
                  <div>{data?.acknowledgeCount}</div>
                </td>
                <td>
                  <div>
                    <div
                      onClick={() => {
                        dispatch(
                          getDownlloadFileView_Action(data?.policyFileUrlId)
                        );
                      }}
                      className="d-flex"
                    >
                      <AttachmentOutlined
                        sx={{ marginRight: "5px", color: "#0072E5" }}
                      />
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "500",
                          color: "#0072E5",
                          cursor: "pointer",
                        }}
                      >
                        {data?.policyFileName}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    {/* <button
                      type="button"
                      className="iconButton"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageFile({ id: data?.strPolicyFileUrl });
                        setFieldValue("policyTitle", data?.strPolicyName);
                        setSingleData(data)
                      }}
                    >
                      <CreateOutlined />
                    </button> */}
                    <Tooltip title="Delete" arrow>
                      <button
                        type="button"
                        className="iconButton mt-0 mt-md-2 mt-lg-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!permission?.isClose)
                            return toast.warn("You don't have permission");
                          remover(data);
                        }}
                      >
                        <DeleteOutlined />
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CardTable;
