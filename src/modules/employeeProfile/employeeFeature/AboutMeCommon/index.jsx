/* eslint-disable react-hooks/exhaustive-deps */
import { PrintOutlined } from "@mui/icons-material";
import Button from "@mui/material/Button";
// import moment from "moment";
import { PModal } from "Components/Modal";
import moment from "moment";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import BackButton from "../../../../common/BackButton";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray500, gray900 } from "../../../../utility/customColor";
import BankDetails from "../../aboutMe/bankDetails";
import ProfileCard from "../../aboutMe/profileCard";
import OverviewTab from "../../employeeOverview/components/OverviewTab";
import AddEditForm from "../addEditFile";
import { getEmployeeProfileViewData } from "../helper";
import "./aboutMeCommon.css";
import { isDevServer } from "App";
import { probationCloseDateCustomDDL } from "utility/yearDDL";
import { Tag } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

function AboutMeDetails() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [empBasic, setEmpBasic] = useState({});
  const [bankData, setBankData] = useState("empty");
  const [isBank, setIsBank] = useState(true);
  const [isDigitalBanking, setIsDigitalBanking] = useState(false);
  const [isCash, setIsCash] = useState(false);
  const [confirmationMOdal, setConfirmationMOdal] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [isAddEditForm, setIsAddEditForm] = useState(false);

  const history = useHistory();

  const { empId } = useParams();
  const location = useLocation();
  const { buId, wgId } = location?.state;

  const { isOfficeAdmin, intAccountId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const getEmpData = () => {
    getEmployeeProfileViewData(empId, setEmpBasic, setLoading, buId, wgId);
  };

  useEffect(() => {
    getEmpData();
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

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let employeeFeature = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 8) {
      employeeFeature = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, []);

  isDevServer && console.log({ isOfficeAdmin, employeeFeature });
  return (
    <>
      {loading && <Loading />}
      {employeeFeature?.isView ? (
        <div className="about-info-main" style={{ paddingTop: "46px" }}>
          <div className="container-about-info">
            <div className="card-about-info-main">
              <div
                className="card-about-info-main-header"
                style={{ marginBottom: "12px" }}
              >
                <BackButton title={"Employee Details"} />
                <div className="d-flex mr-5">
                  {empBasic?.isMarkCompleted && intAccountId === 5 && (
                    <Tag
                      style={{
                        fontSize: "14px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      icon={<CheckCircleOutlined />}
                      color="success"
                    >
                      Marked As Completed
                    </Tag>
                  )}

                  {(isOfficeAdmin || employeeFeature?.isEdit) && (
                    <Button
                      onClick={() => {
                        history.push(
                          `/profile/employee/go-for-print/${empId}`,
                          {
                            buId: empBasic?.employeeProfileLandingView
                              ?.intBusinessUnitId,
                            wgId: empBasic?.employeeProfileLandingView
                              ?.intWorkplaceGroupId,
                          }
                        );
                      }}
                      variant="outlined"
                      sx={{
                        borderColor: gray500,
                        color: gray500,
                        fontSize: "14px",
                        fontWeight: "600",
                        lineHeight: "20px",
                        "&:hover": {
                          borderColor: gray500,
                        },
                      }}
                      startIcon={
                        <PrintOutlined
                          sx={{ color: gray900 }}
                          className="emp-print-icon"
                        />
                      }
                    >
                      Go for print
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <ProfileCard
              isEditBtn={true}
              getEmpData={getEmpData}
              empBasic={empBasic?.employeeProfileLandingView}
              strProfileImageUrl={
                empBasic?.employeeProfileLandingView?.intEmployeeImageUrlId
              }
              empId={empId}
              editBtnHandler={() => {
                // setIsAddEditForm(true);
                history.push(`/profile/employee/edit/${empId}`);
              }}
              isOfficeAdmin={isOfficeAdmin || employeeFeature?.isEdit}
            />
            {/* {(isOfficeAdmin || employeeFeature?.isEdit) && ( */}
            <>
              <div className="bankDetailsCard about-info-card pb-0">
                <div className="about-info-card-heading">
                  <p className="bankCard-title">Overview</p>
                </div>
                <div className="card-body p-0">
                  <OverviewTab empId={empId} wgId={wgId} buId={buId} />
                </div>
              </div>
            </>

            <BankDetails
              objProps={{
                empBasic: empBasic?.empEmployeeBankDetail,
                setRowDto,
                rowDto,
                setConfirmationMOdal,
                confirmationMOdal,
                setIsBank,
                isBank,
                setIsCash,
                isCash,
                setIsDigitalBanking,
                isDigitalBanking,
                setBankData,
                bankData,
                getEmpData,
                isOfficeAdmin: employeeFeature?.isEdit || isOfficeAdmin,
              }}
              editBtnHandler={() => {
                setBankData("create");
                if (
                  empBasic?.empEmployeeBankDetail?.strAccountName &&
                  empBasic?.empEmployeeBankDetail?.intBankOrWalletType !== 3
                ) {
                  setIsBank(true);
                  setIsDigitalBanking(false);
                  setIsCash(false);
                }
                if (
                  !empBasic?.empEmployeeBankDetail?.strAccountName &&
                  empBasic?.empEmployeeBankDetail?.intBankOrWalletType !== 3
                ) {
                  setIsDigitalBanking(true);
                  setIsBank(false);
                  setIsCash(false);
                }
                if (
                  empBasic?.empEmployeeBankDetail?.intBankOrWalletType === 3
                ) {
                  setIsCash(true);
                  setIsBank(false);
                  setIsDigitalBanking(false);
                }
              }}
              isEditBtn={true}
              empId={empId}
            />
          </div>
        </div>
      ) : (
        <NotPermittedPage />
      )}
      <PModal
        open={isAddEditForm}
        title={`Edit Employee(${empBasic?.employeeProfileLandingView?.strEmployeeName})`}
        onCancel={() => setIsAddEditForm(false)}
        maskClosable={false}
        components={
          <AddEditForm
            isEdit={true}
            isMenuEditPermission={!employeeFeature?.isEdit}
            isOfficeAdmin={!isOfficeAdmin}
            singleData={{
              empId:
                empBasic?.employeeProfileLandingView?.intEmployeeBasicInfoId,
              strReferenceId:
                empBasic?.employeeProfileLandingView?.strReferenceId,
              fullName: empBasic?.employeeProfileLandingView?.strEmployeeName,
              employeeCode:
                empBasic?.employeeProfileLandingView?.strEmployeeCode ||
                undefined,
              religion: empBasic?.employeeProfileLandingView?.intReligionId
                ? {
                    value: empBasic?.employeeProfileLandingView?.intReligionId,
                    label: empBasic?.employeeProfileLandingView?.strReligion,
                  }
                : undefined,
              gender: empBasic?.employeeProfileLandingView?.intGenderId
                ? {
                    value: empBasic?.employeeProfileLandingView?.intGenderId,
                    label: empBasic?.employeeProfileLandingView?.strGender,
                  }
                : undefined,
              dateofBirth: empBasic?.employeeProfileLandingView?.dteDateOfBirth
                ? moment(empBasic?.employeeProfileLandingView?.dteDateOfBirth)
                : "",
              joiningDate: empBasic?.employeeProfileLandingView?.dteJoiningDate
                ? moment(empBasic?.employeeProfileLandingView?.dteJoiningDate)
                : "",
              dteInternCloseDate: empBasic?.employeeProfileLandingView
                ?.dteInternCloseDate
                ? moment(
                    empBasic?.employeeProfileLandingView?.dteInternCloseDate
                  )
                : "",
              dteProbationaryCloseDate: empBasic?.employeeProfileLandingView
                ?.dteProbationaryCloseDate
                ? moment(
                    empBasic?.employeeProfileLandingView
                      ?.dteProbationaryCloseDate
                  )
                : "",
              section: empBasic?.employeeProfileLandingView?.intSectionId
                ? {
                    value: empBasic?.employeeProfileLandingView?.intSectionId,
                    label: empBasic?.employeeProfileLandingView?.strSectionName,
                  }
                : undefined,
              dteConfirmationDate: empBasic?.employeeProfileLandingView
                ?.dteConfirmationDate
                ? moment(
                    empBasic?.employeeProfileLandingView?.dteConfirmationDate
                  )
                : "",
              lastWorkingDay: empBasic?.employeeProfileLandingView
                ?.dteLastWorkingDate
                ? moment(
                    empBasic?.employeeProfileLandingView?.dteLastWorkingDate
                  )
                : "",
              employeeType: empBasic?.employeeProfileLandingView
                ?.intEmploymentTypeId
                ? {
                    value:
                      empBasic?.employeeProfileLandingView?.intEmploymentTypeId,
                    label:
                      empBasic?.employeeProfileLandingView?.strEmploymentType,
                    ParentId: empBasic?.employeeProfileLandingView?.intParentId,
                    isManual: empBasic?.employeeProfileLandingView?.isManual,
                  }
                : undefined,
              department: empBasic?.employeeProfileLandingView?.intDepartmentId
                ? {
                    value:
                      empBasic?.employeeProfileLandingView?.intDepartmentId,
                    label: empBasic?.employeeProfileLandingView?.strDepartment,
                  }
                : undefined,
              designation: empBasic?.employeeProfileLandingView
                ?.intDesignationId
                ? {
                    value:
                      empBasic?.employeeProfileLandingView?.intDesignationId,
                    label: empBasic?.employeeProfileLandingView?.strDesignation,
                  }
                : undefined,
              hrPosition: empBasic?.employeeProfileLandingView?.intHrpositionId
                ? {
                    value:
                      empBasic?.employeeProfileLandingView?.intHrpositionId,
                    label:
                      empBasic?.employeeProfileLandingView?.strHrpostionName,
                  }
                : undefined,
              workplaceGroup: empBasic?.employeeProfileLandingView
                ?.intWorkplaceGroupId
                ? {
                    value:
                      empBasic?.employeeProfileLandingView?.intWorkplaceGroupId,
                    label:
                      empBasic?.employeeProfileLandingView
                        ?.strWorkplaceGroupName,
                  }
                : undefined,
              workplace: empBasic?.employeeProfileLandingView?.intWorkplaceId
                ? {
                    value: empBasic?.employeeProfileLandingView?.intWorkplaceId,
                    label:
                      empBasic?.employeeProfileLandingView?.strWorkplaceName,
                  }
                : undefined,
              wing: empBasic?.employeeProfileLandingView?.wingId
                ? {
                    value: empBasic?.employeeProfileLandingView?.wingId,
                    label: empBasic?.employeeProfileLandingView?.wingName,
                  }
                : undefined,
              soleDepo: empBasic?.employeeProfileLandingView?.soleDepoId
                ? {
                    value: empBasic?.employeeProfileLandingView?.soleDepoId,
                    label: empBasic?.employeeProfileLandingView?.soleDepoName,
                  }
                : undefined,
              region: empBasic?.employeeProfileLandingView?.regionId
                ? {
                    value: empBasic?.employeeProfileLandingView?.regionId,
                    label: empBasic?.employeeProfileLandingView?.regionName,
                  }
                : undefined,
              area: empBasic?.employeeProfileLandingView?.areaId
                ? {
                    value: empBasic?.employeeProfileLandingView?.areaId,
                    label: empBasic?.employeeProfileLandingView?.areaName,
                  }
                : undefined,
              territory: empBasic?.employeeProfileLandingView?.territoryId
                ? {
                    value: empBasic?.employeeProfileLandingView?.territoryId,
                    label: empBasic?.employeeProfileLandingView?.territoryName,
                  }
                : undefined,
              payrollGroup: empBasic?.employeeProfileLandingView
                ?.intPayrollGroupId
                ? {
                    value:
                      empBasic?.employeeProfileLandingView?.intPayrollGroupId,
                    label:
                      empBasic?.employeeProfileLandingView?.strPayrollGroupName,
                  }
                : undefined,
              payscaleGrade: empBasic?.employeeProfileLandingView
                ?.intPayscaleGradeId
                ? {
                    value:
                      empBasic?.employeeProfileLandingView?.intPayscaleGradeId,
                    label:
                      empBasic?.employeeProfileLandingView
                        ?.strPayscaleGradeName,
                  }
                : undefined,
              employeeStatus: empBasic?.employeeProfileLandingView
                ?.intEmployeeStatusId
                ? {
                    value:
                      empBasic?.employeeProfileLandingView?.intEmployeeStatusId,
                    label:
                      empBasic?.employeeProfileLandingView?.strEmployeeStatus,
                  }
                : undefined,
              supervisor: empBasic?.employeeProfileLandingView?.intSupervisorId
                ? {
                    value:
                      empBasic?.employeeProfileLandingView?.intSupervisorId,
                    label:
                      empBasic?.employeeProfileLandingView
                        ?.strSupervisorNameWithCode,
                  }
                : undefined,
              lineManager: empBasic?.employeeProfileLandingView
                ?.intLineManagerId
                ? {
                    value:
                      empBasic?.employeeProfileLandingView?.intLineManagerId,
                    label:
                      empBasic?.employeeProfileLandingView
                        ?.strLinemanagerNameWithCode,
                  }
                : undefined,
              dottedSupervisor: empBasic?.employeeProfileLandingView
                ?.intDottedSupervisorId
                ? {
                    value:
                      empBasic?.employeeProfileLandingView
                        ?.intDottedSupervisorId,
                    label:
                      empBasic?.employeeProfileLandingView
                        ?.strDottedSupervisorNameWithCode,
                  }
                : undefined,
              isSalaryHold: empBasic?.employeeProfileLandingView?.isSalaryHold,
              isTakeHomePay:
                empBasic?.employeeProfileLandingView?.isTakeHomePay,
              contractualFromDate: empBasic?.employeeProfileLandingView
                ?.dteContractFromDate
                ? moment(
                    empBasic?.employeeProfileLandingView?.dteContractFromDate
                  )
                : undefined,
              contractualToDate: empBasic?.employeeProfileLandingView
                ?.dteContractToDate
                ? moment(
                    empBasic?.employeeProfileLandingView?.dteContractToDate
                  )
                : undefined,
              isCreateUser:
                empBasic?.employeeProfileLandingView?.isCreateUser || false,
              loginUserId:
                empBasic?.employeeProfileLandingView?.loginId ||
                empBasic?.employeeProfileLandingView?.strEmployeeCode ||
                undefined,
              payScaleGrade: empBasic?.employeeProfileLandingView
                ?.intPayscaleGradeId
                ? {
                    value:
                      empBasic?.employeeProfileLandingView?.intPayscaleGradeId,
                    label:
                      empBasic?.employeeProfileLandingView
                        ?.strPayscaleGradeName,
                  }
                : undefined,

              salaryType: empBasic?.employeeProfileLandingView?.intSalaryTypeId
                ? {
                    value:
                      empBasic?.employeeProfileLandingView?.intSalaryTypeId,
                    label:
                      empBasic?.employeeProfileLandingView?.strSalaryTypeName,
                  }
                : undefined,
              password:
                empBasic?.employeeProfileLandingView?.strPassword || "123456",
              email: empBasic?.employeeProfileLandingView?.strPersonalMail,
              workMail:
                empBasic?.employeeProfileLandingView?.strOfficeMail || "",
              workPhone:
                empBasic?.employeeProfileLandingView?.strOfficeMobile || "",
              phone: empBasic?.employeeProfileLandingView?.strPersonalMobile,
              userType: empBasic?.employeeProfileLandingView?.userTypeId
                ? {
                    value: empBasic?.employeeProfileLandingView?.userTypeId,
                    label: empBasic?.employeeProfileLandingView?.strUserType,
                  }
                : undefined,
              isActive: empBasic?.employeeProfileLandingView?.userStatus,
              otType: empBasic?.employeeProfileLandingView?.intOtType
                ? [
                    {
                      value: 1,
                      label: "Not Applicable",
                    },
                    { value: 2, label: "With Salary" },
                    {
                      value: 3,
                      label: "Without Salary/Additional OT",
                    },
                  ].find(
                    (ot) =>
                      ot.value ===
                      empBasic?.employeeProfileLandingView?.intOtType
                  )
                : {
                    value: 1,
                    label: "Not Applicable",
                  },
              probationayClosedBy:
                probationCloseDateCustomDDL.find(
                  (dt) =>
                    dt?.value ===
                    empBasic?.employeeProfileLandingView
                      ?.intProbationayClosedByInDate
                ) || undefined,
              strOTbasedon: empBasic?.employeeProfileLandingView?.strOTbasedon
                ? {
                    value: empBasic?.employeeProfileLandingView?.strOTbasedon,
                    label: empBasic?.employeeProfileLandingView?.strOTbasedon,
                  }
                : {
                    value: "Calendar",
                    label: "Calendar",
                  },
              intOTFixedHour:
                empBasic?.employeeProfileLandingView?.intOTFixedHour || 0,
              // new requirment calender field will be editable 8-01-2024 🔥🔥 -- requiremnt undo
              // generateDate:  moment(empBasic?.employeeProfileLandingView?.dteCalOrRosGenerateDate) || undefined,
              // calenderType: [{value: 1, label: "Calendar"},
              //                { value: 2, label: "Roster" }].find(itm => itm.label === empBasic?.employeeProfileLandingView?.strCalenderType)  || undefined,
              // calender: empBasic?.employeeProfileLandingView?.strCalenderType === "Roster" ?
              // {
              //   value: empBasic?.employeeProfileLandingView?.intRosterGroupId,
              //   label: empBasic?.employeeProfileLandingView?.strRosterGroupName,
              // } :
              // {
              //     value: empBasic?.employeeProfileLandingView?.intCalenderId,
              //     label: empBasic?.employeeProfileLandingView?.strCalenderName,
              //   } ,
              // startingCalender: empBasic?.employeeProfileLandingView?.strCalenderType === "Roster" ?  {
              //   value: empBasic?.employeeProfileLandingView?.intCalenderId,
              //   label: empBasic?.employeeProfileLandingView?.strCalenderName,
              // } : undefined,
              // nextChangeDate: moment(empBasic?.employeeProfileLandingView?.dteNextChangeDate) || undefined,

              // calender assigne
            }}
            getData={getEmpData}
            // empBasic={empBasic}
            setIsAddEditForm={setIsAddEditForm}
          />
        }
      />
    </>
  );
}
export default AboutMeDetails;
