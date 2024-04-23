import React, { useEffect, useState } from "react";
import PeopleDeskTable, { paginationSize } from "common/peopleDeskTable";
import { useFormik } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import useDebounce from "utility/customHooks/useDebounce";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import Loading from "common/loading/Loading";
import { toast } from "react-toastify";
import { AddOutlined } from "@mui/icons-material";
import PrimaryButton from "common/PrimaryButton";
import MasterFilter from "common/MasterFilter";
import NoResult from "common/NoResult";
import { assignLandingColumn, getData } from "./utils";

const initData = {
  searchString: "",
};

const AssetAssign = () => {
  const debounce = useDebounce();
  const history = useHistory();
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
  const [unassignLoading, setUnassignLoading] = useState(false);

  const { values, setFieldValue, handleSubmit } = useFormik({
    initialValues: initData,
  });

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30402) {
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
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
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
    document.title = "Assign";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return permission?.isView ? (
    <>
      {(loading || unassignLoading) && <Loading />}
      <form onSubmit={handleSubmit}>
        <div className="table-card">
          <div className="table-card-heading">
            <div className="d-flex align-items-center">
              <h6 className="count">Asset Assign</h6>
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
              <li>
                <PrimaryButton
                  type="button"
                  className="btn btn-default flex-center"
                  label="Asset Assign"
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
                      "/assetManagement/assetControlPanel/assign/create"
                    );
                  }}
                />
              </li>
            </ul>
          </div>
          <div className="table-card-body">
            {rowDto?.length > 0 ? (
              <PeopleDeskTable
                columnData={assignLandingColumn(
                  pages?.current,
                  pages?.pageSize,
                  setUnassignLoading,
                  () => {
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
                  }
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
                uniqueKey="assetAssignId"
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
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default AssetAssign;
