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
export const header = (deletedRow, setDeletedRow, remover, random) => [
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
    width: 100,
  },
  {
    title: "Sequence Order",
    dataIndex: "intShortOrder",
    sorter: true,
    isHidden: random,
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
    title: "User Group",
    dataIndex: "userGroup",
    sorter: true,
  },

  {
    width: 50,
    align: "center",
    render: (_, rec, index) => (
      <>
        <TableButton
          buttonsList={[
            {
              type: "delete",
              onClick: (e) => {
                e.stopPropagation();
                // store deleted data,we have to send it to back end for edit
                const data = [...deletedRow];
                data.push({
                  ...rec,
                  isCreate: false,
                  isDelete: true,
                });
                setDeletedRow(data);
                remover(index);
              },
            },
          ]}
        />
      </>
    ),
  },
].filter((item) => !item.isHidden);

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
  const payload = {
    isActive: true,
    dteCreatedAt: todayDate(),
    intCreatedBy: employeeId,
    dteUpdatedAt: todayDate(),
    intUpdatedBy: employeeId,
    intPipelineHeaderId: singleData?.intPipelineHeaderId || 0,
    strPipelineName: values?.pipelineName?.label,
    strApplicationType: values?.pipelineName?.value,
    strRemarks: values?.remarks || "",
    intAccountId: orgId,
    intBusinessUnitId: buId,
    intWorkplaceGroupId: values?.orgName?.value || wgId,
    intWorkplaceId: values?.workplace?.value ? values?.workplace?.value : 0, //  || wId,
    isValidate: true,
    approvalPipelineRowViewModelList: [...tableData, ...deletedRow],
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
