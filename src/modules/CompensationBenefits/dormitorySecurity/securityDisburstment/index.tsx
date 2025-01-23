/* eslint-disable @typescript-eslint/no-empty-function */
import {
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
  TableButton,
} from "Components";

import { useApiRequest } from "Hooks";
import { Col, Form, Row, Tag } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";
import moment from "moment";
import { ModalFooter, PModal } from "Components/Modal";
import CommonEmpInfo from "common/CommonEmpInfo";

export const SecurityDisbursementLanding = () => {
  const dispatch = useDispatch();

  const {
    permissionList,
    profileData: { buId, employeeId, orgId, wgId, wId, buName },
  } = useSelector((state: any) => state?.auth, shallowEqual);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState<any[]>([]);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 8),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  const empDepartmentDDL = useApiRequest({});
  const disbursementApi = useApiRequest({});
  const deleteApi = useApiRequest({});

  const CommonEmployeeDDL = useApiRequest([]);

  const getEmployee = (value: any = "") => {
    // if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };
  const saveDisbursement = () => {
    // if (value?.length < 2) return CommonEmployeeDDL?.reset();

    disbursementApi?.action({
      urlKey: "DepositDisbursement",
      method: "post",
      payload: {
        employeeId: modalData[0]?.employeeId,
        disbursementAmount: modalData[0]?.money,
        disbursementDate: moment(modalData[0]?.date).format("YYYY-MM-DD"),
        comment: modalData[0]?.remarks,
      },
      toast: true,
      onSuccess: () => {
        setOpen(false);
        setModalData([]);
        landingApiCall();
      },
    });
  };
  const getEmployeDepartment = () => {
    // const { workplaceGroup, workplace } = form.getFieldsValue(true);

    empDepartmentDDL?.action({
      urlKey: "DepartmentByAccount",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: wId,

        accountId: orgId,
      },
      onSuccess: (res: any) => {
        res?.data?.forEach((item: any, i: any) => {
          res.data[i].label = item?.strDepartment;
          res.data[i].value = item?.intDepartmentId;
        });
      },
    });
  };
  //   const debounce = useDebounce();

  //   const options: any = [
  //     { value: "", label: "All" },
  //     { value: true, label: "Assigned" },
  //     { value: false, label: "Not-Assigned" },
  //   ];
  // Form Instance
  const [form] = Form.useForm();
  //   api states
  // const workplaceGroup = useApiRequest([]);
  // const workplace = useApiRequest([]);
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Security Disbursement ";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  // workplace wise
  // const getWorkplaceGroup = () => {
  //   workplaceGroup?.action({
  //     urlKey: "WorkplaceGroupWithRoleExtension",
  //     method: "GET",
  //     params: {
  //       accountId: orgId,
  //       businessUnitId: buId,
  //       workplaceGroupId: wgId,
  //       empId: employeeId,
  //     },
  //     onSuccess: (res) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.strWorkplaceGroup;
  //         res[i].value = item?.intWorkplaceGroupId;
  //       });
  //     },
  //   });
  // };

  // const getWorkplace = () => {
  //   const { workplaceGroup } = form.getFieldsValue(true);
  //   workplace?.action({
  //     urlKey: "WorkplaceWithRoleExtension",
  //     method: "GET",
  //     params: {
  //       accountId: orgId,
  //       businessUnitId: buId,
  //       workplaceGroupId: workplaceGroup?.value,
  //       empId: employeeId,
  //     },
  //     onSuccess: (res: any) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.strWorkplace;
  //         res[i].value = item?.intWorkplaceId;
  //       });
  //     },
  //   });
  // };

  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filerList?: any;
    searchText?: string;
    excelDownload?: boolean;
    IsForXl?: boolean;
    date?: string;
  };
  const landingApiCall = ({
    pagination = { current: 1, pageSize: paginationSize },
    searchText = "",
  }: TLandingApi = {}) => {
    const values = form.getFieldsValue(true);

    landingApi.action({
      urlKey: "DepositMasterReport",
      method: "GET",
      params: {
        departmentId: values?.department?.value || 0,
      },
    });
  };

  const deleteDepositById = (item: any) => {
    deleteApi?.action({
      urlKey: "DepositDisbursement",
      method: "DELETE",
      params: {
        id: item?.id,
      },
      toast: true,
      onSuccess: () => {
        landingApiCall();
      },
    });
  };
  const header: any = [
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },
    {
      title: "Employee Code",
      dataIndex: "employeeCode",
      width: 100,
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      width: 100,
    },
    {
      title: "Designation",
      dataIndex: "designation",
      width: 100,
    },
    {
      title: "Department",
      dataIndex: "department",
      width: 100,
    },
    // {
    //   title: "Deposits Month Year",
    //   dataIndex: "joiningDate",
    //   render: (data: any) => (data ? dateFormatter(data) : "-"),
    //   width: 100,
    // },

    {
      title: "Total Deposits Money",
      dataIndex: "totalDepositsMoney",
      width: 100,
    },

    {
      title: "",
      width: 30,

      align: "center",
      render: (_: any, item: any) => (
        <TableButton
          buttonsList={[
            {
              type: "view",
              onClick: (e: any) => {
                if (!employeeFeature?.isEdit) {
                  return toast.warn("You don't have permission");
                  e.stopPropagation();
                }
                //   setOpen(true);
                //   setId(rec);
              },
            },
            {
              type: "disbursement",
              onClick: (e: any) => {
                // if (!employeeFeature?.isEdit) {
                //   return toast.warn("You don't have permission");
                //   e.stopPropagation();
                // }
                setModalData([
                  {
                    ...item,
                    date: moment(todayDate()),
                    money: item?.TotalDepositsMoney,
                    totalDepositsMoney: item?.TotalDepositsMoney,
                    remarks: "",
                  },
                ]);
                setOpen(true);
                //   setId(rec);
              },
            },
            {
              type: "delete",
              onClick: () => {
                deleteDepositById(item);
              },
            },
          ]}
        />
      ),
    },
  ];
  const disburseHeader: any = [
    //  Custom Input Columns
    {
      title: "Disbursement Date",
      width: 150,

      render: (_value: any, row: any, index: number) => (
        <PInput
          type="date"
          value={row?.date}
          onChange={(value) => {
            form.setFieldsValue({
              toDate: value,
            });
            const temp = [...modalData];
            temp[index].date = moment(value).format("YYYY-MM-DD");
            setModalData(temp);
          }}
        />
      ),
    },
    {
      title: "Total Deposits Money",
      dataIndex: "totalDepositsMoney",
      width: 100,
    },
    {
      title: "Disbursement Amount",
      width: 150,

      render: (_value: any, row: any, index: number) => (
        <PInput
          type="number"
          value={+row?.money || 0}
          placeholder="Decimal Number"
          onChange={(e) => {
            if ((e as number) < 0) {
              return toast.warn("number must be positive");
            }

            const temp = [...modalData];
            temp[index].money = e;

            setModalData(temp);
          }}
        />
      ),
    },
    {
      title: "Comment",
      width: 150,

      render: (_value: any, row: any, index: number) => (
        <PInput
          type="text"
          value={row?.remarks}
          placeholder="Textbox"
          onChange={(e) => {
            console.log(e.target?.value);
            const temp = [...modalData];
            temp[index].remarks = e.target?.value;
            setModalData(temp);
          }}
        />
      ),
    },

    {
      title: "",
      width: 30,

      align: "center",
      render: (_: any, item: any) => (
        <TableButton
          buttonsList={
            [
              // {
              //   type: "delete",
              //   onClick: () => {
              //     deleteProposalById(item);
              //   },
              // },
            ]
          }
        />
      ),
    },
  ];
  // const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  //   const { fromDate } = form.getFieldsValue(true);
  //   const fromDateMoment = moment(fromDate, "MM/DD/YYYY");
  //   // Disable dates before fromDate and after next3daysForEmp
  //   return current && current < fromDateMoment.startOf("day");
  // };

  const onFinish = () => {
    landingApiCall();
  };
  useEffect(() => {
    getEmployee();
    getEmployeDepartment();
  }, [wId, wgId]);

  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{
          // employee: { value: employeeId, label: userName },
          fromDate: moment(todayDate()),
          toDate: moment(todayDate()),
        }}
        onFinish={onFinish}
      >
        <PCard>
          <PCardHeader
            title={`Total ${landingApi?.data?.length || 0} employees`}
          />
          {loading && <Loading />}
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={6} sm={24}>
                <PSelect
                  allowClear
                  showSearch
                  options={
                    empDepartmentDDL?.data?.data?.length > 0
                      ? empDepartmentDDL?.data.data
                      : []
                  }
                  name="department"
                  label="Department"
                  placeholder=""
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      department: op,
                    });
                  }}
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Year is required",
                  //   },
                  // ]}
                />
              </Col>
              <Col md={5} sm={12} xs={24}>
                <PSelect
                  allowClear
                  showSearch
                  name="employee"
                  label="Employee"
                  placeholder="Search Min 2 char"
                  options={CommonEmployeeDDL?.data || []}
                  loading={CommonEmployeeDDL?.loading}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      employee: op,
                    });
                    // empBasicInfo(buId, orgId, value, setEmpInfo);
                  }}
                  // onSearch={(value) => {
                  //   getEmployee(value);
                  // }}

                  // filterOption={false}
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Employee is required",
                  //   },
                  // ]}
                />
              </Col>

              {/* <Col md={5} sm={12} xs={24}>
                  <PSelect
                    options={workplaceGroup?.data || []}
                    name="workplaceGroup"
                    label="Workplace Group"
                    placeholder="Workplace Group"
                    disabled={+id ? true : false}
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        workplaceGroup: op,
                        workplace: undefined,
                      });
                      getWorkplace();
                    }}
                    rules={
                      [
                        //   { required: true, message: "Workplace Group is required" },
                      ]
                    }
                  />
                </Col>
                <Col md={5} sm={12} xs={24}>
                  <PSelect
                    options={workplace?.data || []}
                    name="workplace"
                    label="Workplace"
                    placeholder="Workplace"
                    disabled={+id ? true : false}
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        workplace: op,
                      });
                      getWorkplaceDetails(value, setBuDetails);
                    }}
                    // rules={[{ required: true, message: "Workplace is required" }]}
                  />
                </Col> */}

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
            data={
              landingApi?.data?.data?.length > 0 ? landingApi?.data?.data : []
            }
            loading={landingApi?.loading}
            header={header}
            // pagination={{
            //   pageSize: landingApi?.data?.pageSize,
            //   total: landingApi?.data?.totalCount,
            // }}
            // onChange={(pagination, filters, sorter, extra) => {
            //   // Return if sort function is called
            //   if (extra.action === "sort") return;
            //   setFilterList(filters);

            //   landingApiCall({
            //     pagination,
            //   });
            // }}
            // scroll={{ x: 1500 }}
          />
        </PCard>
        <PModal
          width={900}
          open={open}
          onCancel={() => setOpen(false)}
          title={`Disbursement`}
          components={
            <>
              <PCardBody className="my-2">
                <CommonEmpInfo
                  employeeName={modalData[0]?.employeeName}
                  designationName={modalData[0]?.designation}
                  departmentName={modalData[0]?.department}
                />
              </PCardBody>
              <DataTable
                header={disburseHeader}
                bordered
                data={modalData || []}
              />
              <ModalFooter
                submitText={`Save`}
                submitAction="button"
                cancelText={false}
                onSubmit={() => {
                  if (!Boolean(modalData[0]?.date)) {
                    toast.error("Date is Required");
                  }
                  if (!Boolean(modalData[0]?.money)) {
                    toast.error("Disbursement Amount is Required");
                  }
                  saveDisbursement();
                }}
              />
            </>
          }
        />
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};
