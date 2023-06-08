import React from "react";
import { useEffect } from "react";
import { getPeopleDeskWithoutAllDDL } from "../../../employeeProfile/employeeFeature/helper";
import { getPeopleDeskAllDDL } from "../../../announcement/helper";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import DefaultInput from "../../../../common/DefaultInput";
import { shallowEqual, useSelector } from "react-redux";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

const AddEditForm = ({ propsObj }) => {
  const { buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const {
    values,
    setFieldValue,
    errors,
    touched,
    show,
    setOpenModal,
    size,
    setSingleData,
    backdrop,
    classes,
    title,
    resetForm,
    initData,
    handleSubmit,
  } = propsObj;

  const [hrPositionDDL, setHrPositionDDL] = useState([]);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);

  useEffect(() => {
    getPeopleDeskWithoutAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=${employeeId}`,
      "intWorkplaceGroupId",
      "strWorkplaceGroup",
      setWorkplaceGroupDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Position&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
      "PositionId",
      "PositionName",
      setHrPositionDDL
    );
  }, [wgId, buId, employeeId]);

  return (
    <Modal
      show={show}
      onHide={() => {
        setOpenModal(false);
        setSingleData(null);
        resetForm();
      }}
      size={size}
      backdrop={backdrop}
      aria-labelledby="example-modal-sizes-title-xl"
      className={classes}
    >
      <Modal.Header className="bg-custom">
        <div className="d-flex w-100 justify-content-between align-items-center">
          <Modal.Title className="text-center">{title}</Modal.Title>
          <div>
            <IconButton
              onClick={() => {
                resetForm(initData);
                setOpenModal(false);
                setSingleData(null);
              }}
            >
              <Close />
            </IconButton>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body id="example-modal-sizes-title-xl">
        <div className="modalBody px-3">
          <div className="row">
            <div className="col-lg-4 d-none">
              <div className="input-field-main">
                <label>HR Position</label>
                <FormikSelect
                  classes="input-sm"
                  styles={customStyles}
                  name="hrPosition"
                  placeholder=""
                  options={hrPositionDDL || []}
                  value={values?.hrPosition}
                  onChange={(valueOption) => {
                    setFieldValue("hrPosition", valueOption);
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
            <div className="col-lg-4 d-none">
              <div className="input-field-main">
                <label>Workplace Group</label>
                <FormikSelect
                  classes="input-sm"
                  styles={customStyles}
                  name="workplaceGroup"
                  placeholder=""
                  options={workplaceGroupDDL || []}
                  value={values?.workplaceGroup}
                  onChange={(valueOption) => {
                    setFieldValue("workplaceGroup", valueOption);
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="input-field-main">
                <label>Territory Type</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.territoryType}
                  placeholder=""
                  name="territoryType"
                  type="text"
                  onChange={(e) => {
                    setFieldValue("territoryType", e.target.value);
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="form-modal-footer">
        <button
          className="btn btn-cancel"
          onClick={() => {
            setOpenModal(false);
            setSingleData(null);
          }}
          type="button"
          isClose={true}
          label="Close"
        >
          Close
        </button>
        <button type="button" className="btn btn-green" onClick={handleSubmit}>
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditForm;
