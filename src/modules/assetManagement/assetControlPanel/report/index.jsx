import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import MasterFilter from "common/MasterFilter";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import PeopleDeskTable, { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import useDebounce from "utility/customHooks/useDebounce";
import NoResult from "common/NoResult";
import { assetReportColumn, getData } from "./utils";
import EmployeeHistoryView from "./modal/EmployeeHistoryView";
import ViewModal from "common/ViewModal";
import MaintenanceSummary from "./modal/MaintenanceSummary";
import TotalDepreciationView from "./modal/TotalDepreciationView";

const initData = {
  searchString: "",
};

const AssetReport = () => {
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
  const [rowDto, getLandingData, loading, setRowDto] = useAxiosGet([]);
  const [historyModal, setHistoryModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [depreciationModal, setDepreciationModal] = useState(false);
  const [itemId, setItemId] = useState(null);

  const { values, setFieldValue, handleSubmit } = useFormik({
    initialValues: initData,
  });

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30406) {
      permission = item;
    }
  });

  const handleChangePage = (_, newPage, searchText) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData(
      getLandingData,
      setRowDto,
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
      return {
        current: 1,
        total: pages?.total,
        pageSize: +event.target.value,
      };
    });

    getData(
      getLandingData,
      setRowDto,
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
      setRowDto,
      orgId,
      buId,
      wId,
      wgId,
      pages,
      setPages,
      ""
    );
  }, [orgId, buId, wId, wgId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Asset Management"));
    document.title = "Asset Report";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return permission?.isView ? (
    <>
      {loading && <Loading />}
      <form onSubmit={handleSubmit}>
        <div className="table-card">
          <div className="table-card-heading">
            <div className="d-flex align-items-center">
              <h6 className="count">Asset Report</h6>
            </div>
            <ul className="d-flex flex-wrap">
              <li>
                <MasterFilter
                  inputWidth="250px"
                  width="250px"
                  isHiddenFilter
                  value={values?.searchString}
                  setValue={(value) => {
                    setFieldValue("searchString", value);
                    debounce(() => {
                      getData(
                        getLandingData,
                        setRowDto,
                        orgId,
                        buId,
                        wId,
                        wgId,
                        {
                          current: 1,
                          pageSize: pages?.pageSize,
                        },
                        setPages,
                        value
                      );
                    }, 500);
                  }}
                  cancelHandler={() => {
                    setFieldValue("searchString", "");
                    getData(
                      getLandingData,
                      setRowDto,
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
            </ul>
          </div>
          <div className="table-card-body">
            {rowDto?.length > 0 ? (
              <PeopleDeskTable
                columnData={assetReportColumn(
                  pages?.current,
                  pages?.pageSize,
                  setHistoryModal,
                  setItemId,
                  setIsModalOpen,
                  setDepreciationModal
                )}
                pages={pages}
                rowDto={rowDto}
                setRowDto={setRowDto}
                handleChangePage={(e, newPage) =>
                  handleChangePage(e, newPage, values?.searchString)
                }
                handleChangeRowsPerPage={(e) =>
                  handleChangeRowsPerPage(e, values?.searchString)
                }
                uniqueKey="itemId"
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
          </div>
        </div>
      </form>
      <ViewModal
        size="lg"
        title="Employee Details"
        backdrop="static"
        classes="default-modal preview-modal"
        show={historyModal}
        onHide={() => setHistoryModal(false)}
      >
        <EmployeeHistoryView id={itemId} />
      </ViewModal>
      <ViewModal
        size="lg"
        title="Maintenance Summary"
        backdrop="static"
        classes="default-modal preview-modal"
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
      >
        <MaintenanceSummary id={itemId} />
      </ViewModal>
      <ViewModal
        size="lg"
        title="Depreciation Details"
        backdrop="static"
        classes="default-modal preview-modal"
        show={depreciationModal}
        onHide={() => setDepreciationModal(false)}
      >
        <TotalDepreciationView id={itemId} />
      </ViewModal>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default AssetReport;
