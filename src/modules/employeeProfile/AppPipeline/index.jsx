/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { AddOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../../common/loading/Loading";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import AddEditFormComponent from "./addEditForm";
import CardTable from "./components/CardTable";
import "./style.css";
import MasterFilter from "../../../common/MasterFilter";

import PeopleDeskTable, {
  paginationSize,
} from "../../../common/peopleDeskTable";
import { pipleLineColumn } from "./helper";
import NoResult from "../../../common/NoResult";

const initData = {
  movementTypeName: "",
  searchString: "",
};

const CommonAppPipeline = () => {
  const { buId, employeeId, wgName, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  // const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  const [openModal, setOpenModal] = useState(false);
  const saveHandler = (values) => {};
  const [loading, setLoading] = useState(false);
  const [landing, setLanding] = useState([]);
  const [rowDto, getRowDto, apiLoading, setRowDto] = useAxiosGet();
  const [singleData, setSingleData] = useState(null);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const getData = (pagination, searchText = "") => {
    getRowDto(
      `/ApprovalPipeline/ApprovalPipelineHeaderLanding?intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&searchText=${searchText}&PageNo=${pagination?.current}&PageSize=${pagination?.pageSize}`,
      (res) => {
        const modifiedData = res?.data?.map((item, index) => ({
          ...item,
          initialSerialNumber: index + 1,
        }));
        setLanding(modifiedData);
        setPages({
          current: pagination?.current,
          pageSize: pagination?.pageSize,
          total: res?.totalCount,
        });
      }
    );
    // `/ApprovalPipeline/ApprovalPipelineHeaderLanding?accountId=${orgId}&employeeId=${employeeId}`
  };

  const handleChangePage = (_, newPage, searchText) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData(
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      },
      searchText
    );
  };

  const handleChangeRowsPerPage = (event, searchText) => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData(
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      searchText
    );
  };

  useEffect(() => {
    getData(pages);
  }, [buId, wgId]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Common Approval Pipeline";
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 129) {
      permission = item;
    }
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {(loading || apiLoading) && <Loading />}
              {permission?.isView ? (
                <div className="table-card">
                  <div className="table-card-heading">
                    <div></div>
                    <div className="table-card-head-right">
                      <MasterFilter
                        inputWidth="250px"
                        width="250px"
                        isHiddenFilter
                        value={values?.searchString}
                        setValue={(value) => {
                          setFieldValue("searchString", value);
                          if (value) {
                            getData(
                              { current: 1, pageSize: paginationSize },
                              value
                            );
                          } else {
                            getData(
                              { current: 1, pageSize: paginationSize },
                              ""
                            );
                          }
                        }}
                        cancelHandler={() => {
                          setFieldValue("searchString", "");
                          getData({ current: 1, pageSize: paginationSize }, "");
                        }}
                      />
                      <PrimaryButton
                        type="button"
                        className="btn btn-default flex-center"
                        label={"Approval Pipeline"}
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
                          setSingleData(null);
                          setOpenModal(true);
                        }}
                      />
                    </div>
                  </div>
                  <div className="table-card-body">
                    <div className="table-card-styled tableOne">
                      {landing?.length > 0 ? (
                        <PeopleDeskTable
                          columnData={pipleLineColumn(
                            pages?.current,
                            pages?.pageSize,
                            wgName,
                            setOpenModal,
                            setSingleData,
                            permission
                          )}
                          pages={pages}
                          rowDto={landing}
                          setRowDto={setLanding}
                          handleChangePage={(e, newPage) =>
                            handleChangePage(e, newPage, values?.searchString)
                          }
                          handleChangeRowsPerPage={(e) =>
                            handleChangeRowsPerPage(e, values?.searchString)
                          }
                          uniqueKey="intPipelineHeaderId"
                          // getFilteredData={() => {
                          //   getData(
                          //     {
                          //       current: 1,
                          //       pageSize: paginationSize,
                          //       total: 0,
                          //     },
                          //     ""
                          //   );
                          // }}
                          isCheckBox={false}
                          isScrollAble={false}
                        />
                      ) : (
                        <NoResult />
                        // <h2>1st</h2>
                      )}
                      {/* <CardTable
                      landing={rowDto}
                      setOpenModal={setOpenModal}
                      setSingleData={setSingleData}
                      permission={permission}
                    /> */}
                    </div>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
          </>
        )}
      </Formik>
      <AddEditFormComponent
        show={openModal}
        title="Create Approval Pipeline"
        setOpenModal={setOpenModal}
        size="lg"
        backdrop="static"
        classes="default-modal approval-pipeline-modal"
        getData={getData}
        singleData={singleData}
        setSingleData={setSingleData}
        pages={pages}
      />
    </>
  );
};

export default CommonAppPipeline;
