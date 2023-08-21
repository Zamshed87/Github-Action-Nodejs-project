import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Loading from "./../../../common/loading/Loading";
import ProfileCard from "./profileCard";
import BankDetails from "./bankDetails";
// import { getPeopleDeskAllLanding } from "../../../common/api";
import OverviewTab from "../employeeOverview/components/OverviewTab";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { getEmployeeProfileViewData } from "../employeeFeature/helper";

function AboutMe() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { employeeId, buId, wgId, logWgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [empBasic, setEmpBasic] = useState({});
  const [bankData, setBankData] = useState("empty");
  const [isBank, setIsBank] = useState(true);
  // const [hasBankData, setHasBankData] = useState(true);
  const [confirmationMOdal, setConfirmationMOdal] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  const getEmpData = () => {
    // getPeopleDeskAllLanding("EmployeeBasicById", orgId, buId, employeeId, setEmpBasic, null, setLoading);
    // getEmployeeProfileViewData(employeeId, setEmpBasic, setLoading, buId, wgId);
    getEmployeeProfileViewData(employeeId, setEmpBasic, setLoading, buId, logWgId);
  };

  useEffect(() => {
    getEmpData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      empBasic?.empEmployeeBankDetail?.strAccountName ||
      empBasic?.empEmployeeBankDetail?.strBankWalletName ||
      empBasic?.empEmployeeBankDetail?.intBankOrWalletType === 3
    ) {
      setBankData("complete");
    }
  }, [empBasic]);

  return (
    <>
      {loading && <Loading />}
      <div className="about-info-main">
        <div className="container-about-info" style={{ marginTop: "36px" }}>
          <ProfileCard
            empBasic={empBasic?.employeeProfileLandingView}
            getEmpData={getEmpData}
            strProfileImageUrl={
              empBasic?.employeeProfileLandingView?.intEmployeeImageUrlId
            }
            empId={employeeId}
            isMargin
          />
          <div className="bankDetailsCard about-info-card pb-0">
            <div className="about-info-card-heading">
              <p className="bankCard-title">Overview</p>
            </div>
            <div className="card-body p-0">
              <OverviewTab empId={employeeId} wgId={wgId} buId={buId} />
            </div>
          </div>
          <BankDetails
            objProps={{
              empBasic: empBasic?.empEmployeeBankDetail,
              setRowDto,
              rowDto,
              setConfirmationMOdal,
              confirmationMOdal,
              // setHasBankData,
              // hasBankData,
              setIsBank,
              isBank,
              setBankData,
              bankData,
              getEmpData,
            }}
            empId={employeeId}
          />
        </div>
      </div>
    </>
  );
}
export default AboutMe;
