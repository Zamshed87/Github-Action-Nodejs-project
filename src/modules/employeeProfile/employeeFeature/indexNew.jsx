import { AddOutlined, SaveAlt } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useApiRequest } from "Hooks";
import axios from "axios";
import { Form, Formik } from "formik";
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
import { PButton, PCard, PCardBody, PCardHeader, PForm } from "Components";
import { ModalFooter, PModal } from "Components/Modal";

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
  const [isAddEditForm, setIsAddEditForm] = useState(false);

  // landing table
  const [headerList, setHeaderList] = useState({});
  const [checkedHeaderList, setCheckedHeaderList] = useState({
    ...initHeaderList,
  });
  const [resEmpLanding, setEmpLanding] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const [filterOrderList, setFilterOrderList] = useState([]);
  const [initialHeaderListData, setInitialHeaderListData] = useState({});

  // Api Instance
  const landingApi = useApiRequest({});

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

  useEffect(() => {
    landingApiCall();
  }, [buId, wgId, wId]);

  // landing api call
  const getDataApiCall = async (
    modifiedPayload,
    pagination,
    searchText,
    currentFilterSelection = -1,
    checkedHeaderList
  ) => {
    const payload = {
      businessUnitId: buId,
      workplaceGroupId: wgId,
      workplaceId: wId,
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      isPaginated: true,
      isHeaderNeed: true,
      searchTxt: searchText || "",
      ...modifiedPayload,
    };

    try {
      const res = await axios.post(
        `/Employee/EmployeeProfileLandingPaginationWithMasterFilter`,
        payload
      );
      console.log(res?.data);
      if (res?.data?.data) {
        setHeaderListDataDynamically({
          currentFilterSelection,
          checkedHeaderList,
          headerListKey: "employeeHeader",
          headerList,
          setHeaderList,
          response: res?.data,
          filterOrderList,
          setFilterOrderList,
          initialHeaderListData,
          setInitialHeaderListData,
          setEmpLanding,
          setPages,
        });

        setLandingLoading(false);
      }
    } catch (error) {
      setLandingLoading(false);
    }
  };

  const getData = async (
    pagination,
    IsForXl = "false",
    searchText = "",
    currentFilterSelection = -1,
    filterOrderList = [],
    checkedHeaderList = { ...initHeaderList }
  ) => {
    setLandingLoading(true);
    const modifiedPayload = createPayloadStructure({
      initHeaderList,
      currentFilterSelection,
      checkedHeaderList,
      filterOrderList,
    });

    getDataApiCall(
      modifiedPayload,
      pagination,
      searchText,
      currentFilterSelection,
      checkedHeaderList
    );
  };

  const handleChangePage = (_, newPage, searchText) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData(
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      },
      "false",
      searchText,
      -1,
      filterOrderList,
      checkedHeaderList
    );
  };

  const handleChangeRowsPerPage = (event, searchText) => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData(
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      "false",
      searchText,
      -1,
      filterOrderList,
      checkedHeaderList
    );
  };

  // menu permission
  let employeeFeature = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 8) {
      employeeFeature = item;
    }
  });

  useEffect(() => {
    setHeaderList({});
    setEmpLanding([]);
    getBuDetails(buId, setBuDetails, setLoading);
    getData(pages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wgId, wId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PForm>
        <PCard>
          <PCardHeader
            backButton
            exportIcon={true}
            title="Total 64 employees"
            onSearch={(value) => {}}
            buttonList={[
              {
                type: "primary",
                content: "Create New",
                icon: "plus",
                onClick: () => {
                  setIsAddEditForm(true);
                },
              },
            ]}
          />
          <PCardBody>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sequi
              nulla, asperiores eum perferendis ipsum odio, nisi placeat sint
              dolore praesentium earum dolor illum distinctio quod aut itaque
              possimus nihil porro! Provident assumenda quidem modi repellat.
              Ullam culpa voluptates nesciunt optio minima excepturi praesentium
              aliquam in expedita ratione. Sapiente, corporis ex.
            </p>
          </PCardBody>
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
        open={isAddEditForm}
        title="Create New Employee"
        components={
          <>
            <AddEditForm
              getData={getData}
              pages={pages}
              setIsAddEditForm={setIsAddEditForm}
            />
          </>
        }
      />
    </>
  );
}

export default EmployeeFeatureNew;
