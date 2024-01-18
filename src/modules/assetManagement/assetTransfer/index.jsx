/* eslint-disable react-hooks/exhaustive-deps */

import {
  AddOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import AntTable from "../../../common/AntTable";
import DefaultInput from "../../../common/DefaultInput";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import ResetButton from "../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../utility/customHooks/useAxiosPost";
import useDebounce from "../../../utility/customHooks/useDebounce";
import { monthFirstDate, monthLastDate } from "../../../utility/dateFormatter";
import {
  assetTransferTableColumn,
  filterAssetTransferLanding,
  onGetAssetTransferLanding,
} from "./helper";

const initData = {
  search: "",
  filterFromDate: monthFirstDate(),
  filterToDate: monthLastDate(),
};

const AssetTransferLanding = () => {
  const debounce = useDebounce();
  const history = useHistory();
  const dispatch = useDispatch();

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [, setfilterAnchorEl] = useState(null);
  const [rowDto, setRowDto] = useState([]);
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [, deleteAssetTransfer, deleteAssetTransferLoading] = useAxiosPost({});
  const [AssetTransferLanding, getAssetTransferLanding, loading] = useAxiosGet(
    []
  );

  const { values, setFieldValue } = useFormik({
    initialValues: initData,
  });

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30394) {
      permission = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Asset Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onGetAssetTransferLanding(
      getAssetTransferLanding,
      orgId,
      buId,
      values,
      setRowDto
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  return (
    <>
      <>
        {(loading || deleteAssetTransferLoading) && <Loading />}
        {permission?.isView ? (
          <>
            <div className="table-card">
              <div className="table-card-heading">
                <div className="d-flex align-items-center"></div>
                <ul className="d-flex flex-wrap">
                  {values?.search && (
                    <li>
                      <ResetButton
                        classes="btn-filter-reset"
                        title="reset"
                        icon={
                          <SettingsBackupRestoreOutlined
                            sx={{ marginRight: "10px", fontSize: "16px" }}
                          />
                        }
                        styles={{
                          marginRight: "16px",
                        }}
                        onClick={() => {
                          setFieldValue("search", "");
                          setRowDto(AssetTransferLanding);
                        }}
                      />
                    </li>
                  )}
                  <li>
                    <MasterFilter
                      isHiddenFilter
                      styles={{
                        marginRight: "10px",
                      }}
                      inputWidth="200px"
                      width="200px"
                      value={values?.search}
                      setValue={(value) => {
                        setFieldValue("search", value);
                        debounce(() => {
                          filterAssetTransferLanding(
                            value,
                            AssetTransferLanding,
                            setRowDto
                          );
                        }, 500);
                      }}
                      cancelHandler={() => {
                        setFieldValue("search", "");
                        setRowDto(AssetTransferLanding);
                      }}
                      handleClick={(e) => setfilterAnchorEl(e.currentTarget)}
                    />
                  </li>
                  <li>
                    <PrimaryButton
                      type="button"
                      className="btn btn-default flex-center"
                      label="Asset Transfer"
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
                          return toast.warning(
                            "Your are not allowed to access"
                          );
                        }
                        history.push(
                          `/assetManagement/assetAssign/assetTransfer/create`
                        );
                      }}
                    />
                  </li>
                </ul>
              </div>
              <div
                className="card-style pb-0 mb-2"
                style={{ marginTop: "12px" }}
              >
                <div className="row">
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Transfer From Date</label>
                      <DefaultInput
                        classes="input-sm"
                        value={values?.filterFromDate}
                        placeholder="Month"
                        name="toDate"
                        max={values?.filterToDate}
                        type="date"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("filterFromDate", e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Transfer To Date</label>
                      <DefaultInput
                        classes="input-sm"
                        value={values?.filterToDate}
                        placeholder="Month"
                        name="toDate"
                        min={values?.filterFromDate}
                        type="date"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("filterToDate", e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <button
                      className="btn btn-green btn-green-disable mt-4"
                      type="button"
                      disabled={
                        !values?.filterFromDate || !values?.filterToDate
                      }
                      onClick={() => {
                        onGetAssetTransferLanding(
                          getAssetTransferLanding,
                          orgId,
                          buId,
                          values,
                          setRowDto
                        );
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
              {rowDto?.length > 0 ? (
                <>
                  <div className="table-card-body">
                    <div className="table-card-styled employee-table-card table-responsive ant-scrolling-Table">
                      <AntTable
                        data={rowDto}
                        columnsData={assetTransferTableColumn(
                          history,
                          deleteAssetTransfer,
                          () => {
                            onGetAssetTransferLanding(
                              getAssetTransferLanding,
                              orgId,
                              buId,
                              values,
                              setRowDto
                            );
                          },
                          employeeId,
                          orgId,
                          buId,
                          page,
                          paginationSize
                        )}
                        rowClassName="pointer"
                        setPage={setPage}
                        setPaginationSize={setPaginationSize}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>{!loading && <NoResult title="No Result Found" para="" />}</>
              )}
            </div>
          </>
        ) : (
          <NotPermittedPage />
        )}
      </>
    </>
  );
};

export default AssetTransferLanding;
