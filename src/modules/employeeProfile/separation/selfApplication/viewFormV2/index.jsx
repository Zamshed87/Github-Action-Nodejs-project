import { AddOutlined } from "@mui/icons-material";
import Loading from "common/loading/Loading";
import NoResultTwo from "common/NoResultTwo";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import PeopleDeskTable from "common/peopleDeskTable";
import PrimaryButton from "common/PrimaryButton";
import { PModal } from "Components/Modal";
import moment from "moment";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import { separationApplicationLandingTableColumn } from "../helper";
import ChargeHandOver from "./components/ChargeHandOver";

const paginationSize = 100;
export const formatDate = (date) => {
  return moment(date).format("YYYY-MM-DD");
};
export default function SelfServiceSeparation() {
  // hook
  const dispatch = useDispatch();
  const history = useHistory();

  // redux
  const {
    profileData: { buId, wgId, wId, employeeId },
  } = useSelector((state) => state?.auth, shallowEqual);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  const [, getSeperationData] = useAxiosGet();
  const [, postWithdrawSeperationData] = useAxiosPost();
  const [, postCancelSeperationData] = useAxiosPost();
  const [aprovalStatus, setAprovalStatus] = useState("");
  const [separationId, setSeparationId] = useState(null);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30554) {
      permission = item;
    }
  });

  // state
  const [loading, setLoading] = useState(false);
  const [openChargeHandOverModal, setChargeHandOverModal] = useState(false);

  // landing
  const [rowDto, setRowDto] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const getData = () => {
    setLoading(true);
    getSeperationData(`/Separation/GetSeparationByEmployee`, (res) => {
      setRowDto(res?.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    getData();
  }, [buId, wgId, wId]);

  return (
    <>
      {loading && <Loading />}
      {permission?.isView ? (
        <div className="table-card businessUnit-wrapper dashboard-scroll">
          <div
            className="table-card-heading d-flex justify-content-between"
            style={{ marginBottom: "20px" }}
          >
            <div>
              <h6>Separation</h6>
            </div>
            <PrimaryButton
              type="button"
              className="btn btn-default"
              label={"Apply"}
              icon={<AddOutlined sx={{ marginRight: "11px" }} />}
              onClick={(e) => {
                e.stopPropagation();
                history.push("/SelfService/separation/applicationV2/create");
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
                  employeeId,
                  getData,
                  setChargeHandOverModal,
                  postWithdrawSeperationData,
                  postCancelSeperationData,
                  aprovalStatus,
                  setAprovalStatus,
                  separationId,
                  setSeparationId
                )}
                pages={pages}
                rowDto={rowDto || []}
                setRowDto={setRowDto}
                uniqueKey="strEmployeeCode"
                isCheckBox={false}
                isScrollAble={false}
              />
              <PModal
                title="Charge Handover"
                open={openChargeHandOverModal}
                onCancel={() => {
                  setChargeHandOverModal(false);
                }}
                components={
                  <ChargeHandOver
                    separationId={separationId}
                    getSeparationData={getData}
                  />
                }
                width={1000}
              />
            </>
          ) : (
            <>
              {!loading && (
                <NoResultTwo
                  title="You have no application. "
                  to="/SelfService/separation/applicationV2/create"
                />
              )}
            </>
          )}
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
}
