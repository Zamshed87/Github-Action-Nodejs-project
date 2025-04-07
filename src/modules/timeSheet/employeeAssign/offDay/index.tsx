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
  TableButton,
} from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { dateFormatter } from "utility/dateFormatter";
import { getSerial } from "Utils";
import { InfoOutlined } from "@mui/icons-material";

import { toast } from "react-toastify";
import {
  getEmployeeOffdayHistory,
  getSingleCalendar,
  printDays,
} from "./helper";
import { EmpOffDayDetails } from "./component/EmpOffDayDetails";
import moment from "moment";
import { EmpOffDayCalendarView } from "./component/EmpOffDayCalendarView";
import { downloadEmployeeCardFile } from "modules/timeSheet/reports/employeeIDCard/helper";
import { AssignOffDay } from "./addEditForm/AssignOffDay";
import OffDayErrorModal from "./OffDayErrorModal";
// import AddEditForm from "./component";

export const OffDayLanding = () => {
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
    if (item?.menuReferenceId === 44) {
      employeeFeature = item;
    }
  });
  // state
  const [filterList, setFilterList] = useState<any>({});
  const [empIDString, setEmpIDString] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = React.useState<any[]>([]);
  const [singleData, setSingleData] = useState<any>([]);
  const [isAssignAll, setIsAssignAll] = useState<any>(false);
  const [erroModalOpen, setErroModalOpen] = useState<any>(false);
  const [errorData, setErrorData] = useState<any>(false);
  const [errorPayload, setErrorPayload] = useState<any>({});

  // shift info
  const [calendarData, setCalendarData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  // colors
  const [offDayHistory, setOffDayHistory] = useState<any>({});
  const [anchorEl, setAnchorEl] = useState<any>(null);

  const [anchorEl2, setAnchorEl2] = useState<any>(null);
  const open2 = Boolean(anchorEl2);
  const openCalendar = Boolean(anchorEl);
  const id2 = open2 ? "simple-popover" : undefined;
  const id = openCalendar ? "simple-popover" : undefined;

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
      isAssign:
        values?.assigned === 1 ? false : values?.assigned === 2 ? true : null,
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
      wingNameList: [],
      soleDepoNameList: [],
      regionNameList: [],
      areaNameList: [],
      territoryNameList: [],
      //   employmentTypeList: [],
      //   sectionList: [],
      //   hrPositionList: [],
    };
    landingApi.action({
      urlKey: "OffdayLandingFilter",
      method: "POST",
      payload: payload,
      onSuccess: (res: any) => {
        setEmpIDString(res?.employeeList);
        res?.data?.forEach((item: any, idx: any) => {
          (res.data[idx].offDayList =
            !res.data[idx]?.isFriday &&
            !res.data[idx]?.isSaturday &&
            !res.data[idx]?.isSunday &&
            !res.data[idx]?.isMonday &&
            !res.data[idx]?.isThursday &&
            !res.data[idx]?.isTuesday &&
            !res.data[idx]?.isWednesday
              ? "N/A"
              : printDays(res.data[idx])),
            (res.data[idx].offDay =
              res.data[idx]?.isFriday ||
              res.data[idx]?.isSaturday ||
              res.data[idx]?.isSunday ||
              res.data[idx]?.isMonday ||
              res.data[idx]?.isThursday ||
              res.data[idx]?.isTuesday ||
              res.data[idx]?.isWednesday);
        });
      },
    });
  };
  // useEffects
  // sidebar
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "OffDay Assign";
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
                getSingleCalendar(
                  moment().format("MM"),
                  moment().format("YYYY"),
                  rec?.employeeId,
                  setCalendarData,
                  setLoading
                );
                !loading && setAnchorEl(e.currentTarget);
                setSingleData([rec]);
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
      title: "Work. Group/Location",
      dataIndex: "workplaceGroupName",
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
      title: "Off Day",
      width: 90,

      dataIndex: "offDayList",
      render: (_: any, record: any) => (
        <div className="d-flex align-items-center">
          <span className="ml-2">{record?.offDayList}</span>
          {record?.offDayList !== "N/A" && (
            <InfoOutlined
              className="ml-2"
              sx={{ cursor: "pointer", fontSize: "14px" }}
              onClick={(e) => {
                e.stopPropagation();
                getEmployeeOffdayHistory(
                  record?.employeeId,
                  setLoading,
                  setOffDayHistory
                );
                !loading && setAnchorEl2(e.currentTarget);
                setSingleData([record]);
              }}
            />
          )}
        </div>
      ),
    },

    {
      title: "Action",
      width: 100,
      className: "text-center",
      render: (_: any, record: any) => (
        <>
          {record?.offDay ? (
            <TableButton
              buttonsList={[
                {
                  type: "edit",
                  onClick: () => {
                    if (!employeeFeature?.isCreate)
                      return toast.warn("You don't have permission");
                    if (!employeeFeature?.isCreate)
                      return toast.warn("You don't have permission");
                    setSingleData([record]);
                    setOpen(true);

                    // rowDtoHandler(record);
                    setIsAssignAll(false);
                  },
                },
              ]}
            />
          ) : (
            <div className="assign-btn">
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
            </div>
          )}
        </>
      ),
    },
  ];

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
            exportIcon={true}
            onExport={() => {
              const paylaod = {
                businessUnitId: buId,
                workplaceGroupId: wgId,
                isAssign: null,
                workplaceId: wId,
                pageNo: 1,
                pageSize: 10000000,
                isPaginated: false,
                isHeaderNeed: false,
                searchTxt: "",
                designationList: filterList?.designation || [],
                employmentTypeList: filterList?.employmentType || [],
                departmentList: filterList?.department || [],
                hrPositionList: filterList?.hrPosition || [],
                sectionList: filterList?.section || [],

                supervisorNameList: filterList?.supervisorName || [],
                wingNameList: [],
                soleDepoNameList: [],
                regionNameList: [],
                areaNameList: [],
                territoryNameList: [],
              };
              const url = "/PdfAndExcelReport/OffdayLandingFilter_RDLC";
              downloadEmployeeCardFile(
                url,
                paylaod,
                "Off Day List",
                "xlsx",
                setLoading
              );
            }}
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
                  setSingleData([]);

                  setEmpIDString(landingApi?.data?.employeeList);
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
            filterData={landingApi?.data?.offdayAssignHeader}
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
      {/* i button offday view */}
      {offDayHistory.length > 0 ? (
        <EmpOffDayDetails
          idHistory={id2}
          openHistory={open2}
          anchorElHistory={anchorEl2}
          setAnchorElHistory={setAnchorEl2}
          selectedSingleEmployee={singleData}
          setOffDayHistory={setOffDayHistory}
          offDayHistory={offDayHistory}
        />
      ) : (
        ""
      )}
      {calendarData.length > 0 ? (
        <EmpOffDayCalendarView
          id={id}
          open={openCalendar}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          selectedSingleEmployee={singleData}
          calendarData={calendarData}
          setCalendarData={setCalendarData}
        />
      ) : (
        ""
      )}
      {console.log({ erroModalOpen, errorData, errorPayload })}
      <OffDayErrorModal
        show={erroModalOpen}
        title={"⚠️Warning"}
        onHide={() => {
          setErroModalOpen(false);
        }}
        size="lg"
        backdrop="static"
        classes="default-modal"
        errorData={errorData}
        errorPayload={errorPayload}
        setErrorData={setErrorData}
        setErroModalOpen={setErroModalOpen}
        setErrorPayload={setErrorPayload}
        setLoading={setLoading}
        cb={() => {
          landingApiCall();
          setSelectedRow([]);
          setOpen(false);
        }}
        // resetForm={resetForm}
      />
      <PModal
        open={open}
        title={"Assign OffDay"}
        width=""
        onCancel={() => {
          setSingleData([]);
          setSelectedRow([]);
          setOpen(false);
        }}
        maskClosable={false}
        components={
          <AssignOffDay
            setIsAddEditForm={setOpen}
            getData={landingApiCall}
            empIDString={empIDString}
            setCheckedList={setSelectedRow}
            setisAssignAll={setIsAssignAll}
            checked={selectedRow}
            singleData={singleData}
            setSingleData={setSingleData}
            isAssignAll={isAssignAll}
            setErrorData={setErrorData}
            setErroModalOpen={setErroModalOpen}
            setErrorPayload={setErrorPayload}
          />
        }
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};
