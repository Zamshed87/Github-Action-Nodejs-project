import { DeleteOutlineOutlined, EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import FormikInput from "common/FormikInput";
import IConfirmModal from "common/IConfirmModal";
import PrimaryButton from "common/PrimaryButton";
import { todayDate } from "utility/todayDate";
import * as Yup from "yup";

const itemProfileColumn = (
  page,
  paginationSize,
  history,
  saveDeleteHandler,
  orgId,
  buId,
  employeeId,
  getData,
  getLandingData,
  setRowDto,
  wId,
  wgId,
  pages,
  setPages,
  getDeleteMessage,
  setDeleteMessage,
  deleteMessage
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
      title: "Item Code",
      dataIndex: "itemCode",
      sort: true,
      filter: false,
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      sort: true,
      filter: false,
    },
    {
      title: "UoM",
      dataIndex: "itemUom",
      sort: true,
      filter: false,
    },
    {
      title: "Category",
      dataIndex: "itemCategory",
      sort: true,
      filter: false,
    },
    {
      title: "Sub-Category",
      dataIndex: "itemSubCategoryName",
      sort: true,
      filter: false,
    },
    {
      title: "Actions",
      dataIndex: "action",
      sort: false,
      filter: false,
      className: "text-center",
      width: 100,
      render: (record) => (
        <div className="d-flex justify-content-center">
          <Tooltip title="Edit" arrow>
            <button className="iconButton" type="button">
              <EditOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  history.push(
                    `/assetManagement/assetControlPanel/itemProfile/edit/${record?.itemId}`
                  );
                }}
              />
            </button>
          </Tooltip>
          <Tooltip title="Delete" arrow>
            <button type="button" className="iconButton">
              <DeleteOutlineOutlined
              onClick={(e) => {
                e.stopPropagation();
                getDeleteMessage(
                  `/AssetManagement/CheckIfItemAssignOrNot?accountId=${orgId}&businessUnitId=${buId}&workplaceGroupId=${wgId}&workplaceId=${wId}&itemId=${record?.itemId}`,
                  (data) => {
                    setDeleteMessage(data);
              
                    // Move handlePopup here to ensure deleteMessage is updated before calling it
                    handlePopup(
                      saveDeleteHandler,
                      record,
                      orgId,
                      buId,
                      employeeId,
                      wId,
                      wgId,
                      data, // Use the newly set data directly
                      () => {
                        getData(
                          getLandingData,
                          setRowDto,
                          orgId,
                          buId,
                          wId,
                          wgId,
                          pages,
                          setPages,
                          ""
                        );
                      }
                    );
                  }
                );
              }}
              
              />
            </button>
          </Tooltip>
        </div>
      ),
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
    `/AssetManagement/ItemLandingWithPagination?accountId=${orgId}&businessUnitId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}&PageSize=${pages?.pageSize}&PageNo=${pages?.current}&SearchItem=${search}`,
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

const initialValue = {
  isAutoCode: false,
  itemCode: "",
  itemName: "",
  itemCategory: "",
  itemUoM: "",
  description: "",
  itemSubcategory: "",
  manufacturerName: "",
};

const validationSchema = Yup.object().shape({
  isAutoCode: Yup.boolean(),
  description: Yup.string().required("Description is required"),
  itemSubcategory: Yup.object()
    .shape({
      label: Yup.string().required("Item subcategory is required"),
      value: Yup.string().required("Item subcategory is required"),
    })
    .nullable()
    .required("Item subcategory is required"),
  itemCode: Yup.string().when("isAutoCode", {
    is: true,
    then: Yup.string().required("Item code is required"),
    otherwise: Yup.string(),
  }),
  itemName: Yup.string().required("Item name is required"),
  itemCategory: Yup.object()
    .shape({
      label: Yup.string().required("Item category is required"),
      value: Yup.string().required("Item category is required"),
    })
    .nullable()
    .required("Item category is required"),
  itemUoM: Yup.object()
    .shape({
      label: Yup.string().required("Item UoM is required"),
      value: Yup.string().required("Item UoM is required"),
    })
    .nullable()
    .required("Item UoM is required"),
});

const saveItemProfileHandler = (
  id,
  values,
  saveItemProfile,
  orgId,
  buId,
  wId,
  wgId,
  employeeId,
  cb
) => {
  const payload = {
    itemId: +id || 0,
    accountId: orgId,
    businessUnitId: buId,
    workplaceId: wId,
    workplaceGroupId: wgId,
    createdBy: employeeId,
    itemCode: values?.itemCode || "",
    isAutoCode: values?.isAutoCode,
    itemName: values?.itemName,
    itemCategoryId: values?.itemCategory?.value,
    itemCategory: values?.itemCategory?.label,
    strManufacturerName: values?.manufacturerName || "",
    description: values?.description,
    itemUomId: values?.itemUoM?.value,
    itemUom: values?.itemUoM?.label,
    barcode: values?.barcode || "",
    active: true,
    createdAt: todayDate(),
    price: +values?.price || 0,
    itemSubCategoryId: values?.itemSubcategory?.value,
    updatedAt: todayDate(),
    updatedBy: employeeId,
  };
  saveItemProfile(`/AssetManagement/SaveItem`, payload, cb, true);
};

const getById = (
  id,
  getSingleData,
  setSingleData,
  orgId,
  buId,
  wId,
  wgId,
  getItemSubcategory
) => {
  getSingleData(
    `/AssetManagement/GetItem?accountId=${orgId}&businessUnitId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}&itemId=${id}`,
    (res) => {
      const modifiedData = {
        isAutoCode: res?.isAutoCode,
        itemCode: res?.itemCode || "",
        itemName: res?.itemName,
        itemCategory: {
          label: res?.itemCategory,
          value: res?.itemCategoryId,
        },
        itemUoM: {
          label: res?.itemUom,
          value: res?.itemUomId,
        },
        description: res?.description,
        itemSubcategory: {
          label: res?.itemSubCategoryName,
          value: res?.itemSubCategoryId,
        },
        manufacturerName: res?.strManufacturerName,
      };
      setSingleData(modifiedData);
      if (res?.itemCategoryId) {
        getItemSubcategory(
          `/AssetManagement/ItemSubCategoryDDL?accountId=${orgId}&businessUnitId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}&itemCategoryId=${res?.itemCategoryId}`
        );
      }
    }
  );
};

const handlePopup = (
  saveDeleteHandler,
  data,
  orgId,
  buId,
  employeeId,
  wId,
  wgId,
  deleteMessage,
  cb
) => {
  console.log("deleteMessage", deleteMessage);

  const confirmObject = {
    closeOnClickOutside: false,
    message: `${
      deleteMessage?.message === true
        ? "This item is assigned. However do you want to delete this Item?"
        : "Do you want to delete this item?"
    }`,
    yesAlertFunc: () => {
      const payload = {
        itemId: data ? data?.itemId : 0,
        accountId: orgId,
        businessUnitId: buId,
        isAutoCode: data?.isAutoCode,
        itemCode: data?.itemCode || "",
        itemName: data?.itemName,
        itemCategoryId: data?.itemCategoryId,
        itemUomId: data?.itemUomId,
        active: false,
        createdAt: todayDate(),
        createdBy: employeeId,
        updatedAt: todayDate(),
        updatedBy: employeeId,
        workplaceId: wId,
        workplaceGroupId: wgId,
        itemCategory: data?.itemCategory,
        strManufacturerName: data?.strManufacturerName || "",
        description: data?.description,
        itemUom: data?.itemUom,
        barcode: data?.barcode || "",
        price: +data?.price,
        itemSubCategoryId: data?.itemSubCategoryId,
      };
      saveDeleteHandler(`/AssetManagement/SaveItem`, payload, cb, true);
    },
    noAlertFunc: () => {},
  };
  IConfirmModal(confirmObject);
};

const uomColumn = (rowDto, setRowDto, saveHandler, getData) => {
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
      title: "UoM Name",
      dataIndex: "label",
      sort: true,
      filter: false,
      render: (record, index) => {
        if (record?.isEdit) {
          return (
            <FormikInput
              classes="input-sm"
              placeholder=" "
              value={record?.label}
              name="itemUom"
              type="text"
              onChange={(e) => {
                const data = [...rowDto];
                data[index].label = e.target.value;
                setRowDto(data);
              }}
            />
          );
        } else {
          return record?.label;
        }
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      sort: false,
      filter: false,
      width: 200,
      className: "text-center",
      render: (record, index) => (
        <div className="d-flex justify-content-center ">
          {record?.isEdit ? (
            <>
              <PrimaryButton
                type="button"
                className="btn btn-default mr-1"
                label="Update"
                customStyle={{ padding: "5px 10px" }}
                onClick={() => {
                  saveHandler(record, () => {
                    getData();
                  });
                }}
              />
              <PrimaryButton
                type="button"
                className="btn btn-default bg-danger border-danger"
                label="Cancel"
                customStyle={{ padding: "5px 10px" }}
                onClick={() => {
                  const data = [...rowDto];
                  data[index].isEdit = false;
                  setRowDto(data);
                }}
              />
            </>
          ) : (
            <PrimaryButton
              type="button"
              className="btn btn-default"
              label="Edit"
              customStyle={{ padding: "5px 10px" }}
              onClick={() => {
                const data = [...rowDto];
                data[index].isEdit = true;
                setRowDto(data);
              }}
            />
          )}
        </div>
      ),
    },
  ];
};

const itemCategoryColumn = (rowDto, setRowDto, saveHandler, getData) => {
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
      title: "Item Category Name",
      dataIndex: "label",
      sort: true,
      filter: false,
      render: (record, index) => {
        if (record?.isEdit) {
          return (
            <FormikInput
              classes="input-sm"
              placeholder=" "
              value={record?.label}
              name="itemUom"
              type="text"
              onChange={(e) => {
                const data = [...rowDto];
                data[index].label = e.target.value;
                setRowDto(data);
              }}
            />
          );
        } else {
          return record?.label;
        }
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      sort: false,
      filter: false,
      width: 200,
      className: "text-center",
      render: (record, index) => (
        <div className="d-flex justify-content-center">
          {record?.isEdit ? (
            <>
              <PrimaryButton
                type="button"
                className="btn btn-default mr-1"
                label="Update"
                customStyle={{ padding: "5px 10px" }}
                onClick={() => {
                  saveHandler(record, () => {
                    getData();
                  });
                }}
              />
              <PrimaryButton
                type="button"
                className="btn btn-default bg-danger border-danger"
                label="Cancel"
                customStyle={{ padding: "5px 10px" }}
                onClick={() => {
                  const data = [...rowDto];
                  data[index].isEdit = false;
                  setRowDto(data);
                }}
              />
            </>
          ) : (
            <PrimaryButton
              type="button"
              className="btn btn-default"
              label="Edit"
              customStyle={{ padding: "5px 10px" }}
              onClick={() => {
                const data = [...rowDto];
                data[index].isEdit = true;
                setRowDto(data);
              }}
            />
          )}
        </div>
      ),
    },
  ];
};

const itemSubCategoryColumn = (rowDto, setRowDto, saveHandler, getData) => {
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
      title: "Item Category Name",
      dataIndex: "itemCategoryLabel",
      sort: true,
      filter: false,
    },
    {
      title: "Item Sub Category Name",
      dataIndex: "label",
      sort: true,
      filter: false,
      render: (record, index) => {
        if (record?.isEdit) {
          return (
            <FormikInput
              classes="input-sm"
              placeholder=" "
              value={record?.label}
              name="itemUom"
              type="text"
              onChange={(e) => {
                const data = [...rowDto];
                data[index].label = e.target.value;
                setRowDto(data);
              }}
            />
          );
        } else {
          return record?.label;
        }
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      sort: false,
      filter: false,
      width: 200,
      className: "text-center",
      render: (record, index) => (
        <div className="d-flex justify-content-center ">
          {record?.isEdit ? (
            <>
              <PrimaryButton
                type="button"
                className="btn btn-default mr-1"
                label="Update"
                customStyle={{ padding: "5px 10px" }}
                onClick={() => {
                  saveHandler(record, () => {
                    getData();
                  });
                }}
              />
              <PrimaryButton
                type="button"
                className="btn btn-default bg-danger border-danger"
                label="Cancel"
                customStyle={{ padding: "5px 10px" }}
                onClick={() => {
                  const data = [...rowDto];
                  data[index].isEdit = false;
                  setRowDto(data);
                }}
              />
            </>
          ) : (
            <PrimaryButton
              type="button"
              className="btn btn-default"
              label="Edit"
              customStyle={{ padding: "5px 10px" }}
              onClick={() => {
                const data = [...rowDto];
                data[index].isEdit = true;
                setRowDto(data);
              }}
            />
          )}
        </div>
      ),
    },
  ];
};

export {
  getById,
  getData,
  handlePopup,
  initialValue,
  itemCategoryColumn,
  itemProfileColumn,
  itemSubCategoryColumn,
  saveItemProfileHandler,
  uomColumn,
  validationSchema,
};
