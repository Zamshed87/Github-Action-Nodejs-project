import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import PeopleDeskTable, { paginationSize } from "common/peopleDeskTable";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import useDebounce from "utility/customHooks/useDebounce";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import Loading from "common/loading/Loading";
import { toast } from "react-toastify";
import MasterFilter from "common/MasterFilter";
import { AddOutlined } from "@mui/icons-material";
import PrimaryButton from "common/PrimaryButton";
import { Box, Tab, Tabs } from "@mui/material";
import TabPanel, {
  a11yProps,
} from "modules/trainingDevelopment/assessment/assessmentFormDetails/tabpanel";
import { useHistory } from "react-router-dom";
import NoResult from "common/NoResult";
import { destroyLandingColumn, getData, salesLandingColumn } from "./utils";
import ViewModal from "common/ViewModal";
import SalesView from "./modal/SalesView";

const initData = {
  searchString: "",
};

const AssetDisposal = () => {
  const history = useHistory();
  const debounce = useDebounce();
  const dispatch = useDispatch();
  const { orgId, buId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  const [, getLandingData, loading] = useAxiosGet([]);
  const [salesData, setSalesData] = useState([]);
  const [destroyData, setDestroyData] = useState([]);
  const [value, setValue] = useState(0);
  const [rowId, setRowId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { values, setFieldValue, handleSubmit } = useFormik({
    initialValues: initData,
  });

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30405) {
      permission = item;
    }
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangePage = (_, newPage, searchText) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData(
      getLandingData,
      setSalesData,
      setDestroyData,
      value === 0 ? 1 : 2,
      orgId,
      buId,
      wId,
      wgId,
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      },
      setPages,
      searchText
    );
  };

  const handleChangeRowsPerPage = (event, searchText) => {
    setPages(() => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });

    getData(
      getLandingData,
      setSalesData,
      setDestroyData,
      value === 0 ? 1 : 2,
      orgId,
      buId,
      wId,
      wgId,
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      setPages,
      searchText
    );
  };

  useEffect(() => {
    getData(
      getLandingData,
      setSalesData,
      setDestroyData,
      value === 0 ? 1 : 2,
      orgId,
      buId,
      wId,
      wgId,
      pages,
      setPages,
      ""
    );
  }, [orgId, buId, wId, wgId, value]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Asset Management"));
    document.title = "Asset Disposal";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return permission?.isView ? (
    <>
      {loading && <Loading />}
      <form onSubmit={handleSubmit}>
        <div className="table-card">
          <div className="table-card-heading">
            <div className="d-flex align-items-center">
              <h6 className="count">Disposal</h6>
            </div>
            <ul className="d-flex flex-wrap">
              <li>
                <MasterFilter
                  inputWidth="250px"
                  width="250px"
                  isHiddenFilter
                  value={values?.searchString}
                  setValue={(search) => {
                    setFieldValue("searchString", search);
                    debounce(() => {
                      getData(
                        getLandingData,
                        setSalesData,
                        setDestroyData,
                        value === 0 ? 1 : 2,
                        orgId,
                        buId,
                        wId,
                        wgId,
                        {
                          current: 1,
                          pageSize: pages?.pageSize,
                        },
                        setPages,
                        search
                      );
                    }, 500);
                  }}
                  cancelHandler={() => {
                    setFieldValue("searchString", "");
                    getData(
                      getLandingData,
                      setSalesData,
                      setDestroyData,
                      value === 0 ? 1 : 2,
                      orgId,
                      buId,
                      wId,
                      wgId,
                      {
                        current: 1,
                        pageSize: pages?.pageSize,
                      },
                      setPages,
                      ""
                    );
                  }}
                />
              </li>
              <li>
                <PrimaryButton
                  type="button"
                  className="btn btn-default flex-center"
                  label={value === 0 ? "Create Sales" : "Create Destroy"}
                  icon={
                    <AddOutlined
                      sx={{
                        marginRight: "0px",
                        fontSize: "15px",
                      }}
                    />
                  }
                  onClick={() => {
                    if (!permission?.isEdit) {
                      return toast.warn("You don't have permission", {
                        toastId: "permission",
                      });
                    }
                    history.push(
                      "/assetManagement/assetControlPanel/assetDisposal/create",
                      {
                        data:
                          value === 0
                            ? { label: "Sales", value: 1 }
                            : { label: "Destroy", value: 2 },
                      }
                    );
                  }}
                />
              </li>
            </ul>
          </div>
          <div className="table-card-body">
            <div className="tab-panel">
              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    TabIndicatorProps={{
                      style: { background: "#299647", height: 3 },
                    }}
                    sx={{
                      "& .MuiTabs-indicator": { backgroundColor: "#299647" },
                      "& .MuiTab-root": { color: "#667085" },
                      "& .Mui-selected": { color: "#299647" },
                    }}
                  >
                    <Tab label="Sales" {...a11yProps(0)} />
                    <Tab label="Destroy" {...a11yProps(1)} />
                  </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                  {salesData?.length > 0 ? (
                    <PeopleDeskTable
                      columnData={salesLandingColumn(
                        pages?.current,
                        pages?.pageSize,
                        setRowId,
                        setIsModalOpen
                      )}
                      pages={pages}
                      rowDto={salesData}
                      setRowDto={setSalesData}
                      handleChangePage={(e, newPage) =>
                        handleChangePage(e, newPage, values?.searchString)
                      }
                      handleChangeRowsPerPage={(e) =>
                        handleChangeRowsPerPage(e, values?.searchString)
                      }
                      uniqueKey="assetDisposalId"
                    />
                  ) : (
                    <>
                      {!loading && (
                        <div className="col-12">
                          <NoResult title={"No Data Found"} para={""} />
                        </div>
                      )}
                    </>
                  )}
                </TabPanel>
                <TabPanel value={value} index={1}>
                  {destroyData?.length > 0 ? (
                    <PeopleDeskTable
                      columnData={destroyLandingColumn(
                        pages?.current,
                        pages?.pageSize
                      )}
                      pages={pages}
                      rowDto={destroyData}
                      setRowDto={setDestroyData}
                      handleChangePage={(e, newPage) =>
                        handleChangePage(e, newPage, values?.searchString)
                      }
                      handleChangeRowsPerPage={(e) =>
                        handleChangeRowsPerPage(e, values?.searchString)
                      }
                      uniqueKey="assetDisposalId"
                    />
                  ) : (
                    <>
                      {!loading && (
                        <div className="col-12">
                          <NoResult title={"No Data Found"} para={""} />
                        </div>
                      )}
                    </>
                  )}
                </TabPanel>
              </Box>
            </div>
          </div>
        </div>
      </form>
      {/* View Modal */}
      <ViewModal
        size="lg"
        title="Sales Details"
        backdrop="static"
        classes="default-modal preview-modal"
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
      >
        <SalesView id={rowId} />
      </ViewModal>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default AssetDisposal;
