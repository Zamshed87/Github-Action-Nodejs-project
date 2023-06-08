import { Refresh } from "@mui/icons-material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AntTable from "../../../common/AntTable";
import {
  getPeopleDeskAllDDL,
  getSearchEmployeeList,
} from "../../../common/api";
import FormikSelect from "../../../common/FormikSelect";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosPost from "../../../utility/customHooks/useAxiosPost";
import { customStyles } from "../../../utility/selectCustomStyle";

import {
  assetRequisitionAssignColumns,
  getRequisitionAssignLanding,
  sendAssetForApproval,
} from "./helper";
import AsyncFormikSelect from "../../../common/AsyncFormikSelect";

const initData = {
  search: "",
  businessUnit: "",
  workplaceGroup: "",
  workplace: "",
  employee: "",
  status: "",
};

export default function RequisitionAssign() {
  // hooks
  const dispatch = useDispatch();
  const [isFilter, setIsFilter] = useState(false);

  // redux data
  const { orgId, buId, employeeId, intBusinessUnitId, strBusinessUnit, wgId } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);

  // state
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [status, setStatus] = useState("");
  const [, deniedAssetRequisition, deniedAssetRequisitionLoading] =
    useAxiosPost({});

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  // ddl
  const [workplaceDDL, setWorkplaceDDL] = useState([]);

  const { handleSubmit, values, errors, touched, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...initData,
      businessUnit: { value: intBusinessUnitId, label: strBusinessUnit },
    },
    onSubmit: () => saveHandler(),
  });

  const saveHandler = () => {
    const callBack = () => {
      getRequisitionAssignLanding(
        orgId,
        values,
        setRowDto,
        setLoading,
        setAllData
      );
    };
    const modifyFilterRowDto = rowDto.filter((itm) => itm.isAssigned === true);
    const payload = modifyFilterRowDto.map((item) => {
      return {
        assetRequisitionId: item?.assetRequisitionId,
        accountId: item?.accountId,
        businessUnitId: item?.businessUnitId,
        reqisitionQuantity: item?.reqisitionQuantity,
      };
    });
    sendAssetForApproval(payload, setLoading, callBack);
  };

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&AccountId=${orgId}&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      "intWorkplaceId",
      "strWorkplace",
      setWorkplaceDDL
    );
  }, [orgId, buId, employeeId, wgId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Asset Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30348) {
      permission = item;
    }
  });

  // single grid check
  const rowDtoHandler = (record) => {
    const modifiedRowDto = rowDto?.map((item) =>
      item?.assetRequisitionId === record?.assetRequisitionId
        ? { ...item, isAssigned: !item?.isAssigned }
        : item
    );
    setRowDto(modifiedRowDto);
  };

  const quantityHandler = (name, index, value) => {
    const data = [...rowDto];
    data[index][name] = value;
    setRowDto(data);
  };

  return (
    <>
      {(loading || deniedAssetRequisitionLoading) && <Loading />}
      <form onSubmit={handleSubmit}>
        {permission?.isCreate ? (
          <div className="table-card">
            <div className="table-card-heading mt-4 pt-2">
              <div className="table-card-head-right">
                <div></div>
              </div>
            </div>

            <div className="card-style with-form-card mt-3">
              <div className="row">
                {/*     <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Business Unit</label>
                    <FormikSelect
                      name="businessUnit"
                      options={businessUnitDDL || []}
                      value={values?.businessUnit}
                      onChange={(valueOption) => {
                        getPeopleDeskAllDDL(
                          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&WorkplaceGroupId=0&BusinessUnitId=${valueOption?.value}&intId=${employeeId}`,
                          "intWorkplaceGroupId",
                          "strWorkplaceGroup",
                          setWorkplaceGroupDDL
                        );
                        setFieldValue("workplaceGroup", "");
                        setFieldValue("workplace", "");
                        setFieldValue("employee", "");
                        setFieldValue("businessUnit", valueOption);
                        setRowDto([]);
                        setAllData([]);
                      }}
                      placeholder=" "
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Workplace Group</label>
                    <FormikSelect
                      name="workplaceGroup"
                      options={workplaceGroupDDL || []}
                      value={values?.workplaceGroup}
                      onChange={(valueOption) => {
                        getPeopleDeskAllDDL(
                          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&AccountId=${orgId}&BusinessUnitId=${values?.businessUnit?.value}&WorkplaceGroupId=${valueOption?.value}&intId=${employeeId}`,
                          "intWorkplaceId",
                          "strWorkplace",
                          setWorkplaceDDL
                        );
                        setFieldValue("workplace", "");
                        setFieldValue("employee", "");
                        setFieldValue("workplaceGroup", valueOption);
                        setRowDto([]);
                        setAllData([]);
                      }}
                      placeholder=" "
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      isDisabled={!values?.businessUnit}
                    />
                  </div>
                </div> */}
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Workplace</label>
                    <FormikSelect
                      name="workplace"
                      options={workplaceDDL || []}
                      value={values?.workplace}
                      onChange={(valueOption) => {
                        setFieldValue("employee", "");
                        setFieldValue("workplace", valueOption);
                        setRowDto([]);
                        setAllData([]);
                      }}
                      placeholder=" "
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      // isDisabled={!values?.workplaceGroup}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Select Employee</label>
                    <AsyncFormikSelect
                      selectedValue={values?.employee}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue("employee", valueOption);
                        setRowDto([]);
                        setAllData([]);
                      }}
                      placeholder="Search (min 3 letter)"
                      loadOptions={(v) => getSearchEmployeeList(buId, wgId, v)}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-green btn-green-disable mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        getRequisitionAssignLanding(
                          orgId,
                          values,
                          setRowDto,
                          setLoading,
                          setAllData,
                          buId,
                          wgId
                        );
                      }}
                      disabled={!values?.employee || !values?.workplace}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* tax landing */}
            <div>
              <div className="table-card-heading" style={{ marginTop: "12px" }}>
                <div>
                  {rowDto?.length > 0 ? (
                    <>
                      <h6 className="count">
                        Total {rowDto?.length} employees
                      </h6>
                    </>
                  ) : (
                    <>
                      <h6 className="count">Total result 0</h6>
                    </>
                  )}
                </div>
                <ul className="d-flex flex-wrap">
                  {(isFilter || status) && (
                    <ResetButton
                      classes="btn-filter-reset"
                      title="Reset"
                      icon={<Refresh sx={{ marginRight: "10px" }} />}
                      onClick={() => {
                        getRequisitionAssignLanding(
                          orgId,
                          values,
                          setRowDto,
                          setLoading,
                          setAllData
                        );
                        setRowDto(allData);
                        setFieldValue("search", "");
                        setIsFilter(false);
                        setStatus("");
                      }}
                      styles={{
                        height: "auto",
                        fontSize: "12px",
                        marginRight: "10px",
                        marginTop: "3px",
                        paddingTop: "0px",
                      }}
                    />
                  )}
                  <li>
                    {rowDto &&
                      rowDto?.filter((item) => item?.isAssigned).length > 0 ? (
                      <button
                        className="btn btn-default"
                        style={{
                          marginRight: "25px",
                          height: "24px",
                          fontSize: "12px",
                          padding: "0px 12px 0px 12px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!permission?.isCreate)
                            return toast.warn("You don't have permission");
                        }}
                      >
                        Send For Approval
                      </button>
                    ) : (
                      ""
                    )}
                  </li>
                  {/* {values?.businessUnit?.value && (
                    <li>
                      <MasterFilter
                        inputWidth="250px"
                        width="250px"
                        isHiddenFilter
                        value={values?.search}
                        setValue={(value) => {
                          setFieldValue("search", value);
                          debounce(() => {
                            getRequisitionAssignLanding(
                              orgId,
                              values,
                              setRowDto,
                              setLoading,
                              setAllData
                            );
                          }, 500);
                        }}
                        cancelHandler={() => {
                          setFieldValue("search", "");
                          getRequisitionAssignLanding(
                            orgId,
                            values,
                            setRowDto,
                            setLoading,
                            setAllData
                          );
                        }}
                      />
                    </li>
                  )} */}
                </ul>
              </div>
              <div className="table-card-body">
                <div className="table-card-styled tableOne">
                  {allData?.length > 0 ? (
                    <>
                      <AntTable
                        data={allData}
                        columnsData={assetRequisitionAssignColumns(
                          rowDto,
                          setRowDto,
                          allData,
                          setAllData,
                          rowDtoHandler,
                          quantityHandler,
                          permission,
                          errors,
                          touched,
                          page,
                          paginationSize,
                          employeeId,
                          deniedAssetRequisition,
                          () => {
                            getRequisitionAssignLanding(
                              orgId,
                              values,
                              setRowDto,
                              setLoading,
                              setAllData
                            );
                          }
                        )}
                        setColumnsData={(dataRow) => {
                          if (dataRow?.length === allData?.length) {
                            let temp = dataRow?.map((item) => {
                              return {
                                ...item,
                                isAssigned: false,
                              };
                            });
                            setRowDto(temp);
                            setAllData(temp);
                          } else {
                            setRowDto(dataRow);
                          }
                        }}
                        setPage={setPage}
                        setPaginationSize={setPaginationSize}
                      />
                    </>
                  ) : (
                    <>
                      {!loading && <NoResult title="No Result Found" para="" />}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <NotPermittedPage />
        )}
      </form>
    </>
  );
}
