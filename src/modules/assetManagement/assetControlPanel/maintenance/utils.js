import axios from "axios";
import { toast } from "react-toastify";
import { dateFormatter } from "utility/dateFormatter";
import { formatMoney } from "utility/formatMoney";
import { todayDate } from "utility/todayDate";
import * as Yup from "yup";

const initialValue = {
  asset: "",
  maintenanceHeadDDL: "",
  employeeDDL: "",
  fromDate: todayDate(),
  toDate: todayDate(),
  cost: "",
  serviceProviderName: "",
  serviceProviderAddress: "",
  description: "",
};

const validationSchema = Yup.object().shape({
  asset: Yup.object()
    .shape({
      label: Yup.string().required("Asset is required"),
      value: Yup.string().required("Asset is required"),
    })
    .nullable()
    .required("Asset is required"),
  maintenanceHeadDDL: Yup.object()
    .shape({
      label: Yup.string().required("MaintenanceHead is required"),
      value: Yup.string().required("MaintenanceHead is required"),
    })
    .nullable()
    .required("MaintenanceHead is required"),
  employeeDDL: Yup.object()
    .shape({
      label: Yup.string().required("Employee is required"),
      value: Yup.string().required("Employee is required"),
    })
    .nullable()
    .required("Employee is required"),
  fromDate: Yup.string().required("From Date is required"),
  toDate: Yup.string().required("To Date is required"),
  cost: Yup.string().required("Cost  is required"),
  serviceProviderName: Yup.string().required(
    "Service provider Name is required"
  ),
  serviceProviderAddress: Yup.string().required(
    "Service provider Address is required"
  ),
});

const saveHandler = (
  values,
  saveAssetMaintenance,
  orgId,
  buId,
  wId,
  wgId,
  employeeId,
  userName,
  cb
) => {
  const payload = {
    accountId: orgId,
    branchId: buId,
    workplaceId: wId || 0,
    workplaceGroupId: wgId || 0,
    assetId: values?.asset?.value,
    employeeId: values?.employeeDDL?.value,
    employeeName: values?.employeeDDL?.label,
    serviceProviderName: values?.serviceProviderName || "",
    serviceProviderAddress: values?.serviceProviderAddress || "",
    cost: +values?.cost || 0,
    narration: values?.description || "",
    fromDate: values?.fromDate || "",
    toDate: values?.toDate || "",
    actionByName: userName,
    actionById: employeeId,
    maintenanceHeadId: values?.maintenanceHeadDDL?.value,
    maintenanceHeadName: values?.maintenanceHeadDDL?.label,
  };
  saveAssetMaintenance(
    `/AssetManagement/CreateAssetMaintenanceService`,
    payload,
    cb,
    true
  );
};

const assetMaintenanceColumn = (page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Asset Register Code",
      dataIndex: "itemCode",
      sort: true,
      filter: false,
      render: (item) => (item?.assetCode ? item?.assetCode : item?.assetId),
    },
    {
      title: "Asset Name",
      dataIndex: "assetName",
      sort: true,
      filter: false,
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      sort: false,
      filter: false,
    },
    {
      title: "Service Provider Name",
      dataIndex: "serviceProviderName",
      sort: false,
      filter: false,
    },
    {
      title: "Service Provider Address",
      dataIndex: "serviceProviderAddress",
      sort: false,
      filter: false,
    },
    {
      title: "From Date",
      dataIndex: "fromDate",
      sort: false,
      filter: false,
      className: "text-right",
      render: (record) => {
        return dateFormatter(record?.fromDate);
      },
    },
    {
      title: "To Date",
      dataIndex: "toDate",
      sort: false,
      filter: false,
      render: (record) => {
        return dateFormatter(record?.toDate);
      },
    },
    {
      title: "Cost",
      dataIndex: "cost",
      sort: false,
      filter: false,
      className: "text-right",
      render: (record) => formatMoney(record?.cost),
    },
    {
      title: "Description",
      dataIndex: "narration",
      sort: false,
      filter: false,
    },
  ];
};

const getData = (
  getLandingData,
  setRowDto,
  orgId,
  buId,
  wId,
  wgId,
  pages,
  setPages,
  search
) => {
  getLandingData(
    `/AssetManagement/GetAssetMaintainceLandingPasignation?accountId=${orgId}&branchId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}&assetId=&PageSize=${pages?.pageSize}&PageNo=${pages?.current}&SearchItem=${search}`,
    (res) => {
      setRowDto(res?.data);
      setPages?.({
        current: res?.currentPage,
        pageSize: res?.pageSize,
        total: res?.totalCount,
      });
    }
  );
};

const getReceiveActions = async (
  assetId,
  cashInHandAmount,
  cost,
  setDisabled,
  cb
) => {
  // if (+cashInHandAmount < +cost) {
  //   return toast.warn("You have not enough cash in hand", {
  //     toastId: "cashInHandAmount",
  //   });
  // }
  setDisabled(true);
  try {
    const res = await axios.put(
      `/AssetManagement/UpdateAssetMaintainceReceive?assetId=${assetId}`
    );
    setDisabled(false);
    toast.success(res?.data?.message || "Submitted successfully", {
      toastId: "toastId",
    });
    cb();
  } catch (error) {
    setDisabled(false);
    toast.warn(error?.response?.data?.message, { toastId: "toastId" });
  }
};

export {
  assetMaintenanceColumn,
  getData, getReceiveActions, initialValue,
  saveHandler,
  validationSchema
};

