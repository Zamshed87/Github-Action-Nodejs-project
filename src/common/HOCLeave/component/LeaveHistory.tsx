/* eslint-disable @typescript-eslint/no-empty-function */
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
  TableButton,
} from "Components";
import type { RangePickerProps } from "antd/es/date-picker";

import { useApiRequest } from "Hooks";
import { Col, Form, Row, Switch, Tag } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";
import moment from "moment";
import { downloadFile } from "utility/downloadFile";
import { PModal } from "Components/Modal";

export const LeaveApp_History = ({
  empId,
  setLeaveHistoryData,
  leaveHistoryData,
}: any) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    permissionList,
    profileData: { buId, wId, orgId, wgId },
  } = useSelector((state: any) => state?.auth, shallowEqual);
  const [loading, setLoading] = useState(false);

  //   const permission = useMemo(
  //     () => permissionList?.find((item: any) => item?.menuReferenceId === 38),
  //     []
  //   );
  // menu permission
  //   const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  const leaveTypeApi = useApiRequest({});
  const deleteApi = useApiRequest({});
  const detailsApi = useApiRequest({});
  const [open, setOpen] = useState(false);

  //   const debounce = useDebounce();

  // Form Instance
  const [form] = Form.useForm();

  // navTitle

  useEffect(() => {
    getLeaveTypes();
  }, []);

  const getLeaveTypes = () => {
    leaveTypeApi?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "LeaveType",
        BusinessUnitId: buId,
        intId: 0,
        WorkplaceGroupId: wgId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.LeaveType;
          res[i].value = item?.LeaveTypeId;
        });
      },
    });
  };
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
    const ids = values?.leaveType?.map((i: any) => i?.value);
    const statusIds = values?.leaveType?.map((i: any) => i?.value);
    landingApi.action({
      urlKey: "GetAllLeave",
      method: "post",
      payload: {
        employeeId: empId,
        fromDate: moment(values?.fromDate)?.format(
          "YYYY-MM-DDTHH:mm:ss.SSSSSS"
        ),
        toDate: moment(values?.toDate)?.format("YYYY-MM-DDTHH:mm:ss.SSSSSS"),
        leaveTypeList: [],
        approvalStatusList: [],
      },
      onSuccess: (res) => {
        // res.forEach((item, idx) => {
        //   res[idx].value = item?.id;
        //   res[idx].label = item?.name;
        //   res[idx].assingendConsumeTypeList?.forEach((it, i) => {
        //     res[idx].assingendConsumeTypeList[i].value = it?.id;
        //     res[idx].assingendConsumeTypeList[i].label = it?.name;
        //   });
        // });
        setLeaveHistoryData(res);
      },
    });
  };

  //  Delete Element
  //   const deleteProposalById = (item: any) => {
  //     deleteProposal?.action({
  //       urlKey: "DeleteIncrementProposal",
  //       method: "DELETE",
  //       params: {
  //         Id: item?.id,
  //       },
  //       toast: true,
  //       onSuccess: () => {
  //         setSelectedRow([]);

  //         landingApiCall();
  //       },
  //     });
  //   };
  const header: any = [
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },

    {
      title: "Leave Type",
      dataIndex: "leaveType",
      width: 100,
    },
    {
      title: "Leave Duration",
      dataIndex: "policyName",
      width: 100,
    },
    {
      title: "Total Leave Days",
      dataIndex: "policyDisplayName",
      width: 100,
    },
    {
      title: "Location",
      dataIndex: "policyDisplayCode",
      width: 100,
    },
    {
      title: "Leave Reliever",
      dataIndex: "policyDisplayCode",
      width: 100,
    },
    {
      title: "Reason",
      dataIndex: "policyDisplayCode",
      width: 100,
    },
    {
      title: "Attachment",
      dataIndex: "policyDisplayCode",
      width: 100,
    },
    {
      title: "Application Date",
      dataIndex: "policyDisplayCode",
      width: 100,
    },
    {
      title: "Status",
      width: 100,

      dataIndex: "status",
      render: (_: any, rec: any, index: number) => {
        return (
          <div>
            {/* {rec?.status === "Active" ? (
                <Tag color="green">{rec?.status}</Tag>
              ) : rec?.status === "Inactive" ? (
                <Tag color="red">{rec?.status}</Tag>
              ) : (
                <Tag color="gold">{rec?.status}</Tag>
              )} */}
            <p className="">
              <Switch
                checked={rec?.status === "Active"}
                onChange={(checked) => {
                  const newStatus = checked ? "Active" : "Inactive";
                  landingApi?.data?.data?.forEach((i: any, id: any) => {
                    if (id == index) {
                      landingApi.data.data[id].status = "Inactive";
                    }
                  });
                  // Update your data source here
                  // Example (replace with your actual data update logic):
                  // dataSource[index].status = newStatus;
                  // setDataSource([...dataSource]);
                }}
              />
            </p>
          </div>
        );
      },
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
                if (true) {
                  return toast.warn("You don't have permission");
                  e.stopPropagation();
                }
                history.push(
                  `/administration/leaveandmovement/yearlyLeavePolicy/view/${item?.policyId}`
                );
              },
            },
            {
              type: "extend",
              onClick: (e: any) => {
                // if (!employeeFeature?.isEdit) {
                //   return toast.warn("You don't have permission");
                // }
                // history.push({
                //   pathname: `/compensationAndBenefits/securityDeposit/edit/${item?.depositTypeId}`,
                //   state: {
                //     month: item?.monthId,
                //     year: item?.yearId,
                //   },
                // });
                //   setOpen(true);
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

  //   const deleteDepositById = (item: any) => {
  //     deleteApi?.action({
  //       urlKey: "Deposit",
  //       method: "DELETE",
  //       params: {
  //         id: item?.id,
  //       },
  //       toast: true,
  //       onSuccess: () => {
  //         detailsApi?.action({
  //           urlKey: "DepositDetails",
  //           method: "GET",
  //           params: {
  //             month: typeId?.month,
  //             year: typeId?.year,
  //             depositType: typeId?.id,
  //           },
  //         });
  //       },
  //     });
  //   };
  return (
    <>
      <PForm
        form={form}
        initialValues={{
          // employee: { value: employeeId, label: userName },
          leaveType: [{ value: 0, label: "All" }],
          status: { value: 2, label: "All" },
        }}
      >
        <PCard>
          <PCardHeader title={`Leave History`} />
          {loading && <Loading />}
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={4} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="fromDate"
                  label="From Date"
                  placeholder=""
                  rules={[
                    {
                      required: true,
                      message: "From Date is required",
                    },
                  ]}
                  onChange={(date) => {
                    form.setFieldsValue({
                      fromDate: date,
                      toDate: date,
                    });
                  }}
                />
              </Col>
              <Col md={4} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="toDate"
                  label="To Date"
                  placeholder=""
                  rules={[
                    {
                      required: true,
                      message: "To Date is required",
                    },
                  ]}
                  onChange={(date) => {
                    form.setFieldsValue({
                      toDate: date,
                    });
                  }}
                />
              </Col>
              <Col md={5} sm={24}>
                <PSelect
                  mode="multiple"
                  options={
                    leaveTypeApi?.data?.length > 0
                      ? [{ value: 0, label: "All" }, ...leaveTypeApi?.data]
                      : []
                  }
                  name="leaveType"
                  label=" Leave Type"
                  placeholder="  Leave Type"
                  onChange={(value, op) => {
                    if (value && value.includes(0)) {
                      // If "All" (value 0) is selected, clear other selections and set only "All"
                      form.setFieldsValue({
                        leaveType: [op.find((item: any) => item.value === 0)],
                      });
                    } else {
                      // If "All" is deselected or other options are selected, filter out "All"
                      const filteredOp = op.filter(
                        (item: any) => item.value !== 0
                      );
                      form.setFieldsValue({
                        leaveType: filteredOp,
                      });
                    }

                    // value && getWorkplace();
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Leave Type is required",
                    },
                  ]}
                />
              </Col>
              <Col md={5} sm={24}>
                <PSelect
                  //   mode="multiple"
                  options={
                    [
                      // { value: 2, label: "All" },
                      // { value: 1, label: "Active" },
                      // { value: 0, label: "Inactive" },
                    ]
                  }
                  name="status"
                  label="Status"
                  placeholder="status"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      status: op,
                    });

                    // value && getWorkplace();
                  }}
                />
              </Col>
              <Col
                style={{
                  marginTop: "23px",
                }}
              >
                <PButton
                  type="primary"
                  action="button"
                  content="View"
                  onClick={() => {
                    landingApiCall();
                  }}
                />
              </Col>
            </Row>
          </PCardBody>
          <Row gutter={[10, 2]}>
            <Col lg={23} className="mx-2">
              <DataTable
                bordered
                data={leaveHistoryData.length > 0 ? leaveHistoryData : []}
                loading={landingApi?.loading}
                header={header}
                scroll={{ x: 1000 }}
              />
            </Col>
          </Row>
        </PCard>
        <PModal
          open={open}
          title={"Leave Details"}
          width=""
          onCancel={() => setOpen(false)}
          maskClosable={false}
          components={
            <>
              {/* <DataTable
                  bordered
                  data={
                    detailsApi?.data?.data?.length > 0
                      ? detailsApi?.data.data
                      : []
                  }
                  loading={detailsApi?.loading}
                  header={detailsHeader}
                /> */}
            </>
          }
        />
      </PForm>
    </>
  );
};
