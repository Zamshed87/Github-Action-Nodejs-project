import { AddOutlined } from "@mui/icons-material";
import { Form } from "antd";
import CommonFilter from "common/CommonFilter";
import { PModal } from "Components/Modal";
import moment from "moment";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PeopleDeskTable from "../../../../common/peopleDeskTable";
import PrimaryButton from "../../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import {
  getSeparationLanding,
  separationApplicationLandingTableColumn,
} from "../helper";
import { statusDDL } from "./utils";
import SeparationHistoryview from "./viewForm/SeparationHistoryview";

const paginationSize = 100;
export const formatDate = (date) => {
  return moment(date).format("YYYY-MM-DD");
};
export default function ManagementSeparation() {
  // hook
  const dispatch = useDispatch();
  const history = useHistory();

  // redux
  const {
    profileData: { buId, wgId, wId },
    tokenData,
  } = useSelector((state) => state?.auth, shallowEqual);

  const decodedToken = tokenData
    ? JSON.parse(atob(tokenData.split(".")[1]))
    : null;

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 10) {
      permission = item;
    }
  });

  // state
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState(null);
  const [empId, setEmpId] = useState(null);

  // landing
  const [rowDto, setRowDto] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  const [openFilter, setOpenFilter] = useState(false);

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const getData = (pagination, searchText) => {
    getSeparationLanding(
      "EmployeeSeparationList",
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
    getSeparationLanding(
      "EmployeeSeparationList",
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

  // initial
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Retirement"));
    document.title = "Separation";
  }, [dispatch]);

  useEffect(() => {
    getSeparationLanding(
      "EmployeeSeparationList",
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
            <MasterFilter
              inputWidth="200"
              width="200px"
              isHiddenFilter
              value={values?.search}
              setValue={(value) => {
                form.setFieldValue("search", value);
                if (value) {
                  getData(pages, value);
                } else {
                  getData(pages, "");
                }
              }}
              cancelHandler={() => {
                form.setFieldValue("search", "");
                getData(pages, "");
              }}
            />
            <CommonFilter
              visible={openFilter}
              onClose={(visible) => setOpenFilter(visible)}
              onFilter={handleFilter}
              isDate={true}
              isStatus={true}
              statusDDL={statusDDL}
            />
            <PrimaryButton
              type="button"
              className="btn btn-default flex-center ml-2"
              label={"Apply"}
              icon={<AddOutlined sx={{ marginRight: "11px" }} />}
              onClick={(e) => {
                e.stopPropagation();
                if (!permission?.isCreate)
                  return toast.warn("You don't have permission");
                history.push("/retirement/separation/create");
              }}
            />
          </div>
          {rowDto?.length > 0 ? (
            <>
              <PeopleDeskTable
                customClass="iouManagementTable"
                columnData={separationApplicationLandingTableColumn(
                  pages?.current,
                  pages?.pageSize,
                  history,
                  dispatch,
                  setOpenModal,
                  permission,
                  setId,
                  setEmpId,
                  setLoading
                )}
                pages={pages}
                rowDto={rowDto}
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
                title="Separation History View"
                open={openModal}
                onCancel={() => {
                  setOpenModal(false);
                }}
                components={<SeparationHistoryview id={id} empId={empId} />}
                width={1000}
              />
            </>
          ) : (
            <>{!loading && <NoResult title="No Result Found" para="" />}</>
          )}
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
}
