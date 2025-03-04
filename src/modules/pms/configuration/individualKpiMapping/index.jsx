import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import AntTable from "../../../../common/AntTable";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";
import FormikSelect from "../../../../common/FormikSelect";
import ViewModal from "../../../../common/ViewModal";
import {
  getAsyncEmployeeCommonApi,
  getPeopleDeskAllDDL,
} from "../../../../common/api";
import Loading from "../../../../common/loading/Loading";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { individualKpiMappingTableColumn } from "./helper";
import IndividualKpiViewModal from "./individualKpiViewModal";
import AntScrollTable from "../../../../common/AntScrollTable";
import axios from "axios";
import { Tooltip } from "antd";

const IndividualKpiMapping = () => {
  // 30462
  const [selectedData, setSelectedData] = useState(null);
  const [showKpiViewModal, setShowKpiViewModal] = useState(false);

  const { employeeId, orgId, buId, buName, wId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const initData = {
    businessUnit: {
      value: buId,
      label: buName,
    },
    department: "",
    employee: "",
    targetType: "",
    supervisorName: "",
  };

  const history = useHistory();
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [tableData, getTableData, tableDataLoader, setTableData] =
    useAxiosGet();

  useEffect(() => {
    if (initData?.businessUnit?.value) {
      getPeopleDeskAllDDL(
        `/PMS/GetUserWiseDepartmentAndEmployeeListDDL?userId=${employeeId}`,
        "DepartmentId",
        "DepartmentName",
        setDepartmentDDL
      );
    }
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&AccountId=${orgId}&BusinessUnitId=${buId}&intId=${employeeId}&workplaceGroupId=${wgId}`,
      "intBusinessUnitId",
      "strBusinessUnit",
      setBusinessUnitDDL
    );
    getData(initData, pages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, employeeId]);

  const [pages, setPages] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const { values, setFieldValue } = useFormik({
    initialValues: initData,
  });

  const getSuperVisorDDL = async ({ value, minSearchLength = 3 }) => {
    if (value?.length < minSearchLength) return;
    try {
      const response = await axios.get("/PeopleDeskDDL/PeopleDeskAllDDL", {
        params: {
          DDLType: "EmployeeBasicInfoForEmpMgmt",
          AccountId: orgId,
          BusinessUnitId: buId,
          intId: employeeId,
          workplaceGroupId: wgId,
          strWorkplaceIdList: wId,
          searchTxt: value || "",
        },
      });

      const formattedData =
        response?.data?.map((item) => ({
          label: item?.EmployeeOnlyName,
          value: item?.EmployeeId,
        })) || [];
      return formattedData;
    } catch (error) {
      console.error("Failed to fetch supervisor data:", error);
      // supervisorDDL?.reset();
    }
  };

  const getAsyncEmployeeApi = async ({
    orgId,
    buId,
    intId,
    value,
    minSearchLength = 3,
  }) => {
    if (value?.length < minSearchLength) return;
    try {
      const response = await axios.get(
        `/PMS/GetUserWiseDepartmentAndEmployeeListDDL?userId=${employeeId}&type=Employee&search=${
          value || ""
        }`
      );

      return response?.data;
    } catch (_) {
      return [];
    }
  };

  const getData = (values, pages) => {
    getTableData(
      `/PMS/GetKpiMappingLanding?accountId=${orgId}&businessUnitId=${
        values?.businessUnit?.value
      }&departmentId=${values?.department?.value || 0}&employeeId=${
        values?.employee?.value || 0
      }&pageNo=${pages?.current}&pageSize=${pages?.pageSize}`,
      (data) => {
        if (data) {
          setPages((prev) => ({
            ...prev,
            total: data?.totalCount,
          }));
        }
        return data;
      }
    );
  };

  const handleTableChange = ({ pagination }) => {
    setPages((prev) => ({ ...prev, ...pagination }));
    if (
      (pages?.current === pagination?.current &&
        pages?.pageSize !== pagination?.pageSize) ||
      pages?.current !== pagination?.current
    ) {
      return getData(values, pagination);
    }
  };

  return (
    <>
      {tableDataLoader && <Loading />}
      <div className="table-card">
        <div className="table-card-heading" style={{ marginBottom: "12px" }}>
          <div>
            <h2 style={{ color: "#344054" }}>KPI Mapping</h2>
          </div>
          <ul className="d-flex flex-wrap">
            <li>
              <div className="d-flex align-items-center justify-content-center">
                <Tooltip title="Departmental KPIs Setup(Superadmin)" arrow>
                  <button
                    style={{
                      height: "27px",
                      fontSize: "14px",
                      padding: "0px 12px 0px 12px",
                      margin: "0px 5px 0px 5px",
                      backgroundColor: "var(--success800)",
                      color: "white",
                    }}
                    className="btn"
                    type="button"
                    onClick={(e) => {
                      history.push(
                        `/pms/configuration/kpimapping/departmentWise/edit/1`
                        // {
                        //   deptName: record?.departmentName,
                        //   deptId: record?.departmentId,
                        //   designationName: record?.designationName,
                        //   designationId: record?.designationId,
                        //   employeeName: record?.employeeName,
                        //   employeeId: record?.employeeId,
                        // }
                      );
                    }} //
                  >
                    Departmental KPIs Setup
                  </button>
                </Tooltip>
              </div>
            </li>
          </ul>
        </div>
        <div className="card-style pb-2 mb-2">
          <div className="row">
            {/* <div className="col-lg-3">
              <div className="input-field-main">
                <label>Business Unit</label>
                <FormikSelect
                  name="businessUnit"
                  isClearable={false}
                  options={businessUnitDDL || []}
                  value={values?.businessUnit}
                  onChange={(valueOption) => {
                    setTableData([]);
                    if (valueOption) {
                      setFieldValue("businessUnit", valueOption);
                      getPeopleDeskAllDDL(
                        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment&AccountId=${orgId}&BusinessUnitId=${valueOption?.value}&intId=0&workplaceGroupId=${wgId}&intWorkplaceId=${wId}`,
                        "DepartmentId",
                        "DepartmentName",
                        setDepartmentDDL
                      );
                    } else {
                      setFieldValue("businessUnit", "");
                      setFieldValue("department", "");
                      setDepartmentDDL([]);
                    }
                  }}
                  placeholder=""
                  styles={customStyles}
                />
              </div>
            </div> */}
            {/* <div className="col-lg-3">
              <div className="input-field-main">
                <label>Supervisor Name</label>
                <AsyncFormikSelect
                  isClear={true}
                  selectedValue={values?.supervisorName}
                  styles={{
                    control: (provided) => ({
                      ...customStyles?.control(provided),
                      width: "100%",
                    }),
                  }}
                  isSearchIcon={true}
                  handleChange={(valueOption) => {
                    setFieldValue("supervisorName", valueOption);
                    setTableData([]);
                  }}
                  loadOptions={async (value) => {
                    return getSuperVisorDDL({
                      value,
                    });
                  }}
                />
              </div>
            </div> */}
            <div className="col-md-3">
              <div className="input-field-main">
                <label>Department</label>
                <FormikSelect
                  name="department"
                  placeholder=""
                  options={departmentDDL || []}
                  value={values?.department}
                  onChange={(valueOption) => {
                    setTableData([]);
                    setFieldValue("department", valueOption);
                  }}
                  styles={customStyles}
                />
              </div>
            </div>

            <div className="col-lg-3">
              <div className="input-field-main">
                <label>Employee</label>
                <AsyncFormikSelect
                  isClear={true}
                  selectedValue={values?.employee}
                  styles={{
                    control: (provided) => ({
                      ...customStyles?.control(provided),
                      width: "100%",
                    }),
                  }}
                  isSearchIcon={true}
                  handleChange={(valueOption) => {
                    setTableData([]);
                    setFieldValue("employee", valueOption);
                  }}
                  loadOptions={async (value) => {
                    return getAsyncEmployeeApi({
                      orgId,
                      buId: values?.businessUnit?.value,
                      intId: 0,
                      value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-lg-3">
              <label>Type</label>
              <FormikSelect
                classes="input-sm form-control"
                name="targetType"
                options={[
                  {
                    value: 0,
                    label: "All",
                  },
                  {
                    value: 1,
                    label: "Target Assigned",
                  },
                  {
                    value: 2,
                    label: "Target Not Assigned",
                  },
                ]}
                value={values?.targetType}
                onChange={(valueOption) => {
                  setFieldValue("targetType", valueOption);
                  setTableData([]);
                }}
                styles={customStyles}
              />
            </div>
            <div className="col-lg-3">
              <button
                type="button"
                className="btn btn-green mr-2"
                style={{ marginTop: "22px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  getData(values, pages);
                }}
                disabled={!values?.businessUnit}
              >
                View
              </button>
            </div>
          </div>
        </div>
        {/* table */}
        <div className="table-card-body">
          {tableData?.data?.length ? (
            <div className="table-card-styled table-responsive tableOne">
              <AntScrollTable
                data={tableData?.data}
                columnsData={individualKpiMappingTableColumn({
                  values,
                  history,
                  setSelectedData,
                  setShowKpiViewModal,
                })}
                rowKey={(record) => record?.id}
                pages={pages?.pageSize}
                pagination={pages}
                handleTableChange={handleTableChange}
              />
            </div>
          ) : null}
        </div>
        <ViewModal
          size="lg"
          title="Mapped KPI"
          backdrop="static"
          classes="default-modal preview-modal"
          show={showKpiViewModal}
          onHide={() => setShowKpiViewModal(false)}
        >
          <IndividualKpiViewModal selectedData={selectedData} />
        </ViewModal>
      </div>
    </>
  );
};

export default IndividualKpiMapping;
