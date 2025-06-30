import {
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { Button, Col, Form, Row, Space, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";

import { getEnumData } from "common/api/commonApi";
import { shallowEqual, useSelector } from "react-redux";
import Filter from "modules/TrainingAndDevelopment/filter";
import {
  formatDate,
  setCustomFieldsValue,
} from "modules/TrainingAndDevelopment/requisition/helper";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import {
  formatFilterValue,
  typeDataSetForTitle,
} from "modules/TrainingAndDevelopment/helpers";
import { getSerial } from "Utils";
import moment from "moment";
import { PeopleDeskSaasDDL } from "common/api";
import { statusDDL } from "../../helper";
import PfLoanLanding from "../..";
import PrintTypeButton from "common/PrintTypeButton";

const PfLoanLifeCycle = () => {
  const defaultFromDate = moment().subtract(3, "months").startOf("month"); // 1st day of 3 months ago
  const defaultToDate = moment().endOf("month"); // Last day of the current month
  // router states
  const history = useHistory();

  const { permissionList, profileData } = useSelector(
    (state) => state?.auth,
    shallowEqual
  );

  let permission = {};
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30626) {
      permission = item;
    }
  });
  const { wId, buId, wgId, employeeId, orgId } = profileData;
  // hooks
  const [landingApi, getLandingApi, landingLoading, , landingError] =
    useAxiosGet();

  // state
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState({});
  const [viewDetails, setViewDetails] = useState(null);

  const [loanTypeDDL, setLoanTypeDDL] = useState([]);

  // Form Instance
  const [form] = Form.useForm();
  // table column
  const header = [
    {
      title: "SL",
      render: (_, rec, index) =>
        getSerial({
          currentPage: 1,
          pageSize: 500,
          index,
        }),
      fixed: "left",
      align: "center",
      width: 30,
    },
    {
      title: "Code",
      dataIndex: "strEmployeeCode",
    },
    {
      title: "Employee",
      dataIndex: "strEmployeeName",
    },
    {
      title: "Loan ID",
      dataIndex: "strLoanId",
    },
    {
      title: "Effective Date",
      dataIndex: "dteEffectiveDate",
      // -- optional -- nicely format ISO date strings
      // render: (text) => (text ? dayjs(text).format("DD-MM-YYYY") : ""),
    },
    {
      title: "Loan Amount",
      dataIndex: "numLoanAmount",
    },
    {
      title: "Interest (%)",
      dataIndex: "numInterest",
    },
    {
      title: "Loan Amount with Interest",
      dataIndex: "numTotalInstallment", // principal + interest
      width: 50,
    },
    {
      title: "Installment",
      dataIndex: "intNumberOfInstallment",
    },
    {
      title: "Settled Installment",
      dataIndex: "settledInstallment",
      width: 40,
    },
    {
      title: "Settled Amount",
      dataIndex: "settledAmount",
    },
    {
      title: "Un-Settled Amount",
      dataIndex: "unSettledAmount",
    },
    {
      title: "Description",
      dataIndex: "strDescription",
    },
    {
      title: "Status",
      dataIndex: "strStatus",
      width: 50,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, rec) => (
        <button
          style={{ height: 24, fontSize: 12, padding: "0 12px" }}
          className="btn btn-default"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setViewDetails(rec);
          }}
        >
          Details
        </button>
      ),
      align: "center",
      width: 40,
    },
  ];

  const landingApiCall = (
    pagination = {
      current: 1,
      pageSize: 25,
    }
  ) => {
    const values = form.getFieldsValue(true);
    console.log(values);
    getLandingApi(
      `/PfLoan/GetAllPfLifecycleLoan?BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&LoanTypeId=${
        values?.loanType?.value
      }&EffectiveDate=${formatDate(values?.effectiveDate)}&UnSettledAmount=${
        values?.unsettledAmount || 0
      }&Status=${values?.status?.value || 0}`
    );
  };
  useEffect(() => {
    PeopleDeskSaasDDL(
      "PFLoanIdbyWorkplace",
      wgId,
      buId,
      setLoanTypeDDL,
      "value",
      "label",
      0,
      wId
    );
    // landingApiCall();
  }, []);

  return permission?.isView ? (
    <div>
      {/* {loading || (landingLoading && <Loading />)} */}
      <PForm
        form={form}
        initialValues={{
          printType: { label: "Excel", value: 1 },
        }}
      >
        <PCard>
          <PrintTypeButton
            title="PF Loan Life Cycle"
            form={form}
            onClick={() => {}}
          />

          <PCardBody>
            <div className="mb-3">
              <Row gutter={[10, 2]}>
                <Col md={4} sm={12} xs={24}>
                  <PSelect
                    options={loanTypeDDL || []}
                    name="loanType"
                    label={"Loan Type"}
                    placeholder="Loan Type"
                    onChange={(value, op) => {
                      form.setFieldsValue({ loanType: op });
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Loan Type is required",
                      },
                    ]}
                  />
                </Col>
                <Col md={4} sm={24}>
                  <PInput
                    type="date"
                    name="effectiveDate"
                    label="Effective Date"
                    placeholder="Effective Date"
                    onChange={(value) => {
                      form.setFieldsValue({
                        effectiveDate: value,
                      });
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Effective Date is required",
                      },
                    ]}
                  />
                </Col>
                <Col md={3} sm={24}>
                  <PInput
                    type="number"
                    name="loanAmount"
                    label="Loan Amount"
                    placeholder="Loan Amount"
                    onChange={(value) => {
                      form.setFieldsValue({
                        loanAmount: value,
                      });
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Loan Amount is required",
                      },
                    ]}
                  />
                </Col>
                <Col md={3} sm={24}>
                  <PInput
                    type="number"
                    name="interest"
                    label="Interest"
                    placeholder="Interest (%)"
                    onChange={(value) => {
                      form.setFieldsValue({
                        interest: value,
                      });
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Interest is required",
                      },
                    ]}
                  />
                </Col>
                <Col md={3} sm={24}>
                  <PInput
                    type="number"
                    name="unsettledAmount"
                    label="Un-Settled Amount"
                    placeholder="Un-Settled Amount"
                    onChange={(value) => {
                      form.setFieldsValue({
                        unsettledAmount: value,
                      });
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Un-Settled Amount is required",
                      },
                    ]}
                  />
                </Col>
                <Col md={3} sm={12} xs={24}>
                  <PSelect
                    options={statusDDL || []}
                    name="status"
                    label={"Status"}
                    placeholder="Status"
                    onChange={(value, op) => {
                      form.setFieldsValue({ status: op });
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Status is required",
                      },
                    ]}
                  />
                </Col>
                <Col md={4} sm={24}>
                  <PButton
                    style={{ marginTop: "22px" }}
                    type="primary"
                    content="View"
                    onClick={() => {
                      const values = form.getFieldsValue(true);
                      form
                        .validateFields(["loanType", "effectiveDate"])
                        .then(() => {
                          console.log(values);
                          landingApiCall();
                        })
                        .catch(() => {});
                    }}
                  />
                </Col>
              </Row>
            </div>
            <DataTable
              bordered
              data={landingApi?.data || []}
              loading={landingLoading}
              header={header}
              pagination={{
                pageSize: landingApi?.pageSize,
                total: landingApi?.totalCount,
              }}
              filterData={landingApi?.data?.filters}
              onChange={(pagination, filters) => {
                landingApiCall(pagination);
              }}
            />
            {viewDetails !== null && (
              <PfLoanLanding onlyViewDetails={viewDetails} />
            )}
          </PCardBody>
        </PCard>
      </PForm>
      {/* Training Title Modal */}
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default PfLoanLifeCycle;
