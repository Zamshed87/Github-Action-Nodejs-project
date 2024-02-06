import { AddOutlined } from "@mui/icons-material";
import {
  DataTable,
  PButton,
  PCard,
  PCardHeader,
  PForm,
  PSelect,
  TableButton,
} from "Components";
import PBadge from "Components/Badge";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { getSerial } from "Utils";
import { Col, Form, Row } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import CreateInvestment from "./Create/CreateInvestment";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import PFFundModalView from "./view/PFFundModalView";
import RefundEarning from "./Create/RefundEarning";

type TPfFundLanding = {};
const PfFundLanding: React.FC<TPfFundLanding> = () => {
  // Data From Store
  const { buId, wgId, wId, orgId, intEmployeeId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const { businessUnitDDL } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  // Api Actions
  const pfLandingApi = useApiRequest({});
  const typeDDLApi = useApiRequest([]);

  const [form] = Form.useForm();

  // state
  const [open, setOpen] = useState(false);
  const [refundEarningModalOpen, setRefundEarningModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedRows, setsSelectedRows] = useState<any>([]);
  const [checkedRowKeys, setCheckRowKeys] = useState<any>([]);
  const [data, setData] = useState<any>({});

  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  let pfFundFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30395) {
      pfFundFeature = item;
    }
  });

  // Landing Api
  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filerList?: any[];
    searchText?: string;
  };
  const landingApi = async ({
    pagination = {},
    filerList = [],
    searchText = "",
  }: TLandingApi = {}) => {
    await form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        pfLandingApi.action({
          urlKey: "PFLanding",
          method: "get",
          params: {
            IntAccountId: orgId,
            IntBusinessUnitId: values?.businessUnit,
            IntWorkPlaceGroupId: wgId,
            IntWorkPlaceId: wId,
            IntEmployeeId: intEmployeeId,
            FromDate: moment().format("YYYY-MM-DD"),
            ToDate: moment().format("YYYY-MM-DD"),
            PageNo: pagination?.current || 1,
            PageSize: pagination?.pageSize || 25,
          },
        });
      })
      .catch((err) => {});
  };

  const typeDDL = () => {
    typeDDLApi.action({
      method: "get",
      urlKey: "PFRegisterTypeDDL",
      params: {
        accountId: orgId,
        workplaceId: wId,
        workPlaceGroupId: wgId,
      },
    });
  };

  // Life Cycle Hooks
  useEffect(() => {
    typeDDL();
    document.title = "PF Fund";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  // Table Header
  const header: any = [
    {
      title: "SL",
      render: (value: any, row: any, index: number) =>
        getSerial({
          currentPage: pfLandingApi?.data?.currentPage,
          pageSize: pfLandingApi?.data?.pageSize,
          index,
        }),
      align: "center",
      width: 20,
    },
    {
      title: "Reff. No",
      dataIndex: "code",
      sorter: true,
    },
    {
      title: "Fund Date",
      dataIndex: "dteTransactionDate",
      render: (data: any) => moment(data).format("DD-MMM-YYYY"),
    },
    {
      title: "Type",
      dataIndex: "strType",
    },
    {
      title: "Contribution Amount",
      dataIndex: "numAmount",
      className: "text-right",
    },
    {
      title: "Invst. Status",
      dataIndex: "status",
      align: "center",
      render: (data: any, record: any) =>
        // Write condition to check status
        record?.status === "Incomplete" ? (
          <PBadge type="warning" text={record?.status} />
        ) : (
          <PBadge type="success" text={record?.status} />
        ),
      width: "50px",
    },
    {
      title: "Invst. Date",
      dataIndex: "investmentDate",
      render: (data: any) => (data ? moment(data).format("DD-MMM-YYYY") : ""),
    },
    {
      title: "Action",
      align: "center",
      render: (data: any, record: any) => {
        return (
          <TableButton
            buttonsList={[
              {
                type: "view",
                onClick: () => {
                  setViewModal(true);
                  setData(record);
                },
              },
              {
                type: "plus",
                onClick: () => {
                  setsSelectedRows([record]);
                  setOpen(true);
                },
                prompt: "Investment",
                isActive:
                  record?.status === "Complete" ||
                  record?.intTypeId === 1 ||
                  record?.intTypeId === 4 ||
                  record?.intTypeId === 5
                    ? false
                    : true,
              },
              {
                type: "reload",
                onClick: () => {
                  setsSelectedRows([record]);
                  setRefundEarningModalOpen(true);
                },
                prompt: "Refund/Earning",
                isActive: record?.strType === "Fund" ? false : true,
              },
            ]}
          />
        );
      },
      width: "60px",
    },
  ];

  return pfFundFeature?.isView ? (
    <>
      <PForm form={form}>
        <PCard>
          <PCardHeader
            title="PF Fund"
            buttonList={[
              {
                type: "primary",
                content: "Investment",
                onClick: () => {
                  setOpen(true);
                },
                disabled: !selectedRows?.length,
                icon: <AddOutlined />,
              },
            ]}
          />
          <Row gutter={[10, 2]} className="pb-2">
            <Col md={6} sm={24}>
              <PSelect
                name="businessUnit"
                placeholder="Business Unit"
                allowClear={true}
                showSearch={true}
                rules={[
                  { required: true, message: "Business Unit Is Required" },
                ]}
                options={
                  businessUnitDDL?.map((item: any) => {
                    return {
                      ...item,
                      label: item?.BusinessUnitName,
                      value: item?.BusinessUnitId,
                    };
                  }) || []
                }
                label="Business Unit"
              />
            </Col>
            <Col md={6} sm={24}>
              <PSelect
                name="type"
                placeholder="Type"
                allowClear={true}
                showSearch={true}
                // rules={[{ required: true, message: "Type Is Required" }]}
                options={typeDDLApi?.data}
                label="Type"
              />
            </Col>
            <Col style={{ marginTop: "23px" }}>
              <PButton
                type="primary"
                content="View"
                onClick={() => {
                  landingApi();
                }}
              ></PButton>
            </Col>
          </Row>
          <DataTable
            header={header}
            rowSelection={{
              type: "checkbox",
              selectedRowKeys: checkedRowKeys,
              onChange: (selectedRowKeys, selectedRows) => {
                setsSelectedRows(selectedRows);
                setCheckRowKeys(selectedRowKeys);
              },
              getCheckboxProps: (record) => ({
                disabled:
                  record?.status === "Complete" ||
                  record?.strType === "Investment" ||
                  record?.strType === "Refund" ||
                  record?.strType === "Earning",
              }),
            }}
            bordered
            data={pfLandingApi?.data?.data || []}
            pagination={{
              current: pfLandingApi?.data?.currentPage, // Current Page From Api Response
              pageSize: pfLandingApi?.data?.pageSize, // Page Size From Api Response
              total: pfLandingApi?.data?.totalCount, // Total Count From Api Response
            }}
            loading={pfLandingApi?.loading}
            scroll={{ x: 1000 }}
            onChange={(pagination, filters, sorter, extra) => {
              if (extra.action === "sort") return;
              landingApi({
                pagination,
                filerList: filters,
              });
            }}
          />
        </PCard>
      </PForm>
      <PModal
        title="Create Investment"
        open={open}
        onCancel={() => {
          setsSelectedRows([]);
          setCheckRowKeys([]);
          setOpen(false);
        }}
        components={
          <CreateInvestment
            setOpen={setOpen}
            data={selectedRows}
            landingApi={landingApi}
            setsSelectedRows={setsSelectedRows}
            setCheckRowKeys={setCheckRowKeys}
          />
        }
      />
      <PModal
        title="Refund/Earning"
        open={refundEarningModalOpen}
        onCancel={() => {
          setsSelectedRows([]);
          setCheckRowKeys([]);
          setRefundEarningModalOpen(false);
        }}
        components={
          <RefundEarning
            setOpen={setRefundEarningModalOpen}
            data={selectedRows}
            landingApi={landingApi}
            setsSelectedRows={setsSelectedRows}
            setCheckRowKeys={setCheckRowKeys}
          />
        }
      />
      <PModal
        title={"PF Fund View"}
        open={viewModal}
        onCancel={() => {
          setViewModal(false);
          setData({});
        }}
        components={
          <PFFundModalView
            singleData={data}
            setViewModal={setViewModal}
            setData={setData}
          />
        }
        width={1000}
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default PfFundLanding;
