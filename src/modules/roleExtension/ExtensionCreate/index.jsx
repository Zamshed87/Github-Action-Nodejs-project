/* eslint-disable no-unused-vars */
import { ArrowBack, DeleteOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import axios from "axios";
import { Form, Formik } from "formik";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import AsyncFormikSelect from "../../../common/AsyncFormikSelect";
import FormikSelect from "../../../common/FormikSelect";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import SortingIcon from "../../../common/SortingIcon";
import { gray200 } from "../../../utility/customColor";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import { customStyles } from "../../../utility/selectCustomStyle";
import {
  organizationTypeList,
  postRoleExtension,
  setOrganizationDDLFunc,
} from "./helper";
import { getPeopleDeskWithoutAllDDL } from "../../../common/api";

const initData = {
  intEmployeeId: "",
  employeeName: "",
  orgType: "",
  orgName: "",

  wing: "",
  soleDepo: "",
  region: "",
  area: "",
  territory: "",
};
const validationSchema = yup.object().shape({});

const CreateRoleExtension = ({ setCreateOrUpdate }) => {
  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData
  );
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [rowDto, setRowDto] = useState([]);

  const [employeeRoles, getEmployeeRoles] = useAxiosGet();

  const saveHandler = (values, cb) => {
    const payload = {
      intEmployeeId: +values?.intEmployeeId,
      intCreatedBy: +employeeId,
      roleExtensionRowViewModelList: rowDto,
    };
    cb && cb();
    postRoleExtension(payload, history, setLoading, setCreateOrUpdate);
    setRowDto([]);
  };

  const loadUserList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/Auth/GetUserList?businessUnitId=${buId}&workplaceGroupId=${wgId}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  const [organizationTypeDDL, setOrganizationTypeDDL] = useState([]);
  const [organizationDDL, setOrganizationDDL] = useState([]);

  const [wingDDL, setWingDDL] = useState([]);
  const [soleDepoDDL, setSoleDepoDDL] = useState([]);
  const [regionDDL, setRegionDDL] = useState([]);
  const [areaDDL, setAreaDDL] = useState([]);

  const [orgTypeOrder, setOrgTypeOrder] = useState("desc");
  const [orgOrder, setOrgOrder] = useState("desc");
  const commonSortByFilter = (filterType, property) => {
    const newRowData = [...rowDto];
    let modifyRowData = [];

    if (filterType === "asc") {
      modifyRowData = newRowData?.sort((a, b) => {
        if (a[property] > b[property]) return -1;
        return 1;
      });
    } else {
      // eslint-disable-next-line no-unused-vars
      modifyRowData = newRowData?.sort((a, b) => {
        if (b[property] > a[property]) return -1;
        return 1;
      });
    }
    setRowDto(modifyRowData);
  };

  const onRoleAdd = (values, setFieldValue) => {
    let modifyArr = [];

    // role Exist
    const isRoleExist = (values) => {
      let roleExist = false;

      // workplace group role extension exist check
      if (!values?.wing && values?.orgName) {
        roleExist = rowDto?.some(
          (item) =>
            item?.intOrganizationTypeId === values?.orgType?.value &&
            item?.intOrganizationReffId === values?.orgName?.value
        );
      }

      // wing role extension exist check
      if (!values?.soleDepo && values?.orgName && values?.wing) {
        roleExist = rowDto?.some(
          (item) =>
            item?.intOrganizationTypeId === 4 &&
            item?.intOrganizationReffId === values?.wing?.value
        );
      }

      // soleDepo role extension exist check
      if (
        !values?.region &&
        values?.orgName &&
        values?.wing &&
        values?.soleDepo
      ) {
        roleExist = rowDto?.some(
          (item) =>
            item?.intOrganizationTypeId === 5 &&
            item?.intOrganizationReffId === values?.soleDepo?.value
        );
      }

      // region role extension exist check
      if (
        !values?.area &&
        values?.orgName &&
        values?.wing &&
        values?.soleDepo &&
        values?.region
      ) {
        roleExist = rowDto?.some(
          (item) =>
            item?.intOrganizationTypeId === 6 &&
            item?.intOrganizationReffId === values?.region?.value
        );
      }

      // area role extension exist check
      if (
        values?.orgName &&
        values?.wing &&
        values?.soleDepo &&
        values?.region &&
        values?.area
      ) {
        roleExist = rowDto?.some(
          (item) =>
            item?.intOrganizationTypeId === 7 &&
            item?.intOrganizationReffId === values?.area?.value
        );
      }

      return roleExist;
    };

    if (isRoleExist(values)) {
      return toast.warn("Already exsist this role");
    }

    // all data check
    const isAllDataCheck = (typeValue) => {
      return rowDto.some(
        (itm) =>
          itm?.intOrganizationTypeId === typeValue &&
          itm?.intOrganizationReffId === 0
      );
    };

    // same work filed check
    const isSameWorkField = (fieldValue, typeValue) => {
      return rowDto.some(
        (itm) =>
          itm?.intOrganizationReffId === fieldValue &&
          itm?.intOrganizationTypeId === typeValue
      );
    };

    // modify filter Arr
    const modifyFinalArr = (filedType, values) => {
      if (filedType === "wing") {
        return isSameWorkField(values?.orgName?.value, 2)
          ? modifyArr.filter(
            (itm) => itm?.intOrganizationReffId !== values?.orgName?.value
          )
          : modifyArr;
      }

      if (filedType === "soleDepo") {
        return isSameWorkField(values?.wing?.value, 4)
          ? modifyArr.filter(
            (itm) =>
              itm?.intOrganizationReffId !== values?.orgName?.value &&
              itm?.intOrganizationReffId !== values?.wing?.value
          )
          : modifyArr;
      }

      if (filedType === "region") {
        return isSameWorkField(values?.soleDepo?.value, 5)
          ? modifyArr.filter(
            (itm) =>
              itm?.intOrganizationReffId !== values?.orgName?.value &&
              itm?.intOrganizationReffId !== values?.wing?.value &&
              itm?.intOrganizationReffId !== values?.soleDepo?.value
          )
          : modifyArr;
      }

      if (filedType === "area") {
        return isSameWorkField(values?.region?.value, 6)
          ? modifyArr.filter(
            (itm) =>
              itm?.intOrganizationReffId !== values?.orgName?.value &&
              itm?.intOrganizationReffId !== values?.wing?.value &&
              itm?.intOrganizationReffId !== values?.soleDepo?.value &&
              itm?.intOrganizationReffId !== values?.region?.value
          )
          : modifyArr;
      }
    };

    // workplace Group
    if (isAllDataCheck(2)) {
      return toast.warn("Workplace Group has all data exsist...");
    }

    modifyArr = [
      ...modifyArr,
      {
        intOrganizationTypeId: +values?.orgType?.value,
        strOrganizationTypeName: values?.orgType?.label,
        intOrganizationReffId: values?.orgName?.value,
        strOrganizationReffName: values?.orgName?.label,
      },
    ];

    // wing
    if (isAllDataCheck(4)) {
      return toast.warn("Wing has all data exsist...");
    }

    if (values?.wing?.value === 0 || values?.wing?.value) {
      if (values?.wing?.label === "All") {
        let modifyWing = rowDto.filter((itm) => itm?.intOrganizationTypeId < 4);
        modifyArr = [
          ...modifyWing,
          {
            intOrganizationTypeId: 4,
            strOrganizationTypeName: "Wing",
            intOrganizationReffId: values?.wing?.value,
            strOrganizationReffName: values?.wing?.label,
          },
        ];

        setRowDto([...modifyArr]);
      } else {
        modifyArr = [
          ...modifyFinalArr("wing", values),
          {
            intOrganizationTypeId: 4,
            strOrganizationTypeName: "Wing",
            intOrganizationReffId: values?.wing?.value,
            strOrganizationReffName: values?.wing?.label,
          },
        ];

        setRowDto([...rowDto, ...modifyArr]);
      }
    }

    // soleDepo
    if (isAllDataCheck(5)) {
      return toast.warn("Wing has all data exsist...");
    }

    if (values?.soleDepo?.value === 0 || values?.soleDepo?.value) {
      if (values?.soleDepo?.label === "All") {
        let modifySoleDepo = rowDto.filter(
          (itm) => itm?.intOrganizationTypeId < 5
        );
        modifyArr = [
          ...modifySoleDepo,
          {
            intOrganizationTypeId: 5,
            strOrganizationTypeName: "Sole Depo",
            intOrganizationReffId: values?.soleDepo?.value,
            strOrganizationReffName: values?.soleDepo?.label,
          },
        ];

        setRowDto([...modifyArr]);
      } else {
        modifyArr = [
          ...modifyFinalArr("soleDepo", values),
          {
            intOrganizationTypeId: 5,
            strOrganizationTypeName: "Sole Depo",
            intOrganizationReffId: values?.soleDepo?.value,
            strOrganizationReffName: values?.soleDepo?.label,
          },
        ];
        setRowDto([...rowDto, ...modifyArr]);
      }
    }

    // region
    if (isAllDataCheck(6)) {
      return toast.warn("Wing has all data exsist...");
    }

    if (values?.region?.value === 0 || values?.region?.value) {
      if (values?.region?.label === "All") {
        let modifyRegion = rowDto.filter(
          (itm) => itm?.intOrganizationTypeId < 6
        );
        modifyArr = [
          ...modifyRegion,
          {
            intOrganizationTypeId: 6,
            strOrganizationTypeName: "Region",
            intOrganizationReffId: values?.region?.value,
            strOrganizationReffName: values?.region?.label,
          },
        ];

        setRowDto([...modifyArr]);
      } else {
        modifyArr = [
          ...modifyFinalArr("region", values),
          {
            intOrganizationTypeId: 6,
            strOrganizationTypeName: "Region",
            intOrganizationReffId: values?.region?.value,
            strOrganizationReffName: values?.region?.label,
          },
        ];
        setRowDto([...rowDto, ...modifyArr]);
      }
    }

    // region
    if (isAllDataCheck(7)) {
      return toast.warn("Wing has all data exsist...");
    }

    if (values?.area?.value === 0 || values?.area?.value) {
      if (values?.area?.label === "All") {
        let modifyRegion = rowDto.filter(
          (itm) => itm?.intOrganizationTypeId < 7
        );
        modifyArr = [
          ...modifyRegion,
          {
            intOrganizationTypeId: 7,
            strOrganizationTypeName: "Area",
            intOrganizationReffId: values?.area?.value,
            strOrganizationReffName: values?.area?.label,
          },
        ];

        setRowDto([...modifyArr]);
      } else {
        modifyArr = [
          ...modifyFinalArr("area", values),
          {
            intOrganizationTypeId: 7,
            strOrganizationTypeName: "Area",
            intOrganizationReffId: values?.area?.value,
            strOrganizationReffName: values?.area?.label,
          },
        ];
        setRowDto([...rowDto, ...modifyArr]);
      }
    }

    setFieldValue("orgType", "");
    setFieldValue("orgName", "");

    setFieldValue("wing", "");
    setFieldValue("soleDepo", "");
    setFieldValue("region", "");
    setFieldValue("area", "");
  };

  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => resetForm(initData));
        }}
      >
        {({
          values,
          setFieldValue,
          errors,
          touched,
          handleSubmit,
          setValues,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              <div className="table-card create-policy-apply-page-wrapper">
                <div
                  className="table-card-heading"
                  style={{ marginBottom: "10px" }}
                >
                  <div className="d-flex align-items-center">
                    <IconButton onClick={() => history.goBack()}>
                      <ArrowBack
                        style={{
                          width: "18px",
                          height: "18px",
                          color: "#323232",
                        }}
                      />
                    </IconButton>
                    <h2 style={{ color: "#344054" }}>Create Role Extension</h2>
                  </div>
                  <div>
                    <button type="submit" className="btn btn-green">
                      Save
                    </button>
                  </div>
                </div>
                <div className="card-style">
                  <div className="row">
                    <div className="col-md-3">
                      <label className="mb-2">Select Employee</label>
                      <AsyncFormikSelect
                        selectedValue={values?.employeeName}
                        isSearchIcon={true}
                        handleChange={(valueOption) => {
                          if (!valueOption) {
                            setRowDto([]);
                            setFieldValue("employeeName", "");
                            setFieldValue("orgType", "");
                            setFieldValue("orgName", "");
                            return;
                          }
                          setFieldValue("intEmployeeId", valueOption?.value);
                          setFieldValue("employeeName", valueOption);
                          getEmployeeRoles(
                            `/Auth/GetAllRoleExtensionLanding?strReportType=ListForCreatePage&intEmployeeId=${valueOption?.value}&intAccountId=${orgId}`,
                            (data) => {
                              setRowDto([...data]);
                            }
                          );
                        }}
                        loadOptions={loadUserList}
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <label className="mb-2">Organization Type</label>
                      <FormikSelect
                        classes="input-sm"
                        styles={customStyles}
                        name="businessUnit"
                        options={organizationTypeList || []}
                        value={values?.orgType}
                        isDisabled={!values?.employeeName?.value}
                        onChange={(valueOption) => {
                          setFieldValue("orgName", "");
                          setFieldValue("orgType", valueOption);
                          setOrganizationDDLFunc(
                            wgId,
                            buId,
                            employeeId,
                            valueOption,
                            setOrganizationDDL
                          );
                        }}
                        errors={errors}
                        touched={touched}
                        placeholder=" "
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="mb-2">Organization Name</label>
                      <FormikSelect
                        isDisabled={!values?.orgType}
                        classes="input-sm"
                        styles={customStyles}
                        name="orgName"
                        options={organizationDDL || []}
                        value={values?.orgName}
                        onChange={(valueOption) => {
                          setFieldValue("orgName", valueOption);

                          if (valueOption?.label === "Marketing") {
                            setFieldValue("wing", "");
                            setFieldValue("soleDepo", "");
                            setFieldValue("region", "");
                            setFieldValue("area", "");

                            getPeopleDeskWithoutAllDDL(
                              `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WingDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${valueOption?.value}&ParentTerritoryId=0`,
                              "WingId",
                              "WingName",
                              setWingDDL
                            );
                          }
                        }}
                        errors={errors}
                        touched={touched}
                        placeholder=" "
                        isClearable={false}
                      />
                    </div>

                    {/* marketing setup */}
                    {values?.orgName?.label === "Marketing" && (
                      <div className="col-md-3">
                        <div className="input-field-main">
                          <label>Wing</label>
                          <FormikSelect
                            menuPosition="fixed"
                            name="wing"
                            options={
                              [{ value: 0, label: "All" }, ...wingDDL] || []
                            }
                            value={values?.wing}
                            onChange={(valueOption) => {
                              getPeopleDeskWithoutAllDDL(
                                `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=SoleDepoDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${values?.orgName?.value}&ParentTerritoryId=${valueOption?.value}`,
                                "SoleDepoId",
                                "SoleDepoName",
                                setSoleDepoDDL
                              );

                              setFieldValue("soleDepo", "");
                              setFieldValue("region", "");
                              setFieldValue("area", "");
                              setFieldValue("wing", valueOption);
                            }}
                            styles={customStyles}
                            placeholder=""
                            errors={errors}
                            touched={touched}
                            isClearable={false}
                          />
                        </div>
                      </div>
                    )}

                    {/* wing */}
                    {values?.wing && (
                      <div className="col-md-3">
                        <div className="input-field-main">
                          <label>Sole Depo</label>
                          <FormikSelect
                            menuPosition="fixed"
                            name="soleDepo"
                            options={
                              [{ value: 0, label: "All" }, ...soleDepoDDL] || []
                            }
                            value={values?.soleDepo}
                            onChange={(valueOption) => {
                              getPeopleDeskWithoutAllDDL(
                                `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=RegionDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${values?.orgName?.value}&ParentTerritoryId=${valueOption?.value}`,
                                "RegionId",
                                "RegionName",
                                setRegionDDL
                              );
                              setFieldValue("region", "");
                              setFieldValue("area", "");
                              setFieldValue("soleDepo", valueOption);
                            }}
                            styles={customStyles}
                            placeholder=""
                            errors={errors}
                            touched={touched}
                            isClearable={false}
                          />
                        </div>
                      </div>
                    )}

                    {/* soleDepo */}
                    {values?.soleDepo && (
                      <div className="col-md-3">
                        <div className="input-field-main">
                          <label>Region</label>
                          <FormikSelect
                            menuPosition="fixed"
                            name="region"
                            options={
                              [{ value: 0, label: "All" }, ...regionDDL] || []
                            }
                            value={values?.region}
                            onChange={(valueOption) => {
                              getPeopleDeskWithoutAllDDL(
                                `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=AreaDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${values?.orgName?.value}&ParentTerritoryId=${valueOption?.value}`,
                                "AreaId",
                                "AreaName",
                                setAreaDDL
                              );
                              setFieldValue("area", "");
                              setFieldValue("region", valueOption);
                            }}
                            styles={customStyles}
                            placeholder=""
                            errors={errors}
                            touched={touched}
                            isClearable={false}
                          />
                        </div>
                      </div>
                    )}

                    {/* region */}
                    {values?.region && (
                      <div className="col-md-3">
                        <div className="input-field-main">
                          <label>Area</label>
                          <FormikSelect
                            menuPosition="fixed"
                            name="area"
                            options={
                              [{ value: 0, label: "All" }, ...areaDDL] || []
                            }
                            value={values?.area}
                            onChange={(valueOption) => {
                              setFieldValue("area", valueOption);
                            }}
                            styles={customStyles}
                            placeholder=""
                            errors={errors}
                            touched={touched}
                            isClearable={false}
                          />
                        </div>
                      </div>
                    )}

                    <div className="col-md-1">
                      <button
                        disabled={
                          !values?.employeeName ||
                          !values?.orgName ||
                          !values?.orgType
                        }
                        className="btn btn-green"
                        style={{ marginTop: "27px" }}
                        type="button"
                        onClick={() => {
                          onRoleAdd(values, setFieldValue);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="table-card-body">
                  <div
                    className="table-card-heading"
                    style={{
                      marginBottom: "3px",
                      marginTop: "12px",
                    }}
                  >
                    <h2>Role Extension List</h2>
                  </div>

                  <div
                    className="table-card-styled tableOne"
                    style={{ marginTop: "12px" }}
                  >
                    {rowDto.length < 1 ? (
                      <NoResult title="No Result Found" para="" />
                    ) : (
                      <table
                        className="table"
                        style={{ borderTop: `1px solid ${gray200}` }}
                      >
                        <thead>
                          <tr className="py-1">
                            <th>SL</th>
                            <th>
                              <div
                                onClick={(e) => {
                                  setOrgTypeOrder(
                                    orgTypeOrder === "desc" ? "asc" : "desc"
                                  );
                                  commonSortByFilter(
                                    orgTypeOrder,
                                    "strOrganizationTypeName"
                                  );
                                }}
                                className="sortable"
                              >
                                <span className="mr-1"> Org Type</span>
                                <SortingIcon viewOrder={orgTypeOrder} />
                              </div>
                            </th>
                            <th>
                              <div
                                onClick={(e) => {
                                  setOrgOrder(
                                    orgOrder === "desc" ? "asc" : "desc"
                                  );
                                  commonSortByFilter(
                                    orgOrder,
                                    "strOrganizationReffName"
                                  );
                                }}
                                className="sortable"
                              >
                                <span className="mr-1"> Org Name</span>
                                <SortingIcon viewOrder={orgOrder} />
                              </div>
                            </th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((item, index) => (
                            <tr className="hasEvent" key={index + 1}>
                              <td>
                                <p className="tableBody-title pl-1">
                                  {index + 1}
                                </p>
                              </td>
                              <td>
                                <p className="tableBody-title">
                                  {item?.strOrganizationTypeName}
                                </p>
                              </td>
                              <td>
                                <p className="tableBody-title">
                                  {item?.strOrganizationReffName}
                                </p>
                              </td>
                              <td>
                                <div className="d-flex align-items-center justify-content-end">
                                  <button
                                    type="button"
                                    className="iconButton mt-0 mt-md-2 mt-lg-0"
                                    onClick={() =>
                                      setRowDto((prev) => [
                                        ...prev.filter(
                                          (prev_item, item_index) =>
                                            item_index !== index
                                        ),
                                      ])
                                    }
                                  >
                                    <DeleteOutlined />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default CreateRoleExtension;
