/* eslint-disable react-hooks/exhaustive-deps */

import {
  AddOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import AntTable from "../../../common/AntTable";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import PrimaryButton from "../../../common/PrimaryButton";
import ResetButton from "../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../utility/customHooks/useAxiosPost";
import useDebounce from "../../../utility/customHooks/useDebounce";
import { monthFirstDate, monthLastDate } from "../../../utility/dateFormatter";
import {
  assetRequisitionSelfTableColumn,
  filterAssetRequisitionLanding,
  onGetAssetRequisitionLanding,
} from "./helper";

const initData = {
  search: "",
  filterFromDate: monthFirstDate(),
  filterToDate: monthLastDate(),
};

const AssetRequisitionSelfLanding = () => {
  const debounce = useDebounce();
  const history = useHistory();
  const dispatch = useDispatch();

  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [, setfilterAnchorEl] = useState(null);
  const [rowDto, setRowDto] = useState([]);
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [, deleteAssetRequisition, deleteAssetRequisitionLoading] =
    useAxiosPost({});
  const [assetRequisitionLanding, getAssetRequisitionLanding, loading] =
    useAxiosGet([]);

  const { values, setFieldValue } = useFormik({
    initialValues: initData,
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onGetAssetRequisitionLanding(
      getAssetRequisitionLanding,
      orgId,
      buId,
      employeeId,
      values,
      setRowDto,
      wgId
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  return (
    <>
      {(loading || deleteAssetRequisitionLoading) && <Loading />}
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

                      setRowDto(assetRequisitionLanding);
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
                      filterAssetRequisitionLanding(
                        value,
                        assetRequisitionLanding,
                        setRowDto
                      );
                    }, 500);
                  }}
                  cancelHandler={() => {
                    setFieldValue("search", "");
                    setRowDto(assetRequisitionLanding);
                  }}
                  handleClick={(e) => setfilterAnchorEl(e.currentTarget)}
                />
              </li>
              <li>
                <PrimaryButton
                  type="button"
                  className="btn btn-default flex-center"
                  label="Requisition"
                  icon={
                    <AddOutlined
                      sx={{
                        marginRight: "0px",
                        fontSize: "15px",
                      }}
                    />
                  }
                  onClick={() => {
                    history.push(`/SelfService/asset/assetRequisition/create`);
                  }}
                />
              </li>
            </ul>
          </div>
          {rowDto?.length > 0 ? (
            <>
              <div className="table-card-body">
                <div className="table-card-styled employee-table-card table-responsive ant-scrolling-Table">
                  <AntTable
                    data={rowDto}
                    columnsData={assetRequisitionSelfTableColumn(
                      history,
                      employeeId,
                      deleteAssetRequisition,
                      () => {
                        onGetAssetRequisitionLanding(
                          getAssetRequisitionLanding,
                          orgId,
                          buId,
                          employeeId,
                          values,
                          setRowDto,
                          wgId
                        );
                      },
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
    </>
  );
};

export default AssetRequisitionSelfLanding;
