import { TableButton } from "Components";
import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";

export const approverDDL = (orgId, supervisor) => {
  switch (orgId) {
    case 10015:
      return [
        { value: 1, label: supervisor || "Reporting Line" },
        { value: 2, label: "Team Leader" },
        { value: 3, label: "User Group" },
      ];
    default:
      return [
        { value: 1, label: supervisor || "Supervisor" },
        { value: 2, label: "Line Manager" },
        { value: 3, label: "User Group" },
        { value: 4, label: "Individual Employee" },
      ];
  }
};

// Header
export const header = (
  deletedRow,
  setDeletedRow,
  remover,
  random,
  isSequence
) =>
  [
    {
      title: "SL",
      render: (_, rec, index) => index + 1,
      align: "center",
      width: 50,
    },
    {
      title: "Approver",
      dataIndex: "approver",
      sorter: true,
    },
    {
      title: "Sequence Order",
      dataIndex: "intShortOrder",
      sorter: true,
      isHidden: random || !isSequence,
      width: 150,
    },
    {
      title: "Before Approve Status Title",
      dataIndex: "strStatusTitle",
      sorter: true,
    },
    {
      title: "After Approve Status Title",
      dataIndex: "strStatusTitlePending",
      sorter: true,
    },
    {
      title: "User Group/Employee",
      dataIndex: "userGroup",
      sorter: true,
    },
    {
      title: "Action",
      width: 50,
      align: "center",
      render: (_, rec, index) => (
        <i
          className="fa fa-trash"
          style={{
            fontSize: "16px",
            color: "#ff4d4f",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            const data = [...deletedRow];
            data.push({
              ...rec,
              isCreate: false,
              isDelete: true,
            });
            setDeletedRow(data);
            remover(index);
          }}
        />
      ),
    },
  ].filter((col) => !col.isHidden);

export const sequence = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
  { value: 9, label: "9" },
  { value: 10, label: "10" },
  { value: 11, label: "11" },
  { value: 12, label: "12" },
  { value: 13, label: "13" },
  { value: 14, label: "14" },
  { value: 15, label: "15" },
  { value: 16, label: "16" },
  { value: 17, label: "17" },
  { value: 18, label: "18" },
  { value: 19, label: "19" },
  { value: 20, label: "20" },
];

export const submitHandler = ({
  values,
  resetForm,
  setIsAddEditForm,
  getData,
  tableData,
  employeeId,
  singleData,
  orgId,
  buId,
  wgId,
  deletedRow,
  isSequence,
  random,
  savePipeline,
}) => {
  const cb = () => {
    resetForm();
    setIsAddEditForm(false);
    getData();
  };
  if (!tableData?.length)
    return toast.warn(
      `Please add at least one approver to save ${values?.pipelineName?.label} pipeline`
    );
  // const payload = {
  //   isActive: true,
  //   dteCreatedAt: todayDate(),
  //   intCreatedBy: employeeId,
  //   dteUpdatedAt: todayDate(),
  //   intUpdatedBy: employeeId,
  //   intPipelineHeaderId: singleData?.intPipelineHeaderId || 0,
  //   strPipelineName: values?.pipelineName?.label,
  //   strApplicationType: values?.pipelineName?.value,
  //   strRemarks: values?.remarks || "",
  //   intAccountId: orgId,
  //   intBusinessUnitId: buId,
  //   intWorkplaceGroupId: values?.orgName?.value || wgId,
  //   intWorkplaceId: values?.workplace?.value ? values?.workplace?.value : 0, //  || wId,
  //   isValidate: true,
  //   approvalPipelineRowViewModelList: [...tableData, ...deletedRow],
  // };
  const payload = {
    header: {
      sl: 0,
      id: singleData?.intPipelineHeaderId || 0,
      applicationTypeId: values?.pipelineName?.value || 0,
      applicationType: values?.pipelineName?.label || "",
      accountId: orgId,
      businessUnitId: buId,
      workplaceGroupId: values?.orgName?.value || wgId,
      workplaceGroupName: values?.orgName?.label || "",
      workplaceId: values?.workplace?.value || 0,
      workplaceName: values?.workplace?.label || "",
      isInSequence: isSequence,
      randomApproverCount: random ? tableData?.length || 0 : 0,
      isActive: true,
      createdBy: employeeId,
      createdAt: todayDate(),
    },
    row: tableData.map((item) => ({
      id: item?.intPipelineRowId || 0,
      configHeaderId: singleData?.intPipelineHeaderId || 0,
      approverTypeId: item?.approver?.value || 0,
      approverType: item?.approver || "",
      beforeApproveStatus: item?.strStatusTitle || "",
      afterApproveStatus: item?.strStatusTitlePending || "",
      sequenceId: random ? 0 : item?.intShortOrder || 0,
      isActive: true,
      createdBy: employeeId,
      createdAt: todayDate(),
      userGroupOrEmployeeId: item?.userGroup || 0,
    })),
  };
  
  savePipeline.action({
    urlKey: "ApprovalPipelineCreateNUpdate",
    method: "POST",
    payload: payload,
    onSuccess: () => {
      cb();
    },
    toast: true,
  });
};
