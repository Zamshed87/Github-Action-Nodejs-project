import { InfoOutlined } from "@mui/icons-material";
import { DataTable, PForm, PInput, PSelect } from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { TimePicker } from "antd";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { convertTo12HourFormat } from "utility/timeFormatter";

const ChangedInOutTimeEmpListModal = ({
  selectedData = [],
  rowDto = [],
  setRowDto,
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
        intimeUpdate: info?.dteStartTime
          ? moment(info?.dteStartTime, "h:mma")
          : null,
        outtimeUpdate: info?.dteEndTime
          ? moment(info?.dteEndTime, "h:mma")
          : null,
        isChanged: true,
        reasonUpdate: "",
      })),
    ]);
  }, [selectedData]);

  const CommonCalendarDDL = useApiRequest([]);
  const getCalendarDefault = () => {
    CommonCalendarDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "MultiCalendarByEmployeeIdDDL",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: employeeId,
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
    if (employeeId) {
      getCalendarDefault();
    }
  }, [employeeId]);

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
              <p
                style={{ fontWeight: 600, color: "rgba(0, 0, 0, 0.85)" }}
                className="my-3"
              >
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
              <p
                style={{ fontWeight: 600, color: "rgba(0, 0, 0, 0.85)" }}
                className="my-3"
              >
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
        title: () => {
          return (
            <div className="d-flex align-items-center justify-content-between">
              <p
                style={{ fontWeight: 600, color: "rgba(0, 0, 0, 0.85)" }}
                className="my-3"
              >
                Calendar
              </p>
              <InfoOutlined
                style={{ cursor: "pointer", fontSize: "14px" }}
                className="ml-2"
                onClick={() => {
                  setOpenModal(!openModal);
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

      {openModal && (
        <section className="my-3">
          <h3 className="my-3">Calendar Details</h3>
          <DataTable
            header={header}
            bordered
            data={
              CommonCalendarDDL?.data?.length > 0 ? CommonCalendarDDL?.data : []
            }
          />
        </section>
      )}
    </div>
  );
};

export default memo(ChangedInOutTimeEmpListModal);
