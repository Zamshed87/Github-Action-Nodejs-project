import React, { useEffect, useState } from "react";
import { AddOutlined } from "@mui/icons-material";
import FormikInput from "common/FormikInput";
import MasterFilter from "common/MasterFilter";
import PrimaryButton from "common/PrimaryButton";
import Required from "common/Required";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import PeopleDeskTable, { paginationSize } from "common/peopleDeskTable";
import { Form, Formik } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import useDebounce from "utility/customHooks/useDebounce";
import { todayDate } from "utility/todayDate";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { assetDepreciationColumn, getData } from "./utils";
import AssetDepreciationDetailsView from "./modal/AssetDepreciationDetailsView";
import ViewModal from "common/ViewModal";
import NoResult from "common/NoResult";

const initData = {
  searchString: "",
  runDate: todayDate(),
};

const AssetDepreciation = () => {
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
  const [isView, setIsView] = useState(false);
  const [id, setId] = useState(null);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30404) {
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
    document.title = "Depreciation";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return permission?.isView ? (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            {loading && <Loading />}
            <Form onSubmit={handleSubmit}>
              <div className="table-card">
                <div className="table-card-heading">
                  <div className="d-flex align-items-center">
                    <h6 className="count">Asset Depreciation</h6>
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
                        label="Run Depreciation"
                        disabled={!values?.runDate}
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
                            "/assetManagement/assetControlPanel/depreciation/create",
                            {
                              runDate: values?.runDate,
                            }
                          );
                        }}
                      />
                    </li>
                  </ul>
                </div>
                <div className="table-card-body">
                  <div className="row">
                    <div className="col-lg-3">
                      <label>
                        Run Date <Required />
                      </label>
                      <FormikInput
                        classes="input-sm"
                        placeholder=""
                        value={values?.runDate}
                        name="runDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("runDate", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-12">
                      {rowDto?.length > 0 ? (
                        <PeopleDeskTable
                          columnData={assetDepreciationColumn(
                            pages?.current,
                            pages?.pageSize,
                            setIsView,
                            setId
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
                          uniqueKey="assetDepreciationHeaderId"
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
                </div>
              </div>
            </Form>
            <ViewModal
              size="lg"
              title="Asset Depreciation Details"
              backdrop="static"
              classes="default-modal preview-modal"
              show={isView}
              onHide={() => setIsView(false)}
            >
              <AssetDepreciationDetailsView id={id} wId={wId} wgId={wgId} />
            </ViewModal>
          </>
        )}
      </Formik>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default AssetDepreciation;
