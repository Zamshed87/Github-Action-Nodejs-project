import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import DefaultInput from "../../../../common/DefaultInput";
// import FormikCheckBox from "../../../../common/FormikCheckbox";
import PrimaryButton from "../../../../common/PrimaryButton";
// import { gray900, greenColor } from "../../../../utility/customColor";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { timeFormatter } from "../../../../utility/timeFormatter";
import { todayDate } from "../../../../utility/todayDate";
import { getEmpOvertimeLandingData, updateOvertimeHour } from "../helper";

const CardTable = ({ objProps }) => {
  const {
    setFieldValue,
    values,
    setLoading,
    rowDto,
    setRowDto,
    errors,
    touched,
    selectedDto,
    saveFromFieldHandler,
  } = objProps;

  const { employeeId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => {
    let payloadTemp = [];
    selectedDto.length > 0 &&
      selectedDto?.map((item) => {
        const itemPayload = {
          intAutoId: item?.intAutoId,
          hours: values?.bulkChangeHour,
          actionBy: employeeId,
        };
        payloadTemp = [...payloadTemp, itemPayload];
        return payloadTemp;
      });
    const cb = () => {
      getEmpOvertimeLandingData(
        orgId,
        values?.employeeSrc?.value || 0,
        values?.fromDate || todayDate(),
        values?.toDate || todayDate(),
        setRowDto,
        setLoading,
        () => {}
      );
    };

    updateOvertimeHour(payloadTemp, setLoading, cb);
    setFieldValue("bulkChangeHour", "");
  };

  const rowDtoHandler = (name, index, value) => {
    const data = [...rowDto];
    data[index][name] = value;
    setRowDto(data);
  };


  return (
    <>
      <div className="d-flex justify-content-end">
        {rowDto?.filter((item) => item?.selectCheckbox).length > 0 && (
          <div className="input-field-main">
            <DefaultInput
              value={values?.bulkChangeHour}
              classes="input-sm"
              name="bulkChangeHour"
              type="number"
              placeholder="Enter Hour"
              onChange={(e) => {
                setFieldValue("bulkChangeHour", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        )}
        <PrimaryButton
          type="button"
          className="btn btn-green px-auto ml-1"
          label={"Save"}
          onClick={() =>
            rowDto?.filter((item) => item?.selectCheckbox).length > 0
              ? saveHandler(values)
              : saveFromFieldHandler()
          }
        />
      </div>
      <div className="table-card-body mt-1">
        <div className="table-card-styled tableOne">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: "30px" }}>
                  <div>SL</div>
                </th>
                {/* <th>
                  <FormikCheckBox
                    styleObj={{
                      margin: "0 auto!important",
                      color: gray900,
                      checkedColor: greenColor,
                      padding: "0 0 0 2px !important",
                    }}
                    name="allSelected"
                    checked={
                      rowDto.length > 0 &&
                      rowDto?.every((item) => item?.selectCheckbox)
                    }
                    onChange={(e) => {
                      setRowDto(
                        rowDto?.map((item) => ({
                          ...item,
                          selectCheckbox: e.target.checked,
                        }))
                      );
                      setFieldValue("allSelected", e.target.checked);
                    }}
                  />
                </th> */}

                <th>
                  <div className="sortable">
                    <span>Code</span>
                  </div>
                </th>
                <th>
                  <div className="sortable">
                    <span>Employee Name</span>
                  </div>
                </th>
                <th>
                  <div className="sortable">
                    <span>Department</span>
                  </div>
                </th>
                <th>
                  <div className="sortable">
                    <span>Designation</span>
                  </div>
                </th>

                <th>
                  <div className="sortable">
                    <span>Date</span>
                  </div>
                </th>
                <th>
                  <div className="sortable">
                    <span>Start Time</span>
                  </div>
                </th>
                <th>
                  <div className="sortable">
                    <span>End Time</span>
                  </div>
                </th>
                <th>
                  <div className="sortable">
                    <span>Overtime Hour</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {rowDto?.length > 0 &&
                rowDto?.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="content tableBody-title">{index + 1}</div>
                    </td>
                    {/* <td>
                      <FormikCheckBox
                        styleObj={{
                          margin: "0 auto!important",
                          color: gray900,
                          checkedColor: greenColor,
                          padding: "0 0 0 2px !important",
                        }}
                        name="allSelected"
                        checked={item?.selectCheckbox === true}
                        onChange={(e) => {
                          let data = [...rowDto];
                          data[index].selectCheckbox = e.target.checked;
                          setRowDto([...data]);
                        }}
                      />
                    </td> */}
                    <td>
                      <div className="content tableBody-title">
                        {item?.strEmployeeCode}
                      </div>
                    </td>
                    <td>
                      <div className="content tableBody-title">
                        {item?.strEmployeeName}
                      </div>
                    </td>
                    <td>
                      <div className="content tableBody-title">
                        {item?.strDepartmentName}
                      </div>
                    </td>
                    <td>
                      <div className="content tableBody-title">
                        {item?.strDesignationName}
                      </div>
                    </td>
                    <td>
                      <div className="content tableBody-title">
                        {dateFormatter(item?.dteAttendanceDate)}
                      </div>
                    </td>
                    <td>
                      <div className="content tableBody-title">
                        {timeFormatter(item?.timeStartTime)}
                      </div>
                    </td>
                    <td>
                      <div className="content tableBody-title">
                        {timeFormatter(item?.timeEndTime)}
                      </div>
                    </td>
                    {/* <td>{item?.numHours}</td> */}
                    <td>
                      <input
                        style={{
                          height: "25px",
                          width: "100px",
                          fontSize: "12px",
                        }}
                        className="form-control"
                        value={item?.numHours}
                        name={item?.numHours}
                        type="number"
                        onChange={(e) => {
                          rowDtoHandler("numHours", index, e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CardTable;
