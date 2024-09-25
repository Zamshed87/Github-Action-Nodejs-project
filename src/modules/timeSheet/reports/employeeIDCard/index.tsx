import { Col, Form, Row } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
  Avatar,
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PSelect,
} from "Components";
import { useApiRequest } from "Hooks";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { dateFormatter } from "utility/dateFormatter";
import { getSerial } from "Utils";
import { MdPrint } from "react-icons/md";
import { downloadFile } from "utility/downloadFile";
import Loading from "common/loading/Loading";

const EmployeePdfLanding = () => {
  // redux states
  const { orgId, buId, wgId, wId, employeeId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // States
  const [selectedRow, setSelectedRow] = useState<any[]>([]);
  const [filterListm, setFilterList] = useState({});
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);

  //   api states
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);
  const landingApi = useApiRequest({});

  //   Api calls
  const getWorkplaceGroup = () => {
    workplaceGroup?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "WorkplaceGroup",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId, // This should be removed
        intId: employeeId,
      },
      onSuccess: (res: any) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
  };
  const getWorkplace = () => {
    const { workplaceGroup } = form.getFieldsValue(true);
    workplace?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        intId: employeeId,
      },
      onSuccess: (res: any) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };

  const getLandingData = ({
    pagination = { current: 1, pageSize: 25 },
    searchText = "",
    filterList = filterListm,
  }: any) => {
    const { workplaceGroup, workplace, search } = form.getFieldsValue(true);
    const payload = {
      accountId: orgId,
      workplaceGroupId: workplaceGroup?.value || wgId,
      workplaceId: workplace?.value || wId,
      pageNo: pagination?.current,
      pageSize: pagination?.pageSize,
      isPaginated: true,
      isHeaderNeed: true,
      searchTxt: search || searchText,
      DepartmentList: filterList?.Department || [],
      DesignationList: filterList?.Designation || [],
    };
    landingApi.action({
      urlKey: "GetEmployeeIdCardLanding",
      method: "POST",
      payload: payload,
      onSuccess: (res: any) => {
        setPages({
          current: res?.CurrentPage,
          pageSize: res?.PageSize,
          total: res?.TotalCount,
        });
      },
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Employee ID Card";

    // api calls
    getWorkplaceGroup();
    getLandingData({});
  }, [buId, wgId, wId]);

  //   table rows
  const header: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: landingApi?.data?.CurrentPage,
          pageSize: landingApi?.data?.PageSize,
          index,
        }),
      width: 25,
      align: "center",
    },
    {
      title: "Employee Id",
      dataIndex: "EmployeeCode",
    },
    {
      title: "Employee Name",
      dataIndex: "EmployeeName",
      render: (_: any, rec: any) => {
        return (
          <div className="d-flex align-items-center">
            <Avatar title={rec?.EmployeeName} />
            <span className="ml-2">{rec?.EmployeeName}</span>
          </div>
        );
      },
      width: 80,
      sorter: true,
    },

    {
      title: "Department",
      dataIndex: "Department",
      sorter: true,
      filter: true,
      filterKey: "DepartmentList",
      filterSearch: true,
      width: 70,
    },
    {
      title: "Designation",
      dataIndex: "Designation",
      sorter: true,
      filter: true,
      filterKey: "DesignationList",
      filterSearch: true,
      width: 70,
    },
    {
      title: "Date of Joining",
      dataIndex: "JoiningDate",
      render: (_: any, rec: any) => dateFormatter(rec?.JoiningDate),
      width: 50,
    },
    {
      title: "Action",
      dataIndex: "",
      align: "center",
      render: (_: any, rec: any) =>
        selectedRow?.length === 0 && (
          <MdPrint
            style={{
              background: "var(--gray200)",
              borderRadius: "50%",
              padding: "3px 6px",
              fontSize: "24px",
              cursor: "pointer",
            }}
            onClick={() => {
              downloadFile(
                `/PdfAndExcelReport/IdCardPdf?EmployeeIds=${rec?.EmployeeId}&WorkplaceId=${wId}`,
                "Employee ID Cards",
                "pdf",
                setLoading
              );
              // axios
              //   .get(
              //     `/PdfAndExcelReport/IdCardPdfData?workplaceId=${wId}&employeeIds=${rec?.EmployeeId}`
              //   )
              //   .then((res) => {
              //     setEmployeePdfData(res?.data);
              //   });
            }}
          />
        ),
    },
  ];

  const selectedEmpIds = () => {
    const empIdList = selectedRow.map((data) => {
      return data?.EmployeeId;
    });
    return empIdList.join(",");
  };

  return (
    <PForm
      form={form}
      onFinish={() => {
        setSelectedRow([]);
        getLandingData({
          pagination: {
            current: pages?.current,
            pageSize: pages.pageSize,
          },
        });
      }}
    >
      {loading && <Loading />}
      <PCard>
        <PCardHeader
          title={`Total ${landingApi?.data?.TotalCount || 0} employees`}
          onSearch={(e) => {
            form.setFieldsValue({
              search: e?.target?.value,
            });
            getLandingData({ pages, searchText: e.target.value });
          }}
          buttonList={
            selectedRow?.length > 0
              ? [
                  {
                    type: "primary",
                    content: "Download",
                    onClick: () => {
                      downloadFile(
                        `/PdfAndExcelReport/IdCardPdf?EmployeeIds=${selectedEmpIds()}&WorkplaceId=${wId}`,
                        "Employee ID Cards",
                        "pdf",
                        setLoading
                      );
                    },
                  },
                ]
              : []
          }
        />

        <PCardBody className="mb-3">
          <Row gutter={[10, 2]}>
            <Col md={5} sm={12} xs={24}>
              <PSelect
                options={workplaceGroup?.data || []}
                name="workplaceGroup"
                label="Workplace Group"
                placeholder="Workplace Group"
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
                onChange={(value, op) => {
                  form.setFieldsValue({
                    workplace: op,
                  });
                }}
                // rules={[{ required: true, message: "Workplace is required" }]}
              />
            </Col>

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
          header={header}
          bordered
          data={landingApi?.data?.Data || []}
          loading={landingApi?.loading}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectedRow.map((item) => item?.key),
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRow(selectedRows);
            },
          }}
          pagination={{
            pageSize: landingApi?.data?.PageSize,
            total: landingApi?.data?.TotalCount,
            pageSizeOptions: ["25", "50", "100"],
          }}
          filterData={landingApi?.data?.EmployeeInfoHeader}
          onChange={(pagination, filters, sorter, extra) => {
            // Return if sort function is called
            if (extra.action === "sort") return;
            setFilterList(filters);
            setSelectedRow([]);
            getLandingData({
              pagination,
              searchText: form.getFieldValue("search"),
              filterList: filters,
            });
          }}
        />
      </PCard>
    </PForm>
  );
};

export default EmployeePdfLanding;
