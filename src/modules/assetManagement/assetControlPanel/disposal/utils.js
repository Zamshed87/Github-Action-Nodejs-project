import { DeleteOutlineOutlined, Visibility } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import { dateFormatter } from "utility/dateFormatter";
import { formatMoney } from "utility/formatMoney";
import { todayDate } from "utility/todayDate";

const initialValue = {
  date: todayDate(),
  asset: "",
  customer: "",
  receiveAmount: "",
  disposeAmount: "",
  remarks: "",
  office: "",
  warehouse: "",
};

const salesColumn = (rowDto, setRowDto) => {
  return [
    {
      title: "SL",
      render: (_, index) => index + 1,
      sort: false,
      filter: false,
      className: "text-center",
      width: 50,
    },
    {
      title: "Code",
      dataIndex: "assetCode",
      sort: false,
      filter: false,
    },
    {
      title: "Asset",
      dataIndex: "assetLabel",
      sort: false,
      filter: false,
    },
    {
      title: "Book Value",
      dataIndex: "assetBookValue",
      sort: false,
      filter: false,
      render: (record) => formatMoney(record?.assetBookValue),
    },
    {
      title: "Current Value",
      dataIndex: "assetCurrentValue",
      sort: false,
      filter: false,
      render: (record) => formatMoney(record?.assetCurrentValue),
    },
    {
      title: "Sale Amount",
      dataIndex: "disposeAmount",
      sort: false,
      filter: false,
      render: (record) => formatMoney(record?.disposeAmount),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      sort: false,
      filter: false,
    },
    {
      title: "Action",
      dataIndex: "action",
      sort: false,
      filter: false,
      width: 100,
      className: "text-center",
      render: (_, index) => (
        <div className="d-flex justify-content-center">
          <Tooltip title="Delete" arrow>
            <button type="button" className="iconButton">
              <DeleteOutlineOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  deleteRowData(index, rowDto, setRowDto);
                }}
              />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];
};

const destroyColumn = (rowDto, setRowDto) => {
  return [
    {
      title: "SL",
      render: (_, index) => index + 1,
      sort: false,
      filter: false,
      className: "text-center",
      width: 50,
    },
    {
      title: "Code",
      dataIndex: "assetCode",
      sort: false,
      filter: false,
    },
    {
      title: "Asset",
      dataIndex: "assetLabel",
      sort: false,
      filter: false,
    },
    {
      title: "Book Value",
      dataIndex: "assetBookValue",
      sort: false,
      filter: false,
      render: (record) => formatMoney(record?.assetBookValue),
    },
    {
      title: "Current Value",
      dataIndex: "assetCurrentValue",
      sort: false,
      filter: false,
      render: (record) => formatMoney(record?.assetCurrentValue),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      sort: false,
      filter: false,
    },
    {
      title: "Action",
      dataIndex: "action",
      sort: false,
      filter: false,
      width: 100,
      className: "text-center",
      render: (_, index) => (
        <div className="d-flex justify-content-center">
          <Tooltip title="Delete" arrow>
            <button type="button" className="iconButton">
              <DeleteOutlineOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  deleteRowData(index, rowDto, setRowDto);
                }}
              />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];
};

const addHandler = (values, rowDto, setRowDto, disposalType, disposalId) => {
  if (!values?.asset?.label)
    return toast.warn("Please add Asset", { toastId: "toastId" });

  const newData = {
    ...values,
    assetLabel: values?.asset?.label,
    assetCode: values?.asset?.code,
    assetBookValue: values?.asset?.bookValue,
    assetCurrentValue: values?.asset?.currentValue,
    assetDescriptionRate: values?.asset?.depreciationRate,
    disposeType: disposalType,
    disposeId: disposalId,
    rowTotalAmount: values?.disposeQty * values?.disposeAmount,
    //disposeAmount: values?.disposeAmount,
  };
  const isFound = rowDto.find(
    (item) => item.asset.value === values.asset.value
  );
  if (isFound) {
    toast.warn(`${values.asset.label}  is already added `, {
      toastId: "toastId",
    });
    return;
  }
  setRowDto([...rowDto, newData]);
};

const deleteRowData = (index, rowDto, setRowDto) => {
  const rowData = rowDto?.filter((item, i) => i !== index);
  setRowDto(rowData);
};

const saveHandler = (
  values,
  saveAssetDisposal,
  rowDto,
  disposalId,
  orgId,
  buId,
  userName,
  employeeId,
  strBusinessUnit,
  strDisplayName,
  wId,
  wgId,
  cb
) => {
  if (rowDto?.length === 0) {
    return toast.warn("Add atleast one item", { toastId: "toastId" });
  }
  const objRow = [];
  let totalAmount = 0;

  rowDto.forEach((item) => {
    totalAmount += +item?.disposeAmount;
    return objRow.push({
      assetId: item?.asset?.value,
      assetName: item?.assetLabel,
      assetCode: item?.assetCode,
      itemId: item?.asset?.itemId,
      qty: 1,
      amount: +item?.disposeAmount || 0,
      assetBookValue: item?.assetBookValue,
      assetRescheduleValue: item?.assetCurrentValue,
      disposalTypeId: item?.disposeId,
      disposalTypeName: item?.disposeType,
      remarks: values?.remarks,
    });
  });
  if (disposalId === 1) {
    if (+totalAmount - +values?.receiveAmount < 0) {
      return toast.warn("Receive amount cannot be greater than total amount", {
        toastId: "toastId",
      });
    }
  }
  const payload = {
    objHeader: {
      accountId: orgId,
      branchId: buId,
      totalAmount: +totalAmount || 0,
      accountName: strDisplayName,
      branchName: strBusinessUnit,
      workplaceGroupId: wgId || 0,
      workplaceId: wId || 0,
      actionById: employeeId,
      actionByName: userName,
      partnerId: values?.customer?.value || 0,
      strCustomerName: values?.customer || "",
      paymentTypeName: "cash",
      paymentTypeId: 1,
      receiveAmount: +values?.receiveAmount || 0,
      pendingAmount: +totalAmount - +values?.receiveAmount || 0,
      dteInsertDate: values?.date,
      officeId: values?.office?.value || 0,
      warehouseId: values?.warehouse?.value || 0,
    },
    objRow: objRow,
  };
  saveAssetDisposal(
    `/AssetManagement/CreateAssetDisposalEntrysp`,
    payload,
    cb,
    true
  );
};

const salesLandingColumn = (page, paginationSize, setRowId, setIsModalOpen) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Date",
      dataIndex: "date",
      sort: false,
      filter: false,
      render: (record) => dateFormatter(record?.date),
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      sort: true,
      filter: false,
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      sort: true,
      filter: false,
      className: "text-right",
      render: (record) => {
        return formatMoney(record?.totalAmount);
      },
    },
    {
      title: "Rece. Amount",
      dataIndex: "pendingAmount",
      sort: false,
      filter: false,
      render: (record) => {
        return formatMoney(record?.pendingAmount);
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      sort: false,
      filter: false,
      className: "text-center",
      render: (record) => (
        <div className="d-flex justify-content-center">
          <Tooltip title="View" arrow>
            <button className="iconButton" type="button">
              <Visibility
                onClick={(e) => {
                  e.stopPropagation();
                  setRowId(record?.assetDisposalId);
                  setIsModalOpen(true);
                }}
              />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];
};

const destroyLandingColumn = (page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Date",
      dataIndex: "date",
      sort: false,
      filter: false,
      render: (record) => dateFormatter(record?.date),
    },
    {
      title: "AR Code",
      dataIndex: "assetCode",
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
      title: "Current Value",
      dataIndex: "currentValue",
      sort: true,
      filter: false,
      className: "text-right",
      render: (record) => {
        return formatMoney(record?.currentValue);
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      sort: false,
      filter: false,
    },
  ];
};

const salesViewColumn = () => {
  return [
    {
      title: "SL",
      render: (_, index) => index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Code",
      dataIndex: "assetCode",
      sort: true,
      filter: false,
      render: (item) => (item?.assetCode ? item?.assetCode : item?.assetId),
    },
    {
      title: "Asset",
      dataIndex: "assetName",
      sort: false,
      filter: false,
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
      title: "Current Value",
      dataIndex: "currentValue",
      sort: true,
      filter: false,
      className: "text-right",
      render: (record) => {
        return formatMoney(record?.currentValue);
      },
    },
    {
      title: "Sale Amount",
      dataIndex: "amount",
      sort: true,
      filter: false,
      className: "text-right",
      render: (record) => {
        return formatMoney(record?.amount);
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      sort: false,
      filter: false,
    },
  ];
};

const getData = (
  getLandingData,
  setSalesData,
  setDestroyData,
  typeId,
  orgId,
  buId,
  wId,
  wgId,
  pages,
  setPages,
  search
) => {
  getLandingData(
    `/AssetManagement/GetAssetDisposalLandingPagination?accountId=${orgId}&branchId=${buId}&typeId=${typeId}&viewOrder=desc&workplaceId=${wId}&workplaceGroupId=${wgId}&PageSize=${pages?.pageSize}&PageNo=${pages?.current}&SearchItem=${search}`,
    (res) => {
      typeId === 1 ? setSalesData(res?.data) : setDestroyData(res?.data);
      setPages?.({
        current: res?.currentPage,
        pageSize: res?.pageSize,
        total: res?.totalCount,
      });
    }
  );
};

export {
  addHandler,
  destroyColumn,
  destroyLandingColumn,
  getData, initialValue, salesColumn,
  salesLandingColumn,
  salesViewColumn,
  saveHandler
};

