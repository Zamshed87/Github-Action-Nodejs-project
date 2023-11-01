import { DeleteOutlineOutlined } from "@mui/icons-material";
import React from "react";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import { greenColor } from "../../../../utility/customColor";

const StyledTable = (props) => {
  const { values, rowDto, singleCheckBoxHandler, remover } = props;

  return (
    <div className="table-card-body  table-card-styled">
      <table className="table align-middle">
        <thead>
          <tr>
            <th scope="col">
              <div className="d-flex align-items-center ">
                <small>Module Name</small>
              </div>
            </th>
            <th>
              <div className="d-flex align-items-center ">
                <small>Feature Name</small>
              </div>
            </th>

            <th>
              <div className="d-flex align-items-center justify-content-center">
                <small>Create</small>
              </div>
            </th>

            <th>
              <small>Edit</small>
            </th>
            <th>
              <small>View</small>
            </th>
            <th>
              <div className="d-flex align-items-center justify-content-center">
                <small>In Active</small>
              </div>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.length > 0 &&
            rowDto.map((data, index) => (
              <tr key={index}>
                <td>{data?.strFirsLevelMenuName}</td>
                <td>{data.strMenuReferenceName}</td>
                <td>
                  <div className="d-flex align-items-center justify-content-center">
                    <FormikCheckBox
                      styleObj={{
                        margin: "0 auto!important",
                        color: greenColor,
                      }}
                      name="isCreate"
                      color={greenColor}
                      values={data?.isCreate || values?.isCreate}
                      checked={rowDto?.[index]?.isCreate}
                      onChange={(e) => {
                        singleCheckBoxHandler(
                          "isCreate",
                          e.target.checked,
                          index
                        );
                      }}
                    />
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center justify-content-center">
                    <FormikCheckBox
                      styleObj={{
                        margin: "0 auto!important",
                        color: greenColor,
                      }}
                      name="isEdit"
                      color={greenColor}
                      values={data?.isEdit || values?.isEdit}
                      checked={rowDto?.[index]?.isEdit}
                      onChange={(e) => {
                        singleCheckBoxHandler(
                          "isEdit",
                          e.target.checked,
                          index
                        );
                      }}
                    />
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center justify-content-center">
                    <FormikCheckBox
                      styleObj={{
                        margin: "0 auto!important",
                        color: greenColor,
                      }}
                      name="isView"
                      color={greenColor}
                      values={data?.isView || values?.isView}
                      checked={rowDto?.[index]?.isView}
                      onChange={(e) => {
                        singleCheckBoxHandler(
                          "isView",
                          e.target.checked,
                          index
                        );
                      }}
                    />
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center justify-content-center">
                    <FormikCheckBox
                      styleObj={{
                        margin: "0 auto!important",
                        color: greenColor,
                      }}
                      name="isClose"
                      color={greenColor}
                      values={data?.isClose || values?.isClose}
                      checked={rowDto?.[index]?.isClose}
                      onChange={(e) => {
                        singleCheckBoxHandler(
                          "isClose",
                          e.target.checked,
                          index
                        );
                      }}
                    />
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => {
                      remover(data?.intMenuReferenceId);
                    }}
                    className="iconButton"
                  >
                    <DeleteOutlineOutlined sx={{ fontSize: "20px" }} />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default StyledTable;
