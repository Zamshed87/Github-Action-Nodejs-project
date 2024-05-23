import { EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import axios from "axios";
import Chips from "common/Chips";
import FormikInput from "common/FormikInput";
import PrimaryButton from "common/PrimaryButton";
import { toast } from "react-toastify";
import { dateFormatter } from "utility/dateFormatter";
import { formatMoney } from "utility/formatMoney";
import { todayDate } from "utility/todayDate";

const initialValue = {
  itemName: "",
  qty: "",
  rate: "",
  startNumber: "",
  isDepreciation: false,
  percentage: "",
  identifierBy: "",
  isAutoValue: false,
};

const itemAddHandler = (values, setRowDto, cb) => {
  const data = [];
  // generate list based on quantity, if quantity is 10, it will generate 10 row / individual data , and it will save in rowDto,
  for (let i = 0; i < +values?.qty; i++) {
    const obj = {
      itemName: values?.itemName?.label,
      itemId: values?.itemName?.value,
      itemCode: values?.itemName?.itemCode,
      rate: +values?.rate,
      value: values?.isAutoValue ? (+values?.startNumber || 1) + i : "",
    };
    data.push(obj);
  }
  setRowDto(data);
  cb();
};

const registrationColumn = (errors, touched, rowDto, setRowDto) => {
  return [
    {
      title: "SL",
      render: (_, index) => index + 1,
      sort: false,
      filter: false,
      className: "text-center",
      width: 40,
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      sort: false,
      filter: false,
    },
    {
      title: "Item Code",
      dataIndex: "itemCode",
      sort: false,
      filter: false,
    },
    {
      title: "Price",
      dataIndex: "rate",
      sort: false,
      filter: false,
      render: (record) => formatMoney(record?.rate),
    },
    {
      title: "Value (Identifier)",
      dataIndex: "value",
      sort: false,
      filter: false,
      width: 300,
      render: (record, index) => (
        <div className="d-flex align-items-center">
          <FormikInput
            classes="input-sm"
            placeholder=""
            value={record?.value}
            name="value"
            type="text"
            handleBlur={(e) => {
              rowDtoInputHandlerOnBlur(
                "value",
                e.target.value,
                index,
                rowDto,
                setRowDto
              );
            }}
            onChange={(e) => {
              rowDtoInputHandler(
                "value",
                e.target.value,
                index,
                rowDto,
                setRowDto
              );
            }}
            errors={errors}
            touched={touched}
          />
        </div>
      ),
    },
  ];
};

const rowDtoInputHandler = (name, value, index, rowDto, setRowDto) => {
  const data = [...rowDto];
  data[index][name] = value;
  setRowDto(data);
};

const rowDtoInputHandlerOnBlur = (name, value, index, rowDto, setRowDto) => {
  if (value !== "") {
    let isFound = false;
    isFound = rowDto.find(
      (item, ind) => +item?.value === +value && index !== ind
    );
    if (isFound) {
      const data = [...rowDto];
      data[index][name] = "";
      setRowDto(data);
      toast.warn(`${value}  is already added `, { toastId: "toastId" });
      return;
    }
  }
};

export const localUrl = "https://192.168.3.91:45455/api";

const saveHandler = (
  id,
  values,
  rowDto,
  itemCode,
  saveRegistration,
  orgId,
  buId,
  wId,
  wgId,
  setEditLoading,
  cb
) => {
  if (!values?.identifierBy)
    return toast.warn("Please select identifier by", { toastId: "identifier" });
  if (values?.isDepreciation && !values?.percentage)
    return toast.warn("Please select percentage", { toastId: "percentage" });
  if (rowDto?.length === 0)
    return toast.warn("Please add atlest one item", { toastId: "item" });
  const editPayload = {
    assetRegisterId: +id,
    identifier: values?.identifierBy,
    percentage: +values?.percentage || 0,
    isDepreciation: values?.isDepreciation,
    updateList: rowDto?.map((item) => ({
      id: item?.assetId,
      value: item?.value.toString(),
    })),
  };
  const payload = {
    headerAsset: {
      purchaseReceiveId: 0,
      rowId: 0,
      workplaceGroupId: wgId,
      workplaceId: wId,
      purchaseReceiveCode: itemCode,
      assetRegisterDate: todayDate(),
      accountId: orgId,
      branchId: buId,
      percentage: +values?.percentage || 0,
      isDepreciation: values?.isDepreciation,
      identification: values?.identifierBy,
    },
    rowAsset: rowDto?.map((item) => ({
      itemId: item?.itemId,
      itemName: item?.itemName,
      value: item?.value.toString(),
      bookValue: item?.rate,
    })),
  };
  if (id) {
    updateRegisteredAsset(editPayload, setEditLoading, cb);
  } else {
    saveRegistration(
      `/AssetManagement/CreateAssetRegisterService`,
      payload,
      cb,
      true
    );
  }
};

const getById = (id, getSingleData, setSingleData, setRowDto) => {
  getSingleData(
    `/AssetManagement/GetAssetRegisterById?AssetRegisterId=${id}`,
    (res) => {
      const headerData = res?.objHeader;
      const rowData = res?.objRow;
      const modifyHeaderData = {
        isDepreciation: headerData?.isDepreciation,
        percentage: headerData?.depreciationPercent,
        identifierBy: headerData?.identification,
      };
      setSingleData(modifyHeaderData);
      const modifyRowData = rowData?.map((item) => ({
        ...item,
        itemId: item?.itemId,
        itemName: item?.itemName,
        itemCode: headerData?.purchaseReceiveCode,
        value: item?.identificationValue,
        rate: item?.bookValue,
      }));
      setRowDto(modifyRowData);
    }
  );
};

const assetRegistrationColumn = (
  page,
  paginationSize,
  rowDto,
  setRowDto,
  setPages,
  errors,
  touched,
  pages,
  setEditLoading,
  history,
  cb
) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Code",
      dataIndex: "assetCode",
      sort: false,
      filter: false,
      render: (record) =>
        record?.assetCode ? record?.assetCode : record?.assetId,
    },
    {
      title: "Asset",
      dataIndex: "assetName",
      sort: true,
      filter: false,
    },
    {
      title: "Identifier",
      dataIndex: "identification",
      sort: false,
      filter: false,
      render: (record, index) => {
        if (record?.isEdit) {
          return (
            <FormikInput
              classes="input-sm"
              placeholder="Identification"
              value={record?.identification}
              name="identification"
              type="text"
              errors={errors}
              touched={touched}
              onChange={(e) => {
                inputHandler(
                  "identification",
                  e.target.value,
                  index,
                  rowDto,
                  setRowDto,
                  setPages,
                  pages
                );
              }}
            />
          );
        } else {
          return record?.identification;
        }
      },
    },
    {
      title: "Value",
      dataIndex: "value",
      sort: false,
      filter: false,
      render: (record, index) => {
        if (record?.isEdit) {
          return (
            <FormikInput
              classes="input-sm"
              placeholder="Value"
              value={record?.value}
              name="value"
              type="text"
              errors={errors}
              touched={touched}
              onChange={(e) => {
                inputHandler(
                  "value",
                  e.target.value,
                  index,
                  rowDto,
                  setRowDto,
                  setPages,
                  pages
                );
              }}
            />
          );
        } else {
          return record?.value;
        }
      },
    },
    {
      title: "Reg. Date",
      dataIndex: "registrationDate",
      sort: false,
      filter: false,
      render: (record) => dateFormatter(record?.registrationDate),
    },
    {
      title: "Book Value",
      dataIndex: "bookValue",
      sort: false,
      filter: false,
      render: (record) => {
        return formatMoney(record?.bookValue);
      },
    },
    {
      title: "Total Depreciation",
      dataIndex: "totalDepreciation",
      sort: false,
      filter: false,
      className: "text-right",
      render: (record) => {
        return formatMoney(record?.totalDepreciation);
      },
    },
    {
      title: "Total Maintenance",
      dataIndex: "totalMaintenance",
      sort: false,
      filter: false,
      className: "text-right",
      render: (record) => {
        return formatMoney(record?.totalMaintenance);
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      sort: false,
      filter: false,
      className: "text-center",
      render: (item) => {
        return (
          <div>
            {item?.status === "Unavailable" && (
              <Chips label="Unavailable" classess="hold" />
            )}
            {item?.status === "Available" && (
              <Chips label="Available" classess="success" />
            )}
            {item?.status === "Assigned" && (
              <Chips
                label={"Assign to" + " " + item?.assetAssignPerson}
                classess="warning"
              />
            )}
            {item?.status === "On Maintaince" && (
              <Chips
                label={
                  "On Maintenance to" + " " + item?.assetMaintainceByPerson
                }
                classess="danger"
              />
            )}
            {item?.status === "On Rent" && (
              <Chips
                label={"On Rent" + " " + item?.assetRentPerson}
                classess="hold"
              />
            )}
          </div>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      sort: false,
      filter: false,
      className: "text-center",
      render: (record, index) => (
        <div className="d-flex justify-content-center">
          {record?.isEdit ? (
            <>
              <PrimaryButton
                type="button"
                className="btn btn-default mr-1"
                label="Update"
                customStyle={{ padding: "2px 5px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  const payload = {
                    id: +record?.assetId,
                    identifier: record?.identification,
                    value: record?.value,
                    assetRegisterId: record?.assetRegisterId,
                  };
                  updateRegisteredAsset(payload, setEditLoading, cb);
                }}
              />
              <PrimaryButton
                type="button"
                className="btn btn-default bg-danger border-danger"
                label="Cancel"
                customStyle={{ padding: "2px 5px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  inputHandler(
                    "isEdit",
                    false,
                    index,
                    rowDto,
                    setRowDto,
                    setPages,
                    pages
                  );
                }}
              />
            </>
          ) : (
            record?.status !== "Unavailable" && (
              <Tooltip title="Edit" arrow>
                <button className="iconButton" type="button">
                  <EditOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      history.push(
                        `/assetManagement/assetControlPanel/registration/edit/${record?.assetRegisterId}`
                      );
                    }}
                  />
                </button>
              </Tooltip>
            )
          )}
        </div>
      ),
    },
  ];
};

const inputHandler = (name, value, sl, rowDto, setRowDto, setPages, pages) => {
  const data = [...rowDto];
  const _sl = data[sl];
  _sl[name] = value;
  setRowDto(data);
  setPages?.({
    current: pages?.current,
    pageSize: pages?.pageSize,
    total: pages?.total,
  });
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
    `/AssetManagement/GetAssetRegisterPagination?accountId=${orgId}&branchId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}&SearchItem=${search}&PageSize=${pages?.pageSize}&PageNo=${pages?.current}`,
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

const updateRegisteredAsset = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/AssetManagement/EditAssetRegistration`,
      payload
    );
    setLoading(false);
    toast.success(res?.data?.message || "Submitted successfully", {
      toastId: "toastId",
    });
    cb();
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Something went wrong", {
      toastId: "toastId",
    });
  }
};

export {
  assetRegistrationColumn,
  getById,
  getData,
  initialValue,
  itemAddHandler,
  registrationColumn,
  rowDtoInputHandler,
  rowDtoInputHandlerOnBlur,
  saveHandler
};

