import axios from "axios";
import * as Yup from "yup";

export const initData = {
  territoryType: null,
  territoryName: null,
  territoryCode: null,
  territoryAddress: null,
  parentTerritory: null,
  remarks: null,
  attachment: [],
};

export const validationSchema = Yup.object({
  territoryType: Yup.object()
    .shape({
      label: Yup.string().required("Territory type is required"),
      value: Yup.string().required("Territory type is required"),
    })
    .typeError("Territory type is required"),
  territoryName: Yup.string()
    .required("Territory name is required")
    .typeError("Territory name is required"),
  territoryCode: Yup.string()
    .required("Territory code is required")
    .typeError("Territory code is required"),
  territoryAddress: Yup.string()
    .required("Territory address is required")
    .typeError("Territory address is required"),
});

export const tableViewCols = () => {
  return [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      className: "text-center",
    },
    {
      title: "Territory Code",
      dataIndex: "territoryCode",
      filter: true,
      sorter: true,
    },
    {
      title: "Territory Name",
      dataIndex: "territoryName",
      filter: true,
      sorter: true,
    },
    {
      title: "Territory Address",
      dataIndex: "territoryAddress",
    },
    {
      title: "Territory Type",
      dataIndex: "territoryType",
    },
    {
      title: "Parent Territory Type",
      dataIndex: "parentTerritoryType",
    },
    {
      title: "Parent Territory",
      dataIndex: "parentTerritory",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
    },
  ];
};

export const getTableViewLanding = async (
  setter,
  setLoading,
  orgId,
  buId,
  parentTTId = 0,
  TTId = 0
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/SaasMasterData/GetTerritoryLandingTableView?AccountId=${orgId}&BusinessUnitId=${buId}&WorkplaceGroupId=3&ParentTerritoryId=${parentTTId}&TerritoryTypeId=${TTId}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
