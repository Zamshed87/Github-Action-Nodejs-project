import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { gray600 } from "../../../utility/customColor";

export const onGetExternalTrainingLanding = (
  getAssetDirectAssign,
  orgId,
  buId,
  setRowDto
) => {
  getAssetDirectAssign(
    `/Training/GetExternalTrainingLanding?intAccountId=${orgId}&intBusinessUnitId=${buId}`,
    (data) => {
      setRowDto(data);
    }
  );
};

export const filterExternalTrainingLanding = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    const newData = allData?.filter(
      (item) =>
        regex.test(item?.strTrainingName?.toLowerCase()) ||
        regex.test(item?.strDepartmentName?.toLowerCase()) ||
        regex.test(item?.strResourcePersonName?.toLowerCase()) ||
        regex.test(item?.strOrganizationCategory?.toLowerCase())
    );
    setRowDto(newData);
  } catch {
    setRowDto([]);
  }
};

export const externalTrainingTableColumn = (
  history,
  deleteDirectAsset,
  cb,
  employeeId,
  orgId,
  buId,
  page,
  paginationSize
) => {
  return [
    {
      title: () => <span style={{ color: gray600 }}>SL</span>,
      render: (value, item, index) => (page - 1) * paginationSize + index + 1,
      className: "text-center",
      width: "30px",
    },
    {
      title: "Training Name",
      dataIndex: "strTrainingName",
      sorter: true,
      filter: true,
    },
    {
      title: "Department",
      dataIndex: "strDepartmentName",
      sorter: true,
      filter: true,
    },
    {
      title: "Trainer Name",
      dataIndex: "strResourcePersonName",
      sorter: true,
      filter: true,
    },
    {
      title: "Organization Category",
      dataIndex: "strOrganizationCategory",
      sorter: true,
      filter: true,
    },
    {
      title: "Expected Participant",
      dataIndex: "intBatchSize",
      sorter: true,
      filter: true,
    },
    {
      title: "Present Participant",
      dataIndex: "intPresentParticipant",
      sorter: true,
      filter: true,
    },
    {
      title: "Purpose",
      dataIndex: "strRemarks",
      sorter: true,
      filter: true,
    },
    {
      title: "",
      render: (_, item) => (
        <div className="d-flex">
          <>
            <Tooltip title="Edit" arrow>
              <button className="iconButton" type="button">
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push(
                      `/trainingAndDevelopment/training/externalTraining/edit/${item?.intExternalTrainingId}`
                    );
                  }}
                />
              </button>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <button className="iconButton" type="button">
                <DeleteOutline
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDirectAsset(
                      `/Training/DeleteExternalTraining?ExternalTrainingId=${+item?.intExternalTrainingId}`,
                      "",
                      cb,
                      true
                    );
                  }}
                />
              </button>
            </Tooltip>
          </>
        </div>
      ),
    },
  ];
};
