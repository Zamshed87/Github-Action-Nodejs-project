import { DataTable, PInput } from "Components";
import { TimePicker } from "antd";
import FormikInput from "common/FormikInput";
import moment from "moment";
import { useEffect, useState } from "react";

const header = (updateRowDto) => {
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
              name="isUsersection"
              layout="horizontal"
              onChange={(e) => {
                //   if (e.target.checked) {
                //     form.setFieldsValue({
                //       loginUserId: employeeCode,
                //       password: "123456",
                //     });
                //   }
              }}
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
            //   onChange={onChange as (time: any) => void}
            onChange={(e) => {
              console.log(e);
              //   updateRowDto("intimeUpdate", moment(e).format("hh:mm A"), idx);
                updateRowDto("intimeUpdate", e, idx);
              //   updateRowDto("intimeUpdate", moment(e).format("hh:mm A"), idx);
            }}
            format={"hh:mm A"}
            style={{ width: "100%" }}
          />
          {/* <PInput
            type="time"
            placeholder="In-Time"
            // name={reocod?.intimeUpdate}
            // name={[reocod.intimeUpdate]}
            // value={moment(reocod?.intimeUpdate).format("hh:mm A")}
            value={reocod?.intimeUpdate}
            format={"hh:mm A"}
            onChange={(e) => {
              //   updateRowDto("intimeUpdate", moment(e).format("hh:mm A"), idx);
              updateRowDto("intimeUpdate", moment(e).format("hh:mm A"), idx);
            }}
          /> */}
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
              name="isUsersection"
              layout="horizontal"
              // layout="vertical"
              onChange={(e) => {
                //   if (e.target.checked) {
                //     form.setFieldsValue({
                //       loginUserId: employeeCode,
                //       password: "123456",
                //     });
                //   }
              }}
            />
          </div>
        );
      },
      dataIndex: "outtimeUpdate",
      width: 150,
      render: (_, record, idx) => (
        <div>
          {/* <PInput
            type="time"
            name={record?.outtimeUpdate}
            value={record?.outtimeUpdate}
            placeholder="Out-Time"
            format={"hh:mm A"}
            onChange={(e) => {
              updateRowDto("outtimeUpdate", moment(e).format("hh:mm"), idx);
            }}
          /> */}
          <TimePicker
            value={record?.outtimeUpdate}
            //   onChange={onChange as (time: any) => void}
            onChange={(e) => {
              console.log(e);
              //   updateRowDto("intimeUpdate", moment(e).format("hh:mm A"), idx);
                updateRowDto("outtimeUpdate", e, idx);
              //   updateRowDto("intimeUpdate", moment(e).format("hh:mm A"), idx);
            }}
            format={"hh:mm A"}
            style={{ width: "100%" }}
          />
        </div>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reasonUpdate",
      render: (_, record, idx) => (
        <div>
          <PInput
            // name={"reasonUpdate"}
            type="text"
            placeholder="Write reason"
            // name={record?.reasonUpdate}
            value={record?.reasonUpdate}
            onChange={(e) => {
              // console.log(e?.target?.value, idx)
              updateRowDto("reasonUpdate", e?.target?.value, idx);
            }}
          />
        </div>
      ),
      width: 150,
    },
  ];
};

const ChangedInOutTimeEmpListModal = ({ selectedRow = [] }) => {
  const [rowDto, setRowDto] = useState([]);
  useEffect(() => {
    // setRowDto([
    //   ...selectedRow.map((info) => ({
    //     ...info,
    //     inDateUpdate: moment(info?.AttendanceDate).format("YYYY-MM-DD"),
    //     outDateUpdate: moment(info?.AttendanceDate).format("YYYY-MM-DD"),
    //     // intimeUpdate: moment(info?.inTime).format("hh:mm:ss"),
    //     // outtimeUpdate: moment(info?.outTime).format("hh:mm:ss"),
    //     reasonUpdate: "",
    //   })),
    // ]);
    setRowDto([...selectedRow]);
  }, [selectedRow]);

  const updateRowDto = (fieldName, value, index) => {
    console.log({ fieldName, value, index });
    const data = [...rowDto];
    data[index][fieldName] = value;
    setRowDto(data);
  };
  console.log({ rowDto });
  return (
    <div>
      {rowDto.length > 0 ? (
        <DataTable
          header={header(updateRowDto)}
          bordered
          data={rowDto || []}
          // loading={AttendanceAdjustmentFilter?.loading}
          // scroll={{ x: 1500 }}
          checkBoxColWidth={50}
        />
      ) : null}
    </div>
  );
};

export default ChangedInOutTimeEmpListModal;
