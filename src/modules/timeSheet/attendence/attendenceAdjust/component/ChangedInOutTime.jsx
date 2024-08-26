import { DataTable, PInput, PSelect } from "Components";
import { TimePicker } from "antd";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import { InfoOutlined } from "@mui/icons-material";

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
              onClick={(e) => {}}
            />
          </div>
        );
      },
      dataIndex: "calendar",
      width: 120,
      render: (_, record, idx) => (
        <div>
          <PSelect
            name="calendar"
            label="Select Calendar"
            placeholder="Select Calendar"
            // rules={[
            //   {
            //     required: true,
            //     message: "Please Select Attendance Status",
            //   },
            // ]}
            options={[
              {
                value: "Present",
                label: "Present",
              },
              {
                value: "Absent",
                label: "Absent",
              },
              {
                label: "Late",
                value: "Late",
              },
              {
                value: "Leave",
                label: "Leave",
              },
              {
                label: "Movement",
                value: "Movement",
              },
            ]}
            onChange={() => {}}
          />
        </div>
      ),
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
  ];
};

const ChangedInOutTimeEmpListModal = ({
  selectedRow = [],
  rowDto = [],
  setRowDto,
}) => {
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
    </div>
  );
};

export default memo(ChangedInOutTimeEmpListModal);
