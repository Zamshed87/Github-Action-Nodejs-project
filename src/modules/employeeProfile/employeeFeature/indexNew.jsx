import { AddOutlined, SaveAlt } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useApiRequest } from "Hooks";
import axios from "axios";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import MasterFilter from "../../../common/MasterFilter";
import PrimaryButton from "../../../common/PrimaryButton";
import ViewModal from "../../../common/ViewModal";
import Loading from "../../../common/loading/Loading";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import {
  createPayloadStructure,
  setHeaderListDataDynamically,
} from "../../../common/peopleDeskTable/helper";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray900 } from "../../../utility/customColor";
import { createCommonExcelFile } from "../../../utility/customExcel/generateExcelAction";
import { dateFormatter } from "../../../utility/dateFormatter";
import { paginationSize } from "./../../../common/peopleDeskTable/index";
import AddEditForm from "./addEditFile";
import {
  columnForHeadOffice,
  columnForMarketing,
  getBuDetails,
  getTableDataEmployee,
  newEmpListColumn,
} from "./helper";
import "./styles.css";
import {
  Avatar,
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  TableButton,
} from "Components";
import { ModalFooter, PModal } from "Components/Modal";
import { Form } from "antd";
import { getSerial } from "Utils";

const initData = {
  searchString: "",
  payrollGroup: "",
  supervisor: "",
  rosterGroup: "",
  department: "",
  designation: "",
  calendar: "",
  gender: "",
  religion: "",
  employementType: "",
  joiningFromDate: "",
  joiningToDate: "",
  contractualFromDate: "",
  contractualToDate: "",
  employmentStatus: "",
};

const initHeaderList = {
  strDepartmentList: [],
  strDesignationList: [],
  strSupervisorNameList: [],
  strEmploymentTypeList: [],
  strLinemanagerList: [],
  wingNameList: [],
  soleDepoNameList: [],
  regionNameList: [],
  areaNameList: [],
  territoryNameList: [],
};

function EmployeeFeatureNew() {
  // hook
  const dispatch = useDispatch();
  const history = useHistory();

  // redux
  const { buId, buName, wgId, wgName, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  // state
  const [loading, setLoading] = useState(false);
  const [landingLoading, setLandingLoading] = useState(false);
  const [buDetails, setBuDetails] = useState("");
  const [open, setOpen] = useState(false);

  // landing table
  const [headerList, setHeaderList] = useState({});
  const [checkedHeaderList, setCheckedHeaderList] = useState({
    ...initHeaderList,
  });
  const [resEmpLanding, setEmpLanding] = useState([]);

  // Form Instance
  const [form] = Form.useForm();

  // Api Instance
  const landingApi = useApiRequest({});
  const GetBusinessDetailsByBusinessUnitId = useApiRequest({});

  const landingApiCall = (pagination = {}, filerList = {}, searchText = "") => {
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
      method: "post",
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
  let employeeFeature = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 8) {
      employeeFeature = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Header
  const header = [
    {
      title: "SL",
      render: (_, rec, index) =>
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
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <Avatar title={record?.strEmployeeName} />
            <span className="ml-2">{record?.strEmployeeName}</span>
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
      render: (_, record) => dateFormatter(record?.dteJoiningDate),
      sorter: true,
      dataType: "date",
    },
    {
      width: 50,
      align: "center",
      render: (_, record) => (
        <TableButton
          buttonsList={[
            {
              type: "edit",
              onClick: () => {
                history.push({
                  pathname: `/profile/employee/${record?.intEmployeeBasicInfoId}`,
                  state: {
                    buId: record?.intBusinessUnitId,
                    wgId: record?.intWorkplaceGroupId,
                  },
                });
              },
            },
          ]}
        />
      ),
    },
  ];
  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        onFinish={(values) => {
          setOpen(true);
        }}
      >
        <PCard>
          <PCardHeader
            backButton
            exportIcon={true}
            title="Total 64 employees"
            onSearch={(value) => {}}
            submitText="Create New"
            submitIcon={<AddOutlined />}
            // buttonList={[
            //   {
            //     type: "primary",
            //     content: "Create New",
            //     icon: "plus",
            //     onClick: () => {
            //       setIsAddEditForm(true);
            //     },
            //   },
            // ]}
          />

          {/* Example Using Data Table Designed By Ant-Design v4 */}
          <DataTable
            bordered
            data={[] || landingApi?.data?.data || []}
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
              landingApiCall(pagination, filters, search);
            }}
            scroll={{ x: 2000 }}
          />
        </PCard>
      </PForm>
      {/* <ViewModal
      show={isAddEditForm}
      title="Create New Employee"
      onHide={() => setIsAddEditForm(false)}
      size="lg"
      backdrop="static"
      classes="default-modal form-modal"
    >
      <AddEditForm
        getData={getData}
        pages={pages}
        setIsAddEditForm={setIsAddEditForm}
      />
    </ViewModal> */}

      <PModal
        open={open}
        title="Create New Employee"
        width=""
        onCancel={() => setOpen(false)}
        components={
          <>
            <AddEditForm getData={landingApiCall} setIsAddEditForm={setOpen} />
          </>
        }
      />
    </>
  ) : (
    <NotPermittedPage />
  );
}

export default EmployeeFeatureNew;
