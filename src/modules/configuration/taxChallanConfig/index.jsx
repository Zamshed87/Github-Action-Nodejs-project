import {
  AddOutlined,
  SearchOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AntTable from "../../../common/AntTable";
import DefaultInput from "../../../common/DefaultInput";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import PrimaryButton from "../../../common/PrimaryButton";
import ResetButton from "../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import { dateFormatter } from "../../../utility/dateFormatter";
import {
  filterDataOfTaxChallanLanding,
  taxChallanConfigTablecolumns,
} from "./helper";
import TaxChallanConfigCreate from "./TaxChallanConfigCreate";

const TaxChallanConfigLanding = () => {
  const { permissionList, profileData } = useSelector(
    (state) => state?.auth,
    shallowEqual
  );
  const dispatch = useDispatch();
  const [showCreate, setShowCreate] = useState(false);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30335) {
      permission = item;
    }
  });
  const [rowId, setRowId] = useState(null);

  const [search, setSearch] = useState("");

  const [
    mainChallanDataRow,
    getTaxChallanLanding,
    loadingOnGetTaxChallanLanding,
    setMainChallanDataRow,
  ] = useAxiosGet();
  const [tempChallandataRow, setTempChallanDataRow] = useState([]);
  useEffect(() => {
    if (!showCreate && profileData?.orgId) {
      getTaxChallanLanding(
        `/SaasMasterData/GetAllTaxchallanConfig?intAccountId=${profileData?.orgId}`,
        (response) => {
          const modifiedRow = response.map((item, index) => ({
            ...item,
            sl: index + 1,
            yearRange:
              item?.dteFiscalFromDate && item?.dteFiscalToDate
                ? `${dateFormatter(item?.dteFiscalFromDate)}-${dateFormatter(
                    item?.dteFiscalToDate
                  )}`
                : "N/A",
          }));
          setMainChallanDataRow(modifiedRow);
          setTempChallanDataRow(modifiedRow);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.orgId, showCreate]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {loadingOnGetTaxChallanLanding && <Loading />}
      {permission?.isView && (
        <>
          <div className="table-card businessUnit-wrapper dashboard-scroll">
            <div className="table-card-heading">
              <div> </div>
              <ul className="d-flex flex-wrap">
                {search && (
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
                        setSearch("");
                        setTempChallanDataRow(mainChallanDataRow);
                      }}
                    />
                  </li>
                )}

                <li style={{ marginRight: "24px" }}>
                  <DefaultInput
                    value={search}
                    name="search"
                    type="text"
                    className="form-control"
                    classes="search-input fixed-width mt-2 mt-md-0 mb-2 mb-md-0 tableCardHeaderSeach"
                    onChange={(e) => {
                      setSearch(e.target.value);
                      filterDataOfTaxChallanLanding(
                        e.target.value,
                        mainChallanDataRow,
                        setTempChallanDataRow
                      );
                    }}
                    inputClasses="search-inner-input"
                    placeholder="Search"
                    trailicon={<SearchOutlined sx={{ color: "#323232" }} />}
                  />
                </li>
                <li>
                  <PrimaryButton
                    type="button"
                    className="btn btn-default flex-center"
                    label="Tax Challan Config"
                    icon={
                      <AddOutlined
                        sx={{
                          marginRight: "0px",
                          fontSize: "15px",
                        }}
                      />
                    }
                    onClick={() => {
                      if (!permission?.isCreate)
                        return toast.warn("You don't have permission");
                      setShowCreate(true);
                    }}
                  />
                </li>
              </ul>
            </div>
            {/* table body */}
            <div className="table-card-body">
              {tempChallandataRow?.length > 0 ? (
                <div className="table-card-styled employee-table-card tableOne">
                  <AntTable
                    data={tempChallandataRow}
                    columnsData={taxChallanConfigTablecolumns(
                      setShowCreate,
                      setRowId
                    )}
                    setColumnsData={(newRow) =>
                      setTempChallanDataRow(mainChallanDataRow)
                    }
                  />
                </div>
              ) : (
                <>
                  <div className="col-12">
                    <NoResult title={"No Data Found"} para={""} />
                  </div>
                </>
              )}
            </div>
          </div>
          <TaxChallanConfigCreate
            show={showCreate}
            onHide={() => {
              setShowCreate(false);
              rowId && setRowId(null);
            }}
            taxChallanId={rowId}
            size="lg"
            backdrop="static"
            classes="default-modal"
            title={`${rowId ? "Edit" : "Create"} Tax Challan Config`}
          />
        </>
      )}
    </>
  );
};

export default TaxChallanConfigLanding;
