import React, { useEffect, useState } from "react";
import { Col, Form } from "antd";
import { DataTable, PCard, PCardHeader, PForm, PSelect } from "Components";
import { useApiRequest } from "Hooks";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import PFilter from "utility/filter/PFilter";
import { formatFilterValueList } from "utility/filter/helper";
import { getHeader } from "./helper";
import { PModal } from "Components/Modal";
import PFFundReportDetails from "./components/PFFundReportDetails";

type TPFFundReport = {};
const PFFundReport: React.FC<TPFFundReport> = () => {
  const dispatch = useDispatch();
  // Data From Store
  const { buId, wgId, wId, intEmployeeId, orgId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const { tokenData } = useSelector((state: any) => state?.auth, shallowEqual);

  const decodedToken = tokenData
    ? JSON.parse(atob(tokenData.split(".")[1]))
    : null;

  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  let pfFundReportFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30414) {
      pfFundReportFeature = item;
    }
  });

  //State
  const [fundReportView, setFundReportView] = useState<{
    open: boolean;
    data: Record<string, unknown>;
  }>({ open: false, data: {} });

  const [form] = Form.useForm();

  // Api Actions
  const pfFundReportApi = useApiRequest([]);
  const employeeDDLApi = useApiRequest([]);

  // Landing Api
  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filerList?: any[];
    searchText?: string;
    isCurrentFund?: boolean;
  };
  const landingApi = async ({
    pagination = {},
    filerList = [],
    searchText = "",
    isCurrentFund = true,
  }: TLandingApi = {}) => {
    await form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        pfFundReportApi.action({
          urlKey: "RefundOrEarningReport",
          method: "post",
          payload: {
            intAccountId: orgId,
            intEmployeeId: values?.employeeName?.value,
            isCurrentFund: isCurrentFund,
            status: values?.status?.value,
            pageNo: pagination?.current || 1,
            pageSize: pagination?.pageSize || 25,
            departmentIdList: formatFilterValueList(values?.department) || [0],
            designationIdList: formatFilterValueList(values?.designation) || [
              0,
            ],
            WorkplaceGroupList:
              values?.workplaceGroup?.value == 0 ||
              values?.workplaceGroup?.value == undefined
                ? decodedToken.workplaceGroupList
                : values?.workplaceGroup?.value.toString(),
            WorkplaceList:
              values?.workplace?.value == 0 ||
              values?.workplace?.value == undefined
                ? decodedToken.workplaceList
                : values?.workplace?.value.toString(),
          },
        });
      })
      .catch((err) => {});
  };

  const employeeDDL = () => {
    employeeDDLApi.action({
      method: "get",
      urlKey: "EmployeeDDLWithCode",
      params: {
        EmployeeId: intEmployeeId,
        businessUnitId: buId,
        WorkplaceGroupId: wgId,
      },
      onSuccess: (res: any) => {
        const employeeList = res.map((item: any) => ({
          ...item,
          label: `${item?.strEmployeeName} - ${item?.strEmployeeCode}`,
          value: item?.intEmployeeBasicInfoId,
        }));

        // Add the "All" value
        employeeList.unshift({ value: 0, label: "All" });

        // Assuming you need to set the modified result back to the response
        res.splice(0, res.length, ...employeeList);
      },
    });
  };

  // Life Cycle Hooks
  useEffect(() => {
    employeeDDL();
    document.title = "PF Fund Report";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return pfFundReportFeature?.isView ? (
    <PForm form={form}>
      <PCard>
        <PCardHeader title="PF Fund Report" />
        <PFilter form={form} landingApiCall={landingApi}>
          <Col md={12} sm={24}>
            <PSelect
              name="employeeName"
              placeholder="Employee Name"
              allowClear={true}
              showSearch={true}
              rules={[{ required: true, message: "Employee Name Is Required" }]}
              onChange={(value: any, option: any) => {
                form.setFieldsValue({
                  employeeName: option,
                });
                pfFundReportApi.reset();
              }}
              options={employeeDDLApi?.data || []}
              label="Employee Name"
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              name="status"
              placeholder="Status"
              allowClear={true}
              showSearch={true}
              rules={[{ required: true, message: "Status Is Required" }]}
              options={[
                { label: "All", value: 0 },
                { label: "Active", value: 1 },
                { label: "Inactive", value: 2 },
              ]}
              onChange={(value: any, option: any) => {
                form.setFieldsValue({
                  status: option,
                });
                pfFundReportApi.reset();
              }}
              label="Status"
            />
          </Col>
          {/* <Col className="mt-3 pt-1">
            <PRadio
              name="elementType"
              type="group"
              rules={[
                { required: true, message: "Please Select Element Type" },
              ]}
              options={[
                {
                  label: "Current Total Fund",
                  value: "currentTotalFund",
                },
                {
                  label: "Fund Details",
                  value: "fundDetails",
                },
              ]}
              onChange={(e: any) => {
                const value = e.target.value;
                setElementType(value);
                form.setFieldsValue({
                  elementType: value,
                });
                pfFundReportApi.reset();
              }}
            />
          </Col> */}
        </PFilter>
        <DataTable
          header={getHeader(pfFundReportApi, true, setFundReportView)}
          bordered
          data={pfFundReportApi?.data?.data || []}
          pagination={{
            current: pfFundReportApi?.data?.currentPage, // Current Page From Api Response
            pageSize: pfFundReportApi?.data?.pageSize, // Page Size From Api Response
            total: pfFundReportApi?.data?.totalCount, // Total Count From Api Response
          }}
          loading={pfFundReportApi?.loading}
          scroll={{ x: 1500 }}
          onChange={(pagination, filters, sorter, extra) => {
            if (extra.action === "sort") return;
            landingApi({
              pagination,
              filerList: filters,
            });
          }}
        />
      </PCard>
      <PModal
        title="PF Fund Report"
        open={fundReportView.open}
        onCancel={() => {
          setFundReportView({ open: false, data: {} });
        }}
        components={<PFFundReportDetails form={form} data={fundReportView.data}/>}
        width={1400}
        height={"600px"}
      />
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default PFFundReport;
