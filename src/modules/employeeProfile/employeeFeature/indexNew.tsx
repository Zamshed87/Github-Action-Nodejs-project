import { AddOutlined } from "@mui/icons-material";
import {
  Avatar,
  DataTable,
  PCard,
  PCardHeader,
  PForm,
  TableButton,
} from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { getSerial } from "Utils";
import { Form } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatter } from "../../../utility/dateFormatter";
import AddEditForm from "./addEditFile";
import "./styles.css";

function EmployeeFeatureNew() {
  // hook
  const dispatch = useDispatch();
  const history = useHistory();

  // redux
  const { buId, wgId, wgName, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  // state
  const [open, setOpen] = useState(false);

  // Form Instance
  const [form] = Form.useForm();

  // Api Instance
  const landingApi = useApiRequest({});
  const GetBusinessDetailsByBusinessUnitId = useApiRequest({});

  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filerList?: any;
    searchText?: string;
  };
  const landingApiCall = ({
    pagination = {},
    filerList,
    searchText = "",
  }: TLandingApi = {}) => {
    const payload = {
      businessUnitId: buId,
      workplaceGroupId: wgId,
      workplaceId: wId,
      pageNo: pagination?.current || 1,
      pageSize: pagination?.pageSize || 25,
      isPaginated: true,
      isHeaderNeed: true,
      searchTxt: searchText || "",
      strDepartmentList: filerList?.strDepartment || [],
      strDesignationList: filerList?.strDesignation || [],
      strSupervisorNameList: filerList?.strSupervisorName || [],
      strEmploymentTypeList: filerList?.strEmploymentType || [],
      strLinemanagerList: filerList?.strLinemanager || [],
      wingNameList: [],
      soleDepoNameList: [],
      regionNameList: [],
      areaNameList: [],
      territoryNameList: [],
    };
    landingApi.action({
      urlKey: "EmployeeProfileLandingPaginationWithMasterFilter",
      method: "POST",
      payload: payload,
    });
  };

  const getBUDetails = () => {
    GetBusinessDetailsByBusinessUnitId?.action({
      urlKey: "GetBusinessDetailsByBusinessUnitId",
      method: "GET",
      params: {
        businessUnitId: buId,
      },
    });
  };

  useEffect(() => {
    landingApiCall();
    getBUDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  // menu permission
  let employeeFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 8) {
      employeeFeature = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchFunc = debounce((value) => {
    landingApiCall({ searchText: value });
  }, 500);

  // Header
  const header = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: landingApi?.data?.currentPage,
          pageSize: landingApi?.data?.pageSize,
          index,
        }),
      fixed: "left",
      width: 25,
      align: "center",
    },
    {
      title: "Employee ID",
      dataIndex: "strEmployeeCode",
      sorter: true,
      fixed: "left",
    },
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      render: (_: any, rec: any) => {
        return (
          <div className="d-flex align-items-center">
            <Avatar title={rec?.strEmployeeName} />
            <span className="ml-2">{rec?.strEmployeeName}</span>
          </div>
        );
      },
      sorter: true,
      fixed: "left",
    },
    {
      title: "Reference Id",
      dataIndex: "strReferenceId",
      sorter: true,
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sorter: true,
      filter: true,
      filterKey: "strDesignationList",
      filterSearch: true,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sorter: true,
      filter: true,
      filterKey: "strDepartmentList",
      filterSearch: true,
    },
    {
      title: "Wing",
      dataIndex: "wingName",
      sorter: true,
      filter: true,
      filterKey: "wingNameList",

      hidden: wgName === "Marketing" ? false : true,
    },
    {
      title: "Sole Depo",
      dataIndex: "soleDepoName",
      sorter: true,
      filter: true,
      filterKey: "soleDepoNameList",
      hidden: wgName === "Marketing" ? false : true,
    },
    {
      title: "Region",
      dataIndex: "regionName",
      sorter: true,
      filter: true,
      filterKey: "regionNameList",
      hidden: wgName === "Marketing" ? false : true,
    },
    {
      title: "Area",
      dataIndex: "areaName",
      sorter: true,
      filter: true,
      filterKey: "areaNameList",
      hidden: wgName === "Marketing" ? false : true,
    },
    {
      title: "Territory",
      dataIndex: "territoryName",
      sorter: true,
      hidden: wgName === "Marketing" ? false : true,
    },
    {
      title: "Supervisor",
      dataIndex: "strSupervisorName",
      sorter: true,
      filter: true,
      filterKey: "strSupervisorNameList",
    },
    {
      title: "Line Manager",
      dataIndex: "strLinemanager",
      sorter: true,
      filter: true,
      filterKey: "strLinemanagerList",
    },
    {
      title: "Pin Number",
      dataIndex: "pinNo",
      sorter: true,
    },
    {
      title: "Contact No",
      dataIndex: "contactNo",
      sorter: true,
    },
    {
      title: "Type",
      dataIndex: "strEmploymentType",
      sorter: true,
      filter: true,
      filterKey: "strEmploymentTypeList",
    },
    {
      title: "Joining Date",
      dataIndex: "dteJoiningDate",
      render: (_: any, rec: any) => dateFormatter(rec?.dteJoiningDate),
      sorter: true,
      dataType: "date",
    },
    {
      width: 50,
      align: "center",
      render: (_: any, rec: any) => (
        <TableButton
          buttonsList={[
            {
              type: "edit",
              onClick: () => {
                history.push({
                  pathname: `/profile/employee/${rec?.intEmployeeBasicInfoId}`,
                  state: {
                    buId: rec?.intBusinessUnitId,
                    wgId: rec?.intWorkplaceGroupId,
                  },
                });
              },
            },
          ]}
        />
      ),
    },
  ];
  console.log(landingApi?.data);
  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        onFinish={() => {
          setOpen(true);
        }}
      >
        <PCard>
          <PCardHeader
            exportIcon={true}
            title={`Total ${landingApi?.data?.totalCount || 0} employees`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
            }}
            submitText="Create New"
            submitIcon={<AddOutlined />}
            onExport={() => {
              console.log("ecport");
            }}
          />

          {/* Example Using Data Table Designed By Ant-Design v4 */}
          <DataTable
            bordered
            data={landingApi?.data?.data || []}
            loading={landingApi?.loading}
            header={header?.filter((item) => !item?.hidden)}
            pagination={{
              pageSize: landingApi?.data?.pageSize,
              total: landingApi?.data?.totalCount,
            }}
            filterData={landingApi?.data?.employeeHeader}
            onChange={(pagination, filters, sorter, extra) => {
              // Return if sort function is called
              if (extra.action === "sort") return;
              const { search } = form.getFieldsValue(true);
              landingApiCall({
                pagination,
                filerList: filters,
                searchText: search,
              });
            }}
            scroll={{ x: 2000 }}
          />
        </PCard>
      </PForm>

      <PModal
        open={open}
        title="Create New Employee"
        width=""
        onCancel={() => setOpen(false)}
        components={
          <>
            <AddEditForm
              getData={landingApiCall}
              setIsAddEditForm={setOpen}
              isEdit={false}
              pages={undefined}
              singleData={undefined}
            />
          </>
        }
      />
    </>
  ) : (
    <NotPermittedPage />
  );
}

export default EmployeeFeatureNew;
