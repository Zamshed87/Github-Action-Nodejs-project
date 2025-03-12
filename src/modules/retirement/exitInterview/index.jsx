import { Form } from "antd";
import CommonFilter from "common/CommonFilter";
import Loading from "common/loading/Loading";
import NoResult from "common/NoResult";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import PeopleDeskTable, { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions.js";
import { PModal } from "Components/Modal";
import moment from "moment";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  getExitInterviewLanding,
  getExitInterviewLandingTableColumn,
  SearchFilter,
  statusDDL,
} from "../exitInterview/helper.js";
import ExitInterviewAssign from "./components/ExitInterviewAssign.jsx";
import ExitInterviewDataView from "./components/ExitInterviewDataView.jsx";

export default function ExitInterviewLanding() {
  const {
    profileData: { buId, wgId, wId },
    permissionList,
    tokenData,
  } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30544) {
      permission = item;
    }
  });

  const decodedToken = tokenData
    ? JSON.parse(atob(tokenData.split(".")[1]))
    : null;

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const [openFilter, setOpenFilter] = useState(false);
  const [openExitInterviewAssignModal, setOpenExitInterviewAssignModal] =
    useState(false);
  const [openExitInterviewDataViewModal, setOpenExitInterviewDataViewModal] =
    useState(false);

  const history = useHistory();
  const dispatch = useDispatch();

  const [rowDto, setRowDto] = useState([]);
  const [id, setId] = useState(null);
  const [empId, setEmpId] = useState(null);
  const [questionId, setQuestionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getData = (pagination, searchText) => {
    getExitInterviewLanding(
      "ExitInterview",
      buId,
      wgId,
      "",
      "",
      values?.status || "",
      searchText,
      setRowDto,
      setLoading,
      pagination?.current,
      pagination?.pageSize,
      setPages,
      wId,
      "",
      decodedToken.workplaceGroupList || "",
      decodedToken.workplaceList || ""
    );
  };

  const handleFilter = (values, searchText = "", pagination = pages) => {
    const { workplace, workplaceGroup } = values;
    const fromDate = values?.fromDate
      ? moment(values?.fromDate, "DD/MM/YYYY").format("YYYY-MM-DD")
      : null;
    const toDate = values?.toDate
      ? moment(values?.toDate, "DD/MM/YYYY").format("YYYY-MM-DD")
      : null;
    getExitInterviewLanding(
      "ExitInterview",
      buId,
      wgId,
      fromDate || "",
      toDate || "",
      values?.status || "",
      searchText,
      setRowDto,
      setLoading,
      pagination?.current,
      pagination?.pageSize,
      setPages,
      wId,
      "",
      workplaceGroup?.value || wgId,
      workplace?.value || wId
    );
  };

  const handleChangePage = (_, newPage, searchText = "") => {
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

  const handleChangeRowsPerPage = (event, searchText = "") => {
    setPages(() => {
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
    dispatch(setFirstLevelNameAction("Retirement"));
    document.title = "Exit Interview";
  }, [dispatch]);

  useEffect(() => {
    getExitInterviewLanding(
      "ExitInterview",
      buId,
      wgId,
      values?.filterFromDate || "",
      values?.filterToDate || "",
      values?.status?.value || "",
      "",
      setRowDto,
      setLoading,
      1,
      paginationSize,
      setPages,
      wId,
      "",
      decodedToken.workplaceGroupList || "",
      decodedToken.workplaceList || ""
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  return (
    <>
      {loading && <Loading />}
      {permission?.isView ? (
        <div className="table-card businessUnit-wrapper dashboard-scroll">
          <div className="d-flex justify-content-end mr-2">
            <SearchFilter form={form} pages={pages} getData={getData} />
            <CommonFilter
              visible={openFilter}
              onClose={(visible) => setOpenFilter(visible)}
              onFilter={handleFilter}
              isDate={true}
              isStatus={true}
              statusDDL={statusDDL}
            />
          </div>
          <div className="mt-3">
            {rowDto?.length > 0 ? (
              <>
                <PeopleDeskTable
                  customClass="iouManagementTable"
                  columnData={getExitInterviewLandingTableColumn(
                    pages?.current,
                    pages?.pageSize,
                    history,
                    setOpenExitInterviewAssignModal,
                    setOpenExitInterviewDataViewModal,
                    setId,
                    setEmpId,
                    setQuestionId
                  )}
                  pages={pages}
                  rowDto={rowDto || []}
                  setRowDto={setRowDto}
                  handleChangePage={(e, newPage) =>
                    handleChangePage(e, newPage, values?.search)
                  }
                  handleChangeRowsPerPage={(e) =>
                    handleChangeRowsPerPage(e, values?.search)
                  }
                  uniqueKey="strEmployeeCode"
                  isCheckBox={false}
                  isScrollAble={false}
                />
                <PModal
                  title="Assign Exit Interview"
                  open={openExitInterviewAssignModal}
                  onCancel={() => {
                    getExitInterviewLanding(
                      "ExitInterview",
                      buId,
                      wgId,
                      values?.filterFromDate || "",
                      values?.filterToDate || "",
                      values?.status?.value || "",
                      "",
                      setRowDto,
                      setLoading,
                      1,
                      paginationSize,
                      setPages,
                      wId,
                      "",
                      decodedToken.workplaceGroupList || "",
                      decodedToken.workplaceList || ""
                    );
                    setOpenExitInterviewAssignModal(false);
                  }}
                  components={<ExitInterviewAssign id={id} empId={empId} />}
                  width={1000}
                />
                <PModal
                  title="Exit Interview"
                  open={openExitInterviewDataViewModal}
                  onCancel={() => {
                    setOpenExitInterviewDataViewModal(false);
                  }}
                  components={
                    <ExitInterviewDataView
                      id={id}
                      empId={empId}
                      questionId={questionId}
                    />
                  }
                  width={1000}
                />
              </>
            ) : (
              <>{!loading && <NoResult title="No Result Found" para="" />}</>
            )}
          </div>
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
}
