import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Loading from "./../../../common/loading/Loading";
import ProfileCard from "./profileCard";
import BankDetails from "./bankDetails";
// import { getPeopleDeskAllLanding } from "../../../common/api";
import OverviewTab from "../employeeOverview/components/OverviewTab";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import {
  getEmployeeProfileViewData,
  markAsComplete,
} from "../employeeFeature/helper";
import { Tag } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import IConfirmModal from "common/IConfirmModal";

function AboutMe() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "About Me";
  }, []);

  const { employeeId, buId, wgId, logWgId, intAccountId } = useSelector(
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
    getEmployeeProfileViewData(
      employeeId,
      setEmpBasic,
      setLoading,
      buId,
      logWgId
    );
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
        {intAccountId === 5 && (
          <div className="d-flex justify-content-end">
            {empBasic?.employeeProfileLandingView?.isMarkCompleted ? (
              <Tag
                style={{ marginRight: "1rem", fontSize: "14px" }}
                icon={<CheckCircleOutlined />}
                color="success"
              >
                Marked As Completed
              </Tag>
            ) : (
              <Tag
                style={{
                  cursor: "pointer",
                  marginRight: "1rem",
                  fontSize: "14px",
                }}
                onClick={() => {
                  let confirmObject = {
                    closeOnClickOutside: false,
                    message:
                      "Are you sure you want to mark as complete? After marking as complete, you can't edit.",
                    yesAlertFunc: () => {
                      markAsComplete(
                        empBasic?.employeeProfileLandingView
                          ?.intEmployeeBasicInfoId,
                        true,
                        setLoading,
                        () => {
                          getEmpData();
                        }
                      );
                    },
                    noAlertFunc: () => {
                      //   history.push("/components/dialogs")
                    },
                  };
                  IConfirmModal(confirmObject);
                }}
                color="success"
              >
                Mark As Complete
              </Tag>
            )}
          </div>
        )}

        <div className="container-about-info" style={{ marginTop: "18px" }}>
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
