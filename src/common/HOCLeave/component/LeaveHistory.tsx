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
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";

export const LeaveApp_History = ({
  empId,
  setLeaveHistoryData,
  leaveHistoryData,
  setIsEdit,
  setSingleData,
  setImageFile,
  allFormValues,
  isOfficeAdmin,
  landingData,
}: any) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  //   const permission = useMemo(
  //     () => permissionList?.find((item: any) => item?.menuReferenceId === 38),
  //     []
  //   );
  // menu permission
  //   const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  // const leaveTypeApi = useApiRequest({});
  const deleteApi = useApiRequest({});
  const detailsApi = useApiRequest({});
  const [open, setOpen] = useState(false);

  //   const debounce = useDebounce();

  // Form Instance
  const [form] = Form.useForm();

  // navTitle

  // useEffect(() => {
  //   getLeaveTypes();
  // }, []);

  // const getLeaveTypes = () => {
  //   leaveTypeApi?.action({
  //     urlKey: "PeopleDeskAllDDL",
  //     method: "GET",
  //     params: {
  //       DDLType: "LeaveType",
  //       BusinessUnitId: buId,
  //       intId: 0,
  //       WorkplaceGroupId: wgId,
  //     },
  //     onSuccess: (res) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.LeaveType;
  //         res[i].value = item?.LeaveTypeId;
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
    const ids = values?.leaveType?.map((i: any) => i?.value);
    const statusIds = values?.status?.map((i: any) => i?.value);
    landingApi.action({
      urlKey: "GetAllLeave",
      method: "post",
      payload: {
        employeeId: empId,
        fromDate: moment(values?.fromDate)?.format("YYYY-MM-DD"),
        toDate: moment(values?.toDate)?.format("YYYY-MM-DD"),
        leaveTypeList: ids || [],
        approvalStatusList: statusIds || [],
      },
      onSuccess: (res: any) => {
        setLeaveHistoryData(res);
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
      title: "Leave Type",
      dataIndex: "leaveType",
      width: 100,
    },
    {
      title: "Leave Duration",
      dataIndex: "duration",
      width: 100,
    },
    {
      title: "Total Leave Days",
      dataIndex: "totalLeaveDays",
      width: 100,
    },
    {
      title: "Location",
      dataIndex: "location",
      width: 100,
    },
    {
      title: "Leave Reliever",
      dataIndex: "leaveReliverName",
      width: 100,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      width: 100,
    },
    {
      title: "Attachment",
      dataIndex: "attachmentId",
      render: (_: any, item: any) => (
        <TableButton
          buttonsList={[
            item?.attachmentId && {
              type: "view",
              onClick: (e: any) => {
                dispatch(getDownlloadFileView_Action(item?.attachmentId));
              },
            },
          ]}
        />
      ),
    },
    {
      title: "Application Date",
      dataIndex: "applicationDate",
      width: 100,
    },
    {
      title: "Status",
      width: 100,

      dataIndex: "status",
      render: (_: any, rec: any, index: number) => {
        return (
          <>
            {rec?.approvalStatus === "Approved" ? (
              <Tag color="green">{rec?.approvalStatus}</Tag>
            ) : rec?.approvalStatus === "Rejected" ? (
              <Tag color="red">{rec?.approvalStatus}</Tag>
            ) : (
              <Tag color="gold">{rec?.approvalStatus}</Tag>
            )}
          </>
        );
      },
    },

    {
      title: "",
      width: 50,

      align: "center",
      render: (_: any, item: any) => (
        <TableButton
          buttonsList={[
            item?.approvalStatus === "Pending" &&
              // item?.leaveId !== 5 &&
              ({
                type: "edit",
                onClick: (e: any) => {
                  setIsEdit(true);
                  e.stopPropagation();
                  setSingleData(item);
                  setImageFile({
                    globalFileUrlId: item?.attachmentId,
                  });
                },
              } as any),
            isOfficeAdmin &&
              item?.approvalStatus === "Approved" &&
              // item?.leaveId !== 5 &&
              ({
                type: "edit",
                onClick: (e: any) => {
                  setIsEdit(true);
                  e.stopPropagation();
                  setSingleData(item);
                  setImageFile({
                    globalFileUrlId: item?.attachmentId,
                  });
                },
              } as any),

            item?.approvalStatus === "Pending" &&
              // item?.leaveId !== 5 &&
              ({
                type: "delete",
                onClick: () => {
                  deleteLeaveById(item);
                },
              } as any),
            isOfficeAdmin &&
              item?.approvalStatus === "Approved" &&
              // item?.leaveId !== 5 &&
              ({
                type: "delete",
                onClick: () => {
                  deleteLeaveById(item);
                },
              } as any),
          ]}
        />
      ),
    },
  ];

  const deleteLeaveById = (item: any) => {
    deleteApi?.action({
      urlKey: "DeleteLeave",
      method: "DELETE",
      params: {
        applicationId: item?.leaveApplicationId,
      },
      toast: true,
      onSuccess: (res) => {
        toast?.success(res?.message?.[0]);
        landingData();
      },

      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message[0] ||
            error?.response?.data?.message ||
            error?.response?.data?.errors?.["GeneralPayload.Description"][0] ||
            error?.response?.data?.Message ||
            error?.response?.data?.title ||
            error?.response?.title ||
            error?.response?.message ||
            error?.response?.Message
        );
      },
    });
  };
  return (
    <>
      <PForm
        form={form}
        initialValues={{
          fromDate: moment().startOf("year"),
          toDate: moment().endOf("year"),
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
                    leaveHistoryData?.leaveTypeList?.length > 0
                      ? // { value: 0, label: "All" },
                        leaveHistoryData?.leaveTypeList
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
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Leave Type is required",
                  //   },
                  // ]}
                />
              </Col>
              <Col md={5} sm={24}>
                <PSelect
                  mode="multiple"
                  options={
                    leaveHistoryData?.approvalStatusList?.length > 0
                      ? // { value: 0, label: "All" },
                        leaveHistoryData?.approvalStatusList
                      : []
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
                data={
                  leaveHistoryData.employeeLeaveApplicationListDto?.length > 0
                    ? leaveHistoryData?.employeeLeaveApplicationListDto
                    : []
                }
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
