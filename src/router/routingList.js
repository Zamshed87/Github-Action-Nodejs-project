import EmployeeDivision from "modules/configuration/EmployeeDivision/EmployeeDivision";
import { lazy } from "react";

const MultiCalendarAssign = lazy(() =>
  import("modules/TimeManagement/MultiCalendarAssign/MultiCalendarAssign")
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
const MarketVistApproval = lazy(() =>
  import("../modules/marketVisit/approval/index.jsx")
);
const RequisitionApproval = lazy(() =>
  import("../modules/trainingDevelopment/requisition/approval/index.jsx")
);
const MonthlyPunchReportDetails = lazy(() =>
  import(
    "../modules/employeeProfile/Reports/monthlyPunchDetailsReport/index.jsx"
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
const AdditonDeductionCreate = lazy(() =>
  import(
    "../modules/CompensationBenefits/employeeSalary/additionDeduction/create/index.jsx"
  )
);
const AdditionDeduction = lazy(() =>
  import(
    "../modules/CompensationBenefits/employeeSalary/additionDeduction/index.jsx"
  )
);
// const EmployeeSalaryApproval = lazy(() =>
//   import("../modules/CompensationBenefits/employeeSalary/approval")
// );
const CommonSalaryTable = lazy(() =>
  import(
    "../modules/CompensationBenefits/employeeSalary/commonSalaryTable/index.jsx"
  )
);
const SalaryAssign = lazy(() =>
  import("../modules/CompensationBenefits/employeeSalary/salaryAssign/index.js")
);
const SalaryHold = lazy(() =>
  import("../modules/CompensationBenefits/employeeSalary/salaryHold/index.js")
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
const CreateSingleIncrement = lazy(() =>
  import(
    "../modules/CompensationBenefits/Increment/singleIncement/components/createEditSingleIncrement.jsx"
  )
);
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
const CashDisbursementRegister = lazy(() =>
  import(
    "../modules/CompensationBenefits/reports/cashDisbursmentRegister/index.js"
  )
);
const GoForPrintSalary = lazy(() =>
  import(
    "../modules/CompensationBenefits/reports/DeptWiseSalary/components/GoForPrint.jsx"
  )
);
const DeptWiseSalary = lazy(() =>
  import("../modules/CompensationBenefits/reports/DeptWiseSalary/index.jsx")
);
const PfLedger = lazy(() =>
  import("../modules/CompensationBenefits/reports/pfLedger/index.js")
);
const SalaryDetailsReport = lazy(() =>
  import(
    "../modules/CompensationBenefits/reports/salaryDetailsReport/index.jsx"
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
const TaxSlip = lazy(() =>
  import("../modules/CompensationBenefits/reports/taxSlip/index.js")
);
const BulkAddEditForm = lazy(() =>
  import(
    "../modules/CompensationBenefits/salaryAssignAndDeduction/addEditFile/bulkCreateIndex.jsx"
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
const EligibleEmpList = lazy(() =>
  import("../modules/CompensationBenefits/tax/eligibleEmpList/index.js")
);
const ProvisionAmountCalc = lazy(() =>
  import("../modules/CompensationBenefits/tax/provisionAmountCalc/index.js")
);
const TaxCalc = lazy(() =>
  import("../modules/CompensationBenefits/tax/taxCalc/index.js")
);
const TaxDeduction = lazy(() =>
  import("../modules/CompensationBenefits/tax/taxDeduction/index.js")
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
const BankBranch = lazy(() =>
  import("../modules/configuration/bankBranch/index.jsx")
);
const BusinessUnit = lazy(() =>
  import("../modules/configuration/busisnessUnit/index.jsx")
);
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
const Department = lazy(() =>
  import("../modules/configuration/department/index.jsx")
);
const DocumentType = lazy(() =>
  import("../modules/configuration/documentType/index.jsx")
);
const EmploymentTypeCreate = lazy(() =>
  import("../modules/configuration/employmentType/index.jsx")
);
const ExpenseTypeCreate = lazy(() =>
  import("../modules/configuration/expenseType/index.jsx")
);
const FeatureGroup = lazy(() =>
  import("../modules/configuration/featureGroup/index.jsx")
);
const HRPosition = lazy(() =>
  import("../modules/configuration/hrPosition/index.jsx")
);
const LoanTypeCreate = lazy(() =>
  import("../modules/configuration/loanType/index.jsx")
);
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
const OrgBankDetailsLanding = lazy(() =>
  import("../modules/configuration/orgBankDetails/index.jsx")
);
const PayScaleGrade = lazy(() =>
  import("../modules/configuration/payScaleGrade/index.jsx")
);
const Religion = lazy(() =>
  import("../modules/configuration/religion/index.jsx")
);
const SBUUnit = lazy(() =>
  import("../modules/configuration/sbuUnit/index.jsx")
);
const SeparationType = lazy(() =>
  import("../modules/configuration/separationType/index.jsx")
);
const TaxChallanConfigLanding = lazy(() =>
  import("../modules/configuration/taxChallanConfig/index.jsx")
);
const UserGroup = lazy(() =>
  import("../modules/configuration/userGroup/index.jsx")
);
const CreateUser = lazy(() =>
  import("../modules/configuration/userInfo/createUser/index.js")
);
const UserInfo = lazy(() =>
  import("../modules/configuration/userInfo/index.jsx")
);
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
const Workplace = lazy(() =>
  import("../modules/configuration/workplace/index.jsx")
);
const AboutMe = lazy(() => import("../modules/employeeProfile/aboutMe"));
const GoForPrint = lazy(() =>
  import("../modules/employeeProfile/aboutMe/GoForPrint/GoForPrint.jsx")
);
const PrintPreview = lazy(() =>
  import("../modules/employeeProfile/aboutMe/GoForPrint/PrintPreview.jsx")
);
const CommonAppPipeline = lazy(() =>
  import("../modules/employeeProfile/AppPipeline/index.jsx")
);
const EmAttendenceAdjust = lazy(() =>
  import("../modules/employeeProfile/attendenceAdjust/index.jsx")
);
const BulkEmployeeCreate = lazy(() =>
  import("../modules/employeeProfile/bulkEmployeeCreate/index.jsx")
);
const BulkUploadEntry = lazy(() =>
  import("../modules/employeeProfile/bulkUpload/index.jsx")
);
const BulkUploadHistory = lazy(() =>
  import("../modules/employeeProfile/bulkUploadHistory/index.jsx")
);
const Confirmation = lazy(() =>
  import("../modules/employeeProfile/confirmation/index.jsx")
);
const ContactBook = lazy(() =>
  import("../modules/employeeProfile/contactBook/index.jsx")
);
const ContactClosingReport = lazy(() =>
  import("../modules/employeeProfile/contractClosing/index.jsx")
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
  import("../modules/employeeProfile/inactiveEmployees/index.jsx")
);
const JobConfirmationReport = lazy(() =>
  import("../modules/employeeProfile/jobConfirmation/index.jsx")
);
const EmLeaveApplication = lazy(() =>
  import("../modules/employeeProfile/leaveApplication/index.jsx")
);
const EmLoanApplication = lazy(() =>
  import("../modules/employeeProfile/LoanApplication/index.jsx")
);
const EmMovementApplication = lazy(() =>
  import("../modules/employeeProfile/movementApplication/index.jsx")
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
  import("../modules/employeeProfile/Reports/employeeJobCard/index.jsx")
);
const EmpOverallStaus = lazy(() =>
  import("../modules/employeeProfile/Reports/EmployeeOverallStatus/index.jsx")
);
const EmLeaveHistory = lazy(() =>
  import("../modules/employeeProfile/Reports/leaveHistory/index.js")
);
const EmLeaveReportPrint = lazy(() =>
  import("../modules/employeeProfile/Reports/leaveHistory/LeaveReportPrint.jsx")
);
const EmLoanHistory = lazy(() =>
  import("../modules/employeeProfile/Reports/LoanHistory/index.jsx")
);
const EmLoanReportPrint = lazy(() =>
  import("../modules/employeeProfile/Reports/LoanHistory/LoanReportPrint.jsx")
);
const EmMovementHistory = lazy(() =>
  import("../modules/employeeProfile/Reports/movementHistory/index.js")
);
const EmMovementReportPrint = lazy(() =>
  import(
    "../modules/employeeProfile/Reports/movementHistory/MovementReportPrint.jsx"
  )
);
const EmOverTimeReport = lazy(() =>
  import("../modules/employeeProfile/Reports/overTimeReport")
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
  import("../modules/employeeProfile/separation/report/index.jsx")
);
const SelfApplicationSeparationForm = lazy(() =>
  import(
    "../modules/employeeProfile/separation/selfApplication/addEditForm/index.jsx"
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
  import("../modules/FoodDetailsReport/index.jsx")
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
const AdjustmentIOUReport = lazy(() =>
  import("../modules/iouManagement/adjustmentIOUReport/index.jsx")
);
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
const MgtExpenseApplication = lazy(() =>
  import("../modules/iouManagement/mgtExpense/expenseApplication/index.jsx")
);
const MgtExpenseApplicationView = lazy(() =>
  import("../modules/iouManagement/mgtExpense/expenseApplication/viewForm.jsx")
);
const MgtIOUApplicationCreate = lazy(() =>
  import("../modules/iouManagement/mgtIOUApplication/addEditForm.jsx")
);
const MgtIOUApplication = lazy(() =>
  import("../modules/iouManagement/mgtIOUApplication/index.jsx")
);
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
const LeaveTypeCreate = lazy(() =>
  import("../modules/leaveMovement/configuration/LeaveType/index.jsx")
);
const MovementType = lazy(() =>
  import("../modules/leaveMovement/configuration/MovementType/index.jsx")
);
const YearlyLeavePolicy = lazy(() =>
  import("../modules/leaveMovement/configuration/YearlyLeavePolicy/index.jsx")
);
const LeaveApplication = lazy(() =>
  import("../modules/leaveMovement/leave/application/index.jsx")
);
const LeaveApproval = lazy(() =>
  import("../modules/leaveMovement/leave/approval/index.jsx")
);
const LeaveEncashment = lazy(() =>
  import("../modules/leaveMovement/leave/leaveEncashment/index.jsx")
);
const LeaveEncashmentApproval = lazy(() =>
  import("../modules/leaveMovement/leave/leaveEncashmentApproval/index.jsx")
);
const MovementApplication = lazy(() =>
  import("../modules/leaveMovement/movement/movementApplication/index.jsx")
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
const LoanType = lazy(() =>
  import("../modules/loanManagement/loan/loanType/index.js")
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
  import("../modules/PayrollManagementSytem/PayrollElement/index.jsx")
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
const PmsDashboard = lazy(() => import("../modules/pms/dashboard/index.jsx"));
const IndividualKpi = lazy(() => import("../modules/pms/indKpi/index.jsx"));
const IndKpiEntry = lazy(() => import("../modules/pms/indKpi/IndKpiEntry.jsx"));
const Kpis = lazy(() => import("../modules/pms/kpis/index.jsx"));
const StrPlan = lazy(() => import("../modules/pms/strPlan/index.jsx"));
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
const AttendanceApprovalRequest = lazy(() =>
  import("../modules/timeSheet/attendence/attendanceApprovalRequest/index.jsx")
);
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
  import("../modules/timeSheet/reports/attendanceReport/index.jsx")
);
const EmployeeList = lazy(() =>
  import("../modules/timeSheet/reports/employeeList/index.jsx")
);
const ExpenseReport = lazy(() =>
  import("../modules/timeSheet/reports/expenseReport/index.jsx")
);
const MgmtDailyAttendance = lazy(() =>
  import("../modules/timeSheet/reports/mgmtDailyAttendance/index.js")
);
const RosterDetails = lazy(() =>
  import("../modules/timeSheet/reports/rosterDetails/index.jsx")
);
const RosterReportPrint = lazy(() =>
  import("../modules/timeSheet/reports/rosterDetails/RosterReportPrint.jsx")
);

const RosterReport = lazy(() =>
  import("../modules/timeSheet/reports/rosterReport/index.jsx")
);
const MonthlyInOutReport = lazy(() =>
  import("../modules/timeSheet/reports/monthlyInOutReport/index.jsx")
);
const MonthlyAttendanceReport = lazy(() =>
  import("../modules/timeSheet/reports/monthlyAttendanceReport/index.jsx")
);
const EmployeesShift = lazy(() =>
  import("../modules/timeSheet/reports/employeesShift/index.jsx")
);
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
const Designation = lazy(() =>
  import("./../modules/configuration/designation/index")
);
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
const SalaryBreakdown = lazy(() =>
  import("./../modules/PayrollManagementSytem/SalaryBreakdown/index.jsx")
);
const DailyAttendenceReport = lazy(() =>
  import("./../modules/timeSheet/reports/dailyAttendance/Landing/index")
);
const MgmtInOutReport = lazy(() =>
  import("../modules/timeSheet/reports/invalidInOutReport/index.js")
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
    path: "/profile/reports/inactiveEmployees",
    component: ActiveInactiveEmployeeReport,
  },
  {
    path: "/profile/employee/go-for-print/print-preview",
    component: PrintPreview,
  },
  {
    path: "/profile/employee/go-for-print/:empId",
    component: GoForPrint,
  },

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
  { path: "/profile/reports/separationReport", component: SeparationReport },
  {
    path: "/profile/reports/separationReport/print",
    component: SeparationReportPrintPage,
  },
  //separation end
  { path: "/profile/attendenceAdjust", component: EmAttendenceAdjust },
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
    path: "/administration/configuration/commonapprovalpipeline",
    component: CommonAppPipeline,
  },
  // {
  //   path: "/profile/traininganddevelopment/trainingrequisition",
  //   component: TrainingRequisition,
  // },
  // {
  //   path: "/administration/trainingAndDevelopment/list",
  //   component: List,
  // },
  // {
  //   path: "/administration/trainingAndDevelopment/organization",
  //   component: Organization,
  // },
  // {
  //   path: "/administration/trainingAndDevelopment/category",
  //   component: Category,
  // },
  // {
  //   path: "/administration/trainingAndDevelopment/venue",
  //   component: Venue,
  // },
  // {
  //   path: "/SelfService/traininganddevelopment/trainingevaluation",
  //   component: TrainingEvaluation,
  // },
  // {
  //   path: "/SelfService/traininganddevelopment/trainingRequisition",
  //   component: TrainingRequisitionSelf,
  // },
  // {
  //   path: "/profile/traininganddevelopment/trainingschedule",
  //   component: TrainingSchedule,
  // },
  // {
  //   path: "/administration/trainingAndDevelopment/list/create",
  //   component: AddForm,
  // },
  // {
  //   path: "/profile/traininganddevelopment/trainingschedule/create",
  //   component: ScheduleModal,
  // },
  // //new training & development
  // {
  //   path: "/profile/traininganddevelopment/budget",
  //   component: Budget,
  // },
  // {
  //   path: "/profile/traininganddevelopment/budget/create",
  //   component: CreateTrainingBudget,
  // },
  // {
  //   path: "/profile/traininganddevelopment/application",
  //   component: TrainingApplication,
  // },
  // {
  //   path: "/SelfService/traininganddevelopment/application",
  //   component: TrainingApplicationSelf,
  // },
  // {
  //   path: "/profile/traininganddevelopment/application/create",
  //   component: TrainingApplicationCreate,
  // },
  // {
  //   path: "/SelfService/traininganddevelopment/application/self-create",
  //   component: TrainingApplicationCreateSelf,
  // },
  // {
  //   path: "/profile/traininganddevelopment/calendarbooking",
  //   component: CalenderBooking,
  // },
  { path: "/profile/leaveApplication", component: EmLeaveApplication },
  { path: "/profile/movementApplication", component: EmMovementApplication },
  { path: "/profile/loanRequest", component: EmLoanApplication },

  { path: "/profile/confirmation", component: Confirmation },
  {
    path: "/profile/cafeteriaManagement/foodCorner",
    component: FoodCornerForAll,
  },
  {
    path: "/profile/cafeteriaManagement/detailsReport",
    component: FoodDetailsReport,
  },
  //PF Management start for selfService
  {
    path: "/SelfService/pfmanagement",
    component: PFSelfLanding,
  },
  //PF Management start for selfService
  {
    path: "/profile/iOU/application/create",
    component: MgtIOUApplicationCreate,
  },
  {
    path: "/profile/iOU/application/edit/:id",
    component: MgtIOUApplicationCreate,
  },
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
    component: MgtIOUApplication,
  },
  {
    path: "/profile/iOU/adjustmentReport/:id",
    component: AdjustmentIOUReportView,
  },
  {
    path: "/profile/iOU/adjustmentReport",
    component: AdjustmentIOUReport,
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
    path: "/profile/reports/dailyAttendanceReport",
    component: MgmtDailyAttendance,
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
    path: "/profile/reports/jobcard",
    component: EmployeeJobCard,
  },
  {
    path: "/profile/reports/empOverallStatus",
    component: EmpOverallStaus,
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
    component: MgtExpenseApplication,
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
  { path: "/administration/roleManagement/usersInfo", component: UserInfo },
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
    path: "/administration/roleManagement/userRole",
    component: UserRole,
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
  { path: "/administration/loanManagement/loanType", component: LoanType },
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
    path: "/administration/configuration/managementDashboardPermission/view/:id",
    component: ManagementDashboardPermissionDetails,
  },
  {
    path: "/administration/configuration/employeeDivision",
    component: EmployeeDivision,
  },
  { path: "/SelfService/dashboard", component: SelfDashboard },
  { path: "/SelfService/aboutMe", component: AboutMe },
  {
    path: "/profile/timemanagement/attendenceadjust",
    component: AttendenceAdjust,
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
  {
    path: "/SelfService/timeManagement/attendenceAdjustRequest",
    component: AttendanceApprovalRequest,
  },
  {
    path: "/SelfService/timeManagement/overTimeRequisition",
    component: OverTimeRequisition,
  },
  {
    path: "/SelfService/leaveAndMovement/leaveApplication",
    component: LeaveApplication,
  },
  {
    path: "/SelfService/leaveAndMovement/leaveEncashment",
    component: LeaveEncashment,
  },
  {
    path: "/SelfService/leaveAndMovement/movementApplication",
    component: MovementApplication,
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
  {
    path: "/approval",
    component: ApprovalList,
  },
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
    component: Application,
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
    path: "/compensationAndBenefits/incometaxmgmt/taxassign",
    component: IncomeTaxAssign,
  },
  {
    path: "/compensationAndBenefits/employeeSalary/salaryAssign",
    component: SalaryAssign,
  },
  {
    path: "/compensationAndBenefits/employeeSalary/additionDeduction",
    component: AdditionDeduction,
  },
  {
    path: "/compensationAndBenefits/salaryTaxCertificate",
    component: SalaryTaxCertificate,
  },
  {
    path: "/compensationAndBenefits/employeeSalary/additionDeduction/create",
    component: AdditonDeductionCreate,
  },
  {
    path: "/compensationAndBenefits/generateSalary/commonSalaryTable/:id",
    component: CommonSalaryTable,
  },
  {
    path: "/compensationAndBenefits/employeeSalary/salaryHold",
    component: SalaryHold,
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
  // PF Withdraw for Compensation & benefit start
  {
    path: "/compensationAndBenefits/pfandgratuity/pfWithdraw",
    component: PFCompLanding,
  },
  // PF Withdraw for Compensation & benefit end
  {
    path: "/compensationAndBenefits/tax/eligibleEmployeeList",
    component: EligibleEmpList,
  },
  {
    path: "/compensationAndBenefits/tax/provisionAmountCalculation",
    component: ProvisionAmountCalc,
  },
  {
    path: "/compensationAndBenefits/tax/taxDeduction",
    component: TaxDeduction,
  },
  {
    path: "/SelfService/report/salaryPaySlip",
    component: SalaryPaySlipSelfReport,
  },
  { path: "/compensationAndBenefits/tax/taxCalculation", component: TaxCalc },
  { path: "/compensationAndBenefits/reports/PFLedger", component: PfLedger },
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
    path: "/compensationAndBenefits/reports/cashDisbursementRegister",
    component: CashDisbursementRegister,
  },
  { path: "/compensationAndBenefits/reports/taxSlip", component: TaxSlip },
  // increment/promotion start
  { path: "/compensationAndBenefits/increment", component: IncrementLanding },
  {
    path: "/compensationAndBenefits/increment/singleIncrement/create",
    component: CreateSingleIncrement,
  },
  {
    path: "/compensationAndBenefits/increment/singleIncrement/view/:id",
    component: ViewIncrementNPromotion,
  },
  {
    path: "/compensationAndBenefits/increment/singleIncrement/edit/:id",
    component: CreateSingleIncrement,
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
  {
    path: "/performancemanagementsystem/pms/dshboard",
    component: PmsDashboard,
  },
  {
    path: "/performancemanagementsystem/pms/strategicplan",
    component: StrPlan,
  },
  {
    path: "/performancemanagementsystem/pms/kpi",
    component: Kpis,
  },
  {
    path: "/performancemanagementsystem/pms/individualkpi",
    component: IndividualKpi,
  },
  {
    path: "/performancemanagementsystem/pms/individualkpi/create",
    component: IndKpiEntry,
  },

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
    path: "/administration/payrollConfiguration/payrollElement",
    component: PayrollElementCreate,
  },
  {
    path: "/administration/payrollConfiguration/salaryBreakdown",
    component: SalaryBreakdown,
  },
  {
    path: "/administration/payrollConfiguration/salaryBreakdown/:id",
    component: SalaryBreakdownDetails,
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
    component: BonusSetupForm,
  },
  {
    path: "/administration/payrollConfiguration/bonusSetup/create",
    component: BonusSetupForm,
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
    path: "/administration/payrollConfiguration/overtimePolicy",
    component: OvertimePolicy,
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
  // report for salary certificate
  {
    path: "/compensationAndBenefits/salaryCertificate",
    component: SalaryCertificateReport,
  },
  // report for payslip
  {
    path: "/compensationAndBenefits/salaryPaySlip",
    component: SalaryPayslipReport,
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
    path: "/SelfService/separation/application",
    component: SelfSeparation,
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
  {
    path: "/trainingAndDevelopment/training/attendance",
    component: TrainingAttendanceLanding,
  },
  {
    path: "/trainingAndDevelopment/training/attendance/view/:id",
    component: AttendanceView,
  },

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
  // Trainnning and development ends

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
];
