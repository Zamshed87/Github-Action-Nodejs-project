/* eslint-disable react-hooks/exhaustive-deps */

import {
  AddOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import useDebounce from "utility/customHooks/useDebounce";
import { monthFirstDate, monthLastDate } from "utility/dateFormatter";
import {
  assetRequisitionSelfTableColumn,
  onGetAssetRequisitionLanding,
} from "./helper";
import Loading from "common/loading/Loading";
import ResetButton from "common/ResetButton";
import PrimaryButton from "common/PrimaryButton";
import AntTable from "common/AntTable";
import NoResult from "common/NoResult";
import CommonFilter from "common/CommonFilter";

const initData = {
  search: "",
  filterFromDate: monthFirstDate(),
  filterToDate: monthLastDate(),
};

const AssetRequisitionSelfLanding = () => {
  const debounce = useDebounce();
  const history = useHistory();
  const dispatch = useDispatch();

  const [isFilterVisible, setIsFilterVisible] = useState(false);

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
    dispatch(setFirstLevelNameAction("Asset Management"));
    document.title = "Requisition";
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

  const handleFilter = (values) => {};

  return (
    <>
      {(loading || deleteAssetRequisitionLoading) && <Loading />}
      <>
        <div className="table-card">
          <div className="table-card-heading">
            <div className="d-flex align-items-center"></div>
            <ul className="d-flex flex-wrap">
              <li className="mr-3">
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
                    history.push(
                      `/assetManagement/assetControlPanel/assetRequisition/create`
                    );
                  }}
                />
              </li>
              <li>
                <CommonFilter
                  visible={isFilterVisible}
                  onClose={(visible) => setIsFilterVisible(visible)}
                  onFilter={handleFilter}
                  isDate={true}
                />
              </li>
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
