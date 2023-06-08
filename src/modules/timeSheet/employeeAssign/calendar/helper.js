import { toast } from "react-toastify";
import moment from "moment";
import axios from "axios";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import { gray600, gray900, greenColor } from "../../../../utility/customColor";
import AvatarComponent from "../../../../common/AvatarComponent";
import { dateFormatter } from "../../../../utility/dateFormatter";
import RoasterInfo from "./component/RosterInfo";
import { InfoOutlined } from "@mui/icons-material";
export const getShiftInfo = async (id,setter, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `Employee/GetEmployeeShiftInfo?intEmployeeId=${id}&intYear=${moment().format("YYYY")}&intMonth=${moment().format("M")}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setLoading && setLoading(false);
    }
    res?.data?.length === 0 && toast.warn("no data found");
  } catch (error) {
    setLoading && setLoading(false);
  }
};
export const getCalendarAssignFilter = async (
  setter,
  setIsLoading,
  payload,
  cb
) => {
  setIsLoading(true);
  try {
    let res = await axios.post(`/Employee/CalendarAssignFilter`, payload);
    setIsLoading(false);
    // const newList = res?.data?.map((item) => ({
    //   ...item,
    //   isAssigned: false,
    // }));
    res?.data?.length > 0 && cb?.(res?.data);
    // setAllData && setAllData(newList);
    // setter?.(newList);
  } catch (err) {
    setIsLoading(false);
    setter([]);
  }
};

export const rosterGenerateAction = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/RosterGenerateList`, payload);
    cb && cb();
    toast.success(res?.data?.Result?.Message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const columns = (
  permission,
  pages,
  rowDto,
  setRowDto,
  checked,
  setChecked,
  isAlreadyPresent,
  setSingleData,
  setCreateModal,
  rowDtoHandler,
  setSingleShiftData,
  setLoading,
  setAnchorEl2
) => [
  {
    title: () => (
      <span style={{ color: gray600, textAlign: "text-center" }}>SL</span>
    ),
    render: (text, record, index) => {
      return (
        <span>
          {pages?.current === 1
            ? index + 1
            : (pages.current - 1) * pages?.pageSize + (index + 1)}
        </span>
      );
    },

    className: "text-center",
  },
  {
    width: "10px",
    title: () => (
      <FormikCheckBox
        styleObj={{
          margin: "0 auto!important",
          padding: "0 !important",
          color: gray900,
          checkedColor: greenColor,
        }}
        name="allSelected"
        checked={
          rowDto?.length > 0 && rowDto?.every((item) => item?.isAssigned)
        }
        onChange={(e) => {
          let temp = [...checked];
          let data = rowDto?.map((item) => {
            const newItem = {
              ...item,
              isAssigned: e.target.checked,
            };

            if (!e.target.checked) {
              const updatedChecked = temp.filter(
                (ele) => ele.EmployeeId !== item.EmployeeId
              );
              temp = [...updatedChecked];
              setChecked(updatedChecked);
            } else if (isAlreadyPresent(item) === -1) {
              setChecked((prev) => [...prev, newItem]);
            }

            return newItem;
          });
          setRowDto(data);
        }}
      />
    ),
    dataIndex: "EmployeeCode",
    render: (_, record, index) => (
      <div style={{ minWidth: "10px" }}>
        <FormikCheckBox
          styleObj={{
            margin: "0 auto!important",
            color: gray900,
            checkedColor: greenColor,
            padding: "0px",
          }}
          name="selectCheckbox"
          color={greenColor}
          checked={record?.isAssigned}
          onChange={(e) => {
            let data = rowDto?.map((item) => {
              if (item?.EmployeeId === record?.EmployeeId) {
                const idx = isAlreadyPresent(item);
                if (idx >= 0) {
                  let updatedChecked = [...checked];
                  updatedChecked.splice(idx, 1);
                  setChecked(updatedChecked);
                } else {
                  setChecked((prev) => [
                    ...prev,
                    { ...item, isAssigned: true },
                  ]);
                }
                return { ...item, isAssigned: !item?.isAssigned };
              } else return item;
            });
            setRowDto(data);
          }}
        />
      </div>
    ),
  },
  {
    title: () => (
      <div style={{ minWidth: "100px" }}>
        <span style={{ marginLeft: "5px", color: gray600 }}>Employee ID</span>
      </div>
    ),
    dataIndex: "EmployeeCode",
    render: (_, record, index) => (
      <div style={{ minWidth: "80px" }}>
        <span style={{ marginLeft: "5px" }}>{record?.EmployeeCode}</span>
      </div>
    ),
    filter: true,
    sorter: true,
    isNumber: true,
  },
  {
    title: "Employee",
    dataIndex: "EmployeeName",
    render: (EmployeeName,record) => (
      <div className="d-flex align-items-center">
        <AvatarComponent classess="" letterCount={1} label={EmployeeName} />
        <span className="ml-2">{EmployeeName}</span>
        <InfoOutlined
            style={{ cursor: "pointer" }}
            className="ml-2"
            onClick={(e) => {
              e.stopPropagation();
              setSingleShiftData([]);
              getShiftInfo(record?.EmployeeId, setSingleShiftData, setLoading);
              setAnchorEl2(e.currentTarget);
            }}
          />
      </div>
    ),
    sorter: true,
    filter: true,
  },
  {
    title: "Designation",
    dataIndex: "DesignationName",
    sorter: true,
    filter: true,
  },
  {
    title: "Department",
    dataIndex: "DepartmentName",
    sorter: true,
    filter: true,
  },
  {
    title: "Supervisor",
    dataIndex: "SupervisorName",
    sorter: true,
    filter: true,
  },
  {
    title: () => <span style={{ color: gray600 }}>Generate Date</span>,
    dataIndex: "GenerateDate",
    render: (GenerateDate) => dateFormatter(GenerateDate),
    sorter: true,
    filter: true,
    isDate: true,
  },
  {
    title: () => <span style={{ color: gray600 }}>Joining Date</span>,
    dataIndex: "JoiningDate",
    render: (JoiningDate) => dateFormatter(JoiningDate),
    sorter: true,
    filter: true,
    isDate: true,
  },
  {
    title: () => <span style={{ color: gray600 }}>Roster Name</span>,
    dataIndex: "RosterGroupName",
    sorter: true,
    filter: true,
  },
  {
    title: () => <span style={{ color: gray600 }}>Calender Name</span>,
    dataIndex: "CalendarName",
    sorter: true,
    filter: true,
    render: (_, record) => (
      <>
        {record?.CalendarName ? (
          <div className="d-flex align-items-center">
            <RoasterInfo item={record} />
            <div className="pl-2">{record.CalendarName} </div>
          </div>
        ) : (
          ""
        )}
      </>
    ),
  },
  {
    className: "text-center",
    render: (_, record, index) => (
      <div>
        {!(
          record?.HolidayGroupId ||
          record?.ExceptionOffdayGroupId ||
          record?.selectCheckbox
        ) && (
          <div className="assign-btn">
            <button
              style={{
                marginRight: "25px",
                height: "24px",
                fontSize: "12px",
                padding: "0px 12px 0px 12px",
              }}
              type="button"
              className="btn btn-default"
              onClick={(e) => {
                if (!permission?.isCreate)
                  return toast.warn("You don't have permission");
                if (!permission?.isCreate)
                  return toast.warn("You don't have permission");
                setSingleData([record]);
                setCreateModal(true);
                rowDtoHandler(record);
              }}
              disabled={checked.length > 1}
            >
              Assign
            </button>
          </div>
        )}
      </div>
    ),
  },
];
