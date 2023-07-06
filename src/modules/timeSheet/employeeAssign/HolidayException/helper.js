import axios from "axios";
import { toast } from "react-toastify";
import { todayDate } from "../../../../utility/todayDate";
import { CreateOutlined, InfoOutlined } from "@mui/icons-material";
import { LightTooltip } from "../../../../common/LightTooltip";
import { dateFormatterForInput } from "../../../../utility/dateFormatter";

// search
export const filterData = (
  keywords,
  allData,
  setRowDto,
  filterLanding,
  setFilterLanding,
  setHolidayLanding
) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = filterLanding?.filter((item) =>
      regex.test(item?.employeeName?.toLowerCase())
    );
    // setRowDto(newDta);
    setFilterLanding(newDta);
    setHolidayLanding(newDta);
  } catch {
    // setRowDto([]);
    setFilterLanding([]);
    setHolidayLanding([]);
  }
};

export const getAssignLanding = async (
  payload,
  setAllData,
  setter,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/HolidayNExceptionFilter`, payload);
    if (res?.data) {
      setAllData && setAllData(res?.data);
      setter(res?.data);
    }
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);

    setLoading && setLoading(false);
  }
};

export const holidayAndExceptionOffdayAssign = async (
  payload,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/Employee/HolidayAndExceptionOffdayAssign`,
      payload
    );
    cb && cb();
    toast.success(res?.data?.Result?.Message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export function makePayload(array, profileData, values) {
  const { orgId, buId, workPlaceGroupId, employeeId } = profileData;
  const {
    holidayEffectiveDate,
    holidayGroup,
    exceptionEffectiveDate,
    exceptionOffDayGroup,
  } = values;

  const commmonObj = {
    accountId: orgId,
    businessUnitId: buId,
    workplaceGroupId: workPlaceGroupId,
    isActive: true,
    IntCreatedBy: employeeId,
    dteCreatedAt: todayDate(),
    IntUpdatedBy: employeeId,
    dteUpdatedAt: todayDate(),
    isSaveAndProcess: holidayEffectiveDate <= todayDate(),
  };
  const holiDayObj = {
    employeeHolidayAssignId: 0,
    employeeId: 0,
    holidayGroupId: holidayGroup?.value || 0,
    holidayGroupName: holidayGroup?.label || "",
    effectiveDate: holidayEffectiveDate || null,
    ...commmonObj,
  };

  const offDayObj = {
    employeeOffdayAssignId: 0,
    employeeId: 0,
    exceptionOffdayGroupId: exceptionOffDayGroup?.value || 0,
    exceptionOffdayGroupName: exceptionOffDayGroup?.label || "",
    effectiveDate: exceptionEffectiveDate || null,
    ...commmonObj,
  };

  const myObj = {};
  let holiday = [];
  let offDay = [];

  // eslint-disable-next-line no-lone-blocks
  {
    array?.length > 0 &&
      array?.forEach((item) => {
        if (!item?.holidayGroupName && !item?.exceptionOffdayGroupName) {
          if (
            holidayEffectiveDate &&
            holidayGroup &&
            exceptionEffectiveDate &&
            exceptionOffDayGroup
          ) {
            holiday.push({
              ...holiDayObj,
              employeeId: item?.employeeId,
              employeeHolidayAssignId: item?.employeeHolidayAssignId || 0,
            });
            offDay.push({ ...offDayObj, employeeId: item?.employeeId });
          } else if (holidayEffectiveDate && holidayGroup) {
            holiday.push({
              ...holiDayObj,
              employeeId: item?.employeeId,
              employeeHolidayAssignId: item?.employeeHolidayAssignId || 0,
            });
          } else if (exceptionEffectiveDate && exceptionOffDayGroup) {
            offDay.push({ ...offDayObj, employeeId: item?.employeeId });
          }
        } else {
          if (
            holidayEffectiveDate &&
            holidayGroup &&
            exceptionEffectiveDate &&
            exceptionOffDayGroup
          ) {
            holiday.push({
              ...holiDayObj,
              employeeId: item?.employeeId,
              employeeHolidayAssignId: item?.employeeHolidayAssignId || 0,
            });
            offDay.push({ ...offDayObj, employeeId: item?.employeeId });
          } else if (holidayEffectiveDate && holidayGroup) {
            holiday.push({
              ...holiDayObj,
              employeeId: item?.employeeId,
              employeeHolidayAssignId: item?.employeeHolidayAssignId || 0,
            });
            offDay.push({ ...offDayObj, employeeId: item?.employeeId });
          } else if (exceptionEffectiveDate && exceptionOffDayGroup) {
            offDay.push({ ...offDayObj, employeeId: item?.employeeId });
            holiday.push({
              ...holiDayObj,
              employeeId: item?.employeeId,
              employeeHolidayAssignId: item?.employeeHolidayAssignId || 0,
            });
          }
        }
      });
  }

  myObj.holidayAssignDTOList = holiday;
  myObj.exceptionOffdayAssignDTOList = offDay;
  return myObj;
}

export const columns = (
  page,
  paginationSize,
  headerList,
  wgName,
  setShow,
  setIsEdit,
  setSingleData,
  singleData,
  permission,
  setIsMulti
) =>
  [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Employee Name",
      dataIndex: "",
      render: (record) => {
        return (
          <div className="d-flex align-items-center">
            <span className="ml-2">{record?.employeeName}</span>
          </div>
        );
      },
      sort: true,
      filter: false,
      fieldType: "string",
    },

    {
      title: "Department",
      dataIndex: "department",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`departmentList`],
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`designationList`],
      fieldType: "string",
    },
    // {
    //   title: "Supervisor",
    //   dataIndex: "SupervisorName",
    // },

    {
      title: "Wing",
      dataIndex: "wingName",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`wingNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Sole Depo",
      dataIndex: "soleDepoName",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`soleDepoNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Region",
      dataIndex: "regionName",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`regionNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Area",
      dataIndex: "areaName",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`areaNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Territory",
      dataIndex: "territoryName",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`territoryNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Supervisor",
      dataIndex: "supervisorName",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`supervisorNameList`],
      fieldType: "string",
    },
    {
      title: "Holiday Group",
      dataIndex: "holidayGroupName",
      render: (record) => (
        <div className="d-flex align-items-center">
          {record?.holidayGroupName && (
            <LightTooltip
              title={
                <div className="holiday-exception-tooltip tableOne">
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th width="50%">Holiday Group</th>
                        <th width="50%" className="text-center">
                          Effective Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <span className="">{record?.holidayGroupName}</span>
                        </td>
                        <td className="text-center">
                          <span className="">
                            {record?.holidayEffectiveDate &&
                              dateFormatterForInput(
                                record?.holidayEffectiveDate
                              )}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              }
              arrow
            >
              <InfoOutlined />
            </LightTooltip>
          )}
          <div className="pl-2">{record?.holidayGroupName}</div>
        </div>
      ),
    },
    {
      className: "text-center",
      dataIndex: "",
      render: (record) => (
        <>
          <div>
            {(record?.holidayGroupId || record?.exceptionOffdayGroupId) && (
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="iconButton"
                  disabled={record?.isSelected}
                  onClick={() => {
                    if (!permission?.isEdit)
                      return toast.warn("You don't have permission");
                    setShow(true);
                    setIsEdit(true);
                    setSingleData([...singleData, record]);
                  }}
                >
                  <CreateOutlined />
                </button>
              </div>
            )}
          </div>
          <div>
            {!(record?.holidayGroupId || record?.exceptionOffdayGroupId) && (
              <div className="assign-btn">
                <button
                  style={{
                    marginRight: "25px",
                    height: "24px",
                    fontSize: "12px",
                    padding: "0px 12px 0px 12px",
                  }}
                  type="button"
                  disabled={record?.isSelected}
                  className="btn btn-default"
                  onClick={(e) => {
                    if (!permission?.isCreate)
                      return toast.warn("You don't have permission");
                    if (!permission?.isCreate)
                      return toast.warn("You don't have permission");
                    setSingleData([record]);
                    setShow(true);
                    setIsMulti(false);
                  }}
                >
                  Assign
                </button>
              </div>
            )}
          </div>
        </>
      ),
    },
  ].filter((column) => column.hidden !== true);
