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

  const { isOfficeAdmin } = useSelector(
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

  return (
    <>
      {loading && <Loading />}
      {employeeFeature?.isEdit ? (
        <div className="about-info-main" style={{ paddingTop: "46px" }}>
          <div className="container-about-info">
            <div className="card-about-info-main">
              <div
                className="card-about-info-main-header"
                style={{ marginBottom: "12px" }}
              >
                <BackButton title={"Employee Details"} />
                <div>
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
                setIsAddEditForm(true);
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

      {/* <ViewModal
        show={isAddEditForm}
        title={`Edit Employee(${empBasic?.employeeProfileLandingView?.strEmployeeName})`}
        onHide={() => setIsAddEditForm(false)}
        size="lg"
        backdrop="static"
        classes="default-modal form-modal"
      >
        <AddEditForm
          isEdit={true}
          singleData={{
            empId: empBasic?.employeeProfileLandingView?.intEmployeeBasicInfoId,
            fullName: empBasic?.employeeProfileLandingView?.strEmployeeName,
            employeeCode:
              empBasic?.employeeProfileLandingView?.strEmployeeCode || "",
            religion: {
              value: empBasic?.employeeProfileLandingView?.intReligionId || "",
              label: empBasic?.employeeProfileLandingView?.strReligion || "",
            },
            gender: {
              value: empBasic?.employeeProfileLandingView?.intGenderId || "",
              label: empBasic?.employeeProfileLandingView?.strGender || "",
            },
            dateofBirth: empBasic?.employeeProfileLandingView?.dteDateOfBirth
              ? dateFormatterForInput(
                  empBasic?.employeeProfileLandingView?.dteDateOfBirth
                )
              : "",
            joiningDate: empBasic?.employeeProfileLandingView?.dteJoiningDate
              ? dateFormatterForInput(
                  empBasic?.employeeProfileLandingView?.dteJoiningDate
                )
              : "",
            dteInternCloseDate: empBasic?.employeeProfileLandingView
              ?.dteInternCloseDate
              ? dateFormatterForInput(
                  empBasic?.employeeProfileLandingView?.dteInternCloseDate
                )
              : "",
            // dteInternCloseDate: empBasic?.employeeProfileLandingView
            //   ?.dteInternCloseDate
            //   ? moment(
            //     empBasic?.employeeProfileLandingView?.dteInternCloseDate
            //   ).format("YYYY-MM")
            //   : "",
            dteProbationaryCloseDate: empBasic?.employeeProfileLandingView
              ?.dteProbationaryCloseDate
              ? dateFormatterForInput(
                  empBasic?.employeeProfileLandingView?.dteProbationaryCloseDate
                )
              : "",
            // dteProbationaryCloseDate: empBasic?.employeeProfileLandingView
            //   ?.dteProbationaryCloseDate
            //   ? moment(
            //     empBasic?.employeeProfileLandingView?.dteProbationaryCloseDate
            //   ).format("YYYY-MM")
            //   : "",
            dteConfirmationDate: empBasic?.employeeProfileLandingView
              ?.dteConfirmationDate
              ? dateFormatterForInput(
                  empBasic?.employeeProfileLandingView?.dteConfirmationDate
                )
              : "",
            lastWorkingDay: empBasic?.employeeProfileLandingView
              ?.dteLastWorkingDate
              ? dateFormatterForInput(
                  empBasic?.employeeProfileLandingView?.dteLastWorkingDate
                )
              : "",
            employeeType: {
              value:
                empBasic?.employeeProfileLandingView?.intEmploymentTypeId || "",
              label:
                empBasic?.employeeProfileLandingView?.strEmploymentType || "",
              ParentId: empBasic?.employeeProfileLandingView?.intParentId || "",
              isManual: empBasic?.employeeProfileLandingView?.isManual || "",
            },
            department: {
              value:
                empBasic?.employeeProfileLandingView?.intDepartmentId || "",
              label: empBasic?.employeeProfileLandingView?.strDepartment || "",
            },
            designation: {
              value:
                empBasic?.employeeProfileLandingView?.intDesignationId || "",
              label: empBasic?.employeeProfileLandingView?.strDesignation || "",
            },
            hrPosition: {
              value:
                empBasic?.employeeProfileLandingView?.intHrpositionId || "",
              label:
                empBasic?.employeeProfileLandingView?.strHrpostionName || "",
            },
            workplaceGroup: {
              value:
                empBasic?.employeeProfileLandingView?.intWorkplaceGroupId || "",
              label:
                empBasic?.employeeProfileLandingView?.strWorkplaceGroupName ||
                "",
            },
            workplace: {
              value: empBasic?.employeeProfileLandingView?.intWorkplaceId || "",
              label:
                empBasic?.employeeProfileLandingView?.strWorkplaceName || "",
            },
            wing: {
              value: empBasic?.employeeProfileLandingView?.wingId || "",
              label: empBasic?.employeeProfileLandingView?.wingName || "",
            },
            soleDepo: {
              value: empBasic?.employeeProfileLandingView?.soleDepoId || "",
              label: empBasic?.employeeProfileLandingView?.soleDepoName || "",
            },
            region: {
              value: empBasic?.employeeProfileLandingView?.regionId || "",
              label: empBasic?.employeeProfileLandingView?.regionName || "",
            },
            area: {
              value: empBasic?.employeeProfileLandingView?.areaId || "",
              label: empBasic?.employeeProfileLandingView?.areaName || "",
            },
            territory: {
              value: empBasic?.employeeProfileLandingView?.territoryId || "",
              label: empBasic?.employeeProfileLandingView?.territoryName || "",
            },

            payrollGroup: {
              value:
                empBasic?.employeeProfileLandingView?.intPayrollGroupId || "",
              label:
                empBasic?.employeeProfileLandingView?.strPayrollGroupName || "",
            },
            payscaleGrade: {
              value:
                empBasic?.employeeProfileLandingView?.intPayscaleGradeId || "",
              label:
                empBasic?.employeeProfileLandingView?.strPayscaleGradeName ||
                "",
            },
            employeeStatus: {
              value:
                empBasic?.employeeProfileLandingView?.intEmployeeStatusId || "",
              label:
                empBasic?.employeeProfileLandingView?.strEmployeeStatus || "",
            },

            supervisor: {
              value:
                empBasic?.employeeProfileLandingView?.intSupervisorId || "",
              label:
                empBasic?.employeeProfileLandingView?.strSupervisorName || "",
            },
            lineManager: {
              value:
                empBasic?.employeeProfileLandingView?.intLineManagerId || "",
              label: empBasic?.employeeProfileLandingView?.strLinemanager || "",
            },
            dottedSupervisor: {
              value:
                empBasic?.employeeProfileLandingView?.intDottedSupervisorId ||
                "",
              label:
                empBasic?.employeeProfileLandingView?.strDottedSupervisorName ||
                "",
            },
            isSalaryHold: empBasic?.employeeProfileLandingView?.isSalaryHold,
            isTakeHomePay: empBasic?.employeeProfileLandingView?.isTakeHomePay,
            contractualFromDate: empBasic?.employeeProfileLandingView
              ?.dteContractFromDate
              ? dateFormatterForInput(
                  empBasic?.employeeProfileLandingView?.dteContractFromDate
                )
              : "",
            contractualToDate: empBasic?.employeeProfileLandingView
              ?.dteContractToDate
              ? dateFormatterForInput(
                  empBasic?.employeeProfileLandingView?.dteContractToDate
                )
              : "",
            isCreateUser:
              empBasic?.employeeProfileLandingView?.isCreateUser || false,

            //User Info
            loginUserId:
              empBasic?.userVM?.loginId ||
              empBasic?.employeeProfileLandingView?.strEmployeeCode ||
              "",
            password: empBasic?.userVM?.strPassword || "123456",
            email: empBasic?.userVM?.officeMail,
            phone: empBasic?.userVM?.strPersonalMobile,
            userType: empBasic?.userVM?.userTypeId
              ? {
                  value: empBasic?.userVM?.userTypeId,
                  label: empBasic?.userVM?.strUserType,
                }
              : null,
            isActive: empBasic?.userVM?.userStatus,

            // calender assigne
          }}
          getData={getEmpData}
          setIsAddEditForm={setIsAddEditForm}
        />
      </ViewModal> */}

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
                      empBasic?.employeeProfileLandingView?.strSupervisorNameWithCode,
                  }
                : undefined,
              lineManager: empBasic?.employeeProfileLandingView
                ?.intLineManagerId
                ? {
                    value:
                      empBasic?.employeeProfileLandingView?.intLineManagerId,
                    label: empBasic?.employeeProfileLandingView?.strLinemanagerNameWithCode,
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
