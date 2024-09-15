import { useApiRequest } from "Hooks";
import { Avatar, Button, Col, Form, Row } from "antd";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
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
import { fromToDateList } from "utility/createExcel";
import { gray600 } from "utility/customColor";
import { debounce } from "lodash";
import { monthFirstDate, monthLastDate } from "utility/dateFormatter";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";

const MonthlyAttendanceReport = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: {
      buId,
      wgId,
      employeeId,
      orgId,
      wId,
      isOfficeAdmin,
      userName,
    },
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
  const [rowDto, setRowDto] = useState([]);

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
        WorkplaceGroupId: wgId,
        IntWorkplaceId: wId,
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
        intSupervisorIdList: [values?.supervisor?.value],
        dteFromdate: moment(values?.fromDate).format("YYYY-MM-DD"),
        dteToDate: moment(values?.toDate).format("YYYY-MM-DD"),
        strSearchName: searchText,
        intDepartmentIdList: [values?.department || 0],
      },
    });
  };

  useEffect(() => {
    isOfficeAdmin && getEmployeDepartment();
    getCalendarDDL();
  }, []);

  const updateRowDto = (fieldName, value, index) => {
    const data = [...rowDto]; // Clone the current state of rowDto

    // Ensure the row at the given index is initialized
    if (!data[index]) {
      data[index] = {}; // Initialize as an empty object if it doesn't exist
    }

    // Set the field and value for the corresponding index
    data[index][fieldName] = value;

    // Update the state with the modified data
    setRowDto(data);
  };

  console.log("rowDto", rowDto);

  const handleSave = () => {
    console.log("rowDto", rowDto);
  };

  useEffect(() => {
    landingApiCall();
  }, []);
  //   table column
  const header = (updateRowDto, rowDto) => {
    const values = form.getFieldsValue(true);
    const dateList = fromToDateList(
      moment(values?.fromDate).format("YYYY-MM-DD"),
      moment(values?.toDate).format("YYYY-MM-DD")
    );
    const d =
      dateList?.length > 0 &&
      dateList.map((item, idx) => ({
        title: () => <span style={{ color: gray600 }}>{item?.level}</span>,
        render: (_, record, index) => { 
          const key = `${index}_${idx}_calendar`;
          return (
          <div>
            <PSelect
              onClear={true}
              name={key}
              placeholder="Select Calendar"
              options={CommonCalendarDDL?.data || []}
              value={rowDto[key] || null} // Set value dynamically based on the state
              onChange={(value, op) => {
                updateRowDto(key, op, idx);
                updateRowDto("isAdditionalCalendar", true, idx);
                updateRowDto("additionalCalendarId", value, idx);
              }}
            />
          </div>
        )},
        width: 200,
      }));

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
        width: 120,
        fixed: "left",
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
        fixed: "left",
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
      ...(d || []),
    ];
  };
  const searchFunc = debounce((value) => {
    landingApiCall({
      searchText: value,
    });
  }, 500);
  const disabledDate = (current) => {
    const { fromDate } = form.getFieldsValue(true);
    const fromDateMoment = moment(fromDate, "MM/DD/YYYY");
    // Disable dates before fromDate and after next3daysForEmp
    return current && current < fromDateMoment.startOf("day");
  };
  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{
          fromDate: moment(monthFirstDate()),
          toDate: moment(monthLastDate()),
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
              <Col md={6} sm={12} xs={24} className="d-none">
                {isOfficeAdmin && (
                  <PSelect
                    options={empDepartmentDDL?.data || []}
                    name="department"
                    label="Department"
                    placeholder="Select Department"
                    style={{ width: "300px" }}
                    onSelect={(value, op) => {}}
                  />
                )}
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={[{ label: userName, value: employeeId }]}
                  name="supervisor"
                  label="Supervisor"
                  style={{ width: "300px" }}
                  disabled="true"
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
                  disabledDate={disabledDate}
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
            data={landingApi?.data?.length > 0 ? landingApi?.data : []}
            loading={landingApi?.loading}
            header={header(updateRowDto, rowDto)}
            pagination={{
              pageSize: pages?.pageSize,
              total: landingApi?.data[0]?.totalCount,
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
