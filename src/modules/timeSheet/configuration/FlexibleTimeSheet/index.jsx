import { useApiRequest } from "Hooks";
import { Button, Col, Form, Row } from "antd";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Avatar,
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { paginationSize } from "common/AntTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { debounce } from "lodash";
import { monthFirstDate, monthLastDate7 } from "utility/dateFormatter";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { timeSheetClone, timeSheetSave } from "./helper";
import { PSelectWithOutForm } from "Components/PForm/Select/PSelectWithOutForm";
import Loading from "common/loading/Loading";
import { getPeopleDeskAllDDL, getPeopleDeskAllDDLnew } from "common/api";

const MonthlyAttendanceReport = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wgId, employeeId, wId, isOfficeAdmin, userName },
  } = useSelector((state) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item) => item?.menuReferenceId === 30429),
    []
  );
  // menu permission
  const employeeFeature = permission;

  const landingApi = useApiRequest({});
  //   const debounce = useDebounce();

  const [, setFilterList] = useState({});
  const [headerDateList, setHeaderDateList] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emp, setEmp] = useState([]);
  const [calenderRoasterDDL, setCalenderRoasterDDL] = useState([]);
  const [startingCalenderDDL, setStartingCalenderDDL] = useState([]);

  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  // Form Instance
  const [form] = Form.useForm();
  //   api states
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Flexible Timesheet";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // api states
  const empDepartmentDDL = useApiRequest([]);

  const getEmployeDepartment = () => {
    empDepartmentDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmpDepartment",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId || 0,
        IntWorkplaceId: wId || 0,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.DepartmentName;
          res[i].value = item?.DepartmentId;
        });
      },
    });
  };

  const CommonCalendarDDL = useApiRequest([]);
  const getSupervisorListDDL = useApiRequest([]);
  const getSuperUserList = () => {
    const values = form.getFieldsValue(true);
    getSupervisorListDDL?.action({
      urlKey: "getSupervisorListDDL",
      method: "GET",
      params: {
        intDepartmentId: values?.department || 0,
        intWorkplaceId: wId || 0,
      },
    });
  };

  // data call
  const landingApiCall = ({
    pagination = { current: 1, pageSize: paginationSize },
    searchText = "",
  } = {}) => {
    const values = form.getFieldsValue(true);

    landingApi.action({
      urlKey: "FlexibleTimesheetEmployeeLanding",
      method: "POST",
      payload: {
        intSupervisorIdList: [
          values?.supervisor?.value || values?.supervisor || 0,
        ],
        dteFromdate: moment(values?.fromDate).format("YYYY-MM-DD"),
        dteToDate: moment(values?.toDate).format("YYYY-MM-DD"),
        strSearchName: searchText,
        intDepartmentIdList: [values?.department || 0],
        intWorkplaceId: wId,
      },
    });
  };

  useEffect(() => {
    isOfficeAdmin && getEmployeDepartment();
    getCalendarDDL();
    getSuperUserList();
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=RosterGroup&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&IntWorkplaceId=${wId}`,
      "RosterGroupId",
      "RosterGroupName",
      setCalenderRoasterDDL
    );
  }, [wgId, buId, wId]);

  useEffect(() => {
    if (landingApi?.data?.length > 0) {
      const modifiedRowDto = landingApi?.data?.map((i) => {
        const modifiedDateLists = i?.dateLists?.map((item) => {
          const newDate = moment(item?.dteAttendencedate).format("YYYY-MM-DD");
          const dateLevel = moment(
            item?.dteAttendencedate,
            "YYYY-MM-DD"
          ).format("DD MMM, YYYY");

          return {
            ...item,
            date: newDate,
            level: dateLevel,
          };
        });
        return {
          ...i,
          dateLists: modifiedDateLists,
        };
      });

      setRowDto(modifiedRowDto);
      setHeaderDateList(modifiedRowDto?.[0]);
    } else {
      setRowDto([]);
      setHeaderDateList([]);
    }
  }, [landingApi?.data]);

  const getCalendarDDL = () => {
    CommonCalendarDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Calender",
        IntWorkplaceId: wId,
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: 0, // employeeId, Previously set 0
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.CalenderName;
          res[i].value = item?.CalenderId;
        });
      },
    });
  };
  useEffect(() => {
    if (wId) {
      landingApiCall();
    }
  }, [wId]);

  const handleSave = (rec) => {
    const allCalendarsSelected = rec?.dateLists?.every((item) => {
      return item?.strCalenderName;
    });
    if (!allCalendarsSelected) {
      return toast.warn("Please select all calendar names before saving.");
    }

    const payload = rec?.dateLists?.map((item) => {
      return {
        intEmployeeId: rec?.intEmployeeId || 0,
        dteAttendencedate: item?.dteAttendencedate,
        strType:
          item?.strCalenderName === "Offday" ? "Offday" : "Calendar" || "",
        intCalenderId:
          item?.strCalenderName === "Offday"
            ? CommonCalendarDDL?.data?.[0]?.value || 0
            : item?.intCalenderId || 0,
      };
    });

    timeSheetSave(payload, setLoading, () => {});
    // console.log(payload, "payload");
  };
  {
    console.log("rowDto", rowDto);
  }
  console.log("startingCalenderDDL", startingCalenderDDL);
  const dateColumns = headerDateList?.dateLists?.map((date, idx) => ({
    title: date?.level,
    dataIndex: date,
    render: (_, record, index) => {
      const newDateLists = [...record?.dateLists];
      const obj = newDateLists[idx] || "";
      const optionValue = obj?.intCalenderId
        ? {
            value: obj?.intCalenderId,
            label: obj?.strCalenderName,
          }
        : "";
      const key = `${index}_${idx}_calendar`;
      return (
        <div>
          <PSelectWithOutForm
            name={key}
            placeholder="Select Calendar"
            allowClear
            options={[
              { value: 1, label: "Offday" },
              ...(record?.startingCalenderDDL?.length > 0
                ? record?.startingCalenderDDL || []
                : CommonCalendarDDL?.data || []),
            ]}
            value={optionValue}
            onChange={(value, op) => {
              newDateLists[idx] = {
                ...newDateLists[idx],
                intCalenderId: op?.value,
                strCalenderName: op?.label,
              };
              const newRowDto = [...rowDto];
              newRowDto[index] = {
                ...newRowDto[index],
                dateLists: newDateLists,
              };
              setRowDto(newRowDto);
            }}
          />
        </div>
      );
    },
    width: 150,
  }));

  const handleButtonClick = (record, rowIdx) => {
    setEmp([]);
    const values = form.getFieldsValue(true);
    const payload = {
      intSupervisorIdList: [
        values?.supervisor?.value || values?.supervisor || 0,
      ],
      dteFromdate: moment(values?.fromDate).format("YYYY-MM-DD"),
      dteToDate: moment(values?.toDate).format("YYYY-MM-DD"),
      intEmployeeIdList: [record?.intEmployeeId],
      intCloneFrom: +emp || 0,
    };
    timeSheetClone(payload, setLoading, (resData) => {
      const cloneEmpRow = resData?.[0] || [];
      const copyPrvRowDto = [...rowDto];
      copyPrvRowDto[rowIdx] = {
        ...copyPrvRowDto[rowIdx],
        dateLists: cloneEmpRow?.dateLists,
      };
      setRowDto(copyPrvRowDto);
      setEmp([]);
    });
  };

  //   table column
  const header = () => {
    return [
      {
        title: "Action",
        render: (_, rec, index) => (
          <Button
            type="dashed"
            onClick={() => handleSave(rec, index)}
            style={{ fontSize: "12px" }}
          >
            Save
          </Button>
        ),
        fixed: "left",
        width: 80, // Adjust width as needed
        align: "center",
      },
      {
        title: "SL",
        render: (_, rec, index) =>
          (pages?.current - 1) * pages?.pageSize + index + 1,
        fixed: "left",
        width: 45,
        align: "center",
      },
      {
        title: "Employee Id",
        dataIndex: "intEmployeeId",
        width: 70,
        fixed: "left",
        render: (text) => (
          <span
            title="Click to copy"
            onClick={() => {
              navigator.clipboard.writeText(text);
            }}
            style={{ cursor: "pointer", color: "#34a853" }}
          >
            {text}
          </span>
        ),
      },
      {
        title: "Employee Code",
        dataIndex: "strEmployeeCode",
        width: 70,
      },

      {
        title: "Employee Name",
        dataIndex: "strEmployeeName",
        render: (_, rec) => {
          return (
            <div className="d-flex align-items-center">
              <Avatar title={rec?.strEmployeeName} />
              <span className="ml-2">{rec?.strEmployeeName}</span>
            </div>
          );
        },
        // fixed: "left",
        width: 150,
      },

      {
        title: "Designation",
        dataIndex: "strDesignationName",

        width: 100,
      },
      {
        title: "Department",
        dataIndex: "strDepartmentName",
        width: 100,
      },
      {
        title: "Copy From (Emp ID)",
        width: 250,
        render: (text, record, rowIdx) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <PInput
              type="text"
              name={`empId-${record.key}`}
              placeholder="Enter Emp ID"
              value={record.intEmployeeId}
              onChange={(e) => setEmp(e.target.value)}
            />
            <button
              type="button"
              onClick={() => handleButtonClick(record, rowIdx)}
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                backgroundColor: "#34a853",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Clone
            </button>
          </div>
        ),
      },
      {
        title: "Roaster Group",
        width: 200,
        render: (text, record, rowIdx) => (
          <PSelect
            options={calenderRoasterDDL}
            name={`roaster-${record.key}`}
            placeholder="Select Roaster Group"
            allowClear
            onChange={(value, op) => {
              setStartingCalenderDDL([]);
              const newRowDto = [...rowDto];
              newRowDto[rowIdx].startingCalenderDDL = [];
              setRowDto(newRowDto);
              if (value) {
                getPeopleDeskAllDDLnew(
                  `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=CalenderByRosterGroup&intId=${value}&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}`,
                  "CalenderId",
                  "CalenderName",
                  setStartingCalenderDDL,
                  (data) => {
                    newRowDto[rowIdx].startingCalenderDDL = data;
                    setRowDto(newRowDto);
                  }
                );
              } else {
                getCalendarDDL();
                setStartingCalenderDDL([]);
              }
            }}
          />
        ),
      },
      ...(dateColumns || []),
    ];
  };
  const searchFunc = debounce((value) => {
    landingApiCall({
      searchText: value,
    });
  }, 500);
  // const disabledDate = (current) => {
  //   const { fromDate } = form.getFieldsValue(true);
  //   const fromDateMoment = moment(fromDate, "MM/DD/YYYY");
  //   // Disable dates before fromDate and after next3daysForEmp
  //   return current && current < fromDateMoment.startOf("day");
  // };
  return employeeFeature?.isView ? (
    <>
      {loading && <Loading />}
      <PForm
        form={form}
        initialValues={{
          fromDate: moment(monthFirstDate()),
          toDate: moment(monthLastDate7()),
          supervisor: { label: userName, value: employeeId },
        }}
        onFinish={() => {
          landingApiCall({
            pagination: {
              current: pages?.current,
              pageSize: landingApi?.data[0]?.totalCount,
            },
          });
        }}
      >
        <PCard>
          <PCardHeader
            title="Flexible Timesheet"
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
          />
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              {isOfficeAdmin && (
                <Col md={6} sm={12} xs={24}>
                  <PSelect
                    options={empDepartmentDDL?.data || []}
                    name="department"
                    label="Department"
                    placeholder="Select Department"
                    allowClear
                    style={{ width: "300px" }}
                    onSelect={(value, op) => {
                      if (value) {
                        getSuperUserList();
                      } else {
                        getSuperUserList([]);
                      }
                    }}
                  />
                </Col>
              )}

              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={getSupervisorListDDL?.data || []}
                  name="supervisor"
                  label="Supervisor"
                  allowClear
                  style={{ width: "300px" }}
                  disabled={!isOfficeAdmin}
                  onSelect={(value, op) => {}}
                />
              </Col>
              <Col md={5} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="fromDate"
                  label="From Date"
                  placeholder="From Date"
                  onChange={(value) => {
                    form.setFieldsValue({
                      fromDate: value,
                    });
                  }}
                />
              </Col>
              <Col md={5} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="toDate"
                  label="To Date"
                  placeholder="To Date"
                  // disabledDate={disabledDate}
                  onChange={(value) => {
                    form.setFieldsValue({
                      toDate: value,
                    });
                  }}
                />
              </Col>
              <Col
                style={{
                  marginTop: "23px",
                }}
              >
                <PButton type="primary" action="submit" content="View" />
              </Col>
            </Row>
          </PCardBody>

          <DataTable
            bordered
            data={rowDto?.length > 0 ? rowDto : []}
            loading={landingApi?.loading}
            header={header(headerDateList)}
            pagination={{
              pageSize: pages?.pageSize,
              total: rowDto[0]?.totalCount,
            }}
            onChange={(pagination, filters, sorter, extra) => {
              // Return if sort function is called
              if (extra.action === "sort") return;
              setFilterList(filters);
              setPages({
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
              });
              landingApiCall({
                pagination,
              });
            }}
            scroll={{ x: 2000 }}
          />
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default MonthlyAttendanceReport;
