import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import PrimaryButton from "../../../../common/PrimaryButton";
import { AddOutlined, SaveAlt } from "@mui/icons-material";
import { toast } from "react-toastify";
import MasterFilter from "../../../../common/MasterFilter";
import { useHistory } from "react-router-dom";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import Loading from "../../../../common/loading/Loading";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import {
  excelHeaderForObjective,
  excelTableHeaderForObjective,
  excelTableRowForObjective,
  pmsObjectiveTableColumn,
} from "./helper";
import NoResult from "../../../../common/NoResult";
import RefreshIcon from "@mui/icons-material/Refresh";
import AntTable from "../../../../common/AntTable";
import ResetButton from "../../../../common/ResetButton";
import { Tooltip } from "@mui/material";
import { gray900 } from "../../../../utility/customColor";
import { generateCommonExcelAction } from "../../../../common/Excel/excelConvert";
import AntScrollTable from "../../../../common/AntScrollTable";
import usePermissions from "Hooks/usePermissions";
import FormikSelect from "common/FormikSelect";
import { useFormik } from "formik";
import { customStyles } from "utility/selectCustomStyle";

const PMSObjective = () => {
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 30,
    total: 0,
  });
  const {
    permission,
    buId,
    wgId,
    wId,
    orgId,
    intAccountId,
    profileData: { employeeId, buName },
  } = usePermissions(30460);

  const [, getObjectiveLanding, loadingOnGetObjectiveLanding] = useAxiosGet();
  const [
    objectiveTypeDDL,
    getObjectiveTypeDDL,
    loadingOnGetObjectiveTypeDDL,
    setObjectiveTypeDDL,
  ] = useAxiosGet();
  const [objectiveTableData, setObjectiveTableData] = useState([]);
  const [, deletePMSObjective, loadingOnDelete] = useAxiosPost();
  const dispatch = useDispatch();
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [, getExcelData, excelDataLoader] = useAxiosGet();
  const initialValues = {
    objectiveIndex: null,
    pmType: null,
    objectiveTypes: null,
    objective: "",
    description: "",
  };
  const {
    errors,
    touched,
    handleSubmit,
    resetForm,
    setFieldValue,
    setValues,
    values,
  } = useFormik({
    initialValues,
    onSubmit: (formValues) => {
      const objectiveTypes = formValues?.objectiveTypes?.value
        ? `objectiveType=${formValues?.objectiveTypes?.value}`
        : "";
      const status =
        formValues?.status?.value !== null
          ? `&status=${formValues?.status?.value}`
          : "";
      getObjectiveLanding(
        `/PMS/GetPMSObejctiveLanding?${objectiveTypes}${status}&accountId=${orgId}&pageNo=${pages?.current}&pageSize=${pages?.pageSize}&search=${search}`,
        (data) => {
          if (data) {
            setPages((prev) => ({
              ...prev,
              total: data?.totalCount,
            }));
            setObjectiveTableData(data?.data);
          }
          return data?.data;
        }
      );
    },
  });

  const getData = (pages, search = "") => {
    getObjectiveLanding(
      `/PMS/GetPMSObejctiveLanding?accountId=${orgId}&pageNo=${pages?.current}&pageSize=${pages?.pageSize}&search=${search}`,
      (data) => {
        if (data) {
          setPages((prev) => ({
            ...prev,
            total: data?.totalCount,
          }));
          setObjectiveTableData(data?.data);
        }
        return data?.data;
      }
    );
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    getObjectiveTypeDDL(`/PMS/ObjectiveTypeDDL?PMTypeId=1`);
    getData(pages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = ({ pagination }) => {
    setPages((prev) => ({ ...prev, ...pagination }));
    if (
      (pages?.current === pagination?.current &&
        pages?.pageSize !== pagination?.pageSize) ||
      pages?.current !== pagination?.current
    ) {
      return getData(pagination);
    }
  };

  return (
    <>
      {(loadingOnGetObjectiveLanding || loadingOnDelete || excelDataLoader) && (
        <Loading />
      )}
      <div className="table-card">
        <div className="table-card-heading">
          <div className="d-flex justify-content-center align-items-center">
            <Tooltip title="Export CSV" arrow>
              <button
                type="button"
                className="btn-save"
                onClick={(e) => {
                  e.stopPropagation();
                  getExcelData(
                    `/PMS/GetPMSObejctiveLanding?accountId=${orgId}&pageNo=1&pageSize=${pages?.total}`,
                    (resExcelData) => {
                      try {
                        generateCommonExcelAction({
                          title: "PMS Objective",
                          getHeader: () => {
                            return excelHeaderForObjective({
                              businessUnit: buName,
                              title: `PMS Objective List`,
                            });
                          },
                          getTableHeader: () => {
                            return excelTableHeaderForObjective();
                          },
                          getTableRow: () => {
                            return excelTableRowForObjective({
                              rowData: resExcelData?.data,
                            });
                          },
                        });
                      } catch (err) {
                        console.log(err);
                      }
                    }
                  );
                }}
              >
                <SaveAlt
                  sx={{
                    color: gray900,
                    fontSize: "14px",
                  }}
                />
              </button>
            </Tooltip>
            <div className="ml-2">
              {objectiveTableData?.length > 0 ? (
                <>
                  <h6 className="count">Total {pages?.total} Objectives</h6>
                </>
              ) : (
                <>
                  <h6 className="count">Total result 0</h6>
                </>
              )}
            </div>
          </div>
          <ul className="d-flex flex-wrap">
            {search ? (
              <ResetButton
                classes="btn-filter-reset"
                title="Reset"
                icon={<RefreshIcon sx={{ marginRight: "10px" }} />}
                onClick={() => {
                  setSearch("");
                  getData(pages);
                }}
                styles={{
                  height: "auto",
                  fontSize: "12px",
                  marginRight: "10px",
                  marginTop: "3px",
                  paddingTop: "0px",
                }}
              />
            ) : (
              <></>
            )}
            <li>
              <MasterFilter
                isHiddenFilter
                width="200px"
                inputWidth="200px"
                value={search}
                setValue={(value) => {
                  setSearch(value);
                  getData(pages, value);
                }}
                cancelHandler={() => {
                  setSearch("");
                  getData(pages);
                }}
              />
            </li>
            <li>
              <PrimaryButton
                type="button"
                className="btn btn-default flex-center"
                label="New Objective"
                icon={
                  <AddOutlined
                    sx={{
                      marginRight: "0px",
                      fontSize: "15px",
                    }}
                  />
                }
                onClick={() => {
                  if (!permission?.isCreate) {
                    return toast.warn("You don't have permission to create");
                  }
                  history.push("/pms/kpiSettings/objective/create");
                }}
              />
            </li>
          </ul>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="input-field-main col-md-3">
              <label>Objective Type</label>
              <FormikSelect
                classes="input-sm  form-control"
                name="objectiveTypes"
                options={objectiveTypeDDL || []}
                value={values?.objectiveTypes}
                onChange={(valueOption) => {
                  setFieldValue("objectiveTypes", valueOption);
                }}
                styles={customStyles}
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="input-field-main col-md-3">
              <label>Status</label>
              <FormikSelect
                classes="input-sm  form-control"
                name="status"
                options={
                  [
                    { label: "All", value: null },
                    { label: "Active", value: true },
                    { label: "Inactive", value: false },
                  ] || []
                }
                value={values?.status}
                onChange={(valueOption) => {
                  setFieldValue("status", valueOption);
                }}
                styles={customStyles}
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-md-3 mt-4">
              <PrimaryButton
                onClick={() => handleSubmit()}
                type="button"
                className="btn btn-green flex-center"
                label="View"
              />
            </div>
          </div>
        </form>

        {objectiveTableData?.length <= 0 ? (
          <NoResult />
        ) : (
          <div className="table-card-body">
            <div className="table-card-styled table-responsive tableOne">
              <AntScrollTable
                data={objectiveTableData}
                columnsData={pmsObjectiveTableColumn({
                  fromLanding: true,
                  history,
                  permission,
                  deletePMSObjective,
                  getObjectiveLanding,
                  orgId,
                  employeeId,
                  setObjectiveTableData,
                  pages,
                })}
                pages={pages?.pageSize}
                pagination={pages}
                handleTableChange={handleTableChange}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PMSObjective;
