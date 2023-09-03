import { CheckOutlined, EditOutlined, InfoOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import AvatarComponent from "../../../../common/AvatarComponent";
import Chips from "../../../../common/Chips";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import { LightTooltip } from "../../../../common/LightTooltip";
import { gray600, gray900, greenColor } from "../../../../utility/customColor";

export const getRequisitionData = async (
  accId,
  buId,
  scheduleId,
  status,
  setter,
  setAllData,
  setFilterData,
  setIsLoading,
  cb
) => {
  setIsLoading && setIsLoading(true);
  try {
    let res = await axios.get(
      `/Training/GetTrainingRequisitionLanding?intScheduleId=${scheduleId}&IntAccountId=${accId}&intBusinessUnitId=${buId}`
    );

    let modifyResData = [];

    if (status === "Not Assigned") {
      // Not Assigned
      modifyResData = res?.data?.data?.filter(
        (itm) =>
          itm?.strStatus !== "Assigned" && itm?.strStatus !== "Pending"
      );
    }
    if (status === "Pending Assign") {
      // Pending Assigne
      modifyResData = res?.data?.data?.filter(
        (itm) => itm?.strStatus === "Pending"
      );
    }

    if (status === "Assigned") {
      // Assigned

      modifyResData = res?.data?.data?.filter(
        (itm) => itm?.strStatus === "Assigned"
      );
    }

    setIsLoading && setIsLoading(false);
    setter(modifyResData);
    setFilterData(modifyResData);
    setAllData(res?.data);
    cb && cb();
  } catch (err) {
    setIsLoading && setIsLoading(false);
    setter([]);
    setAllData([]);
  }
};
export const createRequisitionData = async (
  orgId,
  employeeId,
  result,
  setLoading,
  state,
  cb
) => {
  setLoading && setLoading(true);
  let modifyResData = [];

  modifyResData = result.map((item) => {
    return {
      ...item,
      intRequisitionId: 0,
      intActionBy: employeeId,
      intAccountId: orgId,
      strEmail: item?.strEmail || "N/A",
      strPhoneNo: item?.strPhoneNo || "N/A",
      intScheduleId: state?.intScheduleId,
      strTrainingName: state?.strTrainingName,
      strTrainingCode: state?.strTrainingCode,
      intSupervisorId: 0,
      isFromRequisition: true,
      isActive: true,
      strResourcePerson: state?.strResourcePersonName,
    };
  });
  try {
    let res = await axios.post(
      `/Training/CreateTrainingRequisition`,
      modifyResData
    );
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading && setLoading(false);
    cb && cb();
  } catch (err) {
    toast.warn(err?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};
export const editRequisitionData = async (
  orgId,
  employeeId,
  result,
  setLoading,
  state
) => {
  setLoading && setLoading(true);
  let modifyResData = [];

  modifyResData = {
    intRequisitionId: result?.intRequisitionId,
    strPhoneNo: result?.strPhoneNo || "N/A",
  };
  try {
    let res = await axios.post(
      `/Training/EditTrainingRequisition`,
      modifyResData
    );
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (err) {
    toast.warn(err?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

const rowDtoHandler = (
  name,
  rowDto,
  setRowDto,
  index,
  value,
  orgId,
  employeeId,
  setLoading,
  state
) => {
  const data = [...rowDto];
  data[index][name] = value;

  // data[index][name] = value;
  setRowDto(data);
  // editRequisitionData(
  //   orgId,
  //   employeeId,
  //   data,
  //   setLoading,
  //   state,
  // )
};
export const employeeListColumn = (
  rowDto,
  filterData,
  setFilterData,
  setRowDto,
  page,
  paginationSize,
  setEdit,
  setEditIndex,
  edit,
  editIndex,
  orgId,
  employeeId,
  setLoading,
  state
) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      className: "text-center",
    },
    {
      title: () => (
        <div>
          {rowDto[0].strStatus !== "Pending" &&
            rowDto[0].strStatus !== "Assigned" && (
              <FormikCheckBox
                styleObj={{
                  margin: "0 auto!important",
                  padding: "0 !important",
                  color: gray900,
                  checkedColor: greenColor,
                }}
                name="allSelected"
                checked={
                  filterData?.length > 0
                    ? filterData?.every((item) => item?.selectCheckbox)
                    : false
                }
                // onChange={(e) => {
                //   setHolidayExceptionDto(
                //     holidayExceptionDto?.map((item) => ({
                //       ...item,
                //       selectCheckbox: e.target.checked,
                //     }))
                //   );
                //   setFieldValue("allSelected", e.target.checked);
                // }}
                onChange={(e) => {
                  let data = filterData.map((item) => ({
                    ...item,
                    selectCheckbox: e.target.checked,
                  }));
                  let data2 = rowDto.map((item) => ({
                    ...item,
                    selectCheckbox: e.target.checked,
                  }));
                  setFilterData(data);
                  setRowDto(data2);
                }}
              />
            )}
          <span style={{ marginLeft: "5px" }}>Code</span>
        </div>
      ),
      dataIndex: "strEmployeeCode",
      render: (_, record, index) => (
        <div>
          {rowDto[0].strStatus !== "Pending" &&
            rowDto[0].strStatus !== "Assigned" && (
              <FormikCheckBox
                styleObj={{
                  margin: "0 auto!important",
                  color: gray900,
                  checkedColor: greenColor,
                  padding: "0px",
                }}
                name="selectCheckbox"
                color={greenColor}
                checked={record?.selectCheckbox === true}
                // onChange={(e) => {
                //   let data = holidayExceptionDto?.map((item) => {
                //     if (item?.EmployeeId === record?.EmployeeId) {
                //       return {
                //         ...item,
                //         selectCheckbox: e.target.checked,
                //       };
                //     } else return item;
                //   });
                //   setHolidayExceptionDto([...data]);
                // }}
                onChange={(e) => {
                  let data = filterData?.map((item) => {
                    if (item?.strEmployeeCode === record?.strEmployeeCode) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  });
                  let data2 = rowDto?.map((item) => {
                    if (item?.strEmployeeCode === record?.strEmployeeCode) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  });
                  setFilterData(data);
                  setRowDto(data2);
                }}
                disabled={record?.ApplicationStatus === "Approved"}
              />
            )}
          <span style={{ marginLeft: "5px" }}>{record?.strEmployeeCode}</span>
        </div>
      ),
    },
    {
      title: "Employee",
      dataIndex: "strEmployeeName",
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.strEmployeeName}
            />
            <span className="ml-2">{record?.strEmployeeName}</span>
          </div>
        );
      },
      className: "text-left",
      filter: true,
    },
    {
      title: () => <span style={{ color: gray600 }}>Designation</span>,
      dataIndex: "strDesignationName",
      sorter: true,
      filter: true,
    },
    {
      title: () => <span style={{ color: gray600 }}>Department</span>,
      dataIndex: "strDepartmentName",
      filter: true,
    },
    {
      title: () => <span style={{ color: gray600 }}>Email</span>,
      dataIndex: "strEmail",
    },
    {
      title: () => <span style={{ color: gray600 }}>Phone</span>,
      dataIndex: "strPhoneNo",
      className: "text-left",
      render: (_, record, index) => {
        return (
          <div>
            {
              edit ? (
                editIndex === index ? (
                  <input
                    style={{
                      height: "25px",
                      width: "100px",
                      fontSize: "12px",
                    }}
                    className="form-control"
                    value={record?.strPhoneNo}
                    name={"strPhoneNo"}
                    type="number"
                    onChange={(e) => {
                      // if(e.target.value){
                      rowDtoHandler(
                        "strPhoneNo",
                        rowDto,
                        setRowDto,
                        index,
                        e.target.value,
                        orgId,
                        employeeId,
                        setLoading,
                        state
                      );
                    }}
                  />
                ) : (
                  record?.strPhoneNo
                )
              ) : (
                record?.strPhoneNo
              )
              //   <FormikInput
              //   classes="input-sm"
              //   value={data}
              //   // onChange={(e) =>
              //   //   // setFieldValue("calendarName", e.target.value)
              //   // }
              //   name="calendarName"
              //   type="text"
              //   className="form-control"
              //   placeholder=""
              //   // errors={errors}
              //   // touched={touched}
              // />
              //   "edit"
              // : record?.strPhoneNo
            }
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "Status",
      hidden:
        rowDto[0].strStatus !== "Pending" &&
        rowDto[0].strStatus !== "Assigned",
      render: (_, item) => (
        <div>
          {item?.strStatus === "Assigned" && (
            <Chips label="Approved" classess="success p-2" />
          )}
          {item?.strStatus === "Pending" && (
            <Chips label="Pending" classess="warning p-2" />
          )}
          {item?.strStatus === "Process" && (
            <Chips label="Process" classess="primary p-2" />
          )}
          {item?.Status === "Rejected" && (
            <>
              <Chips label="Rejected" classess="danger p-2 mr-2" />
              {item?.RejectedBy && (
                <LightTooltip
                  title={
                    <div className="p-1">
                      <div className="mb-1">
                        <p
                          className="tooltip-title"
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          Rejected by {item?.RejectedBy}
                        </p>
                      </div>
                    </div>
                  }
                  arrow
                >
                  <InfoOutlined
                    sx={{
                      color: gray900,
                    }}
                  />
                </LightTooltip>
              )}
            </>
          )}
        </div>
      ),
      filter: true,
    },
    {
      className: "text-center",
      width: 100,
      render: (_, record, index) => (
        <div className="d-flex justify-content-center">
          {record?.strStatus === "Pending" && !edit && (
            <Tooltip title="Edit" arrow>
              <button className="iconButton" type="button">
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    // const modifiedRowDto = rowDto?.map((data) => {
                    //   return {
                    //     ...data,
                    //     isEdit:
                    //       record?.strEmployeeCode === data?.strEmployeeCode
                    //         ? true
                    //         : false,
                    //   };
                    // });
                    // setRowDto(modifiedRowDto);
                    setEdit(true);
                    setEditIndex(index);
                  }}
                />
              </button>
            </Tooltip>
          )}
          {record?.strStatus === "Pending" && edit && editIndex === index && (
            <Tooltip title="Save" arrow>
              <button className="iconButton" type="button">
                <CheckOutlined
                  sx={{ color: "#34A853" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEdit(false);
                    setEditIndex(null);
                    editRequisitionData(
                      orgId,
                      employeeId,
                      rowDto[index],
                      setLoading,
                      state
                    );
                  }}
                />
              </button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ].filter((item) => !item.hidden);
};
