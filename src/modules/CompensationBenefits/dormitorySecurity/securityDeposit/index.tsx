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
import type { RangePickerProps } from "antd/es/date-picker";
import { InfoOutlined } from "@mui/icons-material";
import profileImg from "../../../assets/images/profile.jpg";

import { useApiRequest } from "Hooks";
import { Col, Form, Row, Tag } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { dateFormatter } from "utility/dateFormatter";

import { yearDDLAction } from "utility/yearDDL";
import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";
import moment from "moment";

export const SecurityDepositLanding = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    permissionList,
    profileData: { buId, employeeId, orgId, buName },
  } = useSelector((state: any) => state?.auth, shallowEqual);
  const [selectedRow, setSelectedRow] = useState<any[]>([]);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 8),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  //   const debounce = useDebounce();

  //   const options: any = [
  //     { value: "", label: "All" },
  //     { value: true, label: "Assigned" },
  //     { value: false, label: "Not-Assigned" },
  //   ];
  const { id }: any = useParams();
  // Form Instance
  const [form] = Form.useForm();
  //   api states
  // const workplaceGroup = useApiRequest([]);
  // const workplace = useApiRequest([]);
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Security Deposit";
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
      urlKey: "GetIncrementProposalLoader",
      method: "GET",
      params: {
        fromDate: values?.fromDate
          ? moment(values?.fromDate).format("YYYY-MM-DD")
          : todayDate(),
        toDate: values?.toDate
          ? moment(values?.toDate).format("YYYY-MM-DD")
          : todayDate(),
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
      title: "Deposit Type",
      dataIndex: "workplaceGroupName",
      width: 100,
    },
    {
      title: "Deposits Month Year",
      dataIndex: "joiningDate",
      render: (data: any) => (data ? dateFormatter(data) : "-"),
      width: 100,
    },
    {
      title: "Total Employee",
      dataIndex: "employeeName",
      width: 100,
    },
    {
      title: "Deposits Money",
      dataIndex: "designationName",
      width: 100,
    },

    {
      title: "Last Increment Amount",
      dataIndex: "lastIncrementAmount",
      width: 100,
    },
    {
      title: "Recent Gross Salary",
      dataIndex: "recentGrossSalary",
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
              type: "edit",
              onClick: (e: any) => {
                if (!employeeFeature?.isEdit) {
                  return toast.warn("You don't have permission");
                  e.stopPropagation();
                }
                //   setOpen(true);
                //   setId(rec);
              },
            },
            // {
            //   type: "delete",
            //   onClick: () => {
            //     // deleteProposalById(item);
            //   },
            // },
          ]}
        />
      ),
    },
  ];

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    const { fromDate } = form.getFieldsValue(true);
    const fromDateMoment = moment(fromDate, "MM/DD/YYYY");
    // Disable dates before fromDate and after next3daysForEmp
    return current && current < fromDateMoment.startOf("day");
  };

  const onFinish = () => {
    landingApiCall();
  };
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
            buttonList={[
              // {
              //   type: "primary",
              //   content: "Bulk Upload",
              //   onClick: () => {
              //     if (employeeFeature?.isCreate) {
              //       history.push("/profile/employee/bulk");
              //     } else {
              //       toast.warn("You don't have permission");
              //     }
              //   },
              // },
              {
                type: "primary",
                content: "Create New",
                icon: "plus",
                onClick: () => {
                  if (employeeFeature?.isCreate) {
                    history.push(
                      "/compensationAndBenefits/securityDeposit/create"
                    );
                  } else {
                    toast.warn("You don't have permission");
                  }
                },
              },
            ]}
            title={`Total ${landingApi?.data?.length || 0} employees`}
          />
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={6} sm={12} xs={24}>
                <PInput
                  type="month"
                  name="fromDate"
                  format={"MMM-YYYY"}
                  label="From Date"
                  placeholder="From Date"
                  onChange={(value) => {
                    form.setFieldsValue({
                      fromDate: value,
                    });
                  }}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PInput
                  type="month"
                  name="toDate"
                  label="To Date"
                  placeholder="To Date"
                  format={"MMM-YYYY"}
                  disabledDate={disabledDate}
                  onChange={(value) => {
                    form.setFieldsValue({
                      toDate: value,
                    });
                  }}
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
            data={landingApi?.data?.length > 0 ? landingApi?.data : []}
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
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};
