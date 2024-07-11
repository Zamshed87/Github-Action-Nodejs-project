import { DataTable, PInput } from "Components";
import { TimePicker } from "antd";
import moment from "moment";
import { memo, useEffect, useState } from "react";

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
              checked={apply.dteStartTime}
              layout="horizontal"
              onChange={(e) => {
                setApply({ ...apply, dteStartTime: e.target.checked });
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
            disabled={apply.dteStartTime && idx !== 0 ? true : false}
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
              // name={apply.dteEndTime}
              checked={apply.dteEndTime}
              layout="horizontal"
              onChange={(e) => {
                setApply({ ...apply, dteEndTime: e.target.checked });
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
            disabled={apply.dteEndTime && idx !== 0 ? true : false}
            allowClear={false}
          />
        </div>
      ),
    },
    {
      title: "Reason (optional)",
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
          />
        </div>
      ),
      width: 150,
    },
  ];
};

const ChangedInOutTimeEmpListModal = ({
  selectedData = [],
  rowDto = [],
  setRowDto,
}) => {
  const updateRowDto = (fieldName, value, index) => {
    const data = [...rowDto];
    data[index][fieldName] = value;
    setRowDto(data);
  };
  const [apply, setApply] = useState({
    dteStartTime: false,
    dteEndTime: false,
  });
  const updateByApplyAll = (fieldName) => {
    const firstIndex = moment(
      moment(rowDto?.[0][fieldName]).format("HH:mm:ss"),
      "h:mma"
    );
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
      ...selectedData.map((info) => ({
        ...info,
        inDateUpdate: info?.dteAttendanceDate
          ? moment(info?.dteAttendanceDate).format("YYYY-MM-DD")
          : null,
        outDateUpdate: info?.dteAttendanceDate
          ? moment(info?.dteAttendanceDate).format("YYYY-MM-DD")
          : null,
        intimeUpdate: info?.dteStartTime ? moment(info?.dteStartTime, "h:mma") : null,
        outtimeUpdate: info?.dteEndTime ? moment(info?.dteEndTime, "h:mma") : null,
        reasonUpdate: "",
      })),
    ]);
  }, [selectedData]);

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
