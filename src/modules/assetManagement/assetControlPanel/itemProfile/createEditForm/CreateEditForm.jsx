import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
  getById,
  initialValue,
  saveItemProfileHandler,
  validationSchema,
} from "../utils";
import { Form, Formik } from "formik";
import BackButton from "common/BackButton";
import { useHistory, useParams } from "react-router-dom";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import PrimaryButton from "common/PrimaryButton";
import FormikCheckBox from "common/FormikCheckbox";
import { gray900, greenColor, success500 } from "utility/customColor";
import FormikInput from "common/FormikInput";
import Loading from "common/loading/Loading";
import { AddOutlined } from "@mui/icons-material";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import ViewModal from "common/ViewModal";
import CreateItemCategory from "../modal/CreateItemCategory";
import CreateUom from "../modal/CreateUom";
import CreateItemSubcategory from "../modal/CreateItemSubcategory";
import Required from "common/Required";
import UomLanding from "../modal/UomLanding";
import ItemCategoryLanding from "../modal/ItemCategoryLanding";
import ItemSubCategoryLanding from "../modal/ItemSubCategoryLanding";

const ItemProfileForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { orgId, buId, wgId, wId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [itemCategoryModalShow, setItemCategoryModalShow] = useState(false);
  const [itemSubCategoryModalShow, setItemSubCategoryModalShow] =
    useState(false);
  const [uomModalShow, setUomModalShow] = useState(false);
  const [uomLandingViewModal, setUomLandingViewModal] = useState(false);
  const [itemCategoryViewModal, setItemCategoryViewModal] = useState(false);
  const [itemSubCategoryViewModal, setItemSubCategoryViewModal] =
    useState(false);
  const [, saveItemProfile, loading] = useAxiosPost({});
  const [itemCategoryDDL, getItemCategory, , setItemCategoryDDL] = useAxiosGet(
    []
  );
  const [itemUomDDL, getItemUom, , setItemUomDDL] = useAxiosGet([]);
  const [itemSubcategoryDDL, getItemSubcategory, , setItemSubcategoryDDL] =
    useAxiosGet([]);
  const [singleData, getSingleData, singleDataLoading, setSingleData] =
    useAxiosGet({});

  const getData = () => {
    getItemCategory(
      `/AssetManagement/ItemCategoryDDL?accountId=${orgId}&businessUnitId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}`,
      (res) => {
        const modifyData = res?.map((item) => ({
          ...item,
          isEdit: false,
        }));
        setItemCategoryDDL(modifyData);
      }
    );
    getItemUom(
      `/AssetManagement/ItemUomDDL?accountId=${orgId}&businessUnitId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}`,
      (res) => {
        const modifyData = res?.map((item) => ({
          ...item,
          isEdit: false,
        }));
        setItemUomDDL(modifyData);
      }
    );
  };

  useEffect(() => {
    getData();
    if (id) {
      getById(
        id,
        getSingleData,
        setSingleData,
        orgId,
        buId,
        wId,
        wgId,
        getItemSubcategory
      );
    }
  }, [orgId, buId, wId, wgId, id]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Asset Management"));
    document.title = "Item Profile";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={id ? singleData : initialValue}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveItemProfileHandler(
          id,
          values,
          saveItemProfile,
          orgId,
          buId,
          wId,
          wgId,
          employeeId,
          () => {
            if (id) {
              history.push("/assetManagement/assetControlPanel/itemProfile");
            } else {
              resetForm(initialValue);
            }
          }
        );
      }}
    >
      {({ handleSubmit, values, errors, touched, setFieldValue }) => (
        <>
          {(loading || singleDataLoading) && <Loading />}
          <Form onSubmit={handleSubmit}>
            <div className="mb-2">
              <div className="table-card pb-2">
                <div className="table-card-heading">
                  <div className="d-flex align-items-center">
                    <BackButton
                      title={`${
                        !id ? "Create Item Profile" : "Edit Item Profile"
                      }`}
                    />
                  </div>
                  <div className="table-card-head-right">
                    <ul>
                      <li>
                        <PrimaryButton
                          className="btn btn-green btn-green-disable"
                          type="submit"
                          label="Save"
                          disabled={loading}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="table-card-body">
                <div className="card-style">
                  <div className="row py-2 px-1">
                    <div className="col-lg-3">
                      <label>
                        Item Name <Required />
                      </label>
                      <FormikInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.itemName}
                        name="itemName"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("itemName", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>
                        Description <Required />
                      </label>
                      <FormikInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.description}
                        name="description"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("description", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <label>
                            Item UoM <Required />
                          </label>
                          <label
                            className="pl-2"
                            style={{
                              color: success500,
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setUomLandingViewModal(true);
                            }}
                          >
                            See All
                          </label>
                        </div>
                        <div className="pb-1">
                          <button
                            type="button"
                            className="btn add-ddl-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUomModalShow(true);
                            }}
                          >
                            <AddOutlined sx={{ fontSize: "16px" }} />
                          </button>
                        </div>
                      </div>
                      <FormikSelect
                        placeholder=" "
                        classes="input-sm"
                        styles={customStyles}
                        name="itemUoM"
                        options={itemUomDDL || []}
                        value={values?.itemUoM}
                        onChange={(valueOption) => {
                          setFieldValue("itemUoM", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <label>
                            Item Category <Required />
                          </label>
                          <label
                            className="pl-2"
                            style={{
                              color: success500,
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setItemCategoryViewModal(true);
                            }}
                          >
                            See All
                          </label>
                        </div>
                        <div className="pb-1">
                          <button
                            type="button"
                            className="btn add-ddl-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setItemCategoryModalShow(true);
                            }}
                          >
                            <AddOutlined sx={{ fontSize: "16px" }} />
                          </button>
                        </div>
                      </div>
                      <FormikSelect
                        placeholder=" "
                        classes="input-sm"
                        styles={customStyles}
                        name="itemCategory"
                        options={itemCategoryDDL || []}
                        value={values?.itemCategory}
                        onChange={(valueOption) => {
                          setFieldValue("itemSubcategory", "");
                          setFieldValue("itemCategory", valueOption);
                          if (valueOption) {
                            getItemSubcategory(
                              `/AssetManagement/ItemSubCategoryDDL?accountId=${orgId}&businessUnitId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}&itemCategoryId=${valueOption?.value}`
                            );
                          } else {
                            setItemSubcategoryDDL([]);
                          }
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <label>
                            Item Sub-Category <Required />
                          </label>
                          <label
                            className="pl-2"
                            style={{
                              color: success500,
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setItemSubCategoryViewModal(true);
                            }}
                          >
                            See All
                          </label>
                        </div>
                        <div className="pb-1">
                          <button
                            type="button"
                            className="btn add-ddl-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setItemSubCategoryModalShow(true);
                            }}
                          >
                            <AddOutlined sx={{ fontSize: "16px" }} />
                          </button>
                        </div>
                      </div>
                      <FormikSelect
                        placeholder=" "
                        classes="input-sm"
                        styles={customStyles}
                        name="itemSubcategory"
                        options={itemSubcategoryDDL || []}
                        value={values?.itemSubcategory}
                        onChange={(valueOption) => {
                          setFieldValue("itemSubcategory", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.itemCategory}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Manufacturer/Brand Name</label>
                      <FormikInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.manufacturerName}
                        name="manufacturerName"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("manufacturerName", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
          {/* View Modal */}
          <ViewModal
            size="lg"
            title="Create Item Category"
            backdrop="static"
            classes="default-modal preview-modal"
            show={itemCategoryModalShow}
            onHide={() => setItemCategoryModalShow(false)}
          >
            <CreateItemCategory
              orgId={orgId}
              employeeId={employeeId}
              buId={buId}
              wId={wId}
              wgId={wgId}
              setItemCategoryModalShow={setItemCategoryModalShow}
              getData={getData}
            />
          </ViewModal>
          <ViewModal
            size="lg"
            title="Create Item UoM"
            backdrop="static"
            classes="default-modal preview-modal"
            show={uomModalShow}
            onHide={() => setUomModalShow(false)}
          >
            <CreateUom
              orgId={orgId}
              employeeId={employeeId}
              buId={buId}
              wId={wId}
              wgId={wgId}
              setUomModalShow={setUomModalShow}
              getData={getData}
            />
          </ViewModal>
          <ViewModal
            size="lg"
            title="Create Item Sub-Category"
            backdrop="static"
            classes="default-modal preview-modal"
            show={itemSubCategoryModalShow}
            onHide={() => setItemSubCategoryModalShow(false)}
          >
            <CreateItemSubcategory
              orgId={orgId}
              employeeId={employeeId}
              buId={buId}
              wId={wId}
              wgId={wgId}
              setItemSubCategoryModalShow={setItemSubCategoryModalShow}
              itemCategoryDDL={itemCategoryDDL}
              getItemSubcategory={getItemSubcategory}
            />
          </ViewModal>
          <ViewModal
            size="lg"
            title="UoM"
            backdrop="static"
            classes="default-modal preview-modal"
            show={uomLandingViewModal}
            onHide={() => setUomLandingViewModal(false)}
          >
            <UomLanding
              rowDto={itemUomDDL}
              setRowDto={setItemUomDDL}
              getData={getData}
            />
          </ViewModal>
          <ViewModal
            size="lg"
            title="Item Category"
            backdrop="static"
            classes="default-modal preview-modal"
            show={itemCategoryViewModal}
            onHide={() => setItemCategoryViewModal(false)}
          >
            <ItemCategoryLanding
              rowDto={itemCategoryDDL}
              setRowDto={setItemCategoryDDL}
              getData={getData}
            />
          </ViewModal>
          <ViewModal
            size="lg"
            title="Item Sub Category"
            backdrop="static"
            classes="default-modal preview-modal"
            show={itemSubCategoryViewModal}
            onHide={() => setItemSubCategoryViewModal(false)}
          >
            <ItemSubCategoryLanding
              itemSubcategoryDDL={itemSubcategoryDDL}
              setItemSubcategoryDDL={setItemSubcategoryDDL}
              getItemSubcategory={getItemSubcategory}
            />
          </ViewModal>
        </>
      )}
    </Formik>
  );
};

export default ItemProfileForm;
