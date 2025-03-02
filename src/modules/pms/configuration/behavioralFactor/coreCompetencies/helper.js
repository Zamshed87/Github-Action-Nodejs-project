import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import * as yup from "yup";
import DefaultInput from "../../../../../common/DefaultInput";
import { gray600 } from "../../../../../utility/customColor";
export const competencyTypeDDL = [
  { value: 1, label: "Core competency" },
  { value: 0, label: "Functional competency" },
  { value: 3, label: "Managerial Competency" },
];

export const onGetCoreCompetencyLanding = ({
  getCompetencyList,
  setCompetencyList,
  pagination,
  setPagination,
  buId,
  orgId,
}) => {
  getCompetencyList?.(
    `PMS/GetCompetencyLandingPagination?accountId=${
      orgId || 0
    }&businessUnitId=${buId}&viewOrder=desc&pageNo=${
      pagination?.current
    }&pageSize=${pagination?.pageSize}`,
    (data) => {
      setPagination?.((prev) => ({
        ...prev,
        total: data?.totalCount,
        current: data?.currentPage || data?.pageNo,
        pageSize: data?.pageSize,
      }));
      setCompetencyList?.(data?.data);
    }
  );
};

export const coreCompetencyLandingTableColumn = ({
  setShowCreateModal,
  permission,
  setCompetencyId,
  pagination,
}) => {
  return [
    {
      title: () => <div style={{ color: gray600 }}> SL</div>,
      render: (_, __, index) =>
        (pagination?.current - 1) * pagination?.pageSize + (index + 1),
      className: "text-center",
      width: 30,
    },
    {
      title: "Competency Name",
      dataIndex: "competencyName",
      sorter: true,
      filter: true,
      width: 200,
    },
    {
      title: () => <div style={{ color: gray600 }}>Competency Definition</div>,
      dataIndex: "competencyDefination",
      width: 400,
    },
    {
      title: () => <div style={{ color: gray600 }}>Position Group</div>,
      dataIndex: "positionGroupName",
      sorter: true,
      filter: true,
      width: 200,
    },
    {
      title: () => <div style={{ color: gray600 }}>Desired Value</div>,
      dataIndex: "desiredValue",
      sorter: true,
      filter: true,
      width: 200,
    },
    {
      title: "Action",
      render: (_, record) => (
        <div className="d-flex align-items-center justify-content-center">
          <Tooltip title="Edit" arrow>
            <button
              className="iconButton mx-2"
              onClick={(e) => {
                e.stopPropagation();
                // if (!permission?.isEdit)
                //   return toast.warn("You don't have permission");
                setShowCreateModal?.(true);
                setCompetencyId(record?.competencyId);
              }}
            >
              <EditOutlined sx={{ fontSize: "20px" }} />
            </button>
          </Tooltip>
        </div>
      ),
      width: 50,
    },
  ];
};
export const coreCompetencyCreateValidationSchema = yup.object().shape({
  competencyType: yup
    .mixed()
    .required("Competency type is required")
    .typeError("Competency type is required"),
  competencyName: yup
    .string()
    .required("Competency name is required")
    .typeError("Competency name is required"),
  competencyDefinition: yup
    .string()
    .required("Competency definition is required")
    .typeError("Competency definition is required"),
  employeeLabel: yup
    .mixed()
    .required("Employee Label is required")
    .typeError("Employee Label is required"),
  desiredValue: yup
    .number()
    .required("Desired value is required")
    .typeError("Desired value is required"),
});

export const employeeClusterTableColumn = ({
  clusterList,
  setClusterList,
  fromView,
}) => {
  return [
    {
      title: () => <div style={{ color: gray600 }}>Employee Cluster</div>,
      dataIndex: "label",
      width: "50%",
    },
    {
      title: () => (
        <div style={{ color: gray600 }}>
          Desired Value (By Employee/Supervisor)
        </div>
      ),
      render: (_, record) =>
        fromView ? (
          <p>{record?.desiredValue}</p>
        ) : (
          <DefaultInput
            disabled={fromView}
            classes="input-sm"
            value={record?.desiredValue}
            name="desiredValue"
            type="number"
            className="form-control"
            onChange={(e) => {
              if (parseInt(e.target.value) <= 0)
                return toast.warn("Value can't be less than 1");
              const modifiedClusterList = clusterList?.map((item) =>
                item?.employeeCompetencyClusterId ===
                record?.employeeCompetencyClusterId
                  ? { ...item, desiredValue: e.target.value }
                  : item
              );
              setClusterList?.(modifiedClusterList);
            }}
          />
        ),
      width: "50%",
    },
  ];
};

export const demonstrateBehaviourTableColumn = ({
  demonstratedBehaviourList,
  setDemonstratedBehaviourList,
  permission,
  fromView,
}) => {
  return [
    {
      title: () => <div style={{ color: gray600 }}>SL</div>,
      render: (_, __, index) => index + 1,
      width: "10%",
      className: "text-center",
    },
    {
      title: () => <div style={{ color: gray600 }}>Demonstrated Behaviour</div>,
      dataIndex: "demonstratedBehaviour",
      width: "60%",
    },
    {
      title: () => <div style={{ color: gray600 }}>Level of Leadership</div>,
      dataIndex: "employeeLabel",
      width: "60%",
    },
    {
      title: () => <div style={{ color: gray600 }}>Type</div>,
      render: (_, row) => (row?.isPositive ? "Positive" : "Negative"),
      width: "20%",
    },
    {
      title: "Action",
      render: (_, __, rowIndex) =>
        fromView ? (
          <></>
        ) : (
          <div className="d-flex align-items-center justify-content-center">
            <Tooltip title="Edit" arrow>
              <button
                className="iconButton mx-2"
                onClick={(e) => {
                  e.stopPropagation();
                  const modifiedDemonstratedBehaviourList =
                    demonstratedBehaviourList.filter(
                      (____, index) => index !== rowIndex
                    );
                  setDemonstratedBehaviourList(
                    modifiedDemonstratedBehaviourList
                  );
                }}
              >
                <DeleteOutlined sx={{ fontSize: "20px" }} />
              </button>
            </Tooltip>
          </div>
        ),
      width: "10%",
    },
  ];
};

export const onCreateCoreCompetency = ({
  competencyId,
  orgId,
  buId,
  employeeId,
  formValues,
  createCompetency,
  resetForm,
  clusterList,
  demonstratedBehaviourList,
  setClusterList,
  setDemonstratedBehaviourList,
  onHide,
}) => {
  // const allClusterValuesExist = clusterList?.every(
  //   (item) => parseInt(item?.desiredValue) > 0
  // );
  // if (!allClusterValuesExist) {
  //   return toast.warning("Please fill all cluster");
  // }
  if (demonstratedBehaviourList?.length < 1)
    return toast.warning("Please add some demonstrated behaviour");

  const demonstratedBehaviourListPayload = demonstratedBehaviourList?.map(
    (item) => ({
      ...(competencyId && {
        competencyId: item?.competencyId || 0,
      }),
      configId: item?.configId || 0,
      demonstratedBehaviour: item?.demonstratedBehaviour,
      isPositive: item?.isPositive,
    })
  );
  // const employeeClusterListPayload = clusterList?.map((item) => ({
  //   ...(competencyId && {
  //     competencyDesireValueMapId: item?.competencyDesiredValueMapingId || 0,
  //   }),
  //   employeeClusterId: +item?.employeeCompetencyClusterId || 0,
  //   desirValue: +item?.desiredValue || "",
  // }));
  const payload = {
    objCompetency: {
      accountId: +orgId || 0,
      businessUnitId: +buId || 0,
      ...(competencyId && { competencyId }),
      competencyName: formValues?.competencyName || "",
      competencyDefination: formValues?.competencyDefinition || "",
      isFunctionalCompetency: formValues?.competencyType?.value,
      actionBy: +employeeId || 0,
      positionGroupName: formValues?.employeeLabel?.label,
      positionGroupId: formValues?.employeeLabel?.value,
      desiredValue: +formValues?.desiredValue || "",
    },
    // objValueMap: employeeClusterListPayload,
    objValueMap: [],
    ...(competencyId
      ? { objDemo: demonstratedBehaviourListPayload }
      : { objDemBehav: demonstratedBehaviourListPayload }),
  };
  createCompetency?.(
    !competencyId ? `/PMS/CreateCompetencyData` : `/PMS/EditCompetencyData`,
    payload,
    () => {
      resetForm?.();
      resetClusterList?.({ clusterList, setClusterList });
      setDemonstratedBehaviourList?.([]);
      if (competencyId) {
        onHide?.();
      }
    },
    true
  );
};
export const resetClusterList = ({ clusterList, setClusterList }) => {
  const modifiedClusterList = clusterList?.map((item) => ({
    ...item,
    desiredValue: "",
  }));
  setClusterList?.(modifiedClusterList);
};
export const onGetCompetencyById = ({
  buId,
  competencyId,
  getCompetencyById,
  setValues,
  clusterList,
  setClusterList,
  setDemonstratedBehaviourList,
}) => {
  getCompetencyById?.(
    `/PMS/GetCompetencydetailsById?competencyId=${competencyId}&businessUnitId=${buId}`,
    (data) => {
      if (data?.[0]) {
        const { objCompetency, objValueMap, objDemo } = data?.[0];
        setValues?.((prev) => ({
          ...prev,
          competencyType: competencyTypeDDL?.find(
            (item) => item?.value === objCompetency?.isFunctionalCompetency
          ),
          competencyName: objCompetency?.competencyName,
          competencyDefinition: objCompetency?.competencyDefinition,
          employeeLabel: {
            value: objCompetency?.positionGroupId,
            label: objCompetency?.positionGroupName,
          },
          desiredValue: objCompetency?.desiredValue,
        }));
        const modifiedClusterList = clusterList?.map((item) => {
          const theCluster = objValueMap?.find(
            (clusterItem) =>
              clusterItem?.employeeClusterId ===
              item?.employeeCompetencyClusterId
          );
          return {
            ...item,
            ...theCluster,
            desiredValue: `${theCluster?.desiredValue || item?.desiredValue}`,
          };
        });
        setClusterList?.(modifiedClusterList);
        setDemonstratedBehaviourList?.(objDemo);
      }
    }
  );
};
