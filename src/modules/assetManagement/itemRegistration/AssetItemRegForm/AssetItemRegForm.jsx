/* eslint-disable react-hooks/exhaustive-deps */
import { AddOutlined } from "@mui/icons-material";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import FormikInput from "../../../../common/FormikInput";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import ViewModal from "../../../../common/ViewModal";
import { gray900, greenColor } from "../../../../utility/customColor";
import { customStyles } from "../../../../utility/selectCustomStyle";
import AddCategoryName from "./AddCategoryName";
import AddItemUoM from "./AddItemUoM";

function AssetItemRegForm({ propsObj }) {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    isEdit,
    setIsEdit,
    setSingleData,
    resetForm,
    initData,
    setLoading,
    loading,
    itemCategoryDDL,
    setItemCategoryDDL,
    itemUoMDDL,
    setItemUoMDDL,
  } = propsObj;
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  return (
    <>
      {loading && <Loading />}
      <div className="card-style">
        <div className="row py-2 px-1">
          <div className="col-lg-12 pb-1">
            <h1>Add Items</h1>
          </div>

          <div className="col-lg-12">
            <label>Is Manual Code</label>
            <FormikCheckBox
              height="15px"
              styleobj={{
                color: gray900,
                checkedColor: greenColor,
                padding: "0px 0px 0px 10px",
              }}
              label=""
              name="isAutoCode"
              checked={values?.isAutoCode}
              onChange={(e) => {
                setFieldValue("isAutoCode", e.target.checked);
              }}
            />
          </div>

          {values?.isAutoCode && (
            <div className="col-lg-3">
              <label>Item Code</label>
              <FormikInput
                classes="input-sm"
                placeholder=" "
                value={values?.itemCode}
                name="itemCode"
                type="text"
                onChange={(e) => {
                  setFieldValue("itemCode", e.target.value);
                }}
                errors={errors}
                touched={touched}
              />
            </div>
          )}

          <div className="col-lg-3">
            <label>Item Name</label>
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
            <div className="d-flex justify-content-between align-items-center">
              <label>Item Category</label>
              <div className="pb-1">
                <button
                  type="button"
                  className="btn add-ddl-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShow(true);
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
                setFieldValue("itemCategory", valueOption);
              }}
              errors={errors}
              touched={touched}
            />
          </div>

          <div className="col-lg-3">
            <div className="d-flex justify-content-between align-items-center">
              <label>Item UoM</label>
              <div className="pb-1">
                <button
                  type="button"
                  className="btn add-ddl-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShow2(true);
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
              options={itemUoMDDL || []}
              value={values?.itemUoM}
              onChange={(valueOption) => {
                setFieldValue("itemUoM", valueOption);
              }}
              errors={errors}
              touched={touched}
            />
          </div>

          <div className="col-lg-3 d-flex" style={{ marginTop: "21px" }}>
            <button
              className="btn btn-green btn-green-disable mr-1"
              type="submit"
            >
              {isEdit ? "Update" : "Add"}
            </button>
            {isEdit && (
              <button
                onClick={() => {
                  setIsEdit(false);
                  resetForm(initData);
                  setSingleData("");
                  // setImageFile("");
                }}
                className="btn btn-green"
                type="button"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* View Modal */}
      <ViewModal
        size="lg"
        title="Create Item Category Name"
        backdrop="static"
        classes="default-modal preview-modal"
        show={show}
        onHide={() => setShow(false)}
      >
        <AddCategoryName
          orgId={orgId}
          employeeId={employeeId}
          buId={buId}
          setItemCategoryDDL={setItemCategoryDDL}
          setShow={setShow}
          setLoading={setLoading}
        />
      </ViewModal>
      <ViewModal
        size="lg"
        title="Create Item UoM Name"
        backdrop="static"
        classes="default-modal preview-modal"
        show={show2}
        onHide={() => setShow2(false)}
      >
        <AddItemUoM
          orgId={orgId}
          employeeId={employeeId}
          buId={buId}
          setItemUoMDDL={setItemUoMDDL}
          setShow={setShow2}
          setLoading={setLoading}
        />
      </ViewModal>
    </>
  );
}

export default AssetItemRegForm;
