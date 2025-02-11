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
import { Col, Form, Row } from "antd";
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
    profileData: { buId, orgId, wgId, wId },
  } = useSelector((state: any) => state?.auth, shallowEqual);
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(false);
  const [modalData, setModalData] = useState<any[]>([]);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30532),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  const empDepartmentDDL = useApiRequest({});
  const disbursementApi = useApiRequest({});
  const deleteApi = useApiRequest({});
  const detailsApi = useApiRequest({});

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
      urlKey: "DepartmentIdAll",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: wId,

        accountId: orgId,
      },
      onSuccess: (res: any) => {
        res?.forEach((item: any, i: any) => {
          res[i].label = item?.strDepartment;
          res[i].value = item?.intDepartmentId;
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
    document.title = "Security Disbursement";
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
        strSearch: values?.employee?.employeeCode || "",
        // deposittypeId: 0,
      },
    });
  };

  // const deleteDepositById = (item: any) => {
  //   deleteApi?.action({
  //     urlKey: "DepositDisbursement",
  //     method: "DELETE",
  //     params: {
  //       id: item?.id,
  //     },
  //     toast: true,
  //     onSuccess: () => {
  //       landingApiCall();
  //     },
  //   });
  // };
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
      dataIndex: "totalBalance",
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
                detailsApi?.action({
                  urlKey: "DepositDetailReportByEmployee",
                  method: "GET",
                  params: {
                    employeeId: item?.employeeId,
                  },
                  onSuccess: (res: any) => {
                    res?.data?.forEach((row: any, index: any) => {
                      if (row?.type === "Deposit") {
                        res?.data?.splice(index, 1);
                      }
                    });
                    setModalData([item]);
                    setView(true);
                  },
                });
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
                    money: item?.totalBalance,
                    totalDepositsMoney: item?.totalDepositsMoney,
                    remarks: "",
                  },
                ]);
                setOpen(true);
                //   setId(rec);
              },
            },
            // {
            //   type: "delete",
            //   onClick: () => {
            //     deleteDepositById(item);
            //   },
            // },
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
            temp[index].date = moment(value);
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
  const detailsHeader: any = [
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },

    {
      title: "Type",
      dataIndex: "type",
      width: 100,
    },

    {
      title: "Deposits Time",
      render: (_: any, data: any) =>
        data?.type === "Deposit"
          ? moment(data?.executionTime).format("MMM-YYYY")
          : moment(data?.executionTime).format("ll"),
      width: 100,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 100,
    },
    {
      title: "Comments",
      dataIndex: "comments",
      width: 100,
    },

    // {
    //   title: "",
    //   width: 30,

    //   align: "center",
    //   render: (_: any, item: any) => (
    //     <TableButton
    //       buttonsList={
    //         [
    //           // {
    //           //   type: "delete",
    //           //   onClick: () => {
    //           //     deleteProposalById(item);
    //           //   },
    //           // },
    //         ]
    //       }
    //     />
    //   ),
    // },
  ];

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
            title={`Total ${landingApi?.data?.data?.length || 0} employees`}
          />
          {loading && <Loading />}
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={6} sm={24}>
                <PSelect
                  allowClear
                  showSearch
                  options={
                    empDepartmentDDL?.data?.length > 0
                      ? empDepartmentDDL?.data
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
            data={
              landingApi?.data?.data?.length > 0 ? landingApi?.data?.data : []
            }
            loading={landingApi?.loading}
            header={header}
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
        <PModal
          width={900}
          open={view}
          onCancel={() => setView(false)}
          title={`Disbursement Details`}
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
                header={detailsHeader}
                bordered
                data={
                  detailsApi?.data?.data?.length > 0
                    ? detailsApi?.data?.data
                    : []
                }
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
