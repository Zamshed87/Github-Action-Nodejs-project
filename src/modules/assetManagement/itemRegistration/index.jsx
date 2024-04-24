/* eslint-disable no-unused-vars */
import { DeleteOutlineOutlined, EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import AntTable from "../../../common/AntTable";
import IConfirmModal from "../../../common/IConfirmModal";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../utility/customColor";
import { todayDate } from "../../../utility/todayDate";
import AssetItemRegForm from "./AssetItemRegForm/AssetItemRegForm";
import { createEditItemReg, getDDL, getLandingData } from "./helper";

const initData = {
  search: "",
  isAutoCode: false,
  itemCode: "",
  itemName: "",
  itemCategory: "",
  itemUoM: "",
};

const validationSchema = Yup.object().shape({
  isAutoCode: Yup.boolean(),
  itemCode: Yup.string().when("isAutoCode", {
    is: true,
    then: Yup.string().required("Item code is required"),
    otherwise: Yup.string(),
  }),
  itemName: Yup.string().required("Item name is required"),
  itemCategory: Yup.object().shape({
    label: Yup.string().required("Item category is required"),
    value: Yup.string().required("Item category is required"),
  }),
  itemUoM: Yup.object().shape({
    label: Yup.string().required("Item UoM is required"),
    value: Yup.string().required("Item UoM is required"),
  }),
});

function AssetItemRegistration() {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Asset Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // states
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [itemCategoryDDL, setItemCategoryDDL] = useState([]);
  const [itemUoMDDL, setItemUoMDDL] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = () => {
    getDDL("/AssetManagement/ItemCategoryDDL", orgId, buId, setItemCategoryDDL);
    getDDL("/AssetManagement/ItemUomDDL", orgId, buId, setItemUoMDDL);
    getLandingData(orgId, buId, setRowDto, setLoading, setAllData);
  };

  useEffect(() => {
    // getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePopup = (payload, callback) => {
    let confirmObject = {
      closeOnClickOutside: false,
      message: "Do you want to perform this action?",
      yesAlertFunc: () => {
        createEditItemReg(payload, setLoading, callback);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const saveHandler = (values, cb) => {
    const callback = () => {
      getData();
      setSingleData("");
      setIsEdit(false);
      cb();
    };
    const payload = {
      itemId: singleData ? singleData?.itemId : 0,
      isAutoCode: values?.isAutoCode,
      itemCode: values?.itemCode || "",
      itemName: values?.itemName,
      itemCategoryId: values?.itemCategory?.value,
      itemUomId: values?.itemUoM?.value,
      active: true,
      createdAt: todayDate(),
      createdBy: employeeId,
      updatedAt: todayDate(),
      updatedBy: employeeId,
    };
    handlePopup(payload, callback);
  };

  const deleteHandler = (item) => {
    const callback = () => {
      getData();
    };
    const payload = {
      itemId: item ? item?.itemId : 0,
      accountId: orgId,
      businessUnitId: buId,
      isAutoCode: item?.isAutoCode,
      itemCode: item?.itemCode || "",
      itemName: item?.itemName,
      itemCategoryId: item?.itemCategory?.value,
      itemUomId: item?.itemUoM?.value,
      active: false,
      createdAt: todayDate(),
      createdBy: employeeId,
      updatedAt: todayDate(),
      updatedBy: employeeId,
    };
    handlePopup(payload, callback);
  };

  const handleEditClick = (record, values, setValues) => (e) => {
    setIsEdit(true);
    e.stopPropagation();
    scrollRef.current.scrollIntoView({
      behavior: "smooth",
    });
    setSingleData(record);
    setValues({
      ...values,
      isAutoCode: record?.isAutoCode,
      itemCode: record?.itemCode,
      itemName: record?.itemName,
      itemCategory: {
        value: record?.itemCategoryId,
        label: record?.itemCategory,
      },
      itemUoM: {
        value: record?.itemUomId,
        label: record?.itemUom,
      },
    });
  };

  const columns = (setValues, values) => {
    return [
      {
        title: "SL",
        render: (text, record, index) => index + 1,
        sorter: false,
        filter: false,
        className: "text-center",
      },
      {
        title: "Item Code",
        dataIndex: "itemCode",
        render: (_, record) => (
          <div className="d-flex align-items-center ">
            <div className="d-flex align-items-center">
              <div>{record?.itemCode}</div>
            </div>
          </div>
        ),
        sorter: false,
        filter: true,
      },
      {
        title: "Item Name",
        dataIndex: "itemName",
        sorter: true,
        filter: true,
        isNumber: true,
      },
      {
        title: "UoM",
        dataIndex: "itemUom",

        sorter: false,
        filter: false,
      },
      {
        title: "Category",
        dataIndex: "itemCategory",
        sorter: false,
        filter: false,
      },
      {
        className: "text-center",
        render: (data, record) => (
          <div className="d-flex justify-content-center">
            <Tooltip title="Edit" arrow>
              <button className="iconButton" type="button">
                <EditOutlined
                  onClick={handleEditClick(record, values, setValues)}
                />
              </button>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <button type="button" className="iconButton">
                <DeleteOutlineOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    setSingleData("");
                    deleteHandler(data, values);
                  }}
                />
              </button>
            </Tooltip>
          </div>
        ),
      },
    ];
  };

  const searchData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter(
        (item) =>
          regex.test(item?.itemName?.toLowerCase()) ||
          regex.test(item?.itemCategory?.toLowerCase()) ||
          regex.test(item?.itemCode?.toLowerCase()) ||
          regex.test(item?.itemUom?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  const permission = permissionList.find(
    (item) => item?.menuReferenceId === 30344
  );

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          setValues,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {loading && <Loading />}
            <Form onSubmit={handleSubmit}>
              {permission?.isCreate ? (
                <div className="table-card">
                  <div
                    ref={scrollRef}
                    className="table-card-heading pb-4 mb-4 pr-0"
                  >
                    <div className="table-card-head-right"></div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <AssetItemRegForm
                        propsObj={{
                          singleData,
                          handleSubmit,
                          initData,
                          resetForm,
                          values,
                          setValues,
                          errors,
                          touched,
                          setFieldValue,
                          isValid,
                          setRowDto,
                          isEdit,
                          setIsEdit,
                          setSingleData,
                          setLoading,
                          loading,
                          itemCategoryDDL,
                          setItemCategoryDDL,
                          itemUoMDDL,
                          setItemUoMDDL,
                        }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 my-3">
                      <div className="table-card-body pl-lg-1 pl-md-3">
                        <div>
                          <div className="d-flex align-items-center justify-content-between">
                            <h2 style={{ color: gray500, fontSize: "14px" }}>
                              Item List
                            </h2>
                            <MasterFilter
                              isHiddenFilter
                              styles={{
                                marginRight: "0px",
                              }}
                              width="200px"
                              inputWidth="200px"
                              value={values?.search}
                              setValue={(value) => {
                                searchData(value, allData, setRowDto);
                                setFieldValue("search", value);
                              }}
                              cancelHandler={() => {
                                getData();
                                setFieldValue("search", "");
                              }}
                            />
                          </div>
                        </div>

                        <div
                          className="table-card-styled table-responsive tableOne mt-2"
                          style={{ height: "190px" }}
                        >
                          {rowDto?.length > 0 ? (
                            <AntTable
                              data={rowDto}
                              columnsData={columns(setValues, values)}
                              onRowClick={(item) => {
                                setSingleData(item);
                              }}
                            />
                          ) : (
                            <>
                              {!loading && (
                                <NoResult title="No Result Found" para="" />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
export default AssetItemRegistration;
