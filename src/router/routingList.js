// pms----------------------------------------
const AssessmentByHR = lazy(() =>
  import("../modules/pms/valuesAndCompetencies/assessmentByHR/index.jsx")
);
const SupervisorAssessmentLanding = lazy(() =>
  import("../modules/pms/performanceAssessment/supervisorAssessment/index.jsx")
);
const SupervisorAssessmentNew = lazy(() =>
  import(
    "../modules/pms/performanceAssessment/supervisorAssessment/supervisorAssessment.jsx"
  )
);
const SupervisorAssessment = lazy(() =>
  import("../modules/pms/valuesAndCompetencies/supervisorAssessment/index.jsx")
);
const BarAssesment = lazy(() =>
  import("../modules/pms/valuesAndCompetencies/barAssesment/index.jsx")
);
const BarAssessmentEvaluationForSupervisor = lazy(() =>
  import(
    "../modules/pms/performanceAssessment/supervisorAssessment/barAssessmentEvaluationForSupervisor.jsx"
  )
);
const BarAssesmentEvaluation = lazy(() =>
  import(
    "../modules/pms/valuesAndCompetencies/barAssesment/evaluation/index.jsx"
  )
);
const SelfAssessmentNew = lazy(() =>
  import("../modules/pms/performanceAssessment/selfAssessment/index.jsx")
);
const SelfAssessment = lazy(() =>
  import("../modules/pms/valuesAndCompetencies/selfAssessment/index.jsx")
);
const NineBoxGrid = lazy(() => import("../modules/pms/nineBoxGrid/index.jsx"));
// const CoreValues = lazy(() =>
//   import("../modules/pms/configuration/behavioralFactor/coreValues/index.jsx")
// );
// const CoreCompetencies = lazy(() =>
//   import("../modules/pms/configuration/coreCompetencies/index.jsx")
// );
const EmployeeRole = lazy(() =>
  import("../modules/pms/configuration/employeeRole/index.jsx")
);

const GrowthModel = lazy(() =>
  import("../modules/pms/performanceCoaching/growModel/index.js")
);
const IDP = lazy(() => import("../modules/pms/idp/index.jsx"));
const ActionPlanGrowModelLanding = lazy(() =>
  import("../modules/pms/performanceCoaching/actionPlanGrowModel/index.jsx")
);
const ActionPlanCreate = lazy(() =>
  import("../modules/pms/performancePlanning/actionPlan/create.jsx")
);
const BarAssesmentConfig = lazy(() =>
  import("../modules/pms/performancePlanning/barAssesmentConfig/index.jsx")
);
const ActionPlanJohariWindow = lazy(() =>
  import("../modules/pms/performanceCoaching/actionPlanJohariWindow/index.jsx")
);
const WorkPlan = lazy(() =>
  import("../modules/pms/performancePlanning/workPlan/index.jsx")
);
const IndividualKpiEntry = lazy(() =>
  import("../modules/pms/performancePlanning/individualKpiEntry/index.jsx")
);
// const IndividualKpiResult = lazy(() =>
//   import("../modules/pms/performancePlanning/individualKpiResult/index.jsx")
// );
const IndividualKpiEntrySelf = lazy(() =>
  import("../modules/pms/performancePlanning/individualKpiEntrySelf/index.jsx")
);
const DepartmentalKpiEntry = lazy(() =>
  import("../modules/pms/performancePlanning/departmentalKpiEntry/index.jsx")
);
const SbuKpiEntry = lazy(() =>
  import("../modules/pms/performancePlanning/sbuKpiEntry/index.jsx")
);
const IndividualScoreCard = lazy(() =>
  import("../modules/pms/performancePlanning/individualScoreCard/index.jsx")
);

const EisenhowerMatrix = lazy(() =>
  import("../modules/pms/performancePlanning/eisenhowerMatrix/index.jsx")
);
const JohariWindow = lazy(() =>
  import("../modules/pms/performanceCoaching/johariWindow/index.jsx")
);

const DesignationWiseMapping = lazy(() =>
  import(
    "../modules/pms/configuration/kpimapping/createNUpdateKpi/DesignationWiseMapping.jsx"
  )
);
const DepartmentWiseMapping = lazy(() =>
  import(
    "../modules/pms/configuration/kpimapping/createNUpdateKpi/DepartmentWiseMapping.jsx"
  )
);
const EmployeeWiseMapping = lazy(() =>
  import(
    "../modules/pms/configuration/kpimapping/createNUpdateKpi/EmployeeWiseMapping.jsx"
  )
);
const CreateKPI = lazy(() =>
  import("../modules/pms/configuration/kpis/CreateKPI.jsx")
);
const Kpis = lazy(() => import("../modules/pms/configuration/kpis/index.jsx"));
// const KpiMapping = lazy(() =>
//   import("../modules/pms/configuration/kpimapping/index.jsx")
// );
const IndividualKpiMapping = lazy(() =>
  import("../modules/pms/configuration/individualKpiMapping/index.jsx")
);
const PMSObjective = lazy(() =>
  import("../modules/pms/configuration/objective/index.jsx")
);
const EvaluationCriteria = lazy(() =>
  import("../modules/pms/configuration/evaluationCriteria/index.jsx")
);
const BehavioralFactor = lazy(() =>
  import("../modules/pms/configuration/behavioralFactor/index.jsx")
);
const EvaluationCriteriaCreateEdit = lazy(() =>
  import("../modules/pms/configuration/evaluationCriteria/createEdit.jsx")
);
const ObjectiveCreateAndEdit = lazy(() =>
  import("../modules/pms/configuration/objective/ObjectiveCreateAndEdit.jsx")
);
const DeptKpiMapping = lazy(() =>
  import("../modules/pms/configuration/deptKpiMapping/index.jsx")
);
const DeptKpiCreateAndEdit = lazy(() =>
  import("../modules/pms/configuration/deptKpiMapping/deptKpiCreateAndEdit.jsx")
);
const SbuKpiMapping = lazy(() =>
  import("../modules/pms/configuration/sbuKpiMapping/index.jsx")
);
const SbuKpiCreateAndEdit = lazy(() =>
  import("../modules/pms/configuration/sbuKpiMapping/sbuKpiCreateAndEdit.jsx")
);
// const PMSTargetSetup = lazy(() =>
//   import("../modules/pms/targetSetup/targetSetup/index.jsx")
// );
const Individualtarget = lazy(() =>
  import("../modules/pms/targetSetup/individualTargetSetup/index.jsx")
);

const DepartmentaltargetSetupLanding = lazy(() =>
  import("../modules/pms/targetSetup/departmentalTargetSetup/index.jsx")
);
const SbuTargetSetupLanding = lazy(() =>
  import("../modules/pms/targetSetup/sbuTargetSetup/index.jsx")
);

const IndividualtargetView = lazy(() =>
  import(
    "../modules/pms/targetSetup/individualTargetSetup/individualTargetViewEdit.jsx"
  )
);
const CopyKpi = lazy(() =>
  import("../modules/pms/targetSetup/copyKpi/index.jsx")
);
const PerformanceDialogReport = lazy(() =>
  import("../modules/pms/report/PerformaceDialogReport/index.jsx")
);

const PerformanceEvaluationReport = lazy(() =>
  import("../modules/pms/report/performanceEvaluation/index.jsx")
);
const IDPReport = lazy(() =>
  import("../modules/pms/report/idpReport/index.jsx")
);
const PerformanceReport = lazy(() =>
  import("../modules/pms/report/performanceReport/index.jsx")
);

const PerformanceMarkingView = lazy(() =>
  import("../modules/pms/report/performanceMarking/view.jsx")
);

const PerformanceMarking = lazy(() =>
  import("../modules/pms/report/performanceMarking/index.jsx")
);
const KpiTargetMismatchReport = lazy(() =>
  import("../modules/pms/report/kpiTargetMismatchReport/index.jsx")
);
const IndividualKpi = lazy(() => import("../modules/pms/indKpi/index.jsx"));
const IndKpiEntry = lazy(() => import("../modules/pms/indKpi/IndKpiEntry.jsx"));
const StrPlan = lazy(() => import("../modules/pms/strPlan/index.jsx"));
const RoleWiseJDandSpecification = lazy(() =>
  import("../modules/pms/configuration/roleWiseJD&Specification/index.jsx")
);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////// --------------

import BulkSalaryAssign from "modules/CompensationBenefits/employeeSalary/bulkSalaryAssign";
import SummaryCostCenterReport from "modules/CompensationBenefits/reports/summaryCostCenterReport";
import CreateBonusSetup from "modules/PayrollManagementSytem/BonusSetup/Create/CreateBonusSetup";
import CreateOvertimePolicy from "modules/PayrollManagementSytem/OvertimePolicy/Create/OvertimePolicy";
import OvertimePolicyN from "modules/PayrollManagementSytem/OvertimePolicy/OvertimePolicy";
import PayrollElement from "modules/PayrollManagementSytem/PayrollElement/PayrollElement";
import PayrollGroupCreate from "modules/PayrollManagementSytem/SalaryBreakdown/Create/PayrollGroupCreate";
import SalaryBreakdownN from "modules/PayrollManagementSytem/SalaryBreakdown/indexN";
import SeparationSetupLanding from "modules/PayrollManagementSytem/SeparationSetup";
import HolidayOffdaySwap from "modules/TimeManagement/HolidayOffdaySwap";
import EmployeeDivision from "modules/configuration/EmployeeDivision/EmployeeDivision";
import BankBranch from "modules/configuration/bankBranch";
import BusinessUnit from "modules/configuration/busisnessUnit";
import Department from "modules/configuration/department";
import Designation from "modules/configuration/designation";
import DocumentType from "modules/configuration/documentType";
import EmploymentTypeCreate from "modules/configuration/employmentType";
import ExpenseTypeCreate from "modules/configuration/expenseType";
import HRPosition from "modules/configuration/hrPosition";
import LoanTypeCreate from "modules/configuration/loanType";
import OrgBankDetailsLanding from "modules/configuration/orgBankDetails";
import OrgInfoId from "modules/configuration/orgInfoForId";
import PFRegisterTypeLanding from "modules/configuration/pfRegisterType";
import Religion from "modules/configuration/religion";
import Section from "modules/configuration/section";
import SeparationType from "modules/configuration/separationType";
import TaxChallanConfigLanding from "modules/configuration/taxChallanConfig";
import UserInfoN from "modules/configuration/userInfo/UserInfo";
import UserRoleN from "modules/configuration/userRoleNameCreate/UserRole";
import Workplace from "modules/configuration/workplace";
import CommonAppPipeline from "modules/employeeProfile/AppPipeline";
import CafeteriaPricingLanding from "modules/employeeProfile/cafeteriaPricingSetup";
import PricingSetupForm from "modules/employeeProfile/cafeteriaPricingSetup/AddEditForm";

import SalaryV2 from "modules/CompensationBenefits/employeeSalary/salaryupdate";
import YearlyTaxReturnReport from "modules/CompensationBenefits/reports/YearlyTaxReturnReport";
import MonthlyAllowanceDeductionReport from "modules/CompensationBenefits/reports/monthlyAllowanceDeduction";
import AllowancePolicy from "modules/PayrollManagementSytem/SpecialAllowancePolicy";
import TaxGroupCreate from "modules/PayrollManagementSytem/TaxBreakdown/Create/TaxGroupCreate";
import TaxBreakdown from "modules/PayrollManagementSytem/TaxBreakdown/indexN";
import TaxBreakdownDetails from "modules/PayrollManagementSytem/TaxBreakdown/singleView";
import GradeLanding from "modules/PayrollManagementSytem/grade";
import JobLevelLanding from "modules/PayrollManagementSytem/jobLevel";
import JobClassLanding from "modules/PayrollManagementSytem/jobclass";
import PayscaleLanding from "modules/PayrollManagementSytem/payscale";
import LatePunishmentPolicy from "modules/configuration/latePunishmentPolicySetup";
import { Confirmation } from "modules/employeeProfile/confirmation/index.tsx";
import { AdjustmentIOUReportLanding } from "modules/iouManagement/adjustmentIOUReport";
import { MgtExpenseApplicationLanding } from "modules/iouManagement/mgtExpense/expenseApplication";
import { MgtIOUApplicationLanding } from "modules/iouManagement/mgtIOUApplication";
import LeaveTypeCreate from "modules/leaveMovement/configuration/LeaveType";
import MovementType from "modules/leaveMovement/configuration/MovementType";
import ReporterUpdation from "modules/reporterUpdation";
import AttendenceAdjustN from "modules/timeSheet/attendence/attendenceAdjust/AttendenceAdjust";
import FlexibleTimeSheet from "modules/timeSheet/configuration/FlexibleTimeSheet";
import { LatePunishmentAssign } from "modules/timeSheet/employeeAssign/latePunishment";
import AttendanceLog from "modules/timeSheet/reports/attendanceLog";
import EmpCheckList from "modules/timeSheet/reports/empCheckList";
import EmployeePdfLanding from "modules/timeSheet/reports/employeeIDCard";
import EmployeeList from "modules/timeSheet/reports/employeeList/index.tsx";
import FoodAllowenceReport from "modules/timeSheet/reports/foodAllowenceReport";
import JoiningReport from "modules/timeSheet/reports/joiningReport";
import LateReport from "modules/timeSheet/reports/lateReport";
import MonthlyLeaveReport from "modules/timeSheet/reports/monthlyLeaveReport";
import { lazy } from "react";
import EmLeaveApplicationT from "../modules/employeeProfile/leaveApplication";
import TLeaveApplication from "../modules/leaveMovement/leave/application/T.tsx";
import SelfAttendenceAdjust from "../modules/timeSheet/attendence/attendanceApprovalRequest/index.tsx";
import MovementHistoryDetails from "modules/timeSheet/reports/movementHistoryDetails";
import LetterConfigLanding from "modules/employeeProfile/reportBuilder/letterConfiguration";
import LetterGenerateLanding from "modules/employeeProfile/reportBuilder/LetterGenerate";
import LetterConfigAddEdit from "modules/employeeProfile/reportBuilder/letterConfiguration/letterConfigAddEdit.tsx";
import LetterGenAddEdit from "modules/employeeProfile/reportBuilder/LetterGenerate/letterGenAddEdit";
import SingleIncrement from "modules/CompensationBenefits/Increment/singleIncement/components/SingleIncrement";
import QuestionCreationLanding from "modules/exit-interview/question-creation";
import QuestionerConfigLanding from "modules/exit-interview/questioner-configure";
import QuestionerAssignLanding from "modules/exit-interview/questioner-assign";
import QuestionCreationAddEdit from "modules/exit-interview/question-creation/add-edit";
import { IncrementProposal } from "modules/CompensationBenefits/incrementProposal";
import IncrementProposalApproval from "modules/CompensationBenefits/incrementProposal/Incr_Proposal_Approval";
import RewardPunishmentLanding from "modules/employeeProfile/reportBuilder/rewardPunishmentLetter";
import RewardPunishmentLetterGenAddEdit from "modules/employeeProfile/reportBuilder/rewardPunishmentLetter/letterGenAddEdit";
import PunishmentAction from "modules/employeeProfile/reportBuilder/rewardPunishmentLetter/punishmentActions";
import EssInterviewLanding from "modules/exit-interview/interview/EssInterviewLanding";
import EmInterviewLanding from "modules/exit-interview/interview/EmInterviewLanding";
import InterviewModal from "modules/exit-interview/interview/components/interview-modal";
import JobLocation from "modules/configuration/JobLocation";
import JobTerritory from "modules/configuration/JobTerritory";
import FinalSettlementReport from "modules/timeSheet/reports/finalSettlementReport";

const HolidayOffdaySwapAssign = lazy(() =>
  import("modules/TimeManagement/HolidayOffdaySwap/HolidayOffdaySwapAssign")
);
const AttendanceSummeryReport = lazy(() =>
  import("modules/timeSheet/reports/attendanceSummeryReport")
);
const CreateAndEditEmploye = lazy(() =>
  import("modules/employeeProfile/employeeFeature/createEmployee")
);
const SlabWiseIncomeTaxConf = lazy(() =>
  import("modules/CompensationBenefits/SlabWiseIncomeTaxConf")
);
const MultiCalendarAssign = lazy(() =>
  import("modules/TimeManagement/MultiCalendarAssign/MultiCalendarAssign")
);
const JoineeAttendanceReport = lazy(() =>
  import("modules/timeSheet/reports/joineeAttendanceReport/index.tsx")
);
const EarlyReport = lazy(() =>
  import("modules/timeSheet/reports/earlyInoutReport")
);
const AbsentReport = lazy(() =>
  import("modules/timeSheet/reports/absentReport/index.tsx")
);
const CreateEditLeavePolicy = lazy(() =>
  import(
    "../modules/leaveMovement/configuration/YearlyLeavePolicy/CreateEditLeavePolicy"
  )
);
const TerritoryType = lazy(() =>
  import("../modules/configuration/territoryType/index.js")
);
const TerritorySetup = lazy(() =>
  import("../modules/configuration/territorySetup/index.js")
);
const FixedRoster = lazy(() =>
  import("../modules/timeSheet/employeeAssign/fixedRoster/index.js")
);
const FixedRosterCreateEdit = lazy(() =>
  import("../modules/timeSheet/employeeAssign/fixedRoster/addEditForm/index.js")
);
const ShiftManagementLog = lazy(() =>
  import("../modules/LogHistory/shiftManagementLog/index.js")
);
const ShiftManagement = lazy(() =>
  import("../modules/timeSheet/employeeAssign/shiftManagement/index.js")
);
const HiredeskOnboarding = lazy(() =>
  import("../modules/onboarding/index.js")
);
const ManagementViewTask = lazy(() =>
  import("../modules/employeeProfile/taskManagement/mgmApplication/viewTask.js")
);
const ManagementCreateTask = lazy(() =>
  import(
    "../modules/employeeProfile/taskManagement/mgmApplication/createTask.js"
  )
);
const ManagementTaskManagement = lazy(() =>
  import("../modules/employeeProfile/taskManagement/mgmApplication/index.js")
);
const SelfTaskManagement = lazy(() =>
  import("../modules/employeeProfile/taskManagement/selfApplication/index.js")
);
const SelfViewTask = lazy(() =>
  import(
    "../modules/employeeProfile/taskManagement/selfApplication/viewTask.js"
  )
);
const SelfCreateTask = lazy(() =>
  import(
    "../modules/employeeProfile/taskManagement/selfApplication/createTask.js"
  )
);
const ExternalTrainingCreate = lazy(() =>
  import("../modules/trainingDevelopment/externalTraining/addEditForm.jsx")
);
const ExternalTrainingLanding = lazy(() =>
  import("../modules/trainingDevelopment/externalTraining/index.jsx")
);
const TrainingScheduleApproval = lazy(() =>
  import("../modules/trainingDevelopment/schedule/approval/index.jsx")
);
const LocationWiseEmployee = lazy(() =>
  import("../modules/remoteLocation/locationWiseEmployee/index.js")
);
const MasterLocationRegistration = lazy(() =>
  import("../modules/remoteLocation/approval/index.js")
);
const EmployeeWiseLocation = lazy(() =>
  import("../modules/remoteLocation/employeeWiseLocation/index.js")
);
const AssessmentCreateEdit = lazy(() =>
  import("../modules/trainingDevelopment/assessment/createAssessment/index.jsx")
);
const AssetList = lazy(() =>
  import("../modules/assetManagement/assetAcknowledgementSelf/index.jsx")
);
const AssetTransferApproval = lazy(() =>
  import("../modules/assetManagement/assetTransferApproval/index.jsx")
);
const AssetApproval = lazy(() =>
  import("../modules/assetManagement/assetApproval/index.jsx")
);
const AssetTransferCreate = lazy(() =>
  import("../modules/assetManagement/assetTransfer/addEditForm.jsx")
);
const AssessmentFormLanding = lazy(() =>
  import(
    "../modules/trainingDevelopment/assessment/assessmentFormLanding/index.jsx"
  )
);
const AssetTransferLanding = lazy(() =>
  import("../modules/assetManagement/assetTransfer/index.jsx")
);
const AssessmentFormDetailsLanding = lazy(() =>
  import(
    "../modules/trainingDevelopment/assessment/assessmentFormDetails/index.jsx"
  )
);
const SubmissionDetails = lazy(() =>
  import(
    "../modules/trainingDevelopment/assessment/assessmentFormDetails/submission/index.jsx"
  )
);
const AttendanceView = lazy(() =>
  import("../modules/trainingDevelopment/attendance/attendanceView/index.jsx")
);
const TrainingAttendanceLanding = lazy(() =>
  import("../modules/trainingDevelopment/attendance/index.jsx")
);
const RequisitionLanding = lazy(() =>
  import("../modules/trainingDevelopment/requisition/index.jsx")
);
const RequisitionDetails = lazy(() =>
  import(
    "../modules/trainingDevelopment/requisition/requisitionDetails/index.jsx"
  )
);

const CreateEditSchedule = lazy(() =>
  import("../modules/trainingDevelopment/schedule/createSchedule/index.jsx")
);
const TrainingScheduleLanding = lazy(() =>
  import("../modules/trainingDevelopment/schedule/index.jsx")
);
const ViewTrainingScheduleDetails = lazy(() =>
  import(
    "../modules/trainingDevelopment/schedule/viewScheduleDetails/index.jsx"
  )
);
const AssetRequisitionSelfCreate = lazy(() =>
  import("../modules/assetManagement/assetRequisitionSelf/addEditForm.jsx")
);
const AssetRequisitionSelfLanding = lazy(() =>
  import("../modules/assetManagement/assetRequisitionSelf/index.jsx")
);
const RequisitionAssign = lazy(() =>
  import("../modules/assetManagement/requisitionAssign/index.jsx")
);
const DirectAssetAssignCreate = lazy(() =>
  import("../modules/assetManagement/directAssetAssign/addEditForm.jsx")
);
const DirectAssetAssignLanding = lazy(() =>
  import("../modules/assetManagement/directAssetAssign/index.jsx")
);
const AssetApplicationCreate = lazy(() =>
  import("../modules/assetManagement/assetRegistration/addEditForm.jsx")
);
const AssetApplication = lazy(() =>
  import("../modules/assetManagement/assetRegistration/index.jsx")
);
const AssetItemRegistration = lazy(() =>
  import("../modules/assetManagement/itemRegistration/index.jsx")
);
const AssetItemProfile = lazy(() =>
  import("../modules/assetManagement/assetControlPanel/itemProfile/index.jsx")
);
const AssetCreateItemProfile = lazy(() =>
  import(
    "../modules/assetManagement/assetControlPanel/itemProfile/createEditForm/CreateEditForm.jsx"
  )
);
const AssetEditItemProfile = lazy(() =>
  import(
    "../modules/assetManagement/assetControlPanel/itemProfile/createEditForm/CreateEditForm.jsx"
  )
);
const AssetRegistration = lazy(() =>
  import("../modules/assetManagement/assetControlPanel/registration/index.jsx")
);
const AssetRegistrationCreate = lazy(() =>
  import(
    "../modules/assetManagement/assetControlPanel/registration/createEditForm/CreateEditForm.jsx"
  )
);
const AssetRegistrationEdit = lazy(() =>
  import(
    "../modules/assetManagement/assetControlPanel/registration/createEditForm/CreateEditForm.jsx"
  )
);
const AssetAssign = lazy(() =>
  import("../modules/assetManagement/assetControlPanel/assign/index.jsx")
);
const AssetAssignCreate = lazy(() =>
  import(
    "../modules/assetManagement/assetControlPanel/assign/createEditForm/CreateEditForm.jsx"
  )
);
const AssetDepreciation = lazy(() =>
  import("../modules/assetManagement/assetControlPanel/depreciation/index.jsx")
);
const AssetDepreciationCreate = lazy(() =>
  import(
    "../modules/assetManagement/assetControlPanel/depreciation/createEditForm/CreateEditForm.jsx"
  )
);
const AssetReport = lazy(() =>
  import("../modules/assetManagement/assetControlPanel/report/index.jsx")
);
const AssetMaintenance = lazy(() =>
  import("../modules/assetManagement/assetControlPanel/maintenance/index.jsx")
);
const AssetMaintenanceCreate = lazy(() =>
  import(
    "../modules/assetManagement/assetControlPanel/maintenance/createEditForm/CreateEditForm.jsx"
  )
);
const AssetReceiveDetails = lazy(() =>
  import(
    "../modules/assetManagement/assetControlPanel/maintenance/createEditForm/ReceiveAssetDetails.jsx"
  )
);
const AssetDisposal = lazy(() =>
  import("../modules/assetManagement/assetControlPanel/disposal/index.jsx")
);
const AssetDisposalCreate = lazy(() =>
  import(
    "../modules/assetManagement/assetControlPanel/disposal/createEditForm/CreateEditForm.jsx"
  )
);
const MarketVistApproval = lazy(() =>
  import("../modules/marketVisit/approval/index.jsx")
);
const RequisitionApproval = lazy(() =>
  import("../modules/trainingDevelopment/requisition/approval/index.jsx")
);
const MonthlyPunchReportDetails = lazy(() =>
  import(
    "../modules/employeeProfile/Reports/monthlyPunchDetailsReport/index.tsx"
  )
);
const AccountCreateForm = lazy(() =>
  import("../controllPanel/accountCreate/accountCreate.jsx")
);
const AccountCreateLanding = lazy(() =>
  import("../controllPanel/accountCreate/index.jsx")
);
const AnnouncementCreate = lazy(() =>
  import("../modules/announcement/announcementCreate.jsx")
);
const AnnouncementViewPage = lazy(() =>
  import("../modules/announcement/announcementViewPage/index.jsx")
);
const AnnouncementCreateLanding = lazy(() =>
  import("../modules/announcement/index.jsx")
);
const ApprovalList = lazy(() => import("../modules/approvalList/index.jsx"));
const ChangePassword = lazy(() =>
  import("../modules/auth/changePassword/index.jsx")
);
const Chat = lazy(() => import("../modules/chat/index.jsx"));
const ArearSalaryGenerateForm = lazy(() =>
  import(
    "../modules/CompensationBenefits/arearSalaryGenerate/addEditForm/index.jsx"
  )
);
const ArearSalaryGenerateIndex = lazy(() =>
  import(
    "../modules/CompensationBenefits/arearSalaryGenerate/ArearSalaryGenerateIndex.jsx"
  )
);
const ArearSalaryGenerateView = lazy(() =>
  import(
    "../modules/CompensationBenefits/arearSalaryGenerate/ArearSalaryGenerateView.jsx"
  )
);
const ArrearSalaryGenerateApproval = lazy(() =>
  import(
    "../modules/CompensationBenefits/arearSalaryGenerate/arrearSalaryGenerateApproval/index.jsx"
  )
);
const BankAdviceReport = lazy(() =>
  import("../modules/CompensationBenefits/BankAdviceReport/index.jsx")
);
const EmployeeBonusApproval = lazy(() =>
  import("../modules/CompensationBenefits/bonus/approval")
);
const BonusGenerateApproval = lazy(() =>
  import(
    "../modules/CompensationBenefits/bonusGenerate/bonusGenerateApproval/index.jsx"
  )
);
const BonusGenerateCreate = lazy(() =>
  import(
    "../modules/CompensationBenefits/bonusGenerate/bonusGenerateCreate/index.js"
  )
);
const BonusGenerateLanding = lazy(() =>
  import(
    "../modules/CompensationBenefits/bonusGenerate/BonusGenerateLanding.jsx"
  )
);
const BonusGenerateView = lazy(() =>
  import("../modules/CompensationBenefits/bonusGenerate/BonusGenerateView.jsx")
);
const BulkEmployeeTaxAssign = lazy(() =>
  import("../modules/CompensationBenefits/bulkEmployeeCreate/index.jsx")
);
const Grade = lazy(() =>
  import("../modules/CompensationBenefits/Configuration/Grade/index.jsx")
);
const PayFrequency = lazy(() =>
  import("../modules/CompensationBenefits/Configuration/PayFrequency/index.jsx")
);
const PayrollElementsRules = lazy(() =>
  import(
    "../modules/CompensationBenefits/Configuration/PayrollElementsRules/index.jsx"
  )
);
const PayrollGroup = lazy(() =>
  import("../modules/CompensationBenefits/Configuration/PayrollGroup/index.jsx")
);
const PayRollMonth = lazy(() =>
  import("../modules/CompensationBenefits/Configuration/payrollMonth/index.jsx")
);
const SalaryAssign = lazy(() =>
  import("../modules/CompensationBenefits/employeeSalary/salaryAssign/index.js")
);
const BulkUpload = lazy(() =>
  import(
    "../modules/CompensationBenefits/employeeSalary/salaryAssign/BulkUpload/BulkMovementCreate.jsx"
  )
);
const IncomeTaxAssign = lazy(() =>
  import("../modules/CompensationBenefits/IncomeTaxAssign/index.jsx")
);
const BulkIncrementEntry = lazy(() =>
  import("../modules/CompensationBenefits/Increment/bulkIncrement/index.jsx")
);
const IncrementLanding = lazy(() =>
  import("../modules/CompensationBenefits/Increment/index.jsx")
);
const IncrementNPromotionApproval = lazy(() =>
  import(
    "../modules/CompensationBenefits/Increment/singleIncement/approval/index.jsx"
  )
);
// const CreateSingleIncrement = lazy(() =>
//   import(
//     "../modules/CompensationBenefits/Increment/singleIncement/components/createEditSingleIncrement.jsx"
//   )
// );
const ViewIncrementNPromotion = lazy(() =>
  import(
    "../modules/CompensationBenefits/Increment/singleIncement/components/viewIncrementNPromotion.jsx"
  )
);
const PFInvestmentForm = lazy(() =>
  import("../modules/CompensationBenefits/PfInvestment/addEditForm.jsx")
);
const PfInvestmentLanding = lazy(() =>
  import("../modules/CompensationBenefits/PfInvestment/index.jsx")
);
const PFInvestmentViewForm = lazy(() =>
  import("../modules/CompensationBenefits/PfInvestment/viewForm.jsx")
);
const PfWithdrawApproval = lazy(() =>
  import("../modules/CompensationBenefits/PfWithdraw/approval/index.jsx")
);
const PFCompLanding = lazy(() =>
  import("../modules/CompensationBenefits/PfWithdraw/index.jsx")
);
const PfFundLanding = lazy(() =>
  import("../modules/CompensationBenefits/pfFund/index.tsx")
);
const GoForPrintSalary = lazy(() =>
  import(
    "../modules/CompensationBenefits/reports/DeptWiseSalary/components/GoForPrint.jsx"
  )
);
const DeptWiseSalary = lazy(() =>
  import("../modules/CompensationBenefits/reports/DeptWiseSalary/index.jsx")
);
const SalaryDetailsReport = lazy(() =>
  import(
    "../modules/CompensationBenefits/reports/salaryDetailsReport/index.jsx"
  )
);
const SalaryReconciliation = lazy(() =>
  import(
    "../modules/CompensationBenefits/reports/salaryReconciliationReport/index.jsx"
  )
);
const IncrementReport = lazy(() =>
  import("../modules/CompensationBenefits/reports/IncrementReport/index.js")
);
const SalaryRequisitionReport = lazy(() =>
  import(
    "../modules/CompensationBenefits/reports/salaryRequisitionReport/index.jsx"
  )
);

const SalaryCostCenterReport = lazy(() =>
  import(
    "../modules/CompensationBenefits/reports/SalaryCostCenterReport/index.jsx"
  )
);
const SalaryPaySlip = lazy(() =>
  import("../modules/CompensationBenefits/reports/salaryPaySlip/index.js")
);
const SalaryReportAllEmployee = lazy(() =>
  import(
    "../modules/CompensationBenefits/reports/salaryPaySlip/SalaryReportAllEmployee/index.jsx"
  )
);
const SalaryReportSingleEmp = lazy(() =>
  import(
    "../modules/CompensationBenefits/reports/salaryPaySlip/SalaryReportSingleEmployee/index.jsx"
  )
);
const SalaryReport = lazy(() =>
  import("../modules/CompensationBenefits/reports/salaryReport/index.jsx")
);
const SingleSalaryReport = lazy(() =>
  import(
    "../modules/CompensationBenefits/reports/salaryReport/singleSalaryReport.jsx"
  )
);
const BulkAddEditForm = lazy(() =>
  import(
    "../modules/CompensationBenefits/salaryAssignAndDeduction/addEditFile/bulkCreateIndex.jsx"
  )
);
const BulkAddEditFormCreate = lazy(() =>
  import(
    "../modules/CompensationBenefits/salaryAssignAndDeduction/addEditFile/bulkAssignCreate.jsx"
  )
);
const AddEditForm = lazy(() =>
  import(
    "../modules/CompensationBenefits/salaryAssignAndDeduction/addEditFile/index.jsx"
  )
);
const AllowanceNDeductionApproval = lazy(() =>
  import(
    "../modules/CompensationBenefits/salaryAssignAndDeduction/approval/index.jsx"
  )
);
const SalaryAssignAndDeduction = lazy(() =>
  import("../modules/CompensationBenefits/salaryAssignAndDeduction/index.jsx")
);
const SalaryCertificateReport = lazy(() =>
  import("../modules/CompensationBenefits/SalaryCertificateReport/index.jsx")
);
const SalaryGenerateApproval = lazy(() =>
  import(
    "../modules/CompensationBenefits/salaryGenerate/salaryGenerateApproval/index.jsx"
  )
);
const SalaryGenerateCreate = lazy(() =>
  import(
    "../modules/CompensationBenefits/salaryGenerate/salaryGenerateCreate/index.js"
  )
);
const SalaryGenerateLanding = lazy(() =>
  import(
    "../modules/CompensationBenefits/salaryGenerate/SalaryGenerateLanding.jsx"
  )
);
const SalaryGenerateView = lazy(() =>
  import(
    "../modules/CompensationBenefits/salaryGenerate/SalaryGenerateView.jsx"
  )
);
const SalaryPayslipReport = lazy(() =>
  import("../modules/CompensationBenefits/SalaryPayslipReport/index.jsx")
);
const MultiSalaryPayslipReport = lazy(() =>
  import(
    "../modules/CompensationBenefits/SalaryPayslipReport/MultiPaySlip/index.tsx"
  )
);
const SalaryTaxCertificate = lazy(() =>
  import("../modules/CompensationBenefits/salaryTaxCertificate/index.jsx")
);
const SelfSalaryPayslipReport = lazy(() =>
  import("../modules/CompensationBenefits/SelfSalaryPayslipReport/index.jsx")
);
const SelfTrainingDevelopment = lazy(() =>
  import("../modules/trainingDevelopment/selfService/index.jsx")
);
const TrainingDetails = lazy(() =>
  import("../modules/trainingDevelopment/selfService/trainingDetails/index.jsx")
);
const CalenderModule = lazy(() =>
  import("../modules/componentModule/calenderModule/index.jsx")
);
const NewDashboard = lazy(() =>
  import("../modules/componentModule/Dashboard/index.jsx")
);
const DataGridModule = lazy(() =>
  import("../modules/componentModule/dataGridModule/index.jsx")
);
const DataGridLanding = lazy(() =>
  import("../modules/componentModule/dataGridTable/dataGrid.jsx")
);
const DialogsModule = lazy(() =>
  import("../modules/componentModule/dialogsModule/index.jsx")
);
const FormControl = lazy(() =>
  import("../modules/componentModule/formModule/formControl/index.jsx")
);
const ComponentList = lazy(() =>
  import("../modules/componentModule/index.jsx")
);
const DragAndDropModule = lazy(() =>
  import(
    "../modules/componentModule/pageModule/dragAndDropModule/DragAndDropModule.jsx"
  )
);
const JobListLanding = lazy(() =>
  import("../modules/componentModule/pageModule/jobList/index.jsx")
);
const PipelineCard = lazy(() =>
  import("../modules/componentModule/pageModule/pipeline/PipelineCard.jsx")
);
const CustomizedSteppers = lazy(() =>
  import("../modules/componentModule/pageModule/stepper/CustomizedSteppers.jsx")
);
const Heading = lazy(() =>
  import("../modules/componentModule/pipelineHeading/index.jsx")
);
const SelectionModule = lazy(() =>
  import("../modules/componentModule/selectionModule/index.jsx")
);
const Sliders = lazy(() =>
  import("../modules/componentModule/slidersModule/index.jsx")
);
// const BankBranch = lazy(() =>
//   import("../modules/configuration/bankBranch/index.jsx")
// );
// const BusinessUnit = lazy(() =>
//   import("../modules/configuration/busisnessUnit/index.jsx")
// );
const DashboardComponent = lazy(() =>
  import("../modules/configuration/dashboardComponent/index.jsx")
);
const DashboardCompPermissionCreate = lazy(() =>
  import(
    "../modules/configuration/dashboardComponentPermission/addEditForm.jsx"
  )
);

const DashboardComponentPermission = lazy(() =>
  import("../modules/configuration/dashboardComponentPermission/index.jsx")
);
const DashboardCompPermissionDetails = lazy(() =>
  import("../modules/configuration/dashboardComponentPermission/singleView.jsx")
);
// const Department = lazy(() =>
//   import("../modules/configuration/department/index.jsx")
// );
// const Section = lazy(() =>
//   import("../modules/configuration/section/index.jsx")
// );
// const DocumentType = lazy(() =>
//   import("../modules/configuration/documentType/index.jsx")
// );
// const EmploymentTypeCreate = lazy(() =>
//   import("../modules/configuration/employmentType/index.jsx")
// );
// const ExpenseTypeCreate = lazy(() =>
//   import("../modules/configuration/expenseType/index.jsx")
// );
const FeatureGroup = lazy(() =>
  import("../modules/configuration/featureGroup/index.jsx")
);
// const HRPosition = lazy(() =>
//   import("../modules/configuration/hrPosition/index.jsx")
// );
// const LoanTypeCreate = lazy(() =>
//   import("../modules/configuration/loanType/index.jsx")
// );
const ManagementDashboardPermissionCreate = lazy(() =>
  import(
    "../modules/configuration/managementDashboardPermission/addEditForm.jsx"
  )
);
const ManagementDashboardPermission = lazy(() =>
  import("../modules/configuration/managementDashboardPermission/index.jsx")
);
const ManagementDashboardPermissionDetails = lazy(() =>
  import(
    "../modules/configuration/managementDashboardPermission/singleView.jsx"
  )
);
const NotificationConfigCreate = lazy(() =>
  import("../modules/configuration/NotificationConfig/addEditForm.jsx")
);
const NotificationConfig = lazy(() =>
  import("../modules/configuration/NotificationConfig/index.jsx")
);
const NotificationDetails = lazy(() =>
  import("../modules/configuration/NotificationConfig/singleView.jsx")
);
// const OrgBankDetailsLanding = lazy(() =>
//   import("../modules/configuration/orgBankDetails/index.jsx")
// );
const PayScaleGrade = lazy(() =>
  import("../modules/configuration/payScaleGrade/index.jsx")
);
// const Religion = lazy(() =>
//   import("../modules/configuration/religion/index.jsx")
// );
const SBUUnit = lazy(() =>
  import("../modules/configuration/sbuUnit/index.jsx")
);
// const SeparationType = lazy(() =>
//   import("../modules/configuration/separationType/index.jsx")
// );
// const TaxChallanConfigLanding = lazy(() =>
//   import("../modules/configuration/taxChallanConfig/index.jsx")
// );
const UserGroup = lazy(() =>
  import("../modules/configuration/userGroup/index.jsx")
);
const CreateUser = lazy(() =>
  import("../modules/configuration/userInfo/createUser/index.js")
);
// const UserInfo = lazy(() =>
//   import("../modules/configuration/userInfo/index.jsx")
// );
const FeatureAssignToRole = lazy(() =>
  import(
    "../modules/configuration/userRoleManager/featureAssignToRole/index.jsx"
  )
);
const FeatureAssignToUser = lazy(() =>
  import(
    "../modules/configuration/userRoleManager/featureAssignToUser/index.jsx"
  )
);
const UserRoleManager = lazy(() =>
  import("../modules/configuration/userRoleManager/index.jsx")
);
const RoleAssignToUser = lazy(() =>
  import("../modules/configuration/userRoleManager/roleAssignToUser/index.jsx")
);
const UserRole = lazy(() =>
  import("../modules/configuration/userRoleNameCreate/index.jsx")
);
const WorklineConfig = lazy(() =>
  import("../modules/configuration/worklineConfig/index.jsx")
);
// const Workplace = lazy(() =>
//   import("../modules/configuration/workplace/index.jsx")
// );
const AboutMe = lazy(() => import("../modules/employeeProfile/aboutMe"));
const GoForPrint = lazy(() =>
  import("../modules/employeeProfile/aboutMe/GoForPrint/GoForPrint.jsx")
);
const PrintPreview = lazy(() =>
  import("../modules/employeeProfile/aboutMe/GoForPrint/PrintPreview.jsx")
);
// const CommonAppPipeline = lazy(() =>
//   import("../modules/employeeProfile/AppPipeline/index.jsx")
// );
const BulkEmployeeCreate = lazy(() =>
  import("../modules/employeeProfile/bulkEmployeeCreate/index.jsx")
);
const BulkUploadEntry = lazy(() =>
  import("../modules/employeeProfile/bulkUpload/index.jsx")
);
const BulkUploadHistory = lazy(() =>
  import("../modules/employeeProfile/bulkUploadHistory/index.jsx")
);
// const Confirmation = lazy(() =>
//   import("../modules/employeeProfile/confirmation/index.jsx")
// );
const ContactBook = lazy(() =>
  import("../modules/employeeProfile/contactBook/index.jsx")
);
const ContactClosingReport = lazy(() =>
  import("../modules/employeeProfile/contractClosing/index.tsx")
);
const SelfDashboard = lazy(() =>
  import("../modules/employeeProfile/dashboard/index.jsx")
);
const AboutMeDetails = lazy(() =>
  import("../modules/employeeProfile/employeeFeature/AboutMeCommon/index.jsx")
);
const EmployeeFeatureNew = lazy(() =>
  import("../modules/employeeProfile/employeeFeature/indexNew")
);
const FoodCorner = lazy(() =>
  import("../modules/employeeProfile/foodCorner/FoodCorner.jsx")
);
const FoodCornerForAll = lazy(() =>
  import("../modules/employeeProfile/foodCornerForAll/FoodCorner.jsx")
);
const ActiveInactiveEmployeeReport = lazy(() =>
  import("../modules/employeeProfile/inactiveEmployees/index.tsx")
);
const JobConfirmationReport = lazy(() =>
  import("../modules/employeeProfile/jobConfirmation/index.tsx")
);
// const EmLeaveApplicationT = lazy(() =>
//   import("../modules/employeeProfile/leaveApplication/index.jsx")
// );
const EmLoanApplication = lazy(() =>
  import("../modules/employeeProfile/LoanApplication/index.jsx")
);
const EmMovementApplication = lazy(() =>
  import("../modules/employeeProfile/movementApplication/index.tsx")
);
const EmOvertimeAutoGenerated = lazy(() =>
  import("../modules/employeeProfile/OvertimeAutoGenarated/index.js")
);
const AddEditOverTime = lazy(() =>
  import("../modules/employeeProfile/overtimeEntry/addEditForm/index.jsx")
);
const EmOvertimeEntry = lazy(() =>
  import("../modules/employeeProfile/overtimeEntry/index.jsx")
);
const OvertimeApproval = lazy(() =>
  import("../modules/employeeProfile/overtimeEntry/overtimeApproval/index.jsx")
);
const EmployeeReportBuilder = lazy(() =>
  import("../modules/employeeProfile/reportBuilder/empReportBuilder/index.jsx")
);
const CustomReport2 = lazy(() =>
  import("../modules/employeeProfile/Reports/customReport/customReport.jsx")
);
const CustomReport = lazy(() =>
  import("../modules/employeeProfile/Reports/customReport/index.jsx")
);
const EmployeeJobCard = lazy(() =>
  import("../modules/employeeProfile/Reports/employeeJobCard/index.tsx")
);
const PfFundReport = lazy(() =>
  import("../modules/employeeProfile/Reports/pfFundReport/index.tsx")
);
const EmLeaveHistory = lazy(() =>
  import("../modules/employeeProfile/Reports/leaveHistory/index.tsx")
);
const EmLeaveReportPrint = lazy(() =>
  import("../modules/employeeProfile/Reports/leaveHistory/LeaveReportPrint.jsx")
);
const EmLoanHistory = lazy(() =>
  import("../modules/employeeProfile/Reports/LoanHistory/index.tsx")
);
const EmLoanReportPrint = lazy(() =>
  import("../modules/employeeProfile/Reports/LoanHistory/LoanReportPrint.jsx")
);
const EmMovementHistory = lazy(() =>
  import("../modules/employeeProfile/Reports/movementHistory/index.tsx")
);
const EmMovementReportPrint = lazy(() =>
  import(
    "../modules/employeeProfile/Reports/movementHistory/MovementReportPrint.jsx"
  )
);
const EmOverTimeReport = lazy(() =>
  import("../modules/employeeProfile/Reports/overTimeReport/index.tsx")
);
const EmOverTimeDailyReport = lazy(() =>
  import("../modules/employeeProfile/Reports/overTimeDailyReport/index.tsx")
);
const RewardsAndPunishmentAdd = lazy(() =>
  import(
    "../modules/employeeProfile/rewardsAndPunishment/components/rewardsAndPunishmentAdd.jsx"
  )
);
const RewardsAndPunishmentEntry = lazy(() =>
  import(
    "../modules/employeeProfile/rewardsAndPunishment/rewardsAndPunishmentEntry/index.jsx"
  )
);
const RewardsAndPunishmentView = lazy(() =>
  import(
    "../modules/employeeProfile/rewardsAndPunishment/rewardsAndPunishmentView/index.jsx"
  )
);
const ManagementApplicationSeparationForm = lazy(() =>
  import(
    "../modules/employeeProfile/separation/mgmApplication/addEditForm/index.jsx"
  )
);
const ManagementSeparation = lazy(() =>
  import("../modules/employeeProfile/separation/mgmApplication/index.jsx")
);
const FinalSettlementLanding = lazy(() =>
  import("../modules/employeeProfile/finalSettlement/index.jsx")
);
const FinalSettlementAddEditView = lazy(() =>
  import(
    "../modules/employeeProfile/finalSettlement/create/CreateEditFinalSettlement.jsx"
  )
);

const ManagementReleaseSeparationForm = lazy(() =>
  import(
    "../modules/employeeProfile/separation/mgmApplication/releaseForm/index.jsx"
  )
);
const ManagementViewSeparationForm = lazy(() =>
  import(
    "../modules/employeeProfile/separation/mgmApplication/viewForm/index.jsx"
  )
);
const SeparationReportPrintPage = lazy(() =>
  import("../modules/employeeProfile/separation/report/GoForPrint/index.jsx")
);
const SeparationReport = lazy(() =>
  import("../modules/employeeProfile/separation/report/index.tsx")
);
const SelfApplicationSeparationForm = lazy(() =>
  import(
    "../modules/employeeProfile/separation/selfApplication/addEditForm/index.jsx"
  )
);
const SelfServiceSeparationForm = lazy(() =>
  import(
    "../modules/employeeProfile/separation/selfApplication/addEditFormV2/index.jsx"
  )
);
const SelfSeparation = lazy(() =>
  import("../modules/employeeProfile/separation/selfApplication/index.jsx")
);
const ViewJoining = lazy(() =>
  import(
    "../modules/employeeProfile/transferNPromotion/Joining/components/viewJoing.jsx"
  )
);
const Joining = lazy(() =>
  import("../modules/employeeProfile/transferNPromotion/Joining/index.jsx")
);
const TransferNPromotionApproval = lazy(() =>
  import(
    "../modules/employeeProfile/transferNPromotion/transferNPromotion/approval/index.jsx"
  )
);
const CreateTransferPromotion = lazy(() =>
  import(
    "../modules/employeeProfile/transferNPromotion/transferNPromotion/components/createTransferPromotion.jsx"
  )
);
const BulkUploadTransferNPromotion = lazy(() =>
  import(
    "../modules/employeeProfile/transferNPromotion/transferNPromotion/bulkUpload.jsx"
  )
);

const ViewTransferNPromotion = lazy(() =>
  import(
    "../modules/employeeProfile/transferNPromotion/transferNPromotion/components/viewTransferNPromotion.jsx"
  )
);
const TransferAndPromotion = lazy(() =>
  import(
    "../modules/employeeProfile/transferNPromotion/transferNPromotion/index.jsx"
  )
);
const PFSelfLanding = lazy(() =>
  import("../modules/empSelfService/pfManagement/index.jsx")
);
const SalaryCertificateApproval = lazy(() =>
  import("../modules/empSelfService/salaryCertificateApproval/index.jsx")
);
const SelfSalaryCertificateRequestCreate = lazy(() =>
  import("../modules/empSelfService/salaryCertificateRequest/addEditForm.jsx")
);
const SelfSalaryCertificateRequest = lazy(() =>
  import("../modules/empSelfService/salaryCertificateRequest/index.jsx")
);
const SelfSalaryCertificateView = lazy(() =>
  import("../modules/empSelfService/salaryCertificateRequest/viewForm.jsx")
);
const ExpenseApplicationApproval = lazy(() =>
  import("../modules/expense/expenseApplicationApproval/index.jsx")
);
const SelfExpanseApplicationAddForm = lazy(() =>
  import("../modules/expense/updatedExpanseApp/addEditForm.jsx")
);
const UpdateExpanseApplication = lazy(() =>
  import("../modules/expense/updatedExpanseApp/index.jsx")
);
const SelfExpenseApplicationView = lazy(() =>
  import("../modules/expense/updatedExpanseApp/viewForm.jsx")
);
const FoodDetailsReport = lazy(() =>
  import("../modules/FoodDetailsReport/index.tsx")
);
const GrievanceDetails = lazy(() =>
  import("../modules/grievanceManagement/components/GrievanceDetails.jsx")
);
const GrievanceManagementCreate = lazy(() =>
  import(
    "../modules/grievanceManagement/components/GrievanceManagementCreate/index.jsx"
  )
);
const GrievanceSelfCreate = lazy(() =>
  import(
    "../modules/grievanceManagement/components/grievanceSelfCreate/index.js"
  )
);
const GrievanceSelfDetails = lazy(() =>
  import("../modules/grievanceManagement/components/GrievanceSelfDetails.jsx")
);
const GrievanceManagement = lazy(() =>
  import("../modules/grievanceManagement/EmployeeManagement/index.jsx")
);
const GrievanceManagementSelf = lazy(() =>
  import("../modules/grievanceManagement/EmployeeSelfService/index.jsx")
);
const AdjustmentIOUApproval = lazy(() =>
  import("../modules/iouManagement/adjustmentApproval/index.jsx")
);
// const AdjustmentIOUReport = lazy(() =>
//   import("../modules/iouManagement/adjustmentIOUReport/index.jsx")
// );
const AdjustmentIOUReportView = lazy(() =>
  import("../modules/iouManagement/adjustmentIOUReport/viewForm.jsx")
);
const IOUApproval = lazy(() =>
  import("../modules/iouManagement/approval/index.jsx")
);
const MgtExpenseApplicationCreate = lazy(() =>
  import(
    "../modules/iouManagement/mgtExpense/expenseApplication/addEditForm.jsx"
  )
);
// const MgtExpenseApplication = lazy(() =>
//   import("../modules/iouManagement/mgtExpense/expenseApplication/index.jsx")
// );
const MgtExpenseApplicationView = lazy(() =>
  import("../modules/iouManagement/mgtExpense/expenseApplication/viewForm.jsx")
);
// const MgtIOUApplicationCreate = lazy(() =>
//   import("../modules/iouManagement/mgtIOUApplication/addEditForm.jsx")
// );
// const MgtIOUApplication = lazy(() =>
//   import("../modules/iouManagement/mgtIOUApplication/index.jsx")
// );
const MgtIOUApplicationView = lazy(() =>
  import("../modules/iouManagement/mgtIOUApplication/viewForm.jsx")
);
const SelfIOUApplicationCreate = lazy(() =>
  import("../modules/iouManagement/selfIOUApplication/addEditForm.jsx")
);
const SelfIOUApplication = lazy(() =>
  import("../modules/iouManagement/selfIOUApplication/index.jsx")
);
const SelfIOUApplicationView = lazy(() =>
  import("../modules/iouManagement/selfIOUApplication/viewForm.jsx")
);
const SupervisorIOUReportCreate = lazy(() =>
  import("../modules/iouManagement/supervisorIOUReport/addEditForm.jsx")
);
const SupervisorIOUReport = lazy(() =>
  import("../modules/iouManagement/supervisorIOUReport/index.jsx")
);
const SupervisorIOUReportView = lazy(() =>
  import("../modules/iouManagement/supervisorIOUReport/viewForm.jsx")
);
const AppPipeline = lazy(() =>
  import("../modules/leaveMovement/configuration/AppPipeline/index.jsx")
);
// const LeaveTypeCreate = lazy(() =>
//   import("../modules/leaveMovement/configuration/LeaveType/index.jsx")
// );
// const MovementType = lazy(() =>
//   import("../modules/leaveMovement/configuration/MovementType/index.jsx")
// );
const YearlyLeavePolicy = lazy(() =>
  import("../modules/leaveMovement/configuration/YearlyLeavePolicy/index.jsx")
);
// const LeaveApplication = lazy(() =>
//   import("../modules/leaveMovement/leave/application/index.jsx")
// );
const LeaveApproval = lazy(() =>
  import("../modules/leaveMovement/leave/approval/index.jsx")
);
const LeaveEncashment = lazy(() =>
  import("../modules/leaveMovement/leave/leaveEncashment/index.jsx")
);
const LeaveEncashmentApproval = lazy(() =>
  import("../modules/leaveMovement/leave/leaveEncashmentApproval/index.jsx")
);
const MovementApproval = lazy(() =>
  import("../modules/leaveMovement/movement/movementApproval/index.jsx")
);
const Application = lazy(() =>
  import("../modules/loanManagement/loan/application")
);
const LoanApproval = lazy(() =>
  import("../modules/loanManagement/loan/approval/index.jsx")
);

const Reschedule = lazy(() =>
  import("../modules/loanManagement/loan/reschedule/index.jsx")
);
const LeaveHistory = lazy(() =>
  import("../modules/loanManagement/Reports/leaveHistory/index.js")
);
const LeaveReportPrint = lazy(() =>
  import("../modules/loanManagement/Reports/leaveHistory/LeaveReportPrint.jsx")
);
const LoanHistory = lazy(() =>
  import("../modules/loanManagement/Reports/LoanHistory/index.jsx")
);
const LoanReportPrint = lazy(() =>
  import("../modules/loanManagement/Reports/LoanHistory/LoanReportPrint.jsx")
);
const MovementHistory = lazy(() =>
  import("../modules/loanManagement/Reports/movementHistory/index.js")
);
const MovementReportPrint = lazy(() =>
  import(
    "../modules/loanManagement/Reports/movementHistory/MovementReportPrint.jsx"
  )
);
const SalaryPaySlipSelfReport = lazy(() =>
  import("../modules/loanManagement/Reports/salaryPaySlipSelf/index.js")
);
const LocationAndDeviceApproval = lazy(() =>
  import("../modules/locationAndDeviceApproval/approval/index.jsx")
);
const MasterDashboardLanding = lazy(() =>
  import("../modules/MasterDashboard/MasterDashboardLanding.jsx")
);
const Organogram = lazy(() => import("../modules/organogram/index.jsx"));
const BonusSetupForm = lazy(() =>
  import("../modules/PayrollManagementSytem/BonusSetup/addEditForm/index.jsx")
);
const BreakdownSalaryAssign = lazy(() =>
  import("../modules/PayrollManagementSytem/BreakdownSalaryAssign/index.jsx")
);
const OvertimePolicy = lazy(() =>
  import("../modules/PayrollManagementSytem/OvertimePolicy/index.js")
);
const PayrollElementCreate = lazy(() =>
  import("../modules/PayrollManagementSytem/PayrollElement/Previous/index.jsx")
);
const PfGratuityPolicyForm = lazy(() =>
  import(
    "../modules/PayrollManagementSytem/pfGratuityPolicy/addEditForm/index.jsx"
  )
);
const PfGratuityPolicy = lazy(() =>
  import("../modules/PayrollManagementSytem/pfGratuityPolicy/index.jsx")
);
const AppliedEmployeePolicyDetails = lazy(() =>
  import(
    "../modules/PayrollManagementSytem/PolicyApply/AppliedEmployeePolicyDetails/index.jsx"
  )
);
const PolicyApplyBulk = lazy(() =>
  import(
    "../modules/PayrollManagementSytem/PolicyApply/PolicyApplyBulk/index.jsx"
  )
);
const PolicyApplySingle = lazy(() =>
  import(
    "../modules/PayrollManagementSytem/PolicyApply/PolicyApplySingle/index"
  )
);
const PolicyAppliedLanding = lazy(() =>
  import(
    "../modules/PayrollManagementSytem/PolicyApply/PolicyLanding/index.jsx"
  )
);
const PolicyReAssign = lazy(() =>
  import(
    "../modules/PayrollManagementSytem/PolicyApply/PolicyReassign/index.jsx"
  )
);
const SalaryBreakdownDetails = lazy(() =>
  import("../modules/PayrollManagementSytem/SalaryBreakdown/singleView.jsx")
);
const CreateSalaryPolicy = lazy(() =>
  import(
    "../modules/PayrollManagementSytem/SalaryPolicy/CreateSalaryPolicy/index.jsx"
  )
);
const EditSalaryPolicy = lazy(() =>
  import("../modules/PayrollManagementSytem/SalaryPolicy/editSalaryPolicy")
);
const PolicyList = lazy(() =>
  import("../modules/PayrollManagementSytem/SalaryPolicy/PolicyList/index.jsx")
);
const SalaryPolicyDetails = lazy(() =>
  import(
    "../modules/PayrollManagementSytem/SalaryPolicy/SalaryPolicyDetails/index.jsx"
  )
);
const PayrollGrossWiseBasicLanding = lazy(() =>
  import("../modules/PayrollManagementSytem/PayrollGrossWiseBasic/index.jsx")
);
const PayrollGrossWiseBasicForm = lazy(() =>
  import(
    "../modules/PayrollManagementSytem/PayrollGrossWiseBasic/addEditForm/index.jsx"
  )
);
// const PmsDashboard = lazy(() => import("../modules/pms/dashboard/index.jsx"));
// const IndividualKpi = lazy(() => import("../modules/pms/indKpi/index.jsx"));
// const IndKpiEntry = lazy(() => import("../modules/pms/indKpi/IndKpiEntry.jsx"));
// const Kpis = lazy(() => import("../modules/pms/kpis/index.jsx"));
// const StrPlan = lazy(() => import("../modules/pms/strPlan/index.jsx"));
const PolicyUpload = lazy(() => import("../modules/policyUpload/index.jsx"));
const RemoteAttendanceApproval = lazy(() =>
  import("../modules/remoteAttendanceLocation/approval/index.jsx")
);
const CreateRoleExtension = lazy(() =>
  import("../modules/roleExtension/ExtensionCreate/index.jsx")
);
const ViewRoleExtension = lazy(() =>
  import("../modules/roleExtension/ExtensionCreate/viewRoleExtension.jsx")
);
const UserRoleExtentionLanding = lazy(() =>
  import("../modules/roleExtension/index.jsx")
);
const AttendanceApproval = lazy(() =>
  import("../modules/timeSheet/attendence/attendanceApproval/index.jsx")
);
// const AttendanceApprovalRequest = lazy(() =>
//   import("../modules/timeSheet/attendence/attendanceApprovalRequest/index.jsx")
// );
const AttendenceAdjust = lazy(() =>
  import("../modules/timeSheet/attendence/attendenceAdjust/index.jsx")
);
const AttendanceProcessLanding = lazy(() =>
  import("../modules/timeSheet/attendence/attendanceProcess/index.jsx")
);
const AttendanceGenerateProcessForm = lazy(() =>
  import(
    "../modules/timeSheet/attendence/attendanceProcess/AttendanceGenerateProcessForm.jsx"
  )
);
const CalendarSetup = lazy(() =>
  import("../modules/timeSheet/configuration/calenderSetup/index.jsx")
);
const ExecptionOffdayInput = lazy(() =>
  import(
    "../modules/timeSheet/configuration/ExecptionOffday/ExecptionOffdayInput"
  )
);
const ExecptionOffday = lazy(() =>
  import("../modules/timeSheet/configuration/ExecptionOffday/index.jsx")
);
const HolidaySetup = lazy(() =>
  import("../modules/timeSheet/configuration/holidaySetup/index.jsx")
);
const UnderCreateHolidaySetup = lazy(() =>
  import(
    "../modules/timeSheet/configuration/holidaySetup/UnderCreateHolidaySetup/index.jsx"
  )
);
const LocationAssign = lazy(() =>
  import("../modules/timeSheet/configuration/locationAssign/index.jsx")
);
const OffdaySetup = lazy(() =>
  import("../modules/timeSheet/configuration/offdaySetup/index.jsx")
);
const UnderCreateOffdaySetup = lazy(() =>
  import(
    "../modules/timeSheet/configuration/offdaySetup/UnderCreateRosterSetup/index.jsx"
  )
);
const OutsideDuty = lazy(() =>
  import("../modules/timeSheet/configuration/outsideDuty/index.jsx")
);
const RosterSetup = lazy(() =>
  import("../modules/timeSheet/configuration/rosterSetup/index.jsx")
);
const UnderCreateRosterSetup = lazy(() =>
  import(
    "../modules/timeSheet/configuration/rosterSetup/UnderCreateRosterSetup/index.jsx"
  )
);
const Calendar = lazy(() =>
  import("../modules/timeSheet/employeeAssign/calendar/index.jsx")
);
const LeavePolicyAssign = lazy(() =>
  import("../modules/timeSheet/employeeAssign/leavePolicyAssign/index.jsx")
);
const HolidayException = lazy(() =>
  import("../modules/timeSheet/employeeAssign/HolidayException/index.jsx")
);
const OffDay = lazy(() =>
  import("../modules/timeSheet/employeeAssign/offDay/index.jsx")
);
const MonthlyOffdayAssignLanding = lazy(() =>
  import("../modules/timeSheet/employeeAssign/monthlyOffdayAssign/index.js")
);
const OvertimeReportPrint = lazy(() =>
  import(
    "../modules/timeSheet/overtime/overTimeReport/employeeDetails/components/GoForPrint.jsx"
  )
);
const OverTimeReport = lazy(() =>
  import("../modules/timeSheet/overtime/overTimeReport/index.jsx")
);
const OverTimeRequisition = lazy(() =>
  import("../modules/timeSheet/overtime/overTimeRequisition/index.js")
);
const AssetDetails = lazy(() =>
  import("../modules/timeSheet/reports/assetDetails/index.jsx")
);
const AttendanceByRoster = lazy(() =>
  import("../modules/timeSheet/reports/attendanceByRoster/index.jsx")
);
const AttendanceDetails = lazy(() =>
  import("../modules/timeSheet/reports/attendanceDetails/index.jsx")
);
const GorForPrint = lazy(() =>
  import("../modules/timeSheet/reports/attendanceReport/GorForPrint.jsx")
);
const AttendanceReport = lazy(() =>
  import("../modules/timeSheet/reports/attendanceReport/index.tsx")
);
// const AttendanceRawDataProcess = lazy(() =>
//   import("../modules/timeSheet/attendence/attendanceRawDataProcess/index.jsx")
// );
const AttendanceRawDataProcess = lazy(() =>
  import("../modules/timeSheet/attendence/attendanceRawDataProcess/indexN.jsx")
);
const Bridgeabsentprocess = lazy(() =>
  import("../modules/timeSheet/attendence/bridgeabsentprocess/indexN.jsx")
);
// const EmployeeList = lazy(() =>
//   import("../modules/timeSheet/reports/employeeList/index.jsx")
// );
const ExpenseReport = lazy(() =>
  import("../modules/timeSheet/reports/expenseReport/index.jsx")
);
const MgmtDailyAttendance = lazy(() =>
  import("../modules/timeSheet/reports/mgmtDailyAttendance/index.tsx")
);
const RosterDetails = lazy(() =>
  import("../modules/timeSheet/reports/rosterDetails/index.jsx")
);
const RosterReportPrint = lazy(() =>
  import("../modules/timeSheet/reports/rosterDetails/RosterReportPrint.jsx")
);

const RosterReport = lazy(() =>
  import("../modules/timeSheet/reports/rosterReport/index.tsx")
);
const MonthlyInOutReport = lazy(() =>
  import("../modules/timeSheet/reports/monthlyInOutReport/index.tsx")
);
const MonthlyAttendanceReport = lazy(() =>
  import("../modules/timeSheet/reports/monthlyAttendanceReport/index.tsx")
);
const EmployeesShift = lazy(() =>
  import("../modules/timeSheet/reports/employeesShift/index.tsx")
);
// Training and Development
import TrainingCalender from "modules/TrainingAndDevelopment/reports/trainingCalender/calender";
import TnDAttendanceSave from "modules/TrainingAndDevelopment/attendanceTracker/attendanceSave";
import TnDInventory from "modules/TrainingAndDevelopment/reports/trainingInventory/inventory";
import TnDInventoryDetails from "modules/TrainingAndDevelopment/reports/trainingInventory/inventoryDetails";
import TnDAssessment from "modules/TrainingAndDevelopment/assessment/assessment";
import TnDFeedback from "modules/TrainingAndDevelopment/feedback/feedback";
import TnDRequisitionLanding from "modules/TrainingAndDevelopment/requisition/requisitionLanding";
import TnDRequisitionCreateEdit from "modules/TrainingAndDevelopment/requisition/requisitionCreateEdit";
import TnDPlanningCreateEdit from "modules/TrainingAndDevelopment/planning/planningCreateEdit";
import TnDPlanningLanding from "modules/TrainingAndDevelopment/planning/planningLanding";
import TrainerInfo from "modules/TrainingAndDevelopment/masterData/trainerInfo";
import TrainingType from "modules/TrainingAndDevelopment/masterData/trainingType";
import TrainingTitle from "modules/TrainingAndDevelopment/masterData/trainingTitle";
import TrainingCost from "modules/TrainingAndDevelopment/masterData/trainingCost";
import TnDDashboard from "modules/TrainingAndDevelopment/dashboard";
import MarketVisitReport from "modules/timeSheet/reports/marketVisitReport";
import NightShiftReport from "modules/timeSheet/reports/nightShiftReport";
import InterViewModal from "modules/employeeProfile/separation/selfApplication/viewFormV2/components/InterViewModal";

// const TrainingApplicationCreate = lazy(() =>
//   import(
//     "../modules/trainingDevelopment/Application/components/TrainingApplicationCreate/index.jsx"
//   )
// );
// const TrainingApplication = lazy(() =>
//   import("../modules/trainingDevelopment/Application/index.jsx")
// );
// const TrainingApplicationCreateSelf = lazy(() =>
//   import(
//     "../modules/trainingDevelopment/ApplicationSelf/components/TrainingApplicationCreate/index.jsx"
//   )
// );
// const TrainingApplicationSelf = lazy(() =>
//   import("../modules/trainingDevelopment/ApplicationSelf/index.jsx")
// );
// const CreateTrainingBudget = lazy(() =>
//   import(
//     "../modules/trainingDevelopment/Budget/component/CreateTrainingBudget.jsx"
//   )
// );
// const Budget = lazy(() =>
//   import("../modules/trainingDevelopment/Budget/index.jsx")
// );
// const CalenderBooking = lazy(() =>
//   import("../modules/trainingDevelopment/CalenderBooking/index.jsx")
// );
// const Category = lazy(() =>
//   import("../modules/trainingDevelopment/Category/index")
// );
// const AddForm = lazy(() =>
//   import("../modules/trainingDevelopment/List/addEditForm/AddForm.jsx")
// );
// const List = lazy(() => import("../modules/trainingDevelopment/List/index"));
// const Organization = lazy(() =>
//   import("../modules/trainingDevelopment/Organization/index.jsx")
// );
// const TrainingEvaluation = lazy(() =>
//   import("../modules/trainingDevelopment/TrainingEvaluation/index.jsx")
// );
// const TrainingRequisition = lazy(() =>
//   import("../modules/trainingDevelopment/TrainingRequisition/index.jsx")
// );
// const TrainingRequisitionSelf = lazy(() =>
//   import("../modules/trainingDevelopment/TrainingRequisitionSelf/index.jsx")
// );
// const ScheduleModal = lazy(() =>
//   import("../modules/trainingDevelopment/trainingSchedule/create/index")
// );
// const TrainingSchedule = lazy(() =>
//   import("../modules/trainingDevelopment/trainingSchedule/index.jsx")
// );
// const Venue = lazy(() =>
//   import("../modules/trainingDevelopment/Venue/index.jsx")
// );
const TMProjectForm = lazy(() =>
  import("../saas/taskManagement/taskproject/addEditForm/index.jsx")
);
const TMProject = lazy(() =>
  import("../saas/taskManagement/taskproject/index.jsx")
);
const TMProjectSingleTaskForm = lazy(() =>
  import("../saas/taskManagement/taskproject/singleTask/addEditForm/index.jsx")
);
const TMProjectSingleTask = lazy(() =>
  import("../saas/taskManagement/taskproject/singleTask/index.jsx")
);
const TMProjectTaskBoard = lazy(() =>
  import("../saas/taskManagement/taskproject/taskboard/index.jsx")
);
const TMDashboard = lazy(() =>
  import("../saas/taskManagement/tmDashboard/index.jsx")
);
// const Designation = lazy(() =>
//   import("./../modules/configuration/designation/index")
// );
const SelfViewSeparationForm = lazy(() =>
  import(
    "./../modules/employeeProfile/separation/selfApplication/viewForm/index"
  )
);
const SeparationApproval = lazy(() =>
  import("./../modules/employeeProfile/separation/separationApproval/index")
);
const BonusSetupLanding = lazy(() =>
  import("./../modules/PayrollManagementSytem/BonusSetup/index")
);
// const SalaryBreakdown = lazy(() =>
//   import("./../modules/PayrollManagementSytem/SalaryBreakdown/index.jsx")
// );
const DailyAttendenceReport = lazy(() =>
  import("./../modules/timeSheet/reports/dailyAttendance/Landing/index")
);
const MgmtInOutReport = lazy(() =>
  import("../modules/timeSheet/reports/invalidInOutReport/index.tsx")
);
const EmployeeLocations = lazy(() =>
  import("../modules/remoteLocation/employeeLocations/index.jsx")
);
const OvertimeBulkEntry = lazy(() =>
  import("../modules/employeeProfile/overtimeEntry/OvertimeBulkEntry.js")
);
const Test = lazy(() =>
  import("../modules/componentModule/peopledeskTable/test.jsx")
);
const Homepage = lazy(() => import("../modules/dashboard/Homepage.jsx"));
// Retirement Module
const Separation = lazy(() =>
  import("../modules/retirement/separation/mgmApplication/index.jsx")
);
const SeparationApplicationForm = lazy(() =>
  import(
    "../modules/retirement/separation/mgmApplication/addEditForm/index.jsx"
  )
);
const RetirementReleaseSeparationForm = lazy(() =>
  import(
    "../modules/retirement/separation/mgmApplication/releaseForm/index.jsx"
  )
);
const SelfServiceSeparation = lazy(() =>
  import("../modules/employeeProfile/separation/selfApplication/viewFormV2/index.jsx")
);

export const routingList = [
  { path: "/", component: Homepage },
  { path: "/chat", component: Chat },
  {
    path: "/SelfService/myrewardsandpunishment",
    component: RewardsAndPunishmentView,
  },

  {
    path: "/profile/rewardsandpunishment",
    component: RewardsAndPunishmentEntry,
  },
  {
    path: "/profile/rewardsandpunishmentadd",
    component: RewardsAndPunishmentAdd,
  },

  // { path: "/dashboard", component: DashboardModule },
  { path: "/dashboard", component: MasterDashboardLanding },
  { path: "/profile/employee", component: EmployeeFeatureNew },
  { path: "/profile/employee/bulk", component: BulkEmployeeCreate },
  { path: "/profile/reports/contractClosing", component: ContactClosingReport },
  {
    path: "/profile/reports/jobConfirmation",
    component: JobConfirmationReport,
  },
  {
    path: "/profile/timeManagement/attendanceRawDataProcess",
    component: AttendanceRawDataProcess,
  },
  {
    path: "/profile/timeManagement/bridgeabsentprocess",
    component: Bridgeabsentprocess,
  },
  {
    path: "/profile/reports/inactiveEmployees",
    component: ActiveInactiveEmployeeReport,
  },
  {
    path: "/administration/configuration/bulkReporterChange",
    component: ReporterUpdation,
  },
  {
    path: "/profile/employee/go-for-print/print-preview",
    component: PrintPreview,
  },
  {
    path: "/profile/employee/go-for-print/:empId",
    component: GoForPrint,
  },

  { path: "/profile/employee/create", component: CreateAndEditEmploye },

  { path: "/profile/employee/edit/:empId", component: CreateAndEditEmploye },
  { path: "/profile/employee/:empId", component: AboutMeDetails },
  {
    path: "/profile/separation/release/:id",
    component: ManagementReleaseSeparationForm,
  },
  {
    path: "/profile/separation/edit/:id",
    component: ManagementApplicationSeparationForm,
  },
  {
    path: "/profile/separation/view/:id",
    component: ManagementViewSeparationForm,
  },
  {
    path: "/profile/separation/create",
    component: ManagementApplicationSeparationForm,
  },
  {
    path: "/profile/separation",
    component: ManagementSeparation,
  },
  {
    path: "/profile/finalSettlement",
    component: FinalSettlementLanding,
  },
  {
    path: "/profile/finalSettlement/create",
    component: FinalSettlementAddEditView,
  },
  {
    path: "/profile/finalSettlement/:type/:id",
    component: FinalSettlementAddEditView,
  },
  { path: "/profile/reports/separationReport", component: SeparationReport },
  {
    path: "/profile/reports/separationReport/print",
    component: SeparationReportPrintPage,
  },
  {
    path: "/profile/overTime/manualEntry/create",
    component: AddEditOverTime,
  },
  {
    path: "/profile/overTime/bulkEntry/create",
    component: OvertimeBulkEntry,
  },
  {
    path: "/profile/overTime/manualEntry/edit/:id",
    component: AddEditOverTime,
  },
  {
    path: "/administration/timeManagement/shiftManagement",
    component: ShiftManagement,
  },
  {
    path: "/administration/thirdPartyIntegration/hireDesk",
    component: HiredeskOnboarding,
  },
  {
    path: "/administration/timeManagement/fixedRosterSetup",
    component: FixedRoster,
  },
  {
    path: "/administration/timeManagement/fixedRosterSetup/create",
    component: FixedRosterCreateEdit,
  },
  {
    path: "/administration/timeManagement/fixedRosterSetup/edit/:id",
    component: FixedRosterCreateEdit,
  },
  {
    path: "/profile/overTime/manualEntry",
    component: EmOvertimeEntry,
  },
  {
    path: "/profile/overTime/autoGenerated",
    component: EmOvertimeAutoGenerated,
  },
  {
    path: "/profile/reports/emloyeeIDCard",
    component: EmployeePdfLanding,
  },
  {
    path: "/profile/reports/emloyeeDataChecklist",
    component: EmpCheckList,
  },
  {
    path: "/profile/reports/movementDetailsHistory",
    component: MovementHistoryDetails,
  },
  {
    path: "/profile/reports/marketVisit",
    component: MarketVisitReport,
  },
  {
    path: "/administration/configuration/commonapprovalpipeline",
    component: CommonAppPipeline,
  },
  { path: "/profile/leaveApplication", component: EmLeaveApplicationT },
  { path: "/profile/movementApplication", component: EmMovementApplication },
  { path: "/profile/loanRequest", component: EmLoanApplication },

  { path: "/profile/confirmation", component: Confirmation },
  {
    path: "/profile/cafeteriaManagement/cafeteriaPricingSetup",
    component: CafeteriaPricingLanding,
  },
  {
    path: "/profile/cafeteriaManagement/cafeteriaPricingSetup/pricingSetupForm",
    component: PricingSetupForm,
  },
  {
    path: "/profile/cafeteriaManagement/cafeteriaPricingSetup/pricingSetupForm/:id",
    component: PricingSetupForm,
  },
  {
    path: "/profile/cafeteriaManagement/foodCorner",
    component: FoodCornerForAll,
  },
  {
    path: "/profile/cafeteriaManagement/detailsReport",
    component: FoodDetailsReport,
  },
  {
    path: "/administration/configuration/orgInfoForId",
    component: OrgInfoId,
  },
  //PF Management start for selfService
  {
    path: "/SelfService/pfmanagement",
    component: PFSelfLanding,
  },
  //PF Management start for selfService
  // {
  //   path: "/profile/iOU/application/create",
  //   component: MgtIOUApplicationCreate,
  // },
  // {
  //   path: "/profile/iOU/application/edit/:id",
  //   component: MgtIOUApplicationCreate,
  // },
  {
    path: "/administration/logHistory/shiftManagementLog",
    component: ShiftManagementLog,
  },
  {
    path: "/profile/iOU/application/:id",
    component: MgtIOUApplicationView,
  },
  {
    path: "/profile/iOU/application",
    component: MgtIOUApplicationLanding,
  },
  {
    path: "/profile/iOU/adjustmentReport/:id",
    component: AdjustmentIOUReportView,
  },
  {
    path: "/profile/iOU/adjustmentReport",
    component: AdjustmentIOUReportLanding,
  },
  {
    path: "/profile/reports/employeeList",
    component: EmployeeList,
  },
  {
    path: "/profile/reports/attendanceReport",
    component: AttendanceReport,
  },
  {
    path: "/profile/reports/attendanceSummaryReport",
    component: AttendanceSummeryReport,
  },
  {
    path: "/profile/reports/dailyAttendanceReport",
    component: MgmtDailyAttendance,
  },
  {
    path: "/profile/reports/finalSettlementReport",
    component: FinalSettlementReport,
  },
  {
    path: "/profile/reports/lateReport",
    component: LateReport,
  },
  {
    path: "/profile/reports/joiningReport",
    component: JoiningReport,
  },
  {
    path: "/profile/reports/joineeAttendancereport",
    component: JoineeAttendanceReport,
  },
  {
    path: "/profile/reports/earlyOutReport",
    component: EarlyReport,
  },
  {
    path: "/profile/reports/absentReport",
    component: AbsentReport,
  },
  {
    path: "/profile/reports/invalidInOutAttendanceReport",
    component: MgmtInOutReport,
  },
  {
    path: "/profile/reports/attendanceReport/goForPrint",
    component: GorForPrint,
  },
  {
    path: "/profile/reports/monthlyINOUTReport",
    component: MonthlyInOutReport,
  },
  { path: "/profile/reports/rosterReport", component: RosterReport },
  { path: "/profile/reports/empRosterReport", component: EmployeesShift },
  {
    path: "/profile/reports/monthlyAttendanceReport",
    component: MonthlyAttendanceReport,
  },
  {
    path: "/profile/reports/attendanceLogs",
    component: AttendanceLog,
  },
  {
    path: "/profile/reports/foodAllowenceReport",
    component: FoodAllowenceReport,
  },
  {
    path: "/profile/reports/rosterDetails",
    component: RosterDetails,
  },
  {
    path: "/profile/reports/rosterDetails/print",
    component: RosterReportPrint,
  },
  {
    path: "/profile/reports/attendanceByRoster",
    component: AttendanceByRoster,
  },
  { path: "/profile/reports/loanHistory", component: EmLoanHistory },
  {
    path: "/profile/reports/loanHistoryprint",
    component: EmLoanReportPrint,
  },
  { path: "/profile/reports/leaveHistory", component: EmLeaveHistory },
  {
    path: "/profile/reports/leaveHistory/print",
    component: EmLeaveReportPrint,
  },
  {
    path: "/profile/reports/movementHistory",
    component: EmMovementHistory,
  },
  {
    path: "/profile/reports/movementHistory/print",
    component: EmMovementReportPrint,
  },
  {
    path: "/profile/reports/monthlyPunchDetailsReport",
    component: MonthlyPunchReportDetails,
  },
  {
    path: "/profile/reports/overTimeReport",
    component: EmOverTimeReport,
  },
  {
    path: "/profile/reports/dailyOvertimeReport",
    component: EmOverTimeDailyReport,
  },
  {
    path: "/profile/reports/jobcard",
    component: EmployeeJobCard,
  },
  {
    path: "/profile/reports/pfFundReport",
    component: PfFundReport,
  },
  {
    path: "/profile/expense/expenseApplication/view/:id",
    component: MgtExpenseApplicationView,
  },
  {
    path: "/profile/expense/expenseApplication/edit/:id",
    component: MgtExpenseApplicationCreate,
  },
  {
    path: "/profile/expense/expenseApplication/create",
    component: MgtExpenseApplicationCreate,
  },
  {
    path: "/profile/expense/expenseApplication",
    component: MgtExpenseApplicationLanding,
  },
  {
    path: "/profile/remoteLocation/employeeLocation",
    component: EmployeeLocations,
  },
  {
    path: "/profile/remoteLocation/employeeWiseLocation",
    component: EmployeeWiseLocation,
  },
  {
    path: "/profile/remoteLocation/locationWiseEmployee",
    component: LocationWiseEmployee,
  },
  {
    path: "/approval/masterLocationApproval",
    component: MasterLocationRegistration,
  },
  // <== Administration start
  // { path: "/administration/roleManagement/usersInfo", component: UserInfo },
  { path: "/administration/roleManagement/usersInfo", component: UserInfoN },
  {
    path: "/administration/roleManagement/usersInfo/create",
    component: CreateUser,
  },
  { path: "/administration/roleManagement/userGroup", component: UserGroup },
  {
    path: "/administration/roleManagement/featureGroup",
    component: FeatureGroup,
  },
  {
    path: "/administration/configuration/territorySetup",
    component: TerritorySetup,
  },
  {
    path: "/administration/configuration/territoryType",
    component: TerritoryType,
  },
  //Bank branch start
  {
    path: "/administration/configuration/bankBranch",
    component: BankBranch,
  },
  //Bank branch end
  {
    path: "/administration/roleManagement/userRolePrev",
    component: UserRole,
  },
  {
    path: "/administration/roleManagement/userRole",
    component: UserRoleN,
  },
  {
    path: "/administration/roleManagement/userRoleManager",
    component: UserRoleManager,
  },
  {
    path: "/administration/roleManagement/userRoleManager/featureAssignToRole",
    component: FeatureAssignToRole,
  },
  {
    path: "/administration/roleManagement/userRoleManager/featureAssignToUser",
    component: FeatureAssignToUser,
  },
  {
    path: "/administration/roleManagement/userRoleManager/roleAssignToUser",
    component: RoleAssignToUser,
  },
  {
    path: "/administration/leaveandmovement/approvalPipeline",
    component: AppPipeline,
  },
  {
    path: "/administration/leaveandmovement/leavePolicy",
    component: LeaveTypeCreate,
  },
  {
    path: "/administration/leaveandmovement/movementPolicy",
    component: MovementType,
  },
  {
    path: "/administration/leaveandmovement/yearlyLeavePolicy",
    component: YearlyLeavePolicy,
  },
  {
    path: "/administration/leaveandmovement/yearlyLeavePolicy/create",
    component: CreateEditLeavePolicy,
  },
  {
    path: "/administration/leaveandmovement/yearlyLeavePolicy/extention",
    component: CreateEditLeavePolicy,
  },
  {
    path: "/administration/leaveandmovement/yearlyLeavePolicy/edit/:id",
    component: CreateEditLeavePolicy,
  },
  {
    path: "/administration/timeManagement/holidaySetup",
    component: HolidaySetup,
  },
  {
    path: "/administration/timeManagement/outsideDuty",
    component: OutsideDuty,
  },
  {
    path: "/administration/timeManagement/holidaySetup/:id",
    component: UnderCreateHolidaySetup,
  },
  {
    path: "/compensationAndBenefits/reports/incrementReport",
    component: IncrementReport,
  },
  {
    path: "/administration/timeManagement/calendarSetup",
    component: CalendarSetup,
  },
  {
    path: "/administration/timeManagement/exceptionOffDay",
    component: ExecptionOffday,
  },
  {
    path: "/administration/timeManagement/exceptionOffDay/:id",
    component: ExecptionOffdayInput,
  },
  {
    path: "/administration/timeManagement/rosterSetup",
    component: RosterSetup,
  },
  {
    path: "/administration/timeManagement/rosterSetup/:id/:rosterName",
    component: UnderCreateRosterSetup,
  },
  {
    path: "/administration/timeManagement/rosterSetup/create",
    component: UnderCreateRosterSetup,
  },
  {
    path: "/administration/timeManagement/offdaySetup/:id/:rosterName",
    component: UnderCreateOffdaySetup,
  },
  {
    path: "/administration/timeManagement/offdaySetup",
    component: OffdaySetup,
  },
  {
    path: "/administration/timeManagement/holidayAndExceptionOffdayAssign",
    component: HolidayException,
  },
  {
    path: "/administration/timeManagement/calendarAssign",
    component: Calendar,
  },
  {
    path: "/administration/timeManagement/leavePolicyAssign",
    component: LeavePolicyAssign,
  },
  {
    path: "/administration/timeManagement/offDayAssign",
    component: OffDay,
  },
  {
    path: "/administration/timeManagement/monthlyOffdayAssign",
    component: MonthlyOffdayAssignLanding,
  },
  {
    path: "/administration/timeManagement/locationAssign",
    component: LocationAssign,
  },
  {
    path: "/administration/timeManagement/multiCalendarAssign",
    component: MultiCalendarAssign,
  },
  {
    path: "/administration/configuration/latepunishmentassign",
    component: LatePunishmentAssign,
  },
  {
    path: "/administration/timeManagement/holidayOffdaySwap/assign",
    component: HolidayOffdaySwapAssign,
  },
  {
    path: "/administration/timeManagement/holidayOffdaySwap",
    component: HolidayOffdaySwap,
  },
  {
    path: "/administration/configuration/business-unit",
    component: BusinessUnit,
  },
  {
    path: "/administration/configuration/payScaleGrade",
    component: PayScaleGrade,
  },
  { path: "/administration/configuration/sbu", component: SBUUnit },
  { path: "/administration/configuration/department", component: Department },
  { path: "/administration/configuration/section", component: Section },
  { path: "/administration/configuration/jobLocation", component: JobLocation },
  {
    path: "/administration/configuration/jobTerritory",
    component: JobTerritory,
  },
  { path: "/administration/configuration/hr-position", component: HRPosition },
  {
    path: "/administration/configuration/designation",
    component: Designation,
  },
  { path: "/administration/configuration/workplace", component: Workplace },
  {
    path: "/administration/configuration/worklineConfig",
    component: WorklineConfig,
  },
  {
    path: "/administration/configuration/document-type",
    component: DocumentType,
  },
  {
    path: "/administration/configuration/SeparationType",
    component: SeparationType,
  },
  {
    path: "/administration/configuration/employmentType",
    component: EmploymentTypeCreate,
  },
  {
    path: "/administration/configuration/expenseType",
    component: ExpenseTypeCreate,
  },
  {
    path: "/administration/configuration/loanType",
    component: LoanTypeCreate,
  },
  { path: "/administration/configuration/religion", component: Religion },
  {
    path: "/administration/configuration/notificationConfig/create",
    component: NotificationConfigCreate,
  },
  {
    path: "/administration/configuration/notificationConfig/edit/:id",
    component: NotificationConfigCreate,
  },
  {
    path: "/administration/configuration/notificationConfig/view/:id",
    component: NotificationDetails,
  },
  {
    path: "/administration/configuration/notificationConfig",
    component: NotificationConfig,
  },
  {
    path: "/administration/configuration/dashboardComponent",
    component: DashboardComponent,
  },
  {
    path: "/administration/configuration/dashboardComponentPermission",
    component: DashboardComponentPermission,
  },
  {
    path: "/administration/configuration/dashboardComponentPermission/create",
    component: DashboardCompPermissionCreate,
  },
  {
    path: "/administration/configuration/dashboardComponentPermission/edit/:id",
    component: DashboardCompPermissionCreate,
  },
  {
    path: "/administration/configuration/dashboardComponentPermission/view/:id",
    component: DashboardCompPermissionDetails,
  },
  {
    path: "/administration/configuration/managementDashboardPermission",
    component: ManagementDashboardPermission,
  },
  {
    path: "/administration/configuration/managementDashboardPermission/create",
    component: ManagementDashboardPermissionCreate,
  },
  {
    path: "/administration/configuration/managementDashboardPermission/edit/:id",
    component: ManagementDashboardPermissionCreate,
  },
  {
    path: "/profile/taskManagement",
    component: ManagementTaskManagement,
  },
  {
    path: "/profile/taskManagement/create",
    component: ManagementCreateTask,
  },
  {
    path: "/profile/taskManagement/view/:id",
    component: ManagementViewTask,
  },
  {
    path: "/SelfService/taskManagement",
    component: SelfTaskManagement,
  },
  {
    path: "/SelfService/taskManagement/create",
    component: SelfCreateTask,
  },
  {
    path: "/SelfService/taskManagement/view/:id",
    component: SelfViewTask,
  },
  {
    path: "/administration/configuration/managementDashboardPermission/view/:id",
    component: ManagementDashboardPermissionDetails,
  },
  {
    path: "/administration/configuration/employeeDivision",
    component: EmployeeDivision,
  },
  {
    path: "/administration/configuration/PFRegisterType",
    component: PFRegisterTypeLanding,
  },
  { path: "/SelfService/dashboard", component: SelfDashboard },
  { path: "/SelfService/aboutMe", component: AboutMe },
  {
    path: "/profile/timemanagement/attendenceadjustPrev",
    component: AttendenceAdjust,
  },
  {
    path: "/profile/timemanagement/attendenceadjust",
    component: AttendenceAdjustN,
  },
  {
    path: "/profile/timeManagement/attendanceAutoProcess",
    component: AttendanceProcessLanding,
  },
  {
    path: "/profile/timeManagement/attendanceAutoProcess/generate",
    component: AttendanceGenerateProcessForm,
  },
  {
    path: "/administration/announcement",
    component: AnnouncementCreateLanding,
  },
  {
    path: "/administration/announcement/create",
    component: AnnouncementCreate,
  },
  {
    path: "/administration/announcement/edit/:id",
    component: AnnouncementCreate,
  },
  {
    path: "/administration/policyUpload",
    component: PolicyUpload,
  },
  {
    path: "/administration/announcement/:id",
    component: AnnouncementViewPage,
  },
  {
    path: "/administration/configuration/orgBankDetails",
    component: OrgBankDetailsLanding,
  },
  {
    // dont remove the space from this route.. otherwise it will throw error or redirect to other route
    path: "/administration/configuration/taxChallanConfig ",
    component: TaxChallanConfigLanding,
  },
  // {
  //   path: "/SelfService/timeManagement/attendenceAdjustRequest",
  //   component: AttendanceApprovalRequest,
  // },
  {
    path: "/SelfService/timeManagement/attendenceAdjustRequest",
    component: SelfAttendenceAdjust,
  },
  {
    path: "/SelfService/timeManagement/overTimeRequisition",
    component: OverTimeRequisition,
  },
  {
    path: "/SelfService/leaveAndMovement/leaveApplication",
    component: TLeaveApplication,
  },
  {
    path: "/SelfService/leaveAndMovement/leaveEncashment",
    component: LeaveEncashment,
  },
  {
    path: "/SelfService/leaveAndMovement/movementApplication",
    // component: MovementApplication,
    component: EmMovementApplication, // this component is used in management and self service 🔥
  },
  {
    path: "/SelfService/expense/expenseApplication/create",
    component: SelfExpanseApplicationAddForm,
  },
  {
    path: "/SelfService/expense/expenseApplication/edit/:id",
    component: SelfExpanseApplicationAddForm,
  },
  {
    path: "/SelfService/expense/expenseApplication/view/:id",
    component: SelfExpenseApplicationView,
  },
  {
    path: "/SelfService/expense/expenseApplication",
    component: UpdateExpanseApplication,
  },
  {
    path: "/SelfService/iOU/application/create",
    component: SelfIOUApplicationCreate,
  },
  {
    path: "/SelfService/iOU/application/edit/:id",
    component: SelfIOUApplicationCreate,
  },
  {
    path: "/SelfService/iOU/application/:id",
    component: SelfIOUApplicationView,
  },
  {
    path: "/SelfService/iOU/application",
    component: SelfIOUApplication,
  },
  {
    path: "/SelfService/iOU/report/edit/:id",
    component: SupervisorIOUReportCreate,
  },
  {
    path: "/SelfService/iOU/report/:id",
    component: SupervisorIOUReportView,
  },
  {
    path: "/SelfService/iOU/report",
    component: SupervisorIOUReport,
  },
  {
    path: "/SelfService/salaryCertificate/salaryCertificateRequsition/view/:id",
    component: SelfSalaryCertificateView,
  },
  {
    path: "/SelfService/salaryCertificate/salaryCertificateRequsition/edit/:id",
    component: SelfSalaryCertificateRequestCreate,
  },
  {
    path: "/SelfService/salaryCertificate/salaryCertificateRequsition/create",
    component: SelfSalaryCertificateRequestCreate,
  },
  {
    path: "/SelfService/salaryCertificate/salaryCertificateRequsition",
    component: SelfSalaryCertificateRequest,
  },
  {
    path: "/SelfService/payslip",
    component: SelfSalaryPayslipReport,
  },
  {
    path: "/SelfService/traininganddevelopment",
    component: SelfTrainingDevelopment,
  },
  {
    path: "/SelfService/traininganddevelopment/view/:id",
    component: TrainingDetails,
  },
  {
    path: "/approval",
    component: ApprovalList,
  },
  // {
  //   path: "/approval",
  //   component: ApprovalList,
  // },
  {
    path: "/approval/leaveApproval",
    component: LeaveApproval,
  },
  {
    path: "/approval/leaveEncashmentApproval",
    component: LeaveEncashmentApproval,
  },
  {
    path: "/approval/movementApproval",
    component: MovementApproval,
  },
  {
    path: "/approval/attendanceApproval",
    component: AttendanceApproval,
  },
  {
    path: "/approval/overtimeApproval",
    component: OvertimeApproval,
  },
  {
    path: "/approval/salaryApproval",
    component: SalaryGenerateApproval,
    // component: EmployeeSalaryApproval,
  },
  {
    path: "/approval/loanApproval",
    component: LoanApproval,
  },
  {
    path: "/approval/separationApproval",
    component: SeparationApproval,
  },
  {
    path: "/approval/bonusApproval",
    component: EmployeeBonusApproval,
  },
  {
    path: "/approval/allowanceNDeduction",
    component: AllowanceNDeductionApproval,
  },
  {
    path: "/approval/iouApplication",
    component: IOUApproval,
  },
  {
    path: "/approval/expenseApproval",
    component: ExpenseApplicationApproval,
  },
  {
    path: "/approval/transferandpromotion",
    component: TransferNPromotionApproval,
  },
  {
    path: "/approval/iouAdjustmentApproval",
    component: AdjustmentIOUApproval,
  },
  {
    path: "/approval/remoteAttendance",
    component: RemoteAttendanceApproval,
  },
  {
    path: "/approval/remoteAttendanceLocationNDevice",
    component: LocationAndDeviceApproval,
  },
  {
    path: "/approval/marketVisit",
    component: MarketVistApproval,
  },
  {
    path: "/approval/scheduleApproval",
    component: TrainingScheduleApproval,
  },
  {
    path: "/approval/trainingRequisitionApproval",
    component: RequisitionApproval,
  },
  {
    path: "/approval/salaryGenerateApproval",
    component: SalaryGenerateApproval,
  },
  {
    path: "/approval/incrementApproval",
    component: IncrementNPromotionApproval,
  },
  {
    path: "/approval/bonusGenerateApproval",
    component: BonusGenerateApproval,
  },
  {
    path: "/approval/pfWithdraw",
    component: PfWithdrawApproval,
  },
  {
    path: "/approval/arrearSalaryApproval",
    component: ArrearSalaryGenerateApproval,
  },
  {
    path: "/approval/salaryCertificateApproval",
    component: SalaryCertificateApproval,
  },
  {
    path: "/SelfService/loanFinancialAid/loanRequest",
    component: EmLoanApplication,
  },
  {
    path: "/SelfService/loanFinancialAid/loanReschedule",
    component: Reschedule,
  },
  {
    path: "/SelfService/report/attendanceDetails",
    component: AttendanceDetails,
  },
  { path: "/SelfService/report/loanHistory", component: LoanHistory },
  { path: "/SelfService/report/leaveHistory", component: LeaveHistory },
  {
    path: "/SelfService/report/loanHistory/print",
    component: LoanReportPrint,
  },
  {
    path: "/compensationAndBenefits/leaveEncashment",
    component: LeaveEncashment,
  },
  {
    path: "/SelfService/report/leaveHistory/print",
    component: LeaveReportPrint,
  },
  {
    path: "/SelfService/report/movementHistory",
    component: MovementHistory,
  },
  {
    path: "/SelfService/report/movementHistory/print",
    component: MovementReportPrint,
  },
  {
    path: "/SelfService/report/overTimeReport",
    component: OverTimeReport,
  },
  {
    path: "/SelfService/report/overTimeReport/goForPrint",
    component: OvertimeReportPrint,
  },
  {
    path: "/SelfService/report/expenseReport",
    component: ExpenseReport,
  },
  {
    path: "/SelfService/report/assetDetails",
    component: AssetDetails,
  },
  {
    path: "/SelfService/report/dailyAttendance",
    component: DailyAttendenceReport,
  },
  {
    path: "/SelfService/contactBook",
    component: ContactBook,
  },
  {
    path: "/SelfService/foodcorner",
    component: FoodCorner,
  },

  // compensationAndBenefits

  {
    path: "/compensationAndBenefits/payrollProcess/incrementProposal",
    component: IncrementProposal,
  },
  {
    path: "/compensationAndBenefits/configuration/payrollElementAndRule",
    component: PayrollElementsRules,
  },
  {
    path: "/compensationAndBenefits/configuration/payrollGroup",
    component: PayrollGroup,
  },
  { path: "/compensationAndBenefits/configuration/grade", component: Grade },
  {
    path: "/compensationAndBenefits/configuration/payFrequency",
    component: PayFrequency,
  },
  {
    path: "/compensationAndBenefits/configuration/payrollMonth",
    component: PayRollMonth,
  },
  {
    path: "/compensationAndBenefits/incometaxmgmt/taxassign/bulk",
    component: BulkEmployeeTaxAssign,
  },
  {
    path: "/compensationAndBenefits/incometaxmgmt/slabwiseincometaxconf",
    component: SlabWiseIncomeTaxConf,
  },
  {
    path: "/compensationAndBenefits/incometaxmgmt/taxassign",
    component: IncomeTaxAssign,
  },
  {
    path: "/compensationAndBenefits/employeeSalary/salaryAssignv2",
    component: SalaryV2,
  },
  {
    path: "/compensationAndBenefits/employeeSalary/salaryAssign",
    component: SalaryAssign,
  },
  {
    path: "/compensationAndBenefits/employeeSalary/salaryAssign/bulk",
    component: BulkUpload,
  },
  {
    path: "/compensationAndBenefits/employeeSalary/bulkSalaryAssign",
    component: BulkSalaryAssign,
  },
  {
    path: "/compensationAndBenefits/salaryTaxCertificate",
    component: SalaryTaxCertificate,
  },
  {
    path: "/compensationAndBenefits/payrollProcess/bonusGenerate/view/:id",
    component: BonusGenerateView,
  },
  {
    path: "/compensationAndBenefits/payrollProcess/bonusGenerate/create",
    component: BonusGenerateCreate,
  },
  {
    path: "/compensationAndBenefits/payrollProcess/bonusGenerate/edit/:id",
    component: BonusGenerateCreate,
  },
  {
    path: "/compensationAndBenefits/payrollProcess/bonusGenerate",
    component: BonusGenerateLanding,
  },
  {
    path: "/compensationAndBenefits/payrollProcess/generateSalary/edit/:id",
    component: SalaryGenerateCreate,
  },
  {
    path: "/compensationAndBenefits/payrollProcess/generateSalary/create",
    component: SalaryGenerateCreate,
  },
  {
    path: "/compensationAndBenefits/payrollProcess/generateSalary",
    component: SalaryGenerateLanding,
  },
  {
    path: "/compensationAndBenefits/payrollProcess/arearSalaryGenerate/view/:id",
    component: ArearSalaryGenerateView,
  },
  {
    path: "/compensationAndBenefits/payrollProcess/arearSalaryGenerate/regenerate/:id",
    component: ArearSalaryGenerateForm,
  },
  {
    path: "/compensationAndBenefits/payrollProcess/arearSalaryGenerate/create",
    component: ArearSalaryGenerateForm,
  },
  {
    path: "/compensationAndBenefits/payrollProcess/arearSalaryGenerate",
    component: ArearSalaryGenerateIndex,
  },
  {
    path: "/compensationAndBenefits/payrollProcess/generateSalaryView/:id",
    component: SalaryGenerateView,
  },
  {
    path: "/compensationAndBenefits/pfandgratuity/pfInvestment/view/:id",
    component: PFInvestmentViewForm,
  },
  {
    path: "/compensationAndBenefits/pfandgratuity/pfInvestment/edit/:id",
    component: PFInvestmentForm,
  },
  {
    path: "/compensationAndBenefits/pfandgratuity/pfInvestment/create",
    component: PFInvestmentForm,
  },
  {
    path: "/compensationAndBenefits/pfandgratuity/pfInvestment",
    component: PfInvestmentLanding,
  },
  // PF Fund for Compensation & benefit start
  {
    path: "/compensationAndBenefits/pfandgratuity/PFFund",
    component: PfFundLanding,
  },
  // PF Fund for Compensation & benefit End

  // PF Withdraw for Compensation & benefit start
  {
    path: "/compensationAndBenefits/pfandgratuity/pfWithdraw",
    component: PFCompLanding,
  },
  {
    path: "/SelfService/report/salaryPaySlip",
    component: SalaryPaySlipSelfReport,
  },
  {
    path: "/compensationAndBenefits/reports/salaryPaySlip",
    component: SalaryPaySlip,
  },
  {
    path: "/compensationAndBenefits/reports/salaryPaySlip/allGoForPrint",
    component: SalaryReportAllEmployee,
  },
  {
    path: "/compensationAndBenefits/reports/salaryPaySlip/goForPrint",
    component: SalaryReportSingleEmp,
  },
  {
    path: "/compensationAndBenefits/reports/departmentWiseSalary",
    component: DeptWiseSalary,
  },
  {
    path: "/compensationAndBenefits/reports/departmentWiseSalary/goForPrint",
    component: GoForPrintSalary,
  },
  {
    path: "/compensationAndBenefits/reports/bankAdvice",
    component: BankAdviceReport,
  },
  {
    path: "/compensationAndBenefits/reports/salaryReport",
    component: SalaryReport,
  },
  {
    path: "/compensationAndBenefits/reports/salaryReport/:id",
    component: SingleSalaryReport,
  },
  {
    path: "/compensationAndBenefits/reports/salaryDetailsReport",
    component: SalaryDetailsReport,
  },
  {
    path: "/compensationAndBenefits/reports/salaryReconciliation",
    component: SalaryReconciliation,
  },
  {
    path: "/compensationAndBenefits/reports/salaryRequisitionReport",
    component: SalaryRequisitionReport,
  },
  {
    path: "/compensationAndBenefits/reports/salarySummaryCostCenterReport",
    component: SummaryCostCenterReport,
  },
  {
    path: "/compensationAndBenefits/reports/monthlyAllowenceNDeduction",
    component: MonthlyAllowanceDeductionReport,
  },
  {
    path: "/compensationAndBenefits/reports/salary&AllowenceCostCenterReport",
    component: SalaryCostCenterReport,
  },
  {
    path: "/compensationAndBenefits/reports/yearlyTaxReturnReport",
    component: YearlyTaxReturnReport,
  },
  // increment/promotion start
  { path: "/compensationAndBenefits/increment", component: IncrementLanding },
  {
    path: "/compensationAndBenefits/increment/singleIncrement/create",
    component: SingleIncrement,
  },
  {
    path: "/compensationAndBenefits/increment/singleIncrement/grade/view/:id",
    component: SingleIncrement,
  },
  {
    path: "/compensationAndBenefits/increment/singleIncrement/view/:id",
    component: ViewIncrementNPromotion,
  },
  {
    path: "/compensationAndBenefits/increment/singleIncrement/edit/:id",
    component: SingleIncrement,
  },

  {
    path: "/compensationAndBenefits/increment/bulkIncrement/create",
    component: BulkIncrementEntry,
  },
  // increment/promotion end
  {
    path: "/profile/overTimeBulkUpload",
    component: BulkUploadEntry,
  },
  {
    path: "/profile/reports/overTimeBulkUploadHistory",
    component: BulkUploadHistory,
  },

  // report builder start
  {
    path: "/profile/customReportsBuilder/employeeReportBuilder",
    component: EmployeeReportBuilder,
  },

  // report builder end

  // Change Password
  {
    path: "/changepassword",
    component: ChangePassword,
  },

  // Account Create Module
  {
    path: "/administration/configuration/account/create",
    component: AccountCreateForm,
  },
  {
    path: "/administration/configuration/account/edit/:id",
    component: AccountCreateForm,
  },
  {
    path: "/administration/configuration/account",
    component: AccountCreateLanding,
  },
  { path: "/administration/configuration/organogram", component: Organogram },
  { path: "/tm/task-project", component: TMProject },
  {
    path: "/taskmanagement/taskmgmt/projects/create",
    component: TMProjectForm,
  },
  {
    path: "/taskmanagement/taskmgmt/projects/task-project/:id/create",
    component: TMProjectSingleTaskForm,
  },
  {
    path: "/taskmanagement/taskmgmt/projects/task-project/:id",
    component: TMProjectSingleTask,
  },
  { path: "/tm/task-project/:id/task-board", component: TMProjectTaskBoard },
  { path: "/chat", component: Chat },
  { path: "/taskmanagement/taskmgmt/dashboard", component: TMDashboard },
  { path: "/taskmanagement/taskmgmt/projects", component: TMProject },
  {
    path: "/taskmanagement/taskmgmt/projects/task-project/:id/task-board",
    component: TMProjectTaskBoard,
  },

  // Transfer & Promotion
  {
    path: "/profile/transferandpromotion/transferandpromotion",
    component: TransferAndPromotion,
  },
  {
    path: "/profile/transferandpromotion/transferandpromotion/create",
    component: CreateTransferPromotion,
  },
  {
    path: "/profile/transferandpromotion/transferandpromotion/bulk-upload",
    component: BulkUploadTransferNPromotion,
  },
  {
    path: "/profile/transferandpromotion/transferandpromotion/edit/:id",
    component: CreateTransferPromotion,
  },
  {
    path: "/profile/transferandpromotion/joining",
    component: Joining,
  },
  {
    path: "/profile/transferandpromotion/joining/view/:id",
    component: ViewJoining,
  },
  {
    path: "/profile/transferandpromotion/transferandpromotion/view/:id",
    component: ViewTransferNPromotion,
  },

  // Performance & Management
  // {
  //   path: "/performancemanagementsystem/pms/dshboard",
  //   component: PmsDashboard,
  // },
  // {
  //   path: "/performancemanagementsystem/pms/strategicplan",
  //   component: StrPlan,
  // },
  // {
  //   path: "/performancemanagementsystem/pms/kpi",
  //   component: Kpis,
  // },
  // {
  //   path: "/performancemanagementsystem/pms/individualkpi",
  //   component: IndividualKpi,
  // },
  // {
  //   path: "/performancemanagementsystem/pms/individualkpi/create",
  //   component: IndKpiEntry,
  // },

  // Reward & Punishment
  {
    path: "/profile/rewardsanddisciplinary/grievance",
    component: GrievanceManagement,
  },
  {
    path: "/profile/rewardsanddisciplinary/grievance/create",
    component: GrievanceManagementCreate,
  },
  {
    path: "/profile/rewardsanddisciplinary/grievance/details/:id",
    component: GrievanceDetails,
  },
  {
    path: "/SelfService/rewardanddisciplinary/Grievance",
    component: GrievanceManagementSelf,
  },
  {
    path: "/SelfService/rewardanddisciplinary/Grievance/details/:id",
    component: GrievanceSelfDetails,
  },
  {
    path: "/SelfService/rewardanddisciplinary/Grievance/create",
    component: GrievanceSelfCreate,
  },
  {
    path: "/profile/rewardsanddisciplinary/rewardandpunishment",
    component: RewardsAndPunishmentEntry,
  },
  {
    path: "/profile/rewardsanddisciplinary/rewardandpunishment/create",
    component: RewardsAndPunishmentAdd,
  },
  {
    path: "/administration/payrollConfiguration/payrollElement/prev",
    component: PayrollElementCreate,
  },
  {
    path: "/administration/payrollConfiguration/payrollElement",
    component: PayrollElement,
  },
  {
    path: "/administration/payrollConfiguration/payScaleSetup",
    component: PayscaleLanding,
  },
  {
    path: "/administration/payrollConfiguration/jobClass",
    component: JobClassLanding,
  },
  {
    path: "/administration/payrollConfiguration/jobGrade",
    component: GradeLanding,
  },
  {
    path: "/administration/payrollConfiguration/jobLevel",
    component: JobLevelLanding,
  },
  {
    path: "/administration/payrollConfiguration/allowenceNDeductionPolicy",
    component: AllowancePolicy,
  },
  // {
  //   path: "/administration/payrollConfiguration/salaryBreakdown",
  //   component: SalaryBreakdown,
  // },
  {
    path: "/administration/payrollConfiguration/salaryBreakdown",
    component: SalaryBreakdownN,
  },
  {
    path: "/administration/payrollConfiguration/salaryBreakdown/create",
    component: PayrollGroupCreate,
  },
  {
    path: "/administration/payrollConfiguration/salaryBreakdown/edit/:id",
    component: PayrollGroupCreate,
  },
  {
    path: "/administration/payrollConfiguration/salaryBreakdown/:id",
    component: SalaryBreakdownDetails,
  },
  {
    path: "/administration/payrollConfiguration/breakdownSalaryAssign",
    component: BreakdownSalaryAssign,
  },
  // tax breakdown______________
  {
    path: "/administration/payrollConfiguration/incomeTaxGroup",
    component: TaxBreakdown,
  },
  {
    path: "/administration/payrollConfiguration/incomeTaxGroup/create",
    component: TaxGroupCreate,
  },
  {
    path: "/administration/payrollConfiguration/incomeTaxGroup/edit/:id",
    component: TaxGroupCreate,
  },
  {
    path: "/administration/payrollConfiguration/incomeTaxGroup/:id",
    component: TaxBreakdownDetails,
  },
  {
    path: "/administration/payrollConfiguration/breakdownSalaryAssign",
    component: BreakdownSalaryAssign,
  },
  {
    path: "/administration/payrollConfiguration/salaryPolicy/create",
    component: CreateSalaryPolicy,
  },
  {
    path: "/administration/payrollConfiguration/salaryPolicy/edit/:policyId",
    component: EditSalaryPolicy,
  },
  {
    path: "/administration/payrollConfiguration/salaryPolicy/:id",
    component: SalaryPolicyDetails,
  },
  {
    path: "/administration/payrollConfiguration/salaryPolicy",
    component: PolicyList,
  },
  {
    path: "/administration/payrollConfiguration/policyApply",
    component: PolicyAppliedLanding,
  },
  {
    path: "/administration/payrollConfiguration/policyApply/employeePolicyDetails/:employeeBasicInfoId/:policyId",
    component: AppliedEmployeePolicyDetails,
  },
  {
    path: "/administration/payrollConfiguration/policyApply/single",
    component: PolicyApplySingle,
  },
  {
    path: "/administration/payrollConfiguration/policyApply/bulk",
    component: PolicyApplyBulk,
  },
  {
    path: "/administration/payrollConfiguration/policyApply/reassign",
    component: PolicyReAssign,
  },
  {
    path: "/administration/payrollConfiguration/bonusSetup/edit/:id",
    component: CreateBonusSetup,
  },
  {
    path: "/administration/payrollConfiguration/bonusSetup/createPrevious",
    component: BonusSetupForm,
  },
  {
    path: "/administration/payrollConfiguration/bonusSetup/create",
    component: CreateBonusSetup,
  },
  {
    path: "/administration/payrollConfiguration/bonusSetup",
    component: BonusSetupLanding,
  },
  {
    path: "/administration/payrollConfiguration/PFAndGratuity/edit/:id",
    component: PfGratuityPolicyForm,
  },

  {
    path: "/administration/payrollConfiguration/PFAndGratuity/create",
    component: PfGratuityPolicyForm,
  },
  {
    path: "/administration/payrollConfiguration/PFAndGratuity",
    component: PfGratuityPolicy,
  },
  {
    path: "/administration/payrollConfiguration/overtimePolicyPrevious",
    component: OvertimePolicy,
  },
  // Policy Create/Landing
  {
    path: "/administration/payrollConfiguration/separationSetup",
    component: SeparationSetupLanding,
  },
  {
    path: "/administration/payrollConfiguration/overtimePolicy",
    component: OvertimePolicyN,
  },
  {
    path: "/administration/payrollConfiguration/overtimePolicy/create",
    component: CreateOvertimePolicy,
  },
  {
    path: "/administration/payrollConfiguration/overtimePolicy/edit/:id",
    component: CreateOvertimePolicy,
  },
  {
    path: "/administration/payrollConfiguration/payrollBasic/create",
    component: PayrollGrossWiseBasicForm,
  },
  {
    path: "/administration/payrollConfiguration/payrollBasic/edit/:id",
    component: PayrollGrossWiseBasicForm,
  },
  {
    path: "/administration/payrollConfiguration/payrollBasic",
    component: PayrollGrossWiseBasicLanding,
  },
  {
    path: "/administration/roleManagement/userRoleExtension/create",
    component: CreateRoleExtension,
  },
  {
    path: "/administration/roleManagement/userRoleExtension/view/:id",
    component: ViewRoleExtension,
  },
  {
    path: "/administration/roleManagement/userRoleExtension",
    component: UserRoleExtentionLanding,
  },

  // Salary assign & deduction
  {
    path: "/compensationAndBenefits/employeeSalary/allowanceNDeduction",
    component: SalaryAssignAndDeduction,
  },
  {
    path: "/compensationAndBenefits/employeeSalary/allowanceNDeduction/singleAssign/create",
    component: AddEditForm,
  },
  {
    path: "/compensationAndBenefits/employeeSalary/allowanceNDeduction/view",
    component: AddEditForm,
  },
  {
    path: "/compensationAndBenefits/employeeSalary/allowanceNDeduction/bulkAssign/create",
    component: BulkAddEditForm,
  },
  {
    path: "/compensationAndBenefits/employeeSalary/allowanceNDeduction/bulkAssignCreate",
    component: BulkAddEditFormCreate,
  },
  // report for salary certificate
  {
    path: "/compensationAndBenefits/salaryCertificate",
    component: SalaryCertificateReport,
  },
  // report for payslip
  {
    path: "/compensationAndBenefits/salaryPaySlip/payslip",
    component: SalaryPayslipReport,
  },
  {
    path: "/compensationAndBenefits/salaryPaySlip/multiplePaySlip",
    component: MultiSalaryPayslipReport,
  },
  // report for salary advice/bank advice
  {
    path: "/compensationAndBenefits/bankadvice",
    component: BankAdviceReport,
  },

  /* self module */
  {
    path: "/SelfService/separation/application/view/:id",
    component: SelfViewSeparationForm,
  },
  {
    path: "/SelfService/separation/application/edit/:id",
    component: SelfApplicationSeparationForm,
  },
  {
    path: "/SelfService/separation/application/create",
    component: SelfApplicationSeparationForm,
  },
  {
    path: "/SelfService/separation/applicationV2/create",
    component: SelfServiceSeparationForm,
  },
  {
    path: "/SelfService/separation/application",
    component: SelfSeparation,
  },
  {
    path: "/SelfService/separation/applicationV2",
    component: SelfServiceSeparation,
  },
  {
    path: "/SelfService/separation/applicationV2/interView",
    component: InterViewModal,
  },
  // Asset Management Start
  {
    path: "/SelfService/asset/assetRequisition",
    component: AssetRequisitionSelfLanding,
  },
  {
    path: "/SelfService/asset/assetRequisition/edit/:id",
    component: AssetRequisitionSelfCreate,
  },
  {
    path: "/SelfService/asset/assetRequisition/create",
    component: AssetRequisitionSelfCreate,
  },
  {
    path: "/assetManagement/registration/items",
    component: AssetItemRegistration,
  },
  {
    path: "/assetManagement/assetControlPanel/itemProfile",
    component: AssetItemProfile,
  },
  {
    path: "/assetManagement/assetControlPanel/itemProfile/create",
    component: AssetCreateItemProfile,
  },
  {
    path: "/profile/reports/monthlyLeaveReport",
    component: MonthlyLeaveReport,
  },
  {
    path: "/profile/reports/nightShiftReport",
    component: NightShiftReport,
  },
  {
    path: "/assetManagement/assetControlPanel/itemProfile/edit/:id",
    component: AssetEditItemProfile,
  },
  {
    path: "/assetManagement/assetControlPanel/registration",
    component: AssetRegistration,
  },
  {
    path: "/assetManagement/assetControlPanel/registration/create",
    component: AssetRegistrationCreate,
  },
  {
    path: "/assetManagement/assetControlPanel/registration/edit/:id",
    component: AssetRegistrationEdit,
  },
  {
    path: "/assetManagement/assetControlPanel/assign",
    component: AssetAssign,
  },
  {
    path: "/assetManagement/assetControlPanel/assign/create",
    component: AssetAssignCreate,
  },
  {
    path: "/assetManagement/assetControlPanel/depreciation",
    component: AssetDepreciation,
  },
  {
    path: "/assetManagement/assetControlPanel/depreciation/create",
    component: AssetDepreciationCreate,
  },
  {
    path: "/assetManagement/assetControlPanel/assetReport",
    component: AssetReport,
  },
  {
    path: "/assetManagement/assetControlPanel/maintenance/assetReceiveDetails/:id",
    component: AssetReceiveDetails,
  },
  {
    path: "/assetManagement/assetControlPanel/maintenance/create",
    component: AssetMaintenanceCreate,
  },
  {
    path: "/assetManagement/assetControlPanel/maintenance",
    component: AssetMaintenance,
  },
  {
    path: "/assetManagement/assetControlPanel/assetDisposal",
    component: AssetDisposal,
  },
  {
    path: "/assetManagement/assetControlPanel/assetDisposal/create",
    component: AssetDisposalCreate,
  },
  {
    path: "/assetManagement/registration/assets/edit/:id",
    component: AssetApplicationCreate,
  },
  {
    path: "/assetManagement/registration/assets/create",
    component: AssetApplicationCreate,
  },
  {
    path: "/assetManagement/registration/assets",
    component: AssetApplication,
  },
  {
    path: "/assetManagement/assetAssign/directAssign/edit/:id",
    component: DirectAssetAssignCreate,
  },
  {
    path: "/assetManagement/assetAssign/directAssign/create",
    component: DirectAssetAssignCreate,
  },
  {
    path: "/assetManagement/assetAssign/directAssign",
    component: DirectAssetAssignLanding,
  },
  {
    path: "/assetManagement/assetAssign/requisition Assign",
    component: RequisitionAssign,
  },
  {
    path: "/assetManagement/assetAssign/assetTransfer/edit/:id",
    component: AssetTransferCreate,
  },
  {
    path: "/assetManagement/assetAssign/assetTransfer/create",
    component: AssetTransferCreate,
  },
  {
    path: "/assetManagement/assetAssign/assetTransfer",
    component: AssetTransferLanding,
  },
  {
    path: "/SelfService/asset/assetList",
    component: AssetList,
  },
  {
    path: "/approval/assetApproval",
    component: AssetApproval,
  },
  {
    path: "/approval/assetTransferApproval",
    component: AssetTransferApproval,
  },
  {
    path: "/approval/incrementproposalapproval",
    component: IncrementProposalApproval,
  },
  // Asset Management end

  //  Trainnning and development starts
  {
    path: "/trainingAndDevelopment/training/schedule",
    component: TrainingScheduleLanding,
  },
  {
    path: "/trainingAndDevelopment/training/schedule/view/:id",
    component: ViewTrainingScheduleDetails,
  },
  {
    path: "/trainingAndDevelopment/training/schedule/create",
    component: CreateEditSchedule,
  },
  {
    path: "/trainingAndDevelopment/training/schedule/edit/:id",
    component: CreateEditSchedule,
  },
  {
    path: "/trainingAndDevelopment/training/requisition",
    component: RequisitionLanding,
  },
  {
    path: "/trainingAndDevelopment/training/requisition/view/:id",
    component: RequisitionDetails,
  },
  // {
  //   path: "/trainingAndDevelopment/training/attendance",
  //   component: TrainingAttendanceLanding,
  // },
  // {
  //   path: "/trainingAndDevelopment/training/attendance/view/:id",
  //   component: AttendanceView,
  // },
  // Training & Development New
  {
    path: "/trainingAndDevelopment/trainingRequisition",
    component: TnDRequisitionLanding,
  },
  {
    path: "/SelfService/traininganddevelopment/trainingRequisition",
    component: TnDRequisitionLanding,
  },
  {
    path: "/trainingAndDevelopment/requisition/:type",
    component: TnDRequisitionCreateEdit,
  },
  {
    path: "/SelfService/traininganddevelopment/trainingRequisition/:type",
    component: TnDRequisitionCreateEdit,
  },
  {
    path: "/trainingAndDevelopment/trainingPlan",
    component: TnDPlanningLanding,
  },
  {
    path: "/trainingAndDevelopment/planning/:type",
    component: TnDPlanningCreateEdit,
  },
  {
    path: "/trainingAndDevelopment/configuration/trainingTypes",
    component: TrainingType,
  },
  {
    path: "/trainingAndDevelopment/configuration/trainingTitle",
    component: TrainingTitle,
  },
  {
    path: "/trainingAndDevelopment/configuration/trainingCostType",
    component: TrainingCost,
  },
  {
    path: "/trainingAndDevelopment/configuration/trainerInformation",
    component: TrainerInfo,
  },
  {
    path: "/trainingAndDevelopment/dashboard",
    component: TnDDashboard,
  },
  {
    path: "/trainingAndDevelopment/reports/trainingCalendar",
    component: TrainingCalender,
  },
  {
    path: "/SelfService/traininganddevelopment/trainingCalander",
    component: TrainingCalender,
  },
  {
    path: "/trainingAndDevelopment/training/attendance",
    component: TnDAttendanceSave,
  },
  {
    path: "/trainingAndDevelopment/training/assessment",
    component: TnDAssessment,
  },
  {
    path: "/trainingAndDevelopment/training/feedback",
    component: TnDFeedback,
  },
  {
    path: "/trainingAndDevelopment/reports/trainingInventory",
    component: TnDInventory,
  },
  {
    path: "/trainingAndDevelopment/reports/trainingInventory/details",
    component: TnDInventoryDetails,
  },
  // Trainnning and development ends

  //external training start
  {
    path: "/trainingAndDevelopment/training/externalTraining/edit/:id",
    component: ExternalTrainingCreate,
  },
  {
    path: "/trainingAndDevelopment/training/externalTraining/create",
    component: ExternalTrainingCreate,
  },
  {
    path: "/trainingAndDevelopment/training/externalTraining",
    component: ExternalTrainingLanding,
  },
  //external training end

  {
    path: "/trainingAndDevelopment/assessment/assessmentForm",
    component: AssessmentFormLanding,
    // component: AssessmentFormDetailsLanding,
  },
  {
    path: "/trainingAndDevelopment/assessment/assessmentForm/view/:id",
    component: AssessmentFormDetailsLanding,
  },
  {
    path: "/trainingAndDevelopment/assessment/assessmentForm/:crudStatus/:status/:scheduleId",
    component: AssessmentCreateEdit,
  },
  {
    path: "/test/submission",
    component: SubmissionDetails,
  },
  {
    path: "/administration/configuration/latepunishmentpolicy",
    component: LatePunishmentPolicy,
  },
  {
    path: "/profile/customReportsBuilder/letterConfiguration",
    component: LetterConfigLanding,
  },
  {
    path: "/profile/customReportsBuilder/letterConfiguration/createLetter",
    component: LetterConfigAddEdit,
  },
  {
    path: "/profile/customReportsBuilder/letterConfiguration/createLetter/:letterId",
    component: LetterConfigAddEdit,
  },
  {
    path: "/profile/customReportsBuilder/letterGenerate",
    component: LetterGenerateLanding,
  },
  {
    path: "/profile/customReportsBuilder/letterGenerate/generateLetter",
    component: LetterGenAddEdit,
  },
  {
    path: "/profile/customReportsBuilder/letterGenerate/generateLetter/:letterId",
    component: LetterGenAddEdit,
  },
  {
    path: "/profile/rewardAndPunishment",
    component: RewardPunishmentLanding,
  },
  {
    path: "/profile/rewardAndPunishment/letterGenerate",
    component: RewardPunishmentLetterGenAddEdit,
  },
  {
    path: "/profile/customReportsBuilder/punishmentAction/:recordId",
    component: PunishmentAction,
  },

  // Exit Interview starts

  {
    path: "/profile/exitInterview/questionCreation",
    component: QuestionCreationLanding,
  },
  {
    path: "/profile/exitInterview/questionCreation/create",
    component: QuestionCreationAddEdit,
  },
  {
    path: "/profile/exitInterview/questionCreation/edit/:quesId",
    component: QuestionCreationAddEdit,
  },

  {
    path: "/profile/exitInterview/questionerConfigure",
    component: QuestionerConfigLanding,
  },
  {
    path: "/profile/exitInterview/questionerAssign",
    component: QuestionerAssignLanding,
  },
  {
    path: "/SelfService/exitInterview",
    component: EssInterviewLanding,
  },
  {
    path: "/profile/exitInterview/interview",
    component: EmInterviewLanding,
  },
  {
    path: "/interview",
    component: InterviewModal,
  },

  // task management
  {
    path: "/profile/taskManagement",
    component: ManagementTaskManagement,
  },
  {
    path: "/profile/taskManagement/create",
    component: ManagementCreateTask,
  },
  {
    path: "/profile/taskManagement/view/:id",
    component: ManagementViewTask,
  },
  // pms-----------------------------------------------------------------------////////////////////////////////////////////
  {
    path: "/pms/targetsetup/EmployeeTarget",
    component: Individualtarget,
  },
  {
    path: "/pms/targetsetup/EmployeeTarget/edit/:empId",
    component: IndividualtargetView,
  },
  {
    path: "/pms/targetsetup/EmployeeTarget/view/:empId",
    component: IndividualtargetView,
  },
  // {
  //   path: "/pms/targetsetup/DeptTarget/create",
  //   component: CreateEditDeptTarget,
  // },
  {
    path: "/pms/targetsetup/DeptTarget",
    component: DepartmentaltargetSetupLanding,
  },
  // {
  //   path: "/pms/targetsetup/SBUTarget/create",
  //   component: CreateSBUTarget,
  // },
  // {
  //   path: "/pms/targetsetup/SBUTarget",
  //   component: SBUTargetLanding,
  // },
  {
    path: "/pms/targetsetup/SBUTarget",
    component: SbuTargetSetupLanding,
  },

  {
    path: "/pms/targetsetup/CopyKPI",
    component: CopyKpi,
  },
  {
    path: "/pms/targetsetup/EmployeeTarget",
    component: Individualtarget,
  },
  {
    path: "/pms/targetsetup/EmployeeTarget/edit/:empId",
    component: IndividualtargetView,
  },
  {
    path: "/pms/targetsetup/EmployeeTarget/view/:empId",
    component: IndividualtargetView,
  },
  // {
  //   path: "/pms/targetsetup/DeptTarget/create",
  //   component: CreateEditDeptTarget,
  // },
  {
    path: "/pms/targetsetup/DeptTarget",
    component: DepartmentaltargetSetupLanding,
  },
  // {
  //   path: "/pms/targetsetup/SBUTarget/create",
  //   component: CreateSBUTarget,
  // },
  // {
  //   path: "/pms/targetsetup/SBUTarget",
  //   component: SBUTargetLanding,
  // },
  {
    path: "/pms/targetsetup/SBUTarget",
    component: SbuTargetSetupLanding,
  },

  {
    path: "/pms/targetsetup/CopyKPI",
    component: CopyKpi,
  },
  {
    path: "/pms/configuration/EvaluationCriteria/edit/:id",
    component: EvaluationCriteriaCreateEdit,
  },
  {
    path: "/pms/configuration/EvaluationCriteria/create",
    component: EvaluationCriteriaCreateEdit,
  },
  {
    path: "/pms/configuration/EvaluationCriteria",
    component: EvaluationCriteria,
  },
  {
    path: "/pms/configuration/BehavioralFactor",
    component: BehavioralFactor,
  },
  {
    path: "/pms/configuration/objective",
    component: PMSObjective,
  },
  {
    path: "/pms/configuration/objective/create",
    component: ObjectiveCreateAndEdit,
  },
  {
    path: "/pms/configuration/objective/edit",
    component: ObjectiveCreateAndEdit,
  },
  {
    path: "/pms/configuration/deptkpimapping",
    component: DeptKpiMapping,
  },
  {
    path: "/pms/configuration/deptkpimapping/create",
    component: DeptKpiCreateAndEdit,
  },
  {
    path: "/pms/configuration/deptkpimapping/edit",
    component: DeptKpiCreateAndEdit,
  },
  {
    path: "/pms/configuration/subkpimapping",
    component: SbuKpiMapping,
  },
  {
    path: "/pms/configuration/subkpimapping/create",
    component: SbuKpiCreateAndEdit,
  },
  {
    path: "/pms/configuration/subkpimapping/edit",
    component: SbuKpiCreateAndEdit,
  },
  {
    path: "/pms/report/performanceDialogReport",
    component: PerformanceDialogReport,
  },
  {
    path: "/pms/report/performanceEvalutationReport",
    component: PerformanceEvaluationReport,
  },
  {
    path: "/pms/report/idpreport",
    component: IDPReport,
  },
  {
    path: "/pms/report/PerformanceReport",
    component: PerformanceReport,
  },
  {
    path: "/pms/report/PerformanceMarking/view",
    component: PerformanceMarkingView,
  },
  {
    path: "/pms/report/PerformanceMarking",
    component: PerformanceMarking,
  },
  {
    path: "/pms/report/KPITargetMismatchReport",
    component: KpiTargetMismatchReport,
  },
  {
    path: "/performancemanagementsystem/pms/strategicplan",
    component: StrPlan,
  },
  // {
  //   path: "/pms/configuration/corevalues",
  //   component: CoreValues,
  // },
  // {
  //   path: "/pms/configuration/corecompetency",
  //   component: CoreCompetencies,
  // },
  {
    path: "/pms/configuration/role",
    component: EmployeeRole,
  },
  // {
  //   path: "/pms/configuration/kpimapping",
  //   component: KpiMapping,
  // },
  {
    path: "/pms/configuration/kpimapping",
    component: IndividualKpiMapping,
  },
  {
    path: "/pms/configuration/kpis",
    component: Kpis,
  },
  {
    path: "/pms/configuration/RoleWiseJDSpec",
    component: RoleWiseJDandSpecification,
  },
  {
    path: "/pms/configuration/kpimapping/employeeWise/create",
    component: EmployeeWiseMapping,
  },
  {
    path: "/pms/configuration/kpimapping/employeeWise/edit/:id",
    component: EmployeeWiseMapping,
  },
  {
    path: "/pms/configuration/kpimapping/departmentWise/create",
    component: DepartmentWiseMapping,
  },
  {
    path: "/pms/configuration/kpimapping/departmentWise/edit/:id",
    component: DepartmentWiseMapping,
  },
  {
    path: "/pms/configuration/kpimapping/designationWise/create",
    component: DesignationWiseMapping,
  },
  {
    path: "/pms/configuration/kpimapping/designationWise/edit/:id",
    component: DesignationWiseMapping,
  },
  {
    path: "/pms/configuration/kpis/create",
    component: CreateKPI,
  },
  {
    path: "/pms/configuration/kpis/edit/:id",
    component: CreateKPI,
  },
  {
    path: "/pms/performanceAssessment/assessmentByHr",
    component: AssessmentByHR,
  },
  // {
  //   path: "/pms/valuesAndCompetencies/assessmentByHr",
  //   component: AssessmentByHR,
  // },
  {
    path: "/pms/performanceAssessment/supervisorAssessment/new",
    component: SupervisorAssessment,
  },
  {
    path: "/pms/performanceAssessment/supervisorAssessment",
    component: SupervisorAssessmentLanding,
  },
  {
    path: "/pms/performanceAssessment/BARAssessment/evaluationBSCForSupervisor/:id/:yearId/:quarterId",
    component: SupervisorAssessmentNew,
  },
  {
    path: "/pms/performanceAssessment/BARAssessment/evaluationForSupervisor/:id/:yearId/:quarterId",
    component: BarAssessmentEvaluationForSupervisor,
  },
  {
    path: "/pms/performanceAssessment/BARAssessment/evaluation/:id/:yearId/:quarterId",
    component: BarAssesmentEvaluation,
  },
  {
    path: "/pms/performanceAssessment/BARAssessment",
    component: BarAssesment,
  },
  // {
  //   path: "/pms/valuesAndCompetencies/supervisorAssessment",
  //   component: SupervisorAssessment,
  // },
  // {
  //   path: "/pms/valuesAndCompetencies/selfAssessment",
  //   component: SelfAssessment,
  // },
  {
    path: "/pms/performanceAssessment/selfAssessment/new",
    component: SelfAssessment,
  },
  {
    path: "/pms/performanceAssessment/selfAssessment",
    component: SelfAssessmentNew,
  },
  {
    path: "/pms/9BoxGrid",
    component: NineBoxGrid,
  },
  {
    path: "/performancemanagementsystem/pms/individualkpi",
    component: IndividualKpi,
  },
  {
    path: "/performancemanagementsystem/pms/individualkpi/create",
    component: IndKpiEntry,
  },
  {
    path: "/pms/performancePlanning/workPlan",
    component: WorkPlan,
  },
  {
    path: "/pms/performancePlanning/individualKpiEntry",
    component: IndividualKpiEntry,
  },
  // {
  //   path: "/pms/performancePlanning/individualKpiResult",
  //   component: IndividualKpiResult,
  // },
  {
    path: "/pms/performancePlanning/individualKpiResult",
    component: IndividualKpiEntrySelf,
  },
  {
    path: "/pms/performancePlanning/DepartmentalKPIEntry",
    component: DepartmentalKpiEntry,
  },
  {
    path: "/pms/performancePlanning/SBUKPIEntry",
    component: SbuKpiEntry,
  },
  {
    path: "/pms/performancePlanning/individualScorecard",
    component: IndividualScoreCard,
  },

  {
    path: "/pms/performancePlanning/eisenhowerMatrix",
    component: EisenhowerMatrix,
  },
  {
    path: "/pms/performancePlanning/actionPlan",
    component: ActionPlanCreate,
  },
  {
    path: "/pms/performancePlanning/BARAssessConfig",
    component: BarAssesmentConfig,
  },
  {
    path: "/pms/performanceCoaching/johariWindow",
    component: JohariWindow,
  },
  {
    path: "/pms/performanceCoaching/actionPlanJohariWindow",
    component: ActionPlanJohariWindow,
  },
  {
    path: "/pms/performanceCoaching/growModel",
    component: GrowthModel,
  },
  {
    path: "/pms/performanceCoaching/actionPlanGROWModel",
    component: ActionPlanGrowModelLanding,
  },
  {
    path: "/pms/idp",
    component: IDP,
  },

  // Exit Interview ends

  /* all module should be placed top of this */
  { path: "/components/form-control", component: FormControl },
  { path: "/components/sliders", component: Sliders },
  { path: "/components/dialogs", component: DialogsModule },
  { path: "/components/selection", component: SelectionModule },
  { path: "/components/data-grid", component: DataGridModule },
  { path: "/components/joblist", component: JobListLanding },
  { path: "/components/stepper", component: CustomizedSteppers },
  { path: "/components/pipeline-card", component: PipelineCard },
  { path: "/components/dnd", component: DragAndDropModule },
  { path: "/components/pipeline-heading", component: Heading },
  { path: "/components/calender", component: CalenderModule },
  { path: "/components/dashboard", component: NewDashboard },
  { path: "/components/gridDataTable", component: DataGridLanding },
  { path: "/components/list", component: ComponentList },
  { path: "/components/masterReport", component: CustomReport },
  { path: "/components/masterReport2", component: CustomReport2 },

  { path: "/components/test", component: Test },
  {
    path: "/administration/timeManagement/flexibleTimesheet",
    component: FlexibleTimeSheet,
  },

  // Retirement Routes
  {
    path: "/retirement/separation",
    component: Separation,
  },
  {
    path: "/retirement/separation/create",
    component: SeparationApplicationForm,
  },
  {
    path: "/retirement/separation/edit/:id",
    component: SeparationApplicationForm,
  },
  {
    path: "/retirement/separation/release/:id",
    component: RetirementReleaseSeparationForm,
  },
];

// Those hidden menu just use for develper
//http://localhost:3013/profile/timeManagement/attendanceRawDataProcess
