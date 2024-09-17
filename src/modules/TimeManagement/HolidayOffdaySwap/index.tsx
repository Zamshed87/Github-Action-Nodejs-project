import { Form } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { DataTable, PCard, PCardHeader, PForm } from "Components";
import { useApiRequest } from "Hooks";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
// import { holidayOffdaySwapLandingheader } from "./helper";
import { Popover } from "@mui/material";
import profileImg from "../../../assets/images/profile.jpg";
import { InfoOutlined } from "@mui/icons-material";
import PopoverCalender from "modules/timeSheet/employeeAssign/monthlyOffdayAssign/components/PopoverCalender";

const HolidayOffdaySwap = () => {
  const {
    permissionList,
    profileData: { wId, wgId, buId },
  } = useSelector((state: any) => state?.auth, shallowEqual);
  const dispatch = useDispatch();

  // Form Instance
  const [form] = Form.useForm();

  const holidayOffdayPermission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30419),
    []
  );

  // states
  const [rowDto, setRowDto] = useState<any[]>([]);
  // api states
  const holidayOffdayLandingAPI = useApiRequest([]);
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [calendarData, setCalendarData] = useState([]);
  const [selectedSingleEmployee, setSelectedSingleEmployee] = useState<any>([]);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const getholidayOffdayLanding = (
    pagination = { current: 1, pageSize: 25 }
  ) => {
    const { search } = form.getFieldsValue(true);
    // api: /Employee/SwapEmployeeHistory?workplaceGroupId=4&workplaceId=15&CurrentPage=1&PageSize=15
    holidayOffdayLandingAPI?.action({
      urlKey: "SwapEmployeeHistory",
      method: "get",
      params: {
        workplaceId: wId,
        workplaceGroupId: wgId,
        searchTxt: search || "",
        CurrentPage: pagination?.current,
        PageSize: pagination?.pageSize,
      },
      onSuccess: (res) => {
        setRowDto(res?.swapEmployeeHistoryDto);
      },
    });
  };

  // Life Cycle Hooks
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Holiday/Offday Swap";
  }, []);

  useEffect(() => {
    getholidayOffdayLanding();
  }, [wgId, buId, wId]);
  const holidayOffdaySwapLandingheader: any = () => {
    return [
      {
        title: "SL",
        render: (value: any, row: any, index: number) => index + 1,
        align: "center",
        width: 25,
      },
      {
        title: "Emp ID",
        dataIndex: "empCode",
        width: 55,
      },
      {
        title: "Employee Name",
        dataIndex: "empName",

        // width: 65,
      },
      {
        title: "Department",
        dataIndex: "empDepartment",
      },
      {
        title: "Designation",
        dataIndex: "empDesignation",
      },
      {
        title: "HR Position",
        dataIndex: "empHr",
      },
      {
        title: "Section",
        dataIndex: "empSection",
        width: 45,
      },
      {
        title: "Calender Name",
        dataIndex: "calenderName",
      },
      {
        title: "Attendence Date",
        dataIndex: "dteAttendenceDate",
        className: "text-center",
      },
      {
        title: "Attendence Status",
        dataIndex: "attendendeceStatus",
        className: "text-center",
        render: (data: any, record: any) => (
          <div className="d-flex align-items-center">
            <span className="ml-2">{record?.attendendeceStatus}</span>
            {record?.attendendeceStatus === "Offday" && (
              <InfoOutlined
                className="ml-2"
                sx={{ cursor: "pointer", fontSize: "14px" }}
                onClick={(e: any) => {
                  e.stopPropagation();
                  // getSingleCalendar(
                  //   moment().format("MM"),
                  //   moment().format("YYYY"),
                  //   record?.employeeId,
                  //   setCalendarData,
                  //   setLoading
                  // );
                  setAnchorEl(e.currentTarget);
                  setSelectedSingleEmployee([record]);
                }}
              />
            )}
          </div>
        ),
      },
      {
        title: "Swap Date",
        dataIndex: "swapDate",
        className: "text-center",
      },
      {
        title: "Remarks",
        dataIndex: "strRemarks",
      },
    ];
  };
  return holidayOffdayPermission?.isView ? (
    <>
      <PForm form={form} initialValues={{}}>
        <PCard>
          <PCardHeader
            title="Holiday/Offday Swap"
            onSearch={(e) => {
              form.setFieldsValue({
                search: e?.target?.value,
              });
              getholidayOffdayLanding();
            }}
            buttonList={[
              {
                type: "primary",
                content: `Assign Swap`,
                onClick: () => {
                  history.push(
                    "/administration/timeManagement/holidayOffdaySwap/assign"
                  );
                },
                disabled: !holidayOffdayPermission?.isCreate,
              },
            ]}
          />

          <DataTable
            header={holidayOffdaySwapLandingheader(setSelectedSingleEmployee)}
            bordered
            data={rowDto || []}
            loading={holidayOffdayLandingAPI?.loading}
            pagination={{
              current: holidayOffdayLandingAPI?.data?.currentPage,
              pageSize: holidayOffdayLandingAPI?.data?.pageSize,
              total: holidayOffdayLandingAPI?.data?.totalCount,
            }}
            // rowSelection={{
            //   type: "checkbox",
            //   selectedRowKeys: selectedRow.map((item) => item?.key),
            //   onChange: (selectedRowKeys, selectedRows) => {
            //     setSelectedRow(selectedRows);
            //   },
            // }}
            onChange={(pagination, filters, sorter, extra) => {
              if (extra.action === "sort") return;
              getholidayOffdayLanding(pagination);
              // setSelectedRow([]);
            }}
          />
        </PCard>
        <Popover
          sx={{
            "& .MuiPaper-root": {
              width: "600px",
              minHeight: "200px",
              borderRadius: "4px",
            },
          }}
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={() => {
            setAnchorEl(null);
            setCalendarData([]);
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <PopoverCalender
            propsObj={{
              selectedSingleEmployee,
              profileImg,
              calendarData,
              setCalendarData,
            }}
          />
        </Popover>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default HolidayOffdaySwap;
