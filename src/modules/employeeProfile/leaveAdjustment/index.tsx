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
import { AdjustmentCrud } from "./AdjustmentCrud";

export const LeaveAdjustment = () => {
  const { wId, employeeId, wgId, permissionList } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const dispatch = useDispatch();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [singleData, setSingleData] = useState(false);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 38),
    []
  );
  //   menu permission
  const employeeFeature: any = permission;

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
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    const { fromDate } = form.getFieldsValue(true);
    const fromDateMoment = moment(fromDate, "MM/DD/YYYY");
    // Disable dates before fromDate and after next3daysForEmp
    return current && current < fromDateMoment.startOf("day");
  };

  const landingApiCall = () => {
    const values = form.getFieldsValue(true);
    const ids = values?.leaveType?.map((i: any) => i?.value);
    const statusIds = values?.status?.map((i: any) => i?.value);
    landingApi.action({
      urlKey: "LeaveAdjustmentLanding",
      method: "get",
      params: {
        FromDate: moment(values?.fromDate)?.format("YYYY-MM-DD"),
        ToDate: moment(values?.toDate)?.format("YYYY-MM-DD"),
        Workplace: wId,
      },
      onSuccess: (res: any) => {},
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
      title: "Beneficiary Type",
      dataIndex: "leaveAdjustmentBeneficial",
      width: 100,
    },
    {
      title: "From Beneficiary Name",
      dataIndex: "fromBeneficiaryName",
      width: 100,
    },
    {
      title: "To Beneficiary Name",
      dataIndex: "toBeneficiaryName",
      width: 100,
    },
    {
      title: "Total Leave Adjust",
      dataIndex: "totalLeaveAdjustmenBalance",
      width: 100,
    },

    {
      title: "Action",
      width: 50,

      align: "center",
      render: (_: any, item: any) => (
        <div className="d-flex justify-content-around">
          <TableButton
            buttonsList={[
              {
                type: "edit",
                onClick: (e: any) => {
                  setIsEdit(true);
                  setOpen(true);
                  e.stopPropagation();
                  setSingleData(item);
                },
              },

              {
                type: "delete",
                onClick: () => {
                  deleteLeaveById(item);
                },
              },
            ]}
          />
          <PButton
            type="primary"
            action="button"
            content="Complete"
            onClick={() => {
              //   generateApi?.action({
              //     urlKey: "BalanceGenerate",
              //     method: "post",
              //     payload: {
              //       businessUnitId: buId,
              //       workplaceGroupId: wgId,
              //       policyId: item?.policyId,
              //       createdBy: employeeId,
              //     },
              //     toast: true,
              //     onSuccess: (res) => {
              //       landingApiCall();
              //       toast.success(res?.message[0]);
              //     },
              //     onError: (error: any) => {
              //       if (
              //         error?.response?.data?.errors?.[
              //           "GeneralPayload.Description"
              //         ]?.length > 1
              //       ) {
              //         //  setErrorData(
              //         //    error?.response?.data?.errors?.["GeneralPayload.Description"]
              //         //  );
              //         //  setOpen(true);
              //       } else {
              //         toast.error(
              //           error?.response?.data?.message?.[0] ||
              //             error?.response?.data?.message ||
              //             error?.response?.data?.errors?.[
              //               "GeneralPayload.Description"
              //             ]?.[0] ||
              //             error?.response?.data?.Message ||
              //             error?.response?.data?.title ||
              //             error?.response?.title ||
              //             error?.response?.message ||
              //             error?.response?.Message ||
              //             "Something went wrong"
              //         );
              //       }
              //     },
              //   });
            }}
          />
        </div>
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
        // landingData();
      },

      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message?.[0] ||
            error?.response?.data?.message ||
            error?.response?.data?.errors?.[
              "GeneralPayload.Description"
            ]?.[0] ||
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
          fromDate: moment(todayDate()),
          toDate: moment(todayDate()),
        }}
      >
        <PCard>
          <PCardHeader
            title={`Leave Adjustment`}
            buttonList={[
              {
                type: "primary",
                content: "Create",
                icon: "plus",
                onClick: () => {
                  //   if (employeeFeature?.isCreate) {
                  setOpen(true);
                  //   } else {
                  //     toast.warn("You don't have permission");
                  //   }
                },
              },
            ]}
          />
          {loading && <Loading />}
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={4} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="fromDate"
                  label="From Date"
                  placeholder=""
                  //   rules={[
                  //     {
                  //       required: true,
                  //       message: "From Date is required",
                  //     },
                  //   ]}
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
                  disabledDate={disabledDate}
                  //   rules={[
                  //     {
                  //       required: true,
                  //       message: "To Date is required",
                  //     },
                  //   ]}
                  onChange={(date) => {
                    form.setFieldsValue({
                      toDate: date,
                    });
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
          <DataTable
            bordered
            data={
              landingApi?.data?.data?.length > 0 ? landingApi?.data?.data : []
            }
            loading={landingApi?.loading}
            header={header}
            // scroll={{ x: 1000 }}
          />
        </PCard>
        <PModal
          open={open}
          title={isEdit ? `Edit Adjustment` : `Create Adjustment`}
          width=""
          onCancel={() => setOpen(false)}
          maskClosable={false}
          components={
            <>
              <AdjustmentCrud
                singleData={singleData}
                setSingleData={setSingleData}
                setOpen={setOpen}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                landingApiCall={landingApiCall}
              />
            </>
          }
        />
      </PForm>
    </>
  );
};
