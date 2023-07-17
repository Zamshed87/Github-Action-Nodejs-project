/* eslint-disable react-hooks/exhaustive-deps */

import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import AntTable from "../../../common/AntTable";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import ResetButton from "../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../utility/customHooks/useAxiosPost";
import useDebounce from "../../../utility/customHooks/useDebounce";
import { monthFirstDate, monthLastDate } from "../../../utility/dateFormatter";
import {
  assetListSelfTableColumn,
  filterAssetListLanding,
  onGetAssetListLanding
} from "./helper";

const initData = {
  search: "",
  filterFromDate: monthFirstDate(),
  filterToDate: monthLastDate(),
};

const AssetList = () => {
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
  const [, acknowledgeAsset, loading1] = useAxiosPost({});
  const [assetAcknowledgementLanding, getAssetAcknowledgementLanding, loading] =
    useAxiosGet([]);

  const { values, setFieldValue } = useFormik({
    initialValues: initData,
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onGetAssetListLanding(
      getAssetAcknowledgementLanding,
      orgId,
      buId,
      employeeId,
      setRowDto
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  return (
    <>
      {(loading || loading1) && <Loading />}
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

                      setRowDto(assetAcknowledgementLanding);
                    }}
                  />
                </li>
              )}
              <li>
                <MasterFilter
                  isHiddenFilter
                  styles={{
                    marginRight: "0px",
                  }}
                  inputWidth="250px"
                  width="250px"
                  value={values?.search}
                  setValue={(value) => {
                    setFieldValue("search", value);
                    debounce(() => {
                      filterAssetListLanding(
                        value,
                        assetAcknowledgementLanding,
                        setRowDto
                      );
                    }, 500);
                  }}
                  cancelHandler={() => {
                    setFieldValue("search", "");
                    setRowDto(assetAcknowledgementLanding);
                  }}
                  handleClick={(e) => setfilterAnchorEl(e.currentTarget)}
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
                    columnsData={assetListSelfTableColumn(
                      history,
                      employeeId,
                      acknowledgeAsset,
                      () => {
                        onGetAssetListLanding(
                          getAssetAcknowledgementLanding,
                          orgId,
                          buId,
                          employeeId,
                          setRowDto
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

export default AssetList;
