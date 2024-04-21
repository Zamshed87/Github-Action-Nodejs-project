import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import PeopleDeskTable, { paginationSize } from "common/peopleDeskTable";
import Loading from "common/loading/Loading";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { AddOutlined } from "@mui/icons-material";
import PrimaryButton from "common/PrimaryButton";
import useDebounce from "utility/customHooks/useDebounce";
import MasterFilter from "common/MasterFilter";
import NoResult from "common/NoResult";
import { getData, itemProfileColumn } from "./utils";
import useAxiosPost from "utility/customHooks/useAxiosPost";

const initData = {
  searchString: "",
};

const AssetItemProfile = () => {
  const debounce = useDebounce();
  const history = useHistory();
  const dispatch = useDispatch();
  const { orgId, buId, wgId, wId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  const [rowDto, getLandingData, loading, setRowDto] = useAxiosGet([]);
  const [, saveDeleteHandler, deleteLoading] = useAxiosPost({});

  const { values, setFieldValue, handleSubmit } = useFormik({
    initialValues: initData,
  });

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30415) {
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
    document.title = "Item Profile";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return permission?.isView ? (
    <>
      {(loading || deleteLoading) && <Loading />}
      <form onSubmit={handleSubmit}>
        <div className="table-card">
          <div className="table-card-heading">
            <div className="d-flex align-items-center">
              <h6 className="count">Item Profile</h6>
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
                  label="Item Profile"
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
                      "/assetManagement/assetControlPanel/itemProfile/create"
                    );
                  }}
                />
              </li>
            </ul>
          </div>
          <div className="table-card-body">
            {rowDto?.length > 0 ? (
              <PeopleDeskTable
                columnData={itemProfileColumn(
                  pages?.current,
                  pages?.pageSize,
                  history,
                  saveDeleteHandler,
                  orgId,
                  buId,
                  employeeId,
                  getData,
                  getLandingData,
                  setRowDto,
                  wId,
                  wgId,
                  pages,
                  setPages
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
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default AssetItemProfile;
