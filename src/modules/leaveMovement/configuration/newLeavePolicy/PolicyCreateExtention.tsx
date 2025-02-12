import { Col, Divider, Form, Row, Tag } from "antd";
import { getWorkplaceDDL } from "common/api/commonApi";
import Loading from "common/loading/Loading";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
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
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { orgIdsForBn } from "utility/orgForBanglaField";
import { todayDate } from "utility/todayDate";
import ReactQuill from "react-quill";
import FileUploadComponents from "utility/Upload/FileUploadComponents";
const SandwitchData = [
  {
    index: 0,
    scenario: "Leave + Offday + Leave",
    count: 0,
  },
  {
    index: 1,

    scenario: "Leave + Holiday + Leave",
    count: 0,
  },
  {
    index: 2,

    scenario: "Leave + Offday + Holiday + Leave",
    count: 0,
  },
  {
    index: 3,

    scenario: "Offday + Leave + Offday",
    count: 0,
  },
  {
    index: 4,

    scenario: "Holiday + Leave + Holiday",
    count: 0,
  },
  {
    index: 5,

    scenario: "Offday + Leave + Holiday",
    count: 0,
  },

  {
    index: 6,

    scenario: "Holiday + Leave + Offday",
    count: 0,
  },
];
export const PolicyCreateExtention = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params: any = useParams();

  const {
    permissionList,
    profileData: { buId, employeeId, orgId, wgId },
  } = useSelector((state: any) => state?.auth, shallowEqual);
  // states
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [attachmentList, setAttachmentList] = useState([]);
  const [sandWitchLanding, setSandWitchLanding] =
    useState<any[]>(SandwitchData);
  const [tableData, setTableData] = useState<any>([]);

  const [selectedRow1, setSelectedRow1] = useState<any[]>([]);
  const [selectedRow2, setSelectedRow2] = useState<any[]>([]);

  // api
  const leaveTypeApi = useApiRequest({});
  const EmploymentTypeDDL = useApiRequest([]);
  const HRPositionDDL = useApiRequest([]);
  const workplaceDDL = useApiRequest([]);
  const empDesignationDDL = useApiRequest([]);
  const religionDDL = useApiRequest([]);

  const [form] = Form.useForm();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Leave Policy";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // ddls
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
  const getReligion = () => {
    religionDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Religion",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.ReligionName;
          res[i].value = item?.ReligionId;
        });
      },
    });
  };
  const getEmploymentType = () => {
    const { workplace } = form.getFieldsValue(true);
    // const strWorkplaceIdList = intWorkplaceList
    //   ?.map((item: any) => item.value)
    //   .join(",");

    EmploymentTypeDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmploymentTypeWorkplaceWise",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
        strWorkplaceIdList: workplace?.value,
      },
      onSuccess: (data) => {
        data?.forEach((item: any, idx: number) => {
          data[idx].label = item?.EmploymentType;
          data[idx].value = item?.Id;
        });
      },
    });
  };
  const getHRPosition = () => {
    const { workplace } = form.getFieldsValue(true);
    // const strWorkplaceIdList = intWorkplaceList
    //   ?.map((item: any) => item.value)
    //   .join(",");

    HRPositionDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "AllPosition",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
        strWorkplaceIdList: workplace?.value,
      },
      onSuccess: (data) => {
        data?.forEach((item: any, idx: number) => {
          data[idx].label = item?.PositionName;
          data[idx].value = item?.PositionId;
        });
      },
    });
  };
  const getEmployeDesignation = () => {
    const { workplace } = form.getFieldsValue(true);

    empDesignationDDL?.action({
      urlKey: "DesignationIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: workplace?.value,
      },
      onSuccess: (res: any) => {
        res.forEach((item: any, i: any) => {
          res[i].label = orgIdsForBn.includes(orgId)
            ? item?.designationBn
            : item?.designationName;
          res[i].value = item?.designationId;
        });
      },
    });
  };
  useEffect(() => {
    getLeaveTypes();
    getWorkplaceDDL({ workplaceDDL, orgId, buId, wgId });
    getReligion();
  }, []);

  const sandWitchHeader: any = [
    {
      title: "Scenario",
      dataIndex: "scenario",
      width: 100,
    },
    {
      title: "Leave Count",
      width: 150,

      render: (_value: any, row: any, index: number) => (
        <PInput
          type="number"
          value={+row?.count || 0}
          placeholder=""
          onChange={(e) => {
            // if ((e as number) < 0) {
            //   return toast.warn("number must be positive");
            // }
            // if ((e as number) > 100) {
            //   return toast.warn("Percentage cant be greater than 100");
            // }

            const temp = [...sandWitchLanding];
            temp[row.index].count = e;
            setSandWitchLanding(temp);
          }}
        />
      ),
    },
  ];
  const encashheader: any = [
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },
    {
      title: "Service Length",
      dataIndex: "serviceLength",
      width: 100,
    },
    {
      title: "Leave Encashment Type",
      dataIndex: "encashmentType",
      width: 100,
    },
    {
      title: "Max Leave Encashment",
      dataIndex: "maxEncashment",
      width: 100,
    },
    {
      title: "Encashment Benefits",
      dataIndex: "encashBenefits",
      width: 100,
    },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
      width: 100,
    },

    {
      title: "",
      width: 30,

      align: "center",
      render: (_: any, item: any, index: number) => (
        <TableButton
          buttonsList={[
            {
              type: "delete",
              onClick: () => {
                setTableData((prev: any) => {
                  const filterArr = prev.filter(
                    (itm: any, idx: number) => idx !== index
                  );
                  return filterArr;
                });
              },
            },
          ]}
        />
      ),
    },
  ];
  const header: any = [
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },
    {
      title: "Scenario",
      dataIndex: "scenario",
      width: 100,
    },
    {
      title: "Leave Type",
      dataIndex: "leaveType",
      width: 100,
    },
    {
      title: "Display Name",
      dataIndex: "displayName",
      width: 100,
    },
    {
      title: "Display Code",
      dataIndex: "displayCode",
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_: any, rec: any) => {
        return (
          <div>
            {rec?.status === "Active" ? (
              <Tag color="green">{rec?.status}</Tag>
            ) : rec?.status === "Inactive" ? (
              <Tag color="red">{rec?.status}</Tag>
            ) : (
              <Tag color="gold">{rec?.status}</Tag>
            )}
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
                //   setOpen(true);
                // detailsApi?.action({
                //   urlKey: "DepositDetails",
                //   method: "GET",
                //   params: {
                //     month: item?.monthId,
                //     year: item?.yearId,
                //     depositType: item?.depositTypeId,
                //   },
                //   onSuccess: () => {
                //     setOpen(true);
                //     setTypeId({
                //       id: item?.depositTypeId,
                //       month: item?.monthId,
                //       year: item?.yearId,
                //     });
                //   },
                // });
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
  const onFinish = () => {};
  return (
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
            buttonList={[
              {
                type: "primary",
                content: "Save",
                // icon: "plus",
                onClick: () => {
                  if (true) {
                    // history.push(
                    //   "/compensationAndBenefits/securityDeposit/create"
                    // );
                  } else {
                    toast.warn("You don't have permission");
                  }
                },
              },
            ]}
            title={`Leave Policy`}
          />
          {loading && <Loading />}
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              {/* ----------general info----------- */}
              <Divider
                style={{
                  marginBlock: "4px",
                  marginTop: "6px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
                orientation="left"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span>General Configuration</span>
                </div>
              </Divider>
              <Col md={6} sm={24}>
                <PInput
                  type="text"
                  name="strPolicyName"
                  label="Policy Name"
                  placeholder="Policy Name"
                  rules={[
                    {
                      required: true,
                      message: "Policy Name is required",
                    },
                  ]}
                />
              </Col>

              <Col md={6} sm={24}>
                <PSelect
                  // mode="multiple"
                  options={
                    leaveTypeApi?.data?.length > 0 ? leaveTypeApi?.data : []
                  }
                  name="leaveType"
                  label=" Leave Type"
                  placeholder="  Leave Type"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      leaveType: op,
                    });

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
              <Col md={6} sm={24}>
                <PInput
                  type="text"
                  name="strDisplayName"
                  label="Display Name"
                  placeholder="Display Name"
                  rules={[
                    {
                      required: true,
                      message: "Display Name is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PInput
                  type="text"
                  name="strDisplayCode"
                  label="Display Code"
                  placeholder="Display Code"
                  rules={[
                    {
                      required: true,
                      message: "Display Code is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PSelect
                  showSearch
                  allowClear
                  options={workplaceDDL?.data || []}
                  name="workplace"
                  label="Workplace"
                  placeholder="Workplace"
                  disabled={params?.id}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      intEmploymentTypeList: undefined,
                      hrPositionListDTO: undefined,
                      designationListDTO: undefined,
                      workplace: op,
                    });
                    if (value) {
                      getEmploymentType();
                      getHRPosition();
                      getEmployeDesignation();
                    }
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Workplace is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PSelect
                  mode="multiple"
                  options={empDesignationDDL?.data || []}
                  name="designationListDTO"
                  label="Designation"
                  placeholder="Designation"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      designationListDTO: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Designation is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PSelect
                  mode="multiple"
                  options={EmploymentTypeDDL?.data || []}
                  name="intEmploymentTypeList"
                  label=" Employment Type"
                  placeholder="  Employment Type"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      intEmploymentTypeList: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Employment Type is required",
                    },
                  ]}
                />
              </Col>
              {/* <Col md={6} sm={24}>
                <PSelect
                  //   mode="multiple"
                  options={[
                    { value: "", label: "All" },
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" },
                  ]}
                  name="status"
                  label="status"
                  placeholder="status"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      status: op,
                    });
                  }}
                />
              </Col> */}
              <Col md={6} sm={24}>
                <PSelect
                  mode="multiple"
                  allowClear
                  options={[
                    { value: 1, label: "Male" },
                    { value: 2, label: "Female" },
                  ]}
                  name="intGender"
                  label="Gender"
                  placeholder="Gender"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      intGender: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Gender is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PSelect
                  mode="multiple"
                  allowClear
                  options={religionDDL?.data || []}
                  name="religionListDto"
                  label="Religion"
                  placeholder="Religion"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      religionListDto: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Religion is required",
                    },
                  ]}
                />
              </Col>
              <Col md={3} sm={24} style={{ marginTop: "1.5rem" }}>
                <PInput
                  label="Is Paid Leave"
                  type="checkbox"
                  layout="horizontal"
                  name="isPaidLeave"
                />
              </Col>
              <Col md={6} style={{ marginTop: "1.5rem" }}>
                <div>
                  <>
                    <FileUploadComponents
                      propsObj={{
                        isOpen,
                        setIsOpen,
                        destroyOnClose: false,
                        attachmentList,
                        setAttachmentList,
                        accountId: orgId,
                        tableReferrence: "LeaveAndMovement",
                        documentTypeId: 15,
                        userId: employeeId,
                        buId,
                        maxCount: 1,
                        isIcon: true,
                        isErrorInfo: true,
                        subText:
                          "Recommended file formats are: PDF, JPG and PNG. Maximum file size is 2 MB",
                      }}
                    />
                  </>
                </div>
              </Col>

              <Form.Item shouldUpdate noStyle>
                {() => {
                  const { applicationBody } = form.getFieldsValue(true);

                  return (
                    <>
                      <Col md={24} sm={24}>
                        <h2 style={{ marginBottom: "12px" }}>
                          Leave Description
                        </h2>
                        <ReactQuill
                          value={applicationBody}
                          preserveWhitespace={true}
                          onChange={(value) =>
                            form.setFieldsValue({
                              applicationBody: value,
                            })
                          }
                        />
                      </Col>
                    </>
                  );
                }}
              </Form.Item>

              {/* <Col
                style={{
                  marginTop: "23px",
                }}
              >
                <PButton type="primary" action="submit" content="View" />
              </Col> */}
            </Row>
            <Row gutter={[10, 2]}>
              <Divider
                style={{
                  marginBlock: "4px",
                  marginTop: "20px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
                orientation="left"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span>Leave Consume Type</span>
                </div>
              </Divider>
              <Col md={6} sm={24}>
                <PSelect
                  mode="multiple"
                  allowClear
                  options={[
                    { value: 1, label: "Full Day" },
                    { value: 2, label: "Half Day" },
                    { value: 3, label: "Clock Time" },
                  ]}
                  name="leaveConsumeType"
                  label="Leave Consume Type"
                  placeholder="Leave Consume Type"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      leaveConsumeType: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Leave Consume Type is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PInput
                  type="number"
                  name="minConsumeTime"
                  label="Minimum Consume Time"
                  placeholder=""
                  rules={[
                    {
                      required: true,
                      message: "Minimum Consume Time is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PInput
                  type="number"
                  name="maxConsumeTime"
                  label="Maximum Consume Time"
                  placeholder=""
                  rules={[
                    {
                      required: true,
                      message: "Maximum Consume Time is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PInput
                  type="number"
                  name="standardWorkHour"
                  label="Standard Working Hour"
                  placeholder=""
                  rules={[
                    {
                      required: true,
                      message: "Standard Working Hour is required",
                    },
                  ]}
                />
              </Col>
            </Row>

            <Row gutter={[10, 2]}>
              <Divider
                style={{
                  marginBlock: "4px",
                  marginTop: "20px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
                orientation="left"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span>Sandwitch Leave</span>
                </div>
              </Divider>
              <Col md={12}>
                <DataTable
                  bordered
                  data={sandWitchLanding.slice(0, 4)}
                  loading={false}
                  header={sandWitchHeader}
                  rowSelection={{
                    type: "checkbox",
                    selectedRowKeys: selectedRow1.map((item) => item?.key),
                    onChange: (selectedRowKeys, selectedRows) => {
                      setSelectedRow1(selectedRows);
                    },
                  }}
                  // checkBoxColWidth={50}
                  // pagination={{
                  //   pageSize: landingApi?.data?.pageSize,
                  //   total: landingApi?.data?.totalCount,
                  // }}
                  // onChange={(pagination, filters, sorter, extra) => {
                  //   // Return if sort function is called
                  //   if (extra.action === "sort") return;

                  //   landingApiCall({
                  //     pagination,
                  //   });
                  // }}
                  // scroll={{ x: 1500 }}
                />
              </Col>
              <Col md={12}>
                <DataTable
                  bordered
                  data={sandWitchLanding.slice(4)}
                  loading={false}
                  header={sandWitchHeader}
                  rowSelection={{
                    type: "checkbox",
                    selectedRowKeys: selectedRow2.map((item) => item?.key),
                    onChange: (selectedRowKeys, selectedRows) => {
                      setSelectedRow2(selectedRows);
                    },
                  }}
                />
              </Col>
            </Row>
            <Row gutter={[10, 2]}>
              <Divider
                style={{
                  marginBlock: "4px",
                  marginTop: "20px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
                orientation="left"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span>Leave Lapse</span>
                </div>
              </Divider>
              <Col md={6} sm={24}>
                <PSelect
                  // mode="multiple"
                  allowClear
                  options={[
                    { value: 1, label: "Calendar Year" },
                    { value: 2, label: "Fiscal Year" },
                    { value: 3, label: "Date of Joining" },
                    { value: 4, label: "Date of Confirmation" },
                    { value: 5, label: "Leaves Completed" },
                  ]}
                  name="leavelapse"
                  label="Leave Lapse After"
                  placeholder=""
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      leavelapse: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Leave Lapse is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PInput
                  type="number"
                  name="afterLeaveCompleted"
                  label="After Leaves Completed"
                  placeholder=""
                  rules={[
                    {
                      required: true,
                      message: "After Leaves Completed is required",
                    },
                  ]}
                />
              </Col>
            </Row>
            <Row gutter={[10, 2]}>
              <Divider
                style={{
                  marginBlock: "4px",
                  marginTop: "20px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
                orientation="left"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span>Leave Carry Forward</span>
                </div>
              </Divider>
              <Col md={3} sm={24} style={{ marginTop: "1.2rem" }}>
                <PInput
                  label="Is Carry Forward"
                  type="checkbox"
                  layout="horizontal"
                  name="isCarryForward"
                />
              </Col>
              <Col md={4} sm={24}>
                <PSelect
                  // mode="multiple"
                  allowClear
                  options={[
                    { value: 1, label: "Percentage of Days" },
                    { value: 2, label: "Fixed Days" },
                    // { value: 3, label: "Clock Time" },
                  ]}
                  name="leaveCarryForwardType"
                  label="Leave Carry Forward Type"
                  placeholder="Leave Carry Forward Type"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      leaveCarryForwardType: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Leave Carry Forward Type is required",
                    },
                  ]}
                />
              </Col>
              <Form.Item shouldUpdate noStyle>
                {() => {
                  const { leaveCarryForwardType } = form.getFieldsValue(true);

                  return (
                    <>
                      <Col md={5} sm={24}>
                        <PInput
                          type="number"
                          name="minConsumeTime"
                          label={`Max Carry Forward After Lapse (${
                            leaveCarryForwardType?.value === 1 ? "%" : "Days"
                          })`}
                          placeholder=""
                          rules={[
                            {
                              required: true,
                              message:
                                "Max Carry Forward After Lapse (%, Days) is required",
                            },
                          ]}
                        />
                      </Col>
                    </>
                  );
                }}
              </Form.Item>

              <Col md={6} sm={24}>
                <PInput
                  type="number"
                  name="expiryCarryForwardDaysAfterLapse"
                  label="Expiry of Carry Forward Days After Lapse"
                  placeholder=""
                  rules={[
                    {
                      required: true,
                      message:
                        "Expiry of Carry Forward Days After Lapse is required",
                    },
                  ]}
                />
              </Col>
              <Col md={5} sm={24}>
                <PInput
                  type="number"
                  name="maxCarryForwardBalance"
                  label="Max Carry Forward Balance (Days)"
                  placeholder=""
                  rules={[
                    {
                      required: true,
                      message: "Max Carry Forward Balance (Days) is required",
                    },
                  ]}
                />
              </Col>
            </Row>
            {/* encash */}
            <Row gutter={[10, 2]}>
              <Divider
                style={{
                  marginBlock: "4px",
                  marginTop: "20px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
                orientation="left"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span>Leave Encashment</span>
                </div>
              </Divider>
              <Col md={4} sm={24} style={{ marginTop: "1.2rem" }}>
                <PInput
                  label="Is Encashment"
                  type="checkbox"
                  layout="horizontal"
                  name="isEncashment"
                />
              </Col>
              <Col md={6} sm={24}>
                <PSelect
                  // mode="multiple"
                  allowClear
                  options={[
                    { value: 1, label: "After Leave Lapse" },
                    { value: 2, label: "Final Settlement" },
                    { value: 2, label: "Anytime" },
                    // { value: 3, label: "Clock Time" },
                  ]}
                  name="encashmentTimeline"
                  label="Encashment Timeline"
                  placeholder="Encashment Timeline"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      encashmentTimeline: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Encashment Timeline is required",
                    },
                  ]}
                />
              </Col>
              <Row gutter={[10, 2]}>
                <Col md={6} sm={24}>
                  <PInput
                    type="number"
                    name="serviceStartLength"
                    label="From Service Length (Month)"
                    placeholder=""
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "From Service Length (Month) is required",
                    //   },
                    // ]}
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PInput
                    type="number"
                    name="serviceEndLength"
                    label="To Service Length (Month)"
                    placeholder=""
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "To Service Length (Month) is required",
                    //   },
                    // ]}
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PSelect
                    // mode="multiple"
                    allowClear
                    options={[
                      { value: 1, label: "Percentage of Days" },
                      { value: 2, label: "Fixed Days" },
                      // { value: 3, label: "Clock Time" },
                    ]}
                    name="encashType"
                    label="Leave Encashment Type *"
                    placeholder="Leave Encashment Type *"
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        encashType: op,
                      });
                    }}
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Leave Carry Forward Type is required",
                    //   },
                    // ]}
                  />
                </Col>
                <Form.Item shouldUpdate noStyle>
                  {() => {
                    const { encashType } = form.getFieldsValue(true);

                    return (
                      <>
                        <Col md={5} sm={24}>
                          <PInput
                            type="number"
                            name="maxEncashment"
                            label={`Max Leave Encashment (${
                              encashType?.value === 1
                                ? "% of Days"
                                : "Fixed Days"
                            })`}
                            placeholder=""
                            // rules={[
                            //   {
                            //     required: true,
                            //     message:
                            //       "Max Carry Forward After Lapse (%, Days) is required",
                            //   },
                            // ]}
                          />
                        </Col>
                      </>
                    );
                  }}
                </Form.Item>
                <Col md={6} sm={24}>
                  <PSelect
                    // mode="multiple"
                    allowClear
                    options={[
                      { value: 1, label: "Basic" },
                      { value: 2, label: "Gross" },
                      { value: 3, label: "Fixed Amount" },
                    ]}
                    name="encashBenefits"
                    label="Encashment Benefits"
                    placeholder=""
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        encashBenefits: op,
                      });
                    }}
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Leave Carry Forward Type is required",
                    //   },
                    // ]}
                  />
                </Col>
                <Form.Item shouldUpdate noStyle>
                  {() => {
                    const {
                      paidAmount,
                      encashBenefits,
                      maxEncashment,
                      encashType,
                      serviceEndLength,
                      serviceStartLength,
                    } = form.getFieldsValue(true);

                    return (
                      <>
                        <Col md={5} sm={24}>
                          <PInput
                            type="number"
                            name="paidAmount"
                            label={`Max Leave Encashment (${
                              encashBenefits?.value !== 3 ? "% " : "Amount"
                            })`}
                            placeholder=""
                            // rules={[
                            //   {
                            //     required: true,
                            //     message:
                            //       "Max Carry Forward After Lapse (%, Days) is required",
                            //   },
                            // ]}
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
                            content="Add"
                            onClick={() => {
                              if (
                                paidAmount === undefined ||
                                encashBenefits === undefined ||
                                encashType === undefined ||
                                serviceEndLength === undefined ||
                                serviceStartLength === undefined ||
                                maxEncashment === undefined
                              ) {
                                return toast.warn("Please fill up the fields");
                              }
                              if (serviceEndLength < serviceStartLength) {
                                return toast.warn(
                                  "Service End Length must be greater than Service Start Length"
                                );
                              }

                              setTableData((prev: any) => [
                                ...prev,
                                {
                                  serviceLength: `${serviceStartLength} - ${serviceEndLength}`,
                                  encashmentType: encashType?.label,
                                  maxEncashment,
                                  encashBenefits: encashBenefits?.label,
                                  paidAmount,
                                },
                              ]);
                              form.setFieldsValue({
                                serviceStartLength: undefined,
                                serviceEndLength: undefined,
                                encashmentType: undefined,
                                maxEncashment: undefined,
                                encashBenefits: undefined,
                                paidAmount: undefined,
                              });
                            }}
                          />
                        </Col>
                      </>
                    );
                  }}
                </Form.Item>
                <Col>
                  <DataTable
                    bordered
                    data={tableData}
                    loading={false}
                    header={encashheader}
                  />
                </Col>
              </Row>
            </Row>
          </PCardBody>
        </PCard>
      </PForm>
    </>
  );
};
