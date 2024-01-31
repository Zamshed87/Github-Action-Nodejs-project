import { DataTable } from "Components";
import PBadge from "Components/Badge";
import { ModalFooter } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { getSerial } from "Utils";
import { Col, Row } from "antd";
import moment from "moment";
import React, { useEffect } from "react";

type TPFFundModalView = {
  singleData: any;
  setViewModal: any;
  setData: any;
};
const PFFundModalView: React.FC<TPFFundModalView> = ({
  singleData,
  setViewModal,
  setData,
}) => {
  // Api Actions
  const getByIdApi = useApiRequest({});

  // Landing Api
  type TGetByIdApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filerList?: any[];
    searchText?: string;
  };
  const getById = ({
    pagination = {},
    filerList = [],
    searchText = "",
  }: TGetByIdApi = {}) => {
    getByIdApi.action({
      method: "get",
      urlKey: "PFInvestmentById",
      params: {
        Id: singleData?.intPfLedgerId,
        PageNo: pagination?.current || 1,
        PageSize: pagination?.pageSize || 25,
      },
    });
  };

  // Life Cycle Hooks
  useEffect(() => {
    getById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData?.intPfLedgerId]);

  // Table Header
  const header: any = [
    {
      title: "SL",
      render: (value: any, row: any, index: number) =>
        getSerial({
          currentPage: getByIdApi?.data?.currentPage,
          pageSize: getByIdApi?.data?.pageSize,
          index,
        }),

      align: "center",
      width: 20,
    },
    {
      title: "Enroll Id",
      dataIndex: "intEmployeeId",
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
    },
    {
      title: "Employee Code",
      dataIndex: "strEmployeeCode",
    },
    {
      title: "Department",
      dataIndex: "departmentName",
    },
    {
      title: "Designation",
      dataIndex: "designationName",
    },
    {
      title: "Amount *(Both Employee and Employer)",
      dataIndex: "numAmount",
      className: "text-right",
    },
  ];
  return (
    <>
      <Row gutter={[10, 2]}>
        <Col md={8} sm={24}>
          <b style={{ fontWeight: 600, fontSize: "12px" }}>Bank Name: </b>{" "}
          <span style={{ fontSize: "12px" }}>
            {singleData?.strBankName || "N/A"}
          </span>
        </Col>
        <Col md={8} sm={24}>
          <b style={{ fontWeight: 600, fontSize: "12px" }}>Branch Name: </b>{" "}
          <span style={{ fontSize: "12px" }}>
            {singleData?.strBankBranchName || "N/A"}
          </span>
        </Col>
        <Col md={8} sm={24}>
          <b style={{ fontWeight: 600, fontSize: "12px" }}>Maturity Date: </b>{" "}
          <span style={{ fontSize: "12px" }}>
            {singleData?.strMaturityDate
              ? moment(singleData?.strMaturityDate).format("DD-MMM-YYYY")
              : "N/A"}
          </span>
        </Col>
        <Col md={8} sm={24}>
          <b style={{ fontWeight: 600, fontSize: "12px" }}>Investment Date: </b>{" "}
          <span style={{ fontSize: "12px" }}>
            {singleData?.investmentDate
              ? moment(singleData?.investmentDate).format("DD-MMM-YYYY")
              : moment(singleData?.dteTransactionDate).format("DD-MMM-YYYY")}
          </span>
        </Col>
        <Col md={8} sm={24}>
          <b style={{ fontWeight: 600, fontSize: "12px" }}>Type: </b>{" "}
          <span style={{ fontSize: "12px" }}>
            {singleData?.strType || "N/A"}
          </span>
        </Col>
        <Col md={8} sm={24}>
          <b style={{ fontWeight: 600, fontSize: "12px" }}>Status: </b>{" "}
          <span>
            {singleData?.status === "Incomplete" ? (
              <PBadge type="warning" text={singleData?.status} />
            ) : (
              <PBadge type="success" text={singleData?.status} />
            )}
          </span>
        </Col>
        <Col md={24} sm={24} className="mt-2">
          <DataTable
            header={header}
            bordered
            data={getByIdApi?.data?.data || []}
            pagination={{
              current: getByIdApi?.data?.currentPage, // Current Page From Api Response
              pageSize: getByIdApi?.data?.pageSize, // Page Size From Api Response
              total: getByIdApi?.data?.totalCount, // Total Count From Api Response
            }}
            loading={getByIdApi?.loading}
            scroll={{ x: 800 }}
            onChange={(pagination, filters, sorter, extra) => {
              if (extra.action === "sort") return;
              getById({
                pagination,
                filerList: filters,
              });
            }}
          />
        </Col>
      </Row>
      <ModalFooter
        submitText={false}
        cancelText={"Cancel"}
        onCancel={() => {
          setViewModal(false);
          setData({});
        }}
      />
    </>
  );
};

export default PFFundModalView;
