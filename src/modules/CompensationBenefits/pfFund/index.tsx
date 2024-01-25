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
import { toast } from "react-toastify";

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
  const [selectedRows, setsSelectedRows] = useState<any>([]);

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
      title: "PF Code",
      dataIndex: "intPfLedgerCode",
      sorter: true,
    },
    {
      title: "Fund Date",
      dataIndex: "dteTransactionDate",
      render: (data: any, record: any, index: number) =>
        moment(data).format("DD-MMM-YYYY"),
    },
    {
      title: "Type",
      dataIndex: "strType",
    },
    {
      title: "Contribution Amount",
      dataIndex: "numAmount",
    },
    {
      title: "Invst. Status",
      dataIndex: "status",
      align: "center",
      render: (data: any, record: any, index: number) =>
        // Write condition to check status
        record?.status === "Pending" ? (
          <PBadge type="warning" text={record?.status} />
        ) : (
          <PBadge type="success" text={record?.status} />
        ),
      width: "50px",
    },
    {
      title: "Invst. Date",
      dataIndex: "investDate",
      // render: (data: any, record: any, index: number) =>
      //   moment(data).format("DD-MMM-YYYY"),
    },
    {
      title: "Invst. Reff No",
      dataIndex: "invstmentRefferenceNo",
    },
    {
      title: "Action",
      align: "center",
      render: (data: any, record: any, index: number) => {
        return (
          <TableButton
            buttonsList={[
              {
                type: "view",
                onClick: () => {},
              },
              {
                type: "plus",
                onClick: () => {
                  if (record.status === "Done")
                    return toast.warn("Already done in investment", {
                      toastId: record?.status,
                    });
                  setsSelectedRows([record]);
                  setOpen(true);
                },
                prompt: "Investment",
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
              onChange: (selectedRowKeys, selectedRows) => {
                setsSelectedRows(selectedRows);
              },
              getCheckboxProps: (record) => ({
                disabled: record?.status === "Done",
              }),
            }}
            bordered
            data={pfLandingApi?.data?.data || []}
            filterData={
              pfLandingApi?.data?.calendarAssignHeader // Filter Object From Api Response
            }
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
          setOpen(false);
        }}
        components={
          <CreateInvestment
            setOpen={setOpen}
            data={selectedRows}
            landingApi={landingApi}
            setsSelectedRows={setsSelectedRows}
          />
        }
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default PfFundLanding;
