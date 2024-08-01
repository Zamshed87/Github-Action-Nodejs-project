import React from "react";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import { gray900, greenColor } from "../../../../../utility/customColor";

const StyledTable = ({
  rowDto,
  headerCheckBoxHandler,
  singleCheckBoxHandler,
}) => {
  return (
    <div className="table-card-body">
      <div className="tableOne table-responsive table-card-styled">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>
                <div className="d-flex align-items-center ">
                  <small>Module Name</small>
                </div>
              </th>
              {/* <th>
                <div className="d-flex align-items-center ">
                  <small>Employee Name</small>
                </div>
              </th> */}
              <th>
                <div
                  className="d-flex align-items-center "
                  style={{ width: "100px" }}
                >
                  <small>Feature</small>
                </div>
              </th>
              <th>
                <div
                  className="d-flex align-items-center "
                  style={{ width: "200px" }}
                >
                  <small>Permission Based On</small>
                </div>
              </th>
              <th style={{ width: "100px" }}>
                <div className="d-flex align-items-center">
                  <FormikCheckBox
                    styleObj={{
                      color: gray900,
                      checkedColor: greenColor,
                    }}
                    name="isCreate"
                    checked={
                      rowDto?.length > 0
                        ? rowDto?.every((item) => item?.isCreate)
                        : false
                    }
                    onChange={(e) => {
                      headerCheckBoxHandler("isCreate", e.target.checked);
                    }}
                    label="Create"
                  />
                </div>
              </th>
              <th style={{ width: "85px" }}>
                <div className="d-flex align-items-center ">
                  <FormikCheckBox
                    styleObj={{
                      margin: "0 auto!important",
                      color: gray900,
                      checkedColor: greenColor,
                    }}
                    name="isEdit"
                    checked={
                      rowDto?.length > 0
                        ? rowDto?.every((item) => item?.isEdit)
                        : false
                    }
                    onChange={(e) => {
                      headerCheckBoxHandler("isEdit", e.target.checked);
                    }}
                    label="Edit"
                  />
                </div>
              </th>
              <th style={{ width: "94px" }}>
                <div className="d-flex align-items-center ">
                  <FormikCheckBox
                    styleObj={{
                      color: gray900,
                      checkedColor: greenColor,
                    }}
                    name="isView"
                    label="View"
                    checked={
                      rowDto?.length > 0
                        ? rowDto?.every((item) => item?.isView)
                        : false
                    }
                    onChange={(e) => {
                      headerCheckBoxHandler("isView", e.target.checked);
                    }}
                  />
                </div>
              </th>
              <th style={{ width: "100px" }}>
                <div className="d-flex align-items-center">
                  <FormikCheckBox
                    styleObj={{
                      color: gray900,
                      checkedColor: greenColor,
                    }}
                    name="isDelete"
                    label="Inactive"
                    checked={
                      rowDto?.length > 0
                        ? rowDto?.every((item) => item?.isDelete)
                        : false
                    }
                    onChange={(e) => {
                      headerCheckBoxHandler("isDelete", e.target.checked);
                    }}
                  />
                </div>
              </th>
              <th style={{ width: "55px" }}>
                <div
                  className="d-flex align-items-center"
                  style={{ fontSize: "14px", fontWeight: "500" }}
                ></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {rowDto?.map((data, index) => (
              <tr key={index}>
                <td>
                  <span className="tableBody-title">{data?.moduleName}</span>
                </td>
                {/* <td>
                  <span className="tableBody-title">
                    {index === 0 ? data?.strEmployeeName : ""}
                  </span>
                </td> */}
                <td>
                  <span className="tableBody-title">{data?.strMenuName}</span>
                </td>
                <td>
                  <span className="tableBody-title">{data?.strEmployeeName}</span>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <FormikCheckBox
                      styleObj={{
                        color: gray900,
                        checkedColor: greenColor,
                      }}
                      name="isCreate"
                      color={greenColor}
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
                  <div className="d-flex align-items-center">
                    <FormikCheckBox
                      styleObj={{
                        color: gray900,
                        checkedColor: greenColor,
                      }}
                      name="isEdit"
                      color={greenColor}
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
                  <div className="d-flex align-items-center">
                    <FormikCheckBox
                      styleObj={{
                        color: gray900,
                        checkedColor: greenColor,
                      }}
                      name="isView"
                      color={greenColor}
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
                  <div className="d-flex align-items-center">
                    <FormikCheckBox
                      styleObj={{
                        color: gray900,
                        checkedColor: greenColor,
                      }}
                      name="isDelete"
                      color={greenColor}
                      checked={rowDto?.[index]?.isDelete}
                      onChange={(e) => {
                        singleCheckBoxHandler(
                          "isDelete",
                          e.target.checked,
                          index
                        );
                      }}
                    />
                  </div>
                </td>
                <td>
                  <div
                    className="d-flex align-items-center margin-center"
                    style={{ width: "65px" }}
                  >
                    {/* <FormikCheckBox
                      styleObj={{
                        color: greenColor,
                      }}
                      name="isForWeb"
                      color={greenColor}
                      checked={rowDto?.[index]?.isForWeb}
                      onChange={(e) => {
                        e.stopPropagation();
                      }}
                    /> */}
                    {rowDto?.[index]?.isForWeb &&
                      rowDto?.[index]?.isForApps &&
                      "Web/Apps"}
                    {rowDto?.[index]?.isForWeb === true &&
                      rowDto?.[index]?.isForApps === false &&
                      "Web"}
                    {rowDto?.[index]?.isForWeb === false &&
                      rowDto?.[index]?.isForApps === true &&
                      "Apps"}
                    {rowDto?.[index]?.isForWeb === false &&
                      rowDto?.[index]?.isForApps === false && (
                        <span className="mx-auto">-</span>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StyledTable;
