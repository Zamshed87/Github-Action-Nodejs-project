import { Form } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
  Avatar,
  DataTable,
  PButton,
  PCard,
  PCardHeader,
  PForm,
  PSelect,
} from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { dateFormatter } from "utility/dateFormatter";
import { getSerial } from "Utils";
import RoasterInfo from "./component/RosterInfo";
import { InfoOutlined } from "@mui/icons-material";
import { bgColors, colors, getShiftInfo } from "./helper";

import { EmpWiseShiftInfo } from "./component/EmpWiseShiftInfo";
import { toast } from "react-toastify";
import { AssignModal } from "./component/AssignCalendar";

export const CalendarAssignSelfService = () => {
  const dispatch = useDispatch();

  // redux
  const { buId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  // menu permission
  let employeeFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30559) {
      employeeFeature = item;
    }
  });
  // state
  const [filterList, setFilterList] = useState<any>({});
  const [empIDString, setEmpIDString] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = React.useState<any[]>([]);
  const [singleData, setSingleData] = useState<any>([]);
  const [isAssignAll, setIsAssignAll] = useState(false);

  // shift info
  const [singleShiftData, setSingleShiftData] = useState<any>([]);
  const [uniqueShift, setUniqueShift] = useState<any>([]);

  // colors
  const [uniqueShiftColor, setUniqueShiftColor] = useState<any>({});
  const [uniqueShiftBg, setUniqueShiftBg] = useState<any>({});

  const [anchorEl2, setAnchorEl2] = useState<any>(null);
  const open2 = Boolean(anchorEl2);
  const id2 = open2 ? "simple-popover" : undefined;

  // Form Instance
  const [form] = Form.useForm();

  // Api Instance
  const landingApi = useApiRequest({});
  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filerList?: any;
    searchText?: string;
    isNotAssign?: boolean;
  };
  const landingApiCall = ({
    pagination = {},
    filerList,
    searchText = "",
    isNotAssign = true,
  }: TLandingApi = {}) => {
    const values = form.getFieldsValue(true);
    const payload = {
      businessUnitId: buId,
      workplaceGroupId: wgId,
      workplaceId: wId,
      isNotAssign:
        values?.assigned === 2 ? false : values?.assigned === 1 ? true : null,
      pageNo: pagination?.current || 1,
      pageSize: pagination?.pageSize || 100,
      isPaginated: true,
      isHeaderNeed: true,
      searchTxt: searchText || "",

      designationList: filerList?.designation || [],
      employmentTypeList: filerList?.employmentType || [],
      departmentList: filerList?.department || [],
      hrPositionList: filerList?.hrPosition || [],
      sectionList: filerList?.section || [],

      supervisorNameList: filerList?.supervisorName || [],
    };
    landingApi.action({
      urlKey: "CalendarAssignBySupervisorFilter",
      method: "POST",
      payload: payload,
      onSuccess: (res: any) => {
        setEmpIDString(res?.employeeIdList);
      },
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    document.title = "Calendar Assign";
    return () => {
      document.title = "Peopledesk";
    };
  }, []);
  useEffect(() => {
    landingApiCall();
  }, [wgId, wId]);

  const searchFunc = debounce((value) => {
    const values = form.getFieldsValue(true);
    landingApiCall({
      filerList: filterList,
      searchText: value,
      isNotAssign: values?.assigned?.value === 1 ? true : false,
    });
  }, 500);

  // Header
  const header = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: landingApi?.data?.currentPage,
          pageSize: landingApi?.data?.pageSize,
          index,
        }),
      fixed: "left",
      width: 30,
      align: "center",
    },

    {
      title: "Employee Name",
      dataIndex: "employeeName",
      render: (_: any, rec: any) => {
        return (
          <div className="d-flex align-items-center">
            <Avatar title={rec?.employeeName} />
            <span className="ml-2">{rec?.employeeName}</span>
            <InfoOutlined
              style={{ cursor: "pointer", fontSize: "15px" }}
              className="ml-2"
              onClick={(e: any) => {
                e.stopPropagation();
                setSingleShiftData([]);
                getShiftInfo(rec?.employeeId, setSingleShiftData);
                setAnchorEl2(e.currentTarget);
              }}
            />
          </div>
        );
      },
      sorter: true,
      fixed: "left",
      width: 75,
    },
    {
      title: "Employee ID",
      dataIndex: "employeeCode",
      sorter: true,
      fixed: "left",
      width: 70,
    },

    {
      title: "Department",
      dataIndex: "department",
      sorter: true,
      filter: true,
      filterKey: "departmentList",
      filterSearch: true,
      width: 95,
    },
    {
      title: "Section",
      dataIndex: "section",
      sorter: true,
      filter: true,
      filterKey: "sectionList",
      filterSearch: true,
      width: 90,
    },
    {
      title: "Designation",
      dataIndex: "designation",
      sorter: true,
      filter: true,
      filterKey: "designationList",
      filterSearch: true,
      width: 90,
    },
    {
      title: "HR Position",
      dataIndex: "hrPosition",
      sorter: true,
      filter: true,
      filterKey: "hrPositionList",
      filterSearch: true,
      width: 90,
    },
    {
      title: "Supervisor",
      dataIndex: "supervisorName",
      sorter: true,
      filter: true,
      filterKey: "supervisorNameList",
      filterSearch: true,
      width: 95,
    },

    {
      title: "Type",
      dataIndex: "employmentType",
      sorter: true,
      filter: true,
      filterSearch: true,
      filterKey: "employmentTypeList",
      width: 75,
    },
    {
      title: "Generate Date",
      dataIndex: "generateDate",
      render: (record: any) => dateFormatter(record),
      width: 75,
    },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      render: (record: any) => dateFormatter(record),
      width: 75,
    },
    {
      title: "Roster Name",
      dataIndex: "rosterGroupName",
      width: 75,
    },
    {
      width: 130,

      title: "Calender Name",
      render: (_: any, item: any) => (
        <>
          {item?.calendarName !== "N/A" ? (
            <div className="d-flex align-items-center">
              <RoasterInfo item={item} />
              <div className="pl-2">{item?.calendarName} </div>
            </div>
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      title: "Action",
      width: 100,
      className: "text-center",
      render: (_: any, record: any) => (
        <div>
          {!(record?.calendarAssignId || record?.isSelected) && (
            <PButton
              type="primary"
              action="button"
              content={"Assign"}
              // icon={<PlusOutlined />}
              onClick={() => {
                if (!employeeFeature?.isCreate)
                  return toast.warn("You don't have permission");
                if (!employeeFeature?.isCreate)
                  return toast.warn("You don't have permission");
                setSingleData([record]);
                setOpen(true);
                // rowDtoHandler(record);
                setIsAssignAll(false);
              }}
              disabled={selectedRow.length > 1}
            />
          )}
        </div>
      ),
    },
  ];
  useEffect(() => {
    setUniqueShift([]);
    if (singleShiftData?.length > 0) {
      const data = [
        ...(new Set(
          singleShiftData.map((item: any) => item.strCalendarName)
        ) as any),
      ];
      const colorData: any = {};
      const colorDataBg: any = {};
      data.forEach((status, index) => {
        colorData[status] = colors[index % colors.length] as any;
      });
      setUniqueShiftColor(colorData);
      data.forEach((status, index) => {
        colorDataBg[status] = bgColors[index % bgColors.length] as any;
      });
      setUniqueShiftBg(colorDataBg);
      setUniqueShift(data);
    }
    // eslint-disable-next-line
  }, [singleShiftData]);
  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{
          assigned: { value: 1, label: "Not Assigned" },
        }}
        onFinish={() => {
          // setOpen(true);
        }}
      >
        <PCard>
          {landingApi?.loading && <Loading />}
          <PCardHeader
            // exportIcon={true}
            title={`${
              selectedRow?.length > 0
                ? `Total ${selectedRow?.length}
                      employee${`${
                        selectedRow?.length > 1 ? "s" : ""
                      }`} selected
                      from ${landingApi?.data?.totalCount}`
                : `Total ${landingApi?.data?.totalCount || 0} employees`
            }`}
            buttonListRightLeft={false}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
            // submitText="Create New"
            // submitIcon={<AddOutlined />}
            buttonList={[
              {
                type: "primary",
                content: `Assign ${landingApi?.data?.totalCount}`,
                onClick: () => {
                  setEmpIDString(landingApi?.data?.employeeIdList);
                  setIsAssignAll(true);

                  setOpen(true);
                },
              },
              {
                type: "primary",
                className: ` ${
                  selectedRow?.length === 0 ? "d-none" : "d-block"
                }`,
                content: `Assign ${selectedRow?.length}`,
                onClick: () => {
                  //   if (employeeFeature?.isCreate) {
                  //   } else {
                  //     // toast.warn("You don't have permission");
                  //   }
                  const payload: any = selectedRow?.map(
                    (i: any) => i?.employeeId
                  );
                  setIsAssignAll(false);

                  setEmpIDString(payload);

                  setOpen(true);
                },
              },
            ]}
          >
            <PSelect
              options={[
                { value: 1, label: "Not Assigned" },
                { value: 2, label: "Assigned" },
              ]}
              name="assigned"
              placeholder=""
              style={{ width: "200px" }}
              onSelect={(value: any, op: any) => {
                form.setFieldsValue({
                  assigned: value,
                });
                landingApiCall({ isNotAssign: value === 2 ? false : true });
              }}
            />
          </PCardHeader>

          {/* Example Using Data Table Designed By Ant-Design v4 */}
          <DataTable
            bordered
            data={landingApi?.data?.data || []}
            loading={landingApi?.loading}
            header={header}
            pagination={{
              pageSize: landingApi?.data?.pageSize,
              total: landingApi?.data?.totalCount,
            }}
            filterData={landingApi?.data?.calendarAssignHeader}
            onChange={(pagination, filters, sorter, extra) => {
              // Return if sort function is called
              if (extra.action === "sort") return;
              const { search } = form.getFieldsValue(true);
              setFilterList(filters);
              landingApiCall({
                pagination,
                filerList: filters,
                searchText: search,
              });
            }}
            rowSelection={{
              type: "checkbox",
              selectedRowKeys: selectedRow.map((item) => item?.key),
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRow(selectedRows);
              },

              // getCheckboxProps: (rec) => {
              //   return {
              //     disabled: rec?.ApplicationStatus === "Approved",
              //   };
              // },
            }}
            // checkBoxColWidth={50}
            scroll={{ x: 2000 }}
          />
        </PCard>
      </PForm>
      {/* i button calendar view */}
      {singleShiftData.length > 0 ? (
        <EmpWiseShiftInfo
          id2={id2}
          open2={open2}
          anchorEl2={anchorEl2}
          setAnchorEl2={setAnchorEl2}
          setSingleShiftData={setSingleShiftData}
          singleShiftData={singleShiftData}
          uniqueShiftColor={uniqueShiftColor}
          uniqueShiftBg={uniqueShiftBg}
          uniqueShift={uniqueShift}
        />
      ) : (
        ""
      )}
      <PModal
        open={open}
        title={"Assign Calendar"}
        width=""
        onCancel={() => {
          setSelectedRow([]);
          setOpen(false);
        }}
        maskClosable={false}
        components={
          <>
            <AssignModal
              empIDString={empIDString}
              setIsAddEditForm={setOpen}
              setCheckedList={setSelectedRow}
              checked={selectedRow}
              singleData={singleData}
              setSingleData={setSingleData}
              getData={() => landingApiCall({})}
              isAssignAll={isAssignAll}
            />
          </>
        }
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};
