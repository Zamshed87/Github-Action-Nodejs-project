import React, { useEffect } from "react";
import { Form, Formik } from "formik";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import {
  depreciationDetailsColumn,
  depreciationSummaryColumn,
  initialValues,
  saveHandler,
} from "../utils";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import Loading from "common/loading/Loading";
import BackButton from "common/BackButton";
import PrimaryButton from "common/PrimaryButton";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import NoResult from "common/NoResult";
import PeopleDeskTable from "common/peopleDeskTable";

const AssetDepreciationForm = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { orgId, buId, wgId, wId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [, saveAssetDepreciation, loading] = useAxiosPost({});
  const [
    assetSummaryDetails,
    getAssetSummaryDetails,
    assetSummaryDetailsLoading,
  ] = useAxiosGet([]);
  const [
    assetDepreciationDetails,
    getAssetDepreciationDetails,
    assetDepreciationDetailsLoading,
  ] = useAxiosGet([]);

  useEffect(() => {
    getAssetSummaryDetails(
      `/AssetManagement/GetAssetDepreciationCalculate?accountId=${orgId}&branchId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}&transactionDate=${location?.state?.runDate}&typeId=2`
    );
    getAssetDepreciationDetails(
      `/AssetManagement/GetAssetDepreciationCalculate?accountId=${orgId}&branchId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}&transactionDate=${location?.state?.runDate}&typeId=1`
    );
  }, [orgId, buId, wId, wgId, location?.state?.runDate]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Asset Management"));
    document.title = "Depreciation";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(
            saveAssetDepreciation,
            orgId,
            buId,
            wId,
            wgId,
            location?.state?.runDate,
            employeeId,
            (res) => {
              if (res?.statusCode === 200) {
                setTimeout(() => {
                  history.goBack();
                }, 2000);
              }
            }
          );
        }}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            {(loading || assetSummaryDetailsLoading || assetDepreciationDetailsLoading) && <Loading />}
            <Form onSubmit={handleSubmit}>
              <div className="mb-2">
                <div className="table-card pb-2">
                  <div className="table-card-heading">
                    <div className="d-flex align-items-center">
                      <BackButton title={`Create Run Depreciation`} />
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
                    {assetSummaryDetails?.length > 0 ||
                    assetDepreciationDetails?.length > 0 ? (
                      <>
                        <PeopleDeskTable
                          columnData={depreciationSummaryColumn()}
                          rowDto={assetSummaryDetails}
                          uniqueKey="intGenLedgerId"
                          isPagination={false}
                        />
                        <PeopleDeskTable
                          columnData={depreciationDetailsColumn()}
                          rowDto={assetDepreciationDetails}
                          uniqueKey="intAssetId"
                          isPagination={false}
                        />
                      </>
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
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default AssetDepreciationForm;
