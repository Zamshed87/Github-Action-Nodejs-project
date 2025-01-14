import axios from "axios";
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
  isSequence,
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
      dataIndex: "userGroupOrEmployeeName",
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

  if (!tableData?.length) {
    return toast.warn(
      `Please add at least one approver to save ${values?.pipelineName?.label} pipeline`
    );
  }

  // Ensure workplaces is an array
  const workplaces = Array.isArray(values?.workplace)
    ? values.workplace
    : [values?.workplace];

  // Collect payloads into an array
  const payloadList = workplaces.map((workplace) => ({
    header: {
      id: values?.id || 0, // header id
      applicationTypeId: +values?.pipelineName?.value || 0,
      applicationType: values?.pipelineName?.label || "",
      accountId: orgId,
      businessUnitId: buId,
      workplaceGroupId: values?.orgName?.value || wgId,
      workplaceGroupName: values?.orgName?.label || "",
      workplaceId: workplace?.value || -1,
      workplaceName: workplace?.label || "",
      isInSequence: isSequence,
      randomApproverCount: random ? tableData?.length || 0 : 0,
      isActive: true,
      createdBy: employeeId,
      createdAt: todayDate(),
    },
    row: tableData.map((item) => ({
      id: item?.id || 0, // rowId
      configHeaderId: item?.configHeaderId || 0, // header Id
      approverTypeId: item?.approverId || 0,
      approverType: item?.approver || "",
      beforeApproveStatus: item?.strStatusTitlePending || "",
      afterApproveStatus: item?.strStatusTitle || "",
      sequenceId: random ? 0 : item?.intShortOrder || 0,
      isActive: true,
      createdBy: employeeId,
      createdAt: todayDate(),
      userGroupOrEmployeeId: item?.intUserGroupHeaderId || 0,
    })),
  }));

  const finalPayload = singleData ? payloadList[0] : payloadList;

  const urlKey = singleData
    ? "UpdateApprovalConfiguration"
    : "CreateApprovalConfiguration";

  savePipeline.action({
    urlKey: urlKey,
    method: "POST",
    payload: finalPayload,
    onSuccess: (res) => {
      if (res?.statusCode === 200) {
        toast.success(res?.message || "Submitted successfully");
        cb();
      }
      if(res?.statusCode === 500){
        toast.warn(res?.message)
      }
      if(res?.statusCode === 400){
        toast.warn(res?.message)
      }
    },
    // toast: true,
  });
};


export const fetchPipelineData = async (setPipelineDDL) => {
  try {
    const res = await axios.get(`/Enum/GetEnums?types=ApplicationType`);
    setPipelineDDL(res?.data?.ApplicationType);
  } catch (error) {
    console.log("error", error);
  }
};

export const fetchApproverData = async (setApproverDDL) =>{
  try {
    const res = await axios.get(`/Enum/GetEnums?types=ApproverType`);
    setApproverDDL(res?.data?.ApproverType);
  } catch (error) {
    console.log("error", error);
  }
}