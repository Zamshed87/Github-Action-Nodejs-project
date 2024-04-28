import axios from "axios";
import { toast } from "react-toastify";
import { dateFormatter } from "utility/dateFormatter";
import { todayDate } from "utility/todayDate";
import * as Yup from "yup";

const initialValue = {
  asset: "",
  maintenanceHeadDDL: "",
  employeeDDL: "",
  fromDate: todayDate(),
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
      label: Yup.string().required("Maintenance type is required"),
      value: Yup.string().required("Maintenance type is required"),
    })
    .nullable()
    .required("Maintenance type is required"),
  employeeDDL: Yup.object()
    .shape({
      label: Yup.string().required("Handed over to is required"),
      value: Yup.string().required("Handed over to is required"),
    })
    .nullable()
    .required("Handed over to is required"),
  fromDate: Yup.string().required("Maintenance start date is required"),
  serviceProviderName: Yup.object()
    .shape({
      label: Yup.string().required("Service provider name is required"),
      value: Yup.string().required("Service provider name is required"),
    })
    .nullable()
    .required("Service provider name is required"),
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
    serviceProviderName: values?.serviceProviderName?.label || "",
    serviceProviderId: values?.serviceProviderName?.value || "",
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
      title: "Handed Over To",
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
      title: "Maintenance Start Date",
      dataIndex: "fromDate",
      sort: false,
      filter: false,
      className: "text-right",
      render: (record) => {
        return dateFormatter(record?.fromDate);
      },
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
  payload,
  setDisabled,
  cb
) => {
  setDisabled(true);
  try {
    const res = await axios.put(
      `/AssetManagement/UpdateAssetMaintainceReceive`,
      payload,
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
  getData,
  getReceiveActions,
  initialValue,
  saveHandler,
  validationSchema
};

