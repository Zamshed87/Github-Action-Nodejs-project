import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import {
  addHandler,
  destroyColumn,
  initialValue,
  salesColumn,
  saveHandler,
} from "../utils";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import Loading from "common/loading/Loading";
import PrimaryButton from "common/PrimaryButton";
import BackButton from "common/BackButton";
import Required from "common/Required";
import FormikInput from "common/FormikInput";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";
import { ViewList } from "@mui/icons-material";
import PeopleDeskTable from "common/peopleDeskTable";
import NoResult from "common/NoResult";

const AssetDisposalForm = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    orgId,
    buId,
    wgId,
    wId,
    employeeId,
    userName,
    strBusinessUnit,
    strDisplayName,
  } = useSelector((state) => state?.auth?.profileData, shallowEqual);

  const disposalId = location?.state?.data?.value;
  const disposalType = location?.state?.data?.label;

  const [, saveAssetDisposal, loading] = useAxiosPost({});
  const [assetItemDDL, getAssetItem] = useAxiosGet([]);
  const [rowDto, setRowDto] = useState([]);

  //get total
  const totalAmount = rowDto.reduce(
    (previousValue, currentValue) =>
      previousValue + +currentValue?.disposeAmount,
    0
  );

  useEffect(() => {
    getAssetItem(
      `/AssetManagement/GetAvailableAssetDDL?AccountId=${orgId}&BranchId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}`
    );
  }, [orgId, buId, wId, wgId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Asset Management"));
    document.title = "Asset Disposal";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValue}
      // validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(
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
          () => {
            resetForm(initialValue);
            setRowDto([]);
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
                    <BackButton title={`Create ${disposalType}`} />
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
                        Select Date <Required />
                      </label>
                      <FormikInput
                        classes="input-sm"
                        placeholder=""
                        value={values?.date}
                        name="date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("date", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {disposalId === 1 ? (
                      <div className="col-lg-3">
                        <label>
                          Customer <Required />
                        </label>
                        <FormikInput
                          classes="input-sm"
                          placeholder=""
                          value={values?.customer}
                          name="customer"
                          type="text"
                          onChange={(e) => {
                            setFieldValue("customer", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    ) : null}
                    {disposalId === 1 && (
                      <div className="col-lg-12">
                        <hr style={{ marginTop: "25px" }} />
                      </div>
                    )}
                    <div className="col-lg-3">
                      <label>
                        Asset <Required />
                      </label>
                      <FormikSelect
                        placeholder=""
                        classes="input-sm"
                        styles={customStyles}
                        name="asset"
                        options={assetItemDDL || []}
                        value={values?.asset}
                        onChange={(valueOption) => {
                          setFieldValue("asset", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {disposalId === 1 ? (
                      <div className="col-lg-3">
                        <label>
                          Sales Amount <Required />
                        </label>
                        <FormikInput
                          classes="input-sm"
                          placeholder=""
                          value={values?.disposeAmount}
                          name="customer"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("disposeAmount", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    ) : null}
                    <div className="col-lg-3">
                      <label>
                        Remarks <Required />
                      </label>
                      <FormikInput
                        classes="input-sm"
                        placeholder=""
                        value={values?.remarks}
                        name="remarks"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("remarks", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 mt-4">
                      <PrimaryButton
                        type="button"
                        className="btn btn-default flex-center"
                        label={"Add"}
                        disabled={
                          disposalId === 1
                            ? !values?.disposeAmount || !values?.asset
                            : !values?.asset
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          addHandler(
                            values,
                            rowDto,
                            setRowDto,
                            disposalType,
                            disposalId
                          );
                        }}
                      />
                    </div>
                    <div className="col-lg-12 mt-2 mb-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <ViewList sx={{ color: "#299647 !important" }} />
                          <p style={{ marginLeft: "10px" }}>Asset Lists</p>
                        </div>
                        {disposalId === 1 && (
                          <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                            Total Amount : {totalAmount}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="table-card-body">
                        {rowDto?.length > 0 ? (
                          <PeopleDeskTable
                            columnData={
                              disposalId === 1
                                ? salesColumn(rowDto, setRowDto)
                                : destroyColumn(rowDto, setRowDto)
                            }
                            rowDto={rowDto}
                            setRowDto={setRowDto}
                            uniqueKey="assetLabel"
                            isPagination={false}
                          />
                        ) : (
                          <>
                            {!loading && (
                              <div className="col-12">
                                <NoResult title={"No Data Found"} para={""} />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default AssetDisposalForm;
