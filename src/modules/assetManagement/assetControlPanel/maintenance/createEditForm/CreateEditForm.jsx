import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import { initialValue, saveHandler, validationSchema } from "../utils";
import Loading from "common/loading/Loading";
import PrimaryButton from "common/PrimaryButton";
import BackButton from "common/BackButton";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import Required from "common/Required";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";
import { AddOutlined } from "@mui/icons-material";
import FormikInput from "common/FormikInput";
import ViewModal from "common/ViewModal";
import CreateMaintenanceHead from "../modal/CreateMaintenanceHead";
import CreateServiceProviderName from "../modal/CreateServiceProviderName";
import { localUrl } from "../../registration/utils";

const AssetMaintenanceForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { orgId, buId, wgId, wId, employeeId, userName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [, saveAssetMaintenance, loading] = useAxiosPost({});
  const [assetDDL, getAsset] = useAxiosGet([]);
  const [maintenanceHeadDDL, getMaintenanceHead] = useAxiosGet([]);
  const [serviceProviderNameDDL, getServiceProviderName] = useAxiosGet([]);
  const [employeeDDL, getEmployee] = useAxiosGet([]);
  const [isView, setIsView] = useState(false);
  const [isProviderNameView, setIsProviderNameView] = useState(false);

  useEffect(() => {
    getAsset(
      `/AssetManagement/AssetForMaintainanceDDL?AccountId=${orgId}&BranchId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}`
    );
    getMaintenanceHead(
      `/AssetManagement/GetMaintenceHeadDDL?accountId=${orgId}&branchId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}`
    );
    getServiceProviderName(
      `/AssetManagement/GetServiceProviderNameDDL?accountId=${orgId}&branchId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}`
    );
    getEmployee(`/Employee/AllEmployeeDDL?intAccountId=${orgId}`);
  }, [orgId, buId, wId, wgId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Asset Management"));
    document.title = "Asset Maintenance";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValue}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(
          values,
          saveAssetMaintenance,
          orgId,
          buId,
          wId,
          wgId,
          employeeId,
          userName,
          () => {
            resetForm(initialValue);
            history.goBack();
          }
        );
      }}
    >
      {({ handleSubmit, values, errors, touched, setFieldValue }) => (
        <>
          {loading && <Loading />}
          <Form onSubmit={handleSubmit}>
            <div className="mb-2">
              <div className="table-card pb-2">
                <div className="table-card-heading">
                  <div className="d-flex align-items-center">
                    <BackButton title={`Send Asset to Maintenance`} />
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
                        Asset <Required />{" "}
                      </label>
                      <FormikSelect
                        placeholder=""
                        classes="input-sm"
                        styles={customStyles}
                        name="asset"
                        options={assetDDL || []}
                        value={values?.asset}
                        onChange={(valueOption) => {
                          setFieldValue("asset", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <label>
                            Maintenance Type <Required />
                          </label>
                        </div>
                        <div className="pb-1">
                          <button
                            type="button"
                            className="btn add-ddl-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsView(true);
                            }}
                          >
                            <AddOutlined sx={{ fontSize: "16px" }} />
                          </button>
                        </div>
                      </div>
                      <FormikSelect
                        placeholder=""
                        classes="input-sm"
                        styles={customStyles}
                        name="maintenanceHeadDDL"
                        options={maintenanceHeadDDL || []}
                        value={values?.maintenanceHeadDDL}
                        onChange={(valueOption) => {
                          setFieldValue("maintenanceHeadDDL", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>
                        Handed Over To <Required />{" "}
                      </label>
                      <FormikSelect
                        placeholder=""
                        classes="input-sm"
                        styles={customStyles}
                        name="employeeDDL"
                        options={employeeDDL || []}
                        value={values?.employeeDDL}
                        onChange={(valueOption) => {
                          setFieldValue("employeeDDL", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>
                        Maintenance Start Date <Required />{" "}
                      </label>
                      <FormikInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.fromDate}
                        name="fromDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <label>
                            Service Provider Name <Required />{" "}
                          </label>
                        </div>
                        <div className="pb-1">
                          <button
                            type="button"
                            className="btn add-ddl-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsProviderNameView(true);
                            }}
                          >
                            <AddOutlined sx={{ fontSize: "16px" }} />
                          </button>
                        </div>
                      </div>
                      <FormikSelect
                        placeholder=""
                        classes="input-sm"
                        styles={customStyles}
                        name="serviceProviderName"
                        options={serviceProviderNameDDL || []}
                        value={values?.serviceProviderName}
                        onChange={(valueOption) => {
                          setFieldValue("serviceProviderName", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>
                        Service Provider Address <Required />{" "}
                      </label>
                      <FormikInput
                        classes="input-sm"
                        placeholder=""
                        value={values?.serviceProviderAddress}
                        name="serviceProviderAddress"
                        type="text"
                        onChange={(e) => {
                          setFieldValue(
                            "serviceProviderAddress",
                            e.target.value
                          );
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Description</label>
                      <FormikInput
                        classes="input-sm"
                        placeholder=""
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
                  </div>
                </div>
              </div>
            </div>
          </Form>
          {/* View Modal */}
          <ViewModal
            size="lg"
            title="Create Maintenance Head"
            backdrop="static"
            classes="default-modal preview-modal"
            show={isView}
            onHide={() => setIsView(false)}
          >
            <CreateMaintenanceHead
              orgId={orgId}
              buId={buId}
              wId={wId}
              wgId={wgId}
              setIsView={setIsView}
              getMaintenanceHead={getMaintenanceHead}
            />
          </ViewModal>
          <ViewModal
            size="lg"
            title="Create Service Provider Name"
            backdrop="static"
            classes="default-modal preview-modal"
            show={isProviderNameView}
            onHide={() => setIsProviderNameView(false)}
          >
            <CreateServiceProviderName
              orgId={orgId}
              buId={buId}
              wId={wId}
              wgId={wgId}
              setIsProviderNameView={setIsProviderNameView}
              getServiceProviderName={getServiceProviderName}
            />
          </ViewModal>
        </>
      )}
    </Formik>
  );
};

export default AssetMaintenanceForm;
