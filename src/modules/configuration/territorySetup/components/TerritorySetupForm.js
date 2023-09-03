/* eslint-disable react-hooks/exhaustive-deps */
import { useFormik } from "formik";
import { initData, validationSchema } from "../helper";
import Loading from "../../../../common/loading/Loading";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import DefaultInput from "../../../../common/DefaultInput";
import { Modal } from "react-bootstrap";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import { shallowEqual, useSelector } from "react-redux";

const TerritorySetupForm = ({
  id,
  show,
  setOpenModal,
  size,
  backdrop,
  classes,
  isVisibleHeading = true,
  fullscreen,
  title,
  territoryType,
  currentData,
  setCurrentData,
  getData,
  getTableViewLanding,
}) => {
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [, saveTerritorySetup, loading] = useAxiosPost({});

  const { setFieldValue, values, errors, touched, resetForm, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: initData,
      validationSchema: validationSchema,
      onSubmit: (values) => {
        saveHandler(values, () => {
          resetForm(initData);
          setOpenModal(false);
          getData();
          getTableViewLanding();
        });
      },
    });

  const saveHandler = (values, cb) => {
    const payload = {
      territoryId: 0,
      territoryName: values?.territoryName,
      parentTerritoryId: currentData?.parentTerritoryId || 0,
      workplaceGroupId: 3,
      hrPositionId: 2,
      territoryCode: values?.territoryCode,
      territoryAddress: values?.territoryAddress,
      territoryTypeId: values?.territoryType?.value,
      accountId: orgId,
      businessUnitId: buId,
      remarks: values?.remarks || "",
      isActive: true,
      createdBy: employeeId,
    };
    saveTerritorySetup(`/SaasMasterData/SaveTerritorySetup`, payload, cb, true);
  };

  const ttypeDDL = () => {
    return territoryType.filter(
      (item) => item?.intTerritoryTypeId > currentData?.territoryTypeId
    );
  };

  return (
    <>
      {loading && <Loading />}
      <div className="viewModal">
        <Modal
          show={show}
          onHide={() => {
            setOpenModal(false);
            resetForm(initData);
          }}
          size={size}
          backdrop={backdrop}
          aria-labelledby="example-modal-sizes-title-xl"
          className={classes}
          fullscreen={fullscreen && fullscreen}
        >
          <form onSubmit={handleSubmit}>
            {isVisibleHeading && (
              <Modal.Header className="bg-custom">
                <div className="d-flex w-100 justify-content-between align-items-center">
                  <Modal.Title className="text-center">{title}</Modal.Title>
                  <div>
                    <IconButton
                      onClick={() => {
                        resetForm(initData);
                        setOpenModal(false);
                      }}
                    >
                      <Close />
                    </IconButton>
                  </div>
                </div>
              </Modal.Header>
            )}
            <Modal.Body id="example-modal-sizes-title-xl">
              <div className="modalBody px-3">
                <div className="row">
                  <div className="col-lg-4">
                    <div className="input-field-main">
                      <label>Territory Type</label>
                      <FormikSelect
                        classes="input-sm"
                        styles={customStyles}
                        name="territoryType"
                        placeholder=""
                        options={
                          (currentData?.parentTerritoryId
                            ? ttypeDDL()
                            : territoryType) || []
                        }
                        value={values?.territoryType}
                        onChange={(valueOption) => {
                          setFieldValue("territoryType", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="input-field-main">
                      <label>Territory Name</label>
                      <DefaultInput
                        classes="input-sm"
                        value={values?.territoryName}
                        placeholder=""
                        name="territoryName"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("territoryName", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="input-field-main">
                      <label>Territory Code</label>
                      <DefaultInput
                        classes="input-sm"
                        value={values?.territoryCode}
                        placeholder=""
                        name="territoryCode"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("territoryCode", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="input-field-main">
                      <label>Territory Address</label>
                      <DefaultInput
                        classes="input-sm"
                        value={values?.territoryAddress}
                        placeholder=""
                        name="territoryAddress"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("territoryAddress", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="input-field-main">
                      <label>Remarks</label>
                      <DefaultInput
                        classes="input-sm"
                        value={values?.remarks}
                        placeholder=""
                        name="remarks"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("remarks", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  {/* <div className="col-md-3">
                <AttachmentUploadIcon
                  title="Upload Attachment"
                  onClick={(e) => setVisible(true)}
                  isAttachment={values?.attachment?.length > 0}
                />
                <AttachmentUploadModal
                  visible={visible}
                  setVisible={setVisible}
                  setFieldValue={setFieldValue}
                  values={values}
                  maxCount={1}
                />
              </div> */}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="form-modal-footer">
              <button
                className="btn btn-cancel"
                onClick={() => {
                  setCurrentData({});
                  setOpenModal(false);
                  resetForm(initData);
                }}
                type="button"
                isClose={true}
                label="Close"
              >
                Close
              </button>
              <button type="submit" className="btn btn-green flex-center mr-2">
                Save
              </button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default TerritorySetupForm;
