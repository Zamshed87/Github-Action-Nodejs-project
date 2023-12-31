import { EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import { getPeopleDeskAllDDL } from "../../../common/api";
import { dateFormatter } from "../../../utility/dateFormatter";

export const organizationTypeList = [
  {
    label: "Business Unit",
    value: 1,
  },
  {
    label: "Workplace Group",
    value: 2,
  },
  {
    label: "Workplace",
    value: 3,
  },
];

export const setOrganizationDDLFunc = (
  wgId,
  buId,
  employeeId,
  valueOption,
  setOrganizationDDL
) => {
  return valueOption?.value === 1
    ? getPeopleDeskAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=${employeeId}`,
        "intBusinessUnitId",
        "strShortCode",
        setOrganizationDDL
      )
    : valueOption?.value === 2
    ? getPeopleDeskAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&WorkplaceGroupId=${wgId}&BusinessUnitId=0&intId=${employeeId}`,
        "intWorkplaceGroupId",
        "strWorkplaceGroup",
        setOrganizationDDL
      )
    : valueOption?.value === 3
    ? getPeopleDeskAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&WorkplaceGroupId=${wgId}&BusinessUnitId=0&WorkplaceGroupId=0&intId=${employeeId}`,
        "intWorkplaceId",
        "strWorkplace",
        setOrganizationDDL
      )
    : null;
};

export const pipleLineColumn = (
  page,
  paginationSize,
  wgName,
  setOpenModal,
  setSingleData,
  permission
) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      className: "text-center",
    },
    {
      title: "Pipeline Name",
      dataIndex: "strPipelineName",
      sort: true,
      fieldType: "string",
    },

    {
      title: "Remarks",
      dataIndex: "strRemarks",
      sort: true,
      fieldType: "string",
    },

    {
      title: "Date",
      dataIndex: "dteCreatedAt",
      render: (record) => dateFormatter(record?.dteCreatedAt),
      sort: true,
      fieldType: "date",
    },

    {
      title: "Workplace Group",
      dataIndex: "workplaceGroup",
      sort: true,
      fieldType: "string",
    },
    {
      title: "Workplace",
      dataIndex: "workplace",
      sort: true,
      fieldType: "string",
    },

    {
      title: "",
      dataIndex: "",
      className: "text-center",
      render: (record) => (
        <div className="d-flex justify-content-center">
          <Tooltip title="Edit" arrow>
            <button className="iconButton" type="button">
              <EditOutlined
                onClick={() => {
                  if (!permission?.isEdit)
                    return toast.warn("You don't have permission");
                  setSingleData({
                    pipelineName: {
                      value: record?.strApplicationType,
                      label: record?.strPipelineName,
                    },
                    remarks: record?.strRemarks,
                    intPipelineHeaderId: record?.intPipelineHeaderId,
                    sequence: "",
                    approver: "",
                    userGroup: "",
                  });
                  setOpenModal(true);
                }}
              />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ].filter((itm) => !itm?.hidden);
};
