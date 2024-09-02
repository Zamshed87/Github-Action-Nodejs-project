import { DataTable, PForm, PInput, PSelect } from "Components";
import { TimePicker } from "antd";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import { InfoOutlined } from "@mui/icons-material";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";
import { PModal } from "Components/Modal";
import { convertTo12HourFormat } from "utility/timeFormatter";

const ChangedInOutTimeEmpListModal = ({
  selectedRow = [],
  rowDto = [],
  setRowDto,
  value,
}) => {
  const { orgId, buId, wgId, wId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [openModal, setOpenModal] = useState(false);

  const updateRowDto = (fieldName, value, index) => {
    const data = [...rowDto];

    data[index][fieldName] = value;

    setRowDto(data);
  };
  const [apply, setApply] = useState({
    inTime: false,
    outTime: false,
    reason: false,
  });
  const updateByApplyAll = (fieldName) => {
    const firstIndex = fieldName?.toLowerCase()?.includes("time")
      ? moment(moment(rowDto?.[0][fieldName]).format("HH:mm:ss"), "h:mma")
      : rowDto?.[0][fieldName];
    const updateState = [];
    rowDto.forEach((item) => {
      const obj = {
        ...item,
        [fieldName]: firstIndex,
      };
      updateState.push(obj);
    });
    setRowDto(updateState);
  };
  useEffect(() => {
    setRowDto([
      ...selectedRow.map((info) => ({
        ...info,
        inDateUpdate: info?.AttendanceDate
          ? moment(info?.AttendanceDate).format("YYYY-MM-DD")
          : null,
        outDateUpdate: info?.AttendanceDate
          ? moment(info?.AttendanceDate).format("YYYY-MM-DD")
          : null,
        intimeUpdate: info?.InTime ? moment(info?.InTime, "h:mma") : null,
        outtimeUpdate: info?.OutTime ? moment(info?.OutTime, "h:mma") : null,
        reasonUpdate: info?.reasonUpdate || null,
      })),
    ]);
  }, [selectedRow]);
  const CommonCalendarDDL = useApiRequest([]);
  const getCalendarDefault = () => {
    CommonCalendarDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "MultiCalendarByEmployeeIdDDL",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: value?.employee?.employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strCalendarName;
          res[i].value = item?.intCalendarId;
        });
      },
    });
  };
  useEffect(() => {
    if (value?.employee?.employeeId) {
      getCalendarDefault();
    }
  }, [value?.employee?.employeeId]);

  const onCancel = () => setOpenModal(false);

  const tableHeadColumn = (
    updateRowDto,
    apply,
    setApply,
    updateByApplyAll,
    rowDto
  ) => {
    return [
      {
        title: "SL",
        render: (value, row, index) => index + 1,
        align: "center",
        width: 30,
      },
      {
        title: "Employee Name",
        dataIndex: "EmployeeName",
        width: 120,
      },
      {
        title: "Employee ID",
        dataIndex: "EmployeeCode",
        width: 90,
      },
      {
        title: "Select From Date",
        dataIndex: "inDateUpdate",
        width: 100,
        render: (_, record, idx) => {
          return (
            <div>
              <PInput
                type="date"
                value={moment(record?.inDateUpdate)}
                placeholder="Select From Date"
                onChange={(value) => {
                  updateRowDto(
                    "inDateUpdate",
                    moment(value).format("YYYY-MM-DD"),
                    idx
                  );
                }}
              />
            </div>
          );
        },
      },
      {
        title: () => {
          return (
            <div className="d-flex align-items-center justify-content-between">
              <p style={{ fontWeight: 600, color: "rgba(0, 0, 0, 0.85)" }}>
                In-Time
              </p>
              <PInput
                label="Apply All?"
                type="checkbox"
                checked={apply.inTime}
                layout="horizontal"
                onChange={(e) => {
                  setApply({ ...apply, inTime: e.target.checked });
                  e.target.checked && updateByApplyAll("intimeUpdate");
                }}
                disabled={rowDto?.[0]?.intimeUpdate ? false : true}
              />
            </div>
          );
        },
        dataIndex: "intimeUpdate",
        width: 150,
        render: (_, record, idx) => (
          <div>
            <TimePicker
              value={record?.intimeUpdate}
              onChange={(e) => {
                const date = record?.inDateUpdate;
                const time = moment(e).format("hh:mm:ss");
                const datetime = moment(`${date} ${time}`)
                  .set({ hour: 23, minute: 59, second: 0 })
                  .format("YYYY-MM-DDTHH:mm:ss");
                if (
                  moment(datetime).isBetween(
                    record?.officeOpeningTime,
                    record?.officeClosingTime,
                    null,
                    "[]"
                  )
                ) {
                  console.log(true);
                }
                console.log(
                  record?.officeOpeningTime,
                  record?.officeClosingTime,
                  datetime
                );
                console.log(record);
                updateRowDto("intimeUpdate", e, idx);
              }}
              format={"hh:mm A"}
              style={{ width: "100%" }}
              disabled={apply.inTime && idx !== 0 ? true : false}
              allowClear={false}
            />
          </div>
        ),
      },
      {
        title: "Select To Date",
        dataIndex: "outDateUpdate",
        width: 120,
        render: (_, record, idx) => (
          <div>
            <PInput
              type="date"
              value={moment(record?.outDateUpdate)}
              placeholder="Select To Date"
              onChange={(value) => {
                updateRowDto(
                  "outDateUpdate",
                  moment(value).format("YYYY-MM-DD"),
                  idx
                );
              }}
            />
          </div>
        ),
      },
      {
        title: () => {
          return (
            <div className="d-flex align-items-center justify-content-between">
              <p style={{ fontWeight: 600, color: "rgba(0, 0, 0, 0.85)" }}>
                Out-Time
              </p>
              <PInput
                label="Apply All?"
                type="checkbox"
                // name={apply.outTime}
                checked={apply.outTime}
                layout="horizontal"
                onChange={(e) => {
                  setApply({ ...apply, outTime: e.target.checked });
                  e.target.checked && updateByApplyAll("outtimeUpdate");
                }}
                disabled={rowDto?.[0]?.outtimeUpdate ? false : true}
              />
            </div>
          );
        },
        dataIndex: "outtimeUpdate",
        width: 150,
        render: (_, record, idx) => (
          <div>
            <TimePicker
              value={record?.outtimeUpdate}
              onChange={(e) => {
                updateRowDto("outtimeUpdate", e, idx);
              }}
              format={"hh:mm A"}
              style={{ width: "100%" }}
              disabled={apply.outTime && idx !== 0 ? true : false}
              allowClear={false}
            />
          </div>
        ),
      },
      {
        title: () => {
          return (
            <div className="d-flex align-items-center justify-content-between">
              <p style={{ fontWeight: 600, color: "rgba(0, 0, 0, 0.85)" }}>
                Calendar
              </p>
              <InfoOutlined
                style={{ cursor: "pointer", fontSize: "14px" }}
                className="ml-2"
                onClick={() => {
                  setOpenModal(true);
                }}
              />
            </div>
          );
        },
        dataIndex: "calendar",
        width: 120,
        render: (_, record, idx) => (
          <div>
            <PSelect
              name={`calendar_${idx}`}
              placeholder="Select Calendar"
              options={CommonCalendarDDL?.data || []}
              onChange={(value, op) => {
                updateRowDto("calendar", op, idx);
                updateRowDto("isAdditionalCalendar", true, idx);
                updateRowDto("additionalCalendarId", value, idx);
              }}
            />
          </div>
        ),
        hidden: orgId === 6 ? false : true,
      },
      {
        title: () => {
          return (
            <div className="d-flex align-items-center justify-content-between">
              <p style={{ fontWeight: 600, color: "rgba(0, 0, 0, 0.85)" }}>
                Reason (optional)
              </p>
              <PInput
                label="Apply All?"
                type="checkbox"
                checked={apply.reason}
                layout="horizontal"
                onChange={(e) => {
                  setApply({ ...apply, reason: e.target.checked });
                  e.target.checked && updateByApplyAll("reasonUpdate");
                }}
                // disabled={rowDto?.[0]?.reasonUpdate ? false : true}
              />
            </div>
          );
        },
        dataIndex: "reasonUpdate",
        render: (_, record, idx) => (
          <div>
            <PInput
              type="text"
              placeholder="Write reason"
              value={record?.reasonUpdate}
              onChange={(e) => {
                updateRowDto("reasonUpdate", e?.target?.value, idx);
              }}
              disabled={apply.reason && idx !== 0 ? true : false}
            />
          </div>
        ),
        width: 200,
      },
    ].filter((item) => item.hidden !== true);
  };
  const header = [
    {
      title: "SL",
      render: (value, row, index) => index + 1,
      align: "center",
      width: 30,
    },
    {
      title: "Calendar Name",
      dataIndex: "strCalendarName",
    },
    {
      title: "Start Time",
      dataIndex: "dteStartTime",
      render: (data) => {
        const startTime = data ? convertTo12HourFormat(data) : "N/A";

        return `${startTime}`;
      },
      width: 90,
    },
    {
      title: "End Time",
      dataIndex: "dteEndTime",
      render: (data) => {
        const endTime = data ? convertTo12HourFormat(data) : "N/A";

        return `${endTime}`;
      },
      width: 90,
    },
    {
      title: "Extended Start Time",
      dataIndex: "dteExtendedStartTime",
      render: (data) => {
        const startTime = data ? convertTo12HourFormat(data) : "N/A";

        return `${startTime}`;
      },
      width: 90,
    },
    {
      title: "Last Start Time",
      dataIndex: "dteLastStartTime",
      render: (data) => {
        const endTime = data ? convertTo12HourFormat(data) : "N/A";

        return `${endTime}`;
      },
      width: 90,
    },
  ];
  return (
    <div>
      {rowDto.length > 0 ? (
        <DataTable
          header={tableHeadColumn(
            updateRowDto,
            apply,
            setApply,
            updateByApplyAll,
            rowDto
          )}
          bordered
          data={rowDto || []}
          checkBoxColWidth={50}
        />
      ) : null}
      <PModal
        width={900}
        open={openModal}
        onCancel={onCancel}
        title={`Calendar Details`}
        components={
          <PForm>
            <>
              <DataTable
                header={header}
                bordered
                data={
                  CommonCalendarDDL?.data?.length > 0
                    ? CommonCalendarDDL?.data
                    : []
                }
              />
            </>
          </PForm>
        }
      />
    </div>
  );
};

export default memo(ChangedInOutTimeEmpListModal);
