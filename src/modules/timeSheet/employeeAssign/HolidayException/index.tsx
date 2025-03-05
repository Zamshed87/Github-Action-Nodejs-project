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
import { dateFormatter, dateFormatterForInput } from "utility/dateFormatter";
import { getSerial } from "Utils";
import { InfoOutlined } from "@mui/icons-material";

import { toast } from "react-toastify";
import { LightTooltip } from "common/LightTooltip";
import { AssignModal } from "./components/AssignHolidayModal";
// import AddEditForm from "./component";

export const HolidayAssignPage = () => {
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
    if (item?.menuReferenceId === 43) {
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
      departmentList: filerList?.department || [],
      hrPositionList: filerList?.hrPosition || [],
      sectionList: filerList?.section || [],

      supervisorNameList: filerList?.supervisorName || [],
      //   wingNameList: [],
      //   soleDepoNameList: [],
      //   regionNameList: [],
      //   areaNameList: [],
      //   territoryNameList: [],
      //   employmentTypeList: [],
      //   sectionList: [],
      //   hrPositionList: [],
    };
    landingApi.action({
      urlKey: "HolidayNExceptionFilter",
      method: "POST",
      payload: payload,
      onSuccess: (res: any) => {
        setEmpIDString(res?.employeeList);
      },
    });
  };
  // useEffects
  // sidebar
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Holiday Assign";
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
      title: "Supervisor",
      dataIndex: "supervisorName",
      sorter: true,
      filter: true,
      filterKey: "supervisorNameList",
      filterSearch: true,
      width: 95,
    },

    {
      title: "Holiday Group",
      width: 90,

      render: (_: any, record: any) => (
        <div className="d-flex align-items-center">
          {record?.holidayGroupName && (
            <LightTooltip
              title={
                <div className="holiday-exception-tooltip tableOne">
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th style={{ width: "50%" }}>Holiday Group</th>
                        <th style={{ width: "50%" }} className="text-center">
                          Effective Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <span className="">{record?.holidayGroupName}</span>
                        </td>
                        <td className="text-center">
                          <span className="">
                            {record?.holidayEffectiveDate &&
                              dateFormatterForInput(
                                record?.holidayEffectiveDate
                              )}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              }
              arrow
            >
              <InfoOutlined
                sx={{
                  fontSize: 15,
                }}
              />
            </LightTooltip>
          )}
          <div className="pl-2">{record?.holidayGroupName}</div>
        </div>
      ),
    },
    {
      title: "Action",
      width: 100,
      className: "text-center",
      render: (_: any, record: any) => (
        <>
          <>
            {(record?.holidayGroupId || record?.exceptionOffdayGroupId) && (
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
            )}
          </>
          <>
            {!(record?.holidayGroupId || record?.exceptionOffdayGroupId) && (
              <div className="assign-btn">
                {/* <button
                  style={{
                    marginRight: "25px",
                    height: "24px",
                    fontSize: "12px",
                    padding: "0px 12px 0px 12px",
                  }}
                  type="button"
                  disabled={record?.isSelected}
                  className="btn btn-default"
                  onClick={(e) => {
                    if (!permission?.isCreate)
                      return toast.warn("You don't have permission");
                    if (!permission?.isCreate)
                      return toast.warn("You don't have permission");
                    setSingleData([record]);
                    setShow(true);
                    setIsMulti(false);
                  }}
                >
                  Assign
                </button> */}
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
              allowClear
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
            filterData={landingApi?.data?.holidayAssignHeader}
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

      <PModal
        open={open}
        title={"Assign Holiday"}
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
