import { AddSharp, Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import FormikInput from "../../../../common/FormikInput";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { todayDate } from "../../../../utility/todayDate";
import StyledTable from "../components/StyledTable";
import {
  createFeatureGroup,
  getFeatureGroupLanding,
  getFeatureNameDDL,
  getModudleNameDDL
} from "../helper";
import Loading from "./../../../../common/loading/Loading";

const initData = {
  featureName: "",
  featureGroupName: "",
  moduleName: "",
  isCreate: false,
  isEdit: false,
  isView: false,
  isClose: false,
};

const validationSchema = Yup.object().shape({});

const AddEditFormComponent = ({
  show,
  onHide,
  size,
  backdrop,
  classes,
  isVisibleHeading = true,
  fullscreen,
  title,
  rowDto,
  setRowDto,
  setLandingData,
  featureName,
  singleData,
  setFeatureName,
  setAllData,
}) => {
  const [moduleNameDDL, setModuleNameDDL] = useState([]);
  const [featureNameDDL, setFeatureNameDDL] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getModudleNameDDL(setModuleNameDDL);
  }, []);

  const { userId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values, cb) => {
    if (rowDto.length > 0) {
      const newRowDto = rowDto.map((itm, index) => {
        return {
          ...itm,
          isCreate: itm?.isCreate,
          isEdit: itm?.isEdit,
          isView: itm?.isView,
          isClose: itm?.isClose,
        };
      });
      const payload = {
        isCreate: featureName ? false : true,
        strFeatureGroupName: values?.featureGroupName,
        intBusinessUnitId: buId,
        featureList: newRowDto,
      };
      const callback = () => {
        cb();
        getFeatureGroupLanding(buId, setLandingData, setAllData, setLoading);
        onHide();
      };
      createFeatureGroup(payload, setLoading, callback);
    } else {
      toast.warning("Please add at least One data");
    }
  };

  const addFeature = (values) => {
    if (
      !values?.featureName ||
      !values?.featureGroupName ||
      !values?.moduleName
    )
      return toast.warn("All fields are required");
    const exitsData = rowDto?.filter(
      (item) => values?.featureName?.value === item?.intMenuReferenceId
    );

    if (exitsData?.length > 0) return toast.warn("Already exits");
    const data = [...rowDto];
    data.push({
      intFeatureGroupId: 0,
      strFeatureGroupName: values?.featureGroupName,
      intBusinessUnitId: buId,
      intFirsLevelMenuId: values?.moduleName?.value,
      strFirsLevelMenuName: values?.moduleName?.label,
      intMenuReferenceId: values?.featureName?.value,
      strMenuReferenceName: values?.featureName?.label,
      isCreate: false,
      isEdit: false,
      isView: false,
      isClose: false,
      strInsertBy: userId,
      dteInsertDate: todayDate(),
      isActive: true,
    });
    setRowDto(data);
  };

  const singleCheckBoxHandler = (name, value, index) => {
    let data = [...rowDto];
    data[index][name] = value;
    setRowDto(data);
  };

  const remover = (payload) => {
    const filterArr = rowDto.filter(
      (itm) => itm?.intMenuReferenceId !== payload
    );
    setRowDto(filterArr);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          featureGroupName: featureName
            ? singleData[0]?.strFeatureGroupName
            : "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {loading && <Loading />}
            <div className="viewModal">
              <Modal
                show={show}
                onHide={onHide}
                size={size}
                backdrop={backdrop}
                aria-labelledby="example-modal-sizes-title-xl"
                className={classes}
                fullscreen={fullscreen && fullscreen}
              >
                <Form>
                  {isVisibleHeading && (
                    <Modal.Header className="bg-custom">
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <Modal.Title className="text-center">
                          {title}
                        </Modal.Title>
                        <div>
                          <IconButton
                            onClick={() => {
                              onHide();
                              resetForm(initData);
                              setRowDto([]);
                              setFeatureName("");
                            }}
                          >
                            <Close />
                          </IconButton>
                        </div>
                      </div>
                    </Modal.Header>
                  )}

                  <Modal.Body
                    id="example-modal-sizes-title-xl"
                    className="featureGroupModal"
                  >
                    <div
                      className="modalBody pt-1"
                      style={{ padding: "0px 15px" }}
                    >
                      <div className="row">
                        <div className="col-4">
                          <label>Feature Group Name</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.featureGroupName}
                            name="featureGroupName"
                            type="text"
                            className="form-control"
                            placeholder=""
                            onChange={(e) => {
                              setFieldValue("featureGroupName", e.target.value);
                            }}
                            disabled={featureName}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-4">
                          <label>Module Name</label>
                          <FormikSelect
                            name="moduleName"
                            options={moduleNameDDL || []}
                            value={values?.moduleName}
                            onChange={(valueOption) => {
                              getFeatureNameDDL(
                                valueOption?.value,
                                setFeatureNameDDL
                              );
                              setFieldValue("moduleName", valueOption);
                              setFieldValue("featureName", "");
                            }}
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                            placeholder=" "
                            isDisabled={false}
                            menuPosition="fixed"
                          />
                        </div>
                        <div className="col-4">
                          <label>Feature Name</label>
                          <FormikSelect
                            name="featureName"
                            options={featureNameDDL || []}
                            value={values?.featureName}
                            onChange={(valueOption) => {
                              setFieldValue("featureName", valueOption);
                            }}
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                            placeholder=" "
                            isDisabled={false}
                            menuPosition="fixed"
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <button
                            className="btn btn-green btn-green-less"
                            type="button"
                            onClick={() => addFeature(values)}
                          >
                            <AddSharp
                              sx={{
                                fontSize: "16px",
                                marginRight: "8px",
                              }}
                            />
                            ADD
                          </button>
                        </div>
                      </div>

                      <StyledTable
                        values={values}
                        errors={errors}
                        touched={touched}
                        setFieldValue={setFieldValue}
                        rowDto={rowDto}
                        setRowDto={setRowDto}
                        singleCheckBoxHandler={singleCheckBoxHandler}
                        remover={remover}
                      />
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="form-modal-footer">
                    <button
                      type="button"
                      className="btn btn-cancel"
                      onClick={() => {
                        onHide();
                        resetForm(initData);
                        setRowDto([]);
                        setFeatureName("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-green btn-green-disable"
                      type="submit"
                      onSubmit={() => handleSubmit()}
                    >
                      Save
                    </button>
                  </Modal.Footer>
                </Form>
              </Modal>
            </div>
          </>
        )}
      </Formik>
    </>
  );
};

export default AddEditFormComponent;
