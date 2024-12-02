import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import * as yup from "yup";
import DefaultInput from "../../../../../common/DefaultInput";
import { gray600 } from "../../../../../utility/customColor";
export const competencyTypeDDL = [
  { value: true, label: "Core competency" },
  { value: false, label: "Functional competency" },
];

export const onGetCoreValuesLanding = ({
  getCoreValuesList,
  setCoreValuesList,
  pagination,
  setPagination,
  buId,
  orgId,
}) => {
  getCoreValuesList?.(
    `/PMS/GetCoreValuesLandingPagination?accountId=${
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
      setCoreValuesList?.(data?.data);
    }
  );
};

export const coreValuesLandingTableColumn = ({
  setShowCreateModal,
  permission,
  setCoreValueId,
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
      title: "Core Value Name",
      dataIndex: "strCoreValueName",
      sorter: true,
      filter: true,
      width: 200,
    },
    {
      title: () => <div style={{ color: gray600 }}>Core Value Definition</div>,
      dataIndex: "strCoreValueDefinition",
      width: 400,
    },
    {
      title: () => <div style={{ color: gray600 }}>Desired Value</div>,
      dataIndex: "numDesiredValue",
      width: 150,
    },
    {
      title: "Action",
      render: (_, record) => (
        <div className="d-flex align-items-center justify-content-center">
          <Tooltip title="Edit" arrow>
            <button
              className="iconButton mx-2"
              onClick={(e) => {
                setCoreValueId(record?.intCoreValueId);
                e.stopPropagation();
                // if (!permission?.isEdit)
                //   return toast.warn("You don't have permission");
                setShowCreateModal(true);
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

export const coreValuesValidationSchema = yup.object().shape({
  coreValueName: yup
    .string()
    .required("Core value name is required")
    .typeError("Core value name is required"),
  coreValueDefinition: yup
    .string()
    .required("Core value definition is required")
    .typeError("Core value definition is required"),
  numDesiredValue: yup
    .number()
    .min(0, "Desired value must be greater than or equal to zero")
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
      dataIndex: "employeeCompetencyClusterName",
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
                  ? {
                      ...item,
                      desiredValue: e.target.value,
                    }
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
      title: () => <div style={{ color: gray600 }}>Type</div>,
      render: (_, row) => (row?.isPositive ? "Positive" : "Negative"),
      width: "20%",
    },
    {
      title: "",
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

export const onCreateEditCoreValues = ({
  coreValueId,
  orgId,
  buId,
  employeeId,
  formValues,
  createCoreValues,
  resetForm,
  demonstratedBehaviourList,
  setDemonstratedBehaviourList,
  onHide,
}) => {
  if (demonstratedBehaviourList?.length < 1)
    return toast.warning("Please add some demonstrated behaviour");

  const demonstratedBehaviourListPayload = demonstratedBehaviourList?.map(
    (item) => ({
      configId: item?.configId || 0,
      demonstratedBehaviour: item?.demonstratedBehaviour,
      isPositive: item?.isPositive,
      actionBy: +employeeId || 0,
    })
  );
  const payload = {
    objHeader: {
      ...(coreValueId && { coreValueId }),
      accountId: +orgId || 0,
      businessUnitId: +buId || 0,
      coreValueName: formValues?.coreValueName,
      coreValueDefinition: formValues?.coreValueDefinition,
      numDesiredValue: +formValues?.numDesiredValue,
      actionBy: +employeeId || 0,
    },
    objListRow: demonstratedBehaviourListPayload,
  };
  createCoreValues?.(
    !coreValueId ? `/PMS/CreateCoreValues` : `/PMS/EditCoreValues`,
    payload,
    (data) => {
      if (data) onHide?.();
      resetForm?.();
      setDemonstratedBehaviourList?.([]);
      // if (coreValueId) {
      //   onHide?.();
      // }
    },
    true
  );
};

export const onGetCoreValuesyById = ({
  buId,
  coreValueId,
  getCoreValuesById,
  setValues,
  setDemonstratedBehaviourList,
}) => {
  getCoreValuesById?.(
    `/PMS/GetCoreValuesById?coreValueId=${coreValueId}&businessUnitId=${buId}`,
    (data) => {
      if (data) {
        setValues?.((prev) => ({
          ...prev,
          coreValueName: data[0]?.objHeader?.coreValueName || "",
          coreValueDefinition: data[0]?.objHeader?.coreValueDefinition || "",
          numDesiredValue: data[0]?.objHeader?.numDesiredValue || "",
          desiredValue: data[0]?.objHeader?.numDesiredValue || "",
        }));

        setDemonstratedBehaviourList?.([...data[0]?.objListRow]);
      }
    }
  );
};
