import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import Loading from "common/loading/Loading";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import PrimaryButton from "common/PrimaryButton";
import BackButton from "common/BackButton";
import { dateFormatter, dateFormatterForInput } from "utility/dateFormatter";
import { Typography } from "@mui/material";
import { Article, LocalShipping, LocationOn } from "@mui/icons-material";
import { getReceiveActions } from "../utils";
import { todayDate } from "utility/todayDate";
import FormikInput from "common/FormikInput";
import { toast } from "react-toastify";

const ReceiveAssetDetails = () => {
  const history = useHistory();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [singleData, getSingleData, loading, setSingleData] = useAxiosGet({});
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (id) {
      getSingleData(
        `/AssetManagement/GetAssetMaintainceById?AssetMaintenanceId=${id}`,
        (res) => {
          const obj = {
            ...res,
            asset: res?.AssetId && {
              value: res?.AssetId,
              label: res?.AssetName,
            },
            employeeDDL: res?.EmployeeId && {
              value: res?.EmployeeId,
              label: res?.EmployeeName,
            },
            fromDate: dateFormatter(res?.FromDate),
            toDate: dateFormatter(res?.ToDate),
            cost: "",
            receiveDate: todayDate(),
          };
          setSingleData(obj);
        }
      );
    }
  }, [id]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Asset Management"));
    document.title = "Asset Maintenance";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={singleData}
      // validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        if (!values?.receiveDate)
          return toast.warn("Please select a receive date", {
            toastId: "receiveDate",
          });
        if (!values?.cost)
          return toast.warn("Please enter a cost", { toastId: "cost" });
        const payload = {
          assetId: +id,
          maintenanceDate: values?.receiveDate,
          cost: +values?.cost || 0,
        };
        getReceiveActions(payload, setDisabled, () => {
          history.goBack();
        });
      }}
    >
      {({ handleSubmit, setFieldValue, values, errors, touched }) => (
        <>
          {(loading || disabled) && <Loading />}
          <Form onSubmit={handleSubmit}>
            <div className="mb-2">
              <div className="table-card pb-2">
                <div className="table-card-heading">
                  <div className="d-flex align-items-center">
                    <BackButton title={`Receive Asset`} />
                  </div>
                  <div className="table-card-head-right">
                    <ul>
                      <li>
                        <PrimaryButton
                          className="btn btn-green btn-green-disable"
                          type="submit"
                          label="Receive"
                          disabled={loading}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="table-card-body">
                <div className="card-style">
                  {/* Asset Details */}
                  <div className="w-100" style={{ marginTop: "12px" }}>
                    <div
                      className="accordion_header d-flex justify-content-between"
                      style={{ padding: "16px" }}
                    >
                      <div className="d-flex justify-content-start align-items-center ">
                        <Article
                          sx={{
                            margin: "3px",
                            color: "#229a16 !important",
                            fontSize: "30px",
                          }}
                        />
                        <Typography
                          sx={{
                            "&.MuiTypography-root": {
                              fontSize: "18px",
                              fontWeight: "500",
                              lineHeight: "21.09px",
                              padding: "8px",
                            },
                          }}
                        >
                          <h2>Asset Details</h2>
                        </Typography>
                      </div>
                    </div>
                    <hr
                      style={{
                        margin: "0px",
                        backgroundColor: "var(--black400)",
                      }}
                    />
                    <div
                      className="accordion_body"
                      style={{ padding: "0 16px" }}
                    >
                      <div className="d-flex justify-content-between">
                        <div className="d-flex justify-content-start align-items-center">
                          <LocalShipping
                            sx={{
                              margin: "16px 0",
                              color: "#229a16 !important",
                              fontSize: "30px",
                            }}
                          />
                          <div style={{ paddingLeft: "16px" }}>
                            <Typography
                              sx={{
                                "&.MuiTypography-root": {
                                  fontSize: "14px",
                                  fontWeight: "400",
                                  lineHeight: "16.41px",
                                  paddingBottom: "8px",
                                },
                              }}
                            >
                              <h6>Service Provider Name</h6>
                            </Typography>
                            <Typography
                              sx={{
                                "&.MuiTypography-root": {
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  lineHeight: "16.41px",
                                },
                              }}
                            >
                              <span>{singleData?.ServiceProviderName}</span>
                            </Typography>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="circle"></div>
                            <Typography
                              sx={{
                                "&.MuiTypography-root": {
                                  fontSize: "14px",
                                  fontWeight: "400",
                                  lineHeight: "16.00px",
                                },
                              }}
                            >
                              <h6>Maintenance Start Date - </h6>
                            </Typography>
                            <Typography
                              sx={{
                                "&.MuiTypography-root": {
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  lineHeight: "16.00px",
                                  paddingLeft: "8px",
                                },
                              }}
                            >
                              <span>{dateFormatter(singleData?.FromDate)}</span>
                            </Typography>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-start align-items-center">
                        <LocationOn
                          sx={{
                            margin: "16px 0",
                            color: "#229a16 !important",
                            fontSize: "30px",
                          }}
                        />
                        <div style={{ paddingLeft: "16px" }}>
                          <Typography
                            sx={{
                              "&.MuiTypography-root": {
                                fontSize: "14px",
                                fontWeight: "400",
                                lineHeight: "16.41px",
                                paddingBottom: "8px",
                              },
                            }}
                          >
                            <h6>Service Provider Address</h6>
                          </Typography>
                          <Typography
                            sx={{
                              "&.MuiTypography-root": {
                                fontSize: "14px",
                                fontWeight: "500",
                                lineHeight: "16.41px",
                              },
                            }}
                          >
                            <span>{singleData?.ServiceProviderAddress}</span>
                          </Typography>
                        </div>
                      </div>

                      <hr
                        style={{
                          margin: "8px 0",
                          backgroundColor: "var(--black400)",
                        }}
                      />
                      <div
                        className="d-flex justify-content-between"
                        style={{ padding: "8px 0" }}
                      >
                        <Typography
                          sx={{
                            "&.MuiTypography-root": {
                              fontSize: "14px",
                              fontWeight: "400",
                              lineHeight: "16.41px",
                            },
                          }}
                        >
                          <h6>Asset Item Name</h6>
                        </Typography>
                        <div className="d-flex justify-content-between align-items-center">
                          <Typography
                            sx={{
                              "&.MuiTypography-root": {
                                fontSize: "16px",
                                fontWeight: "500",
                                lineHeight: "16.41px",
                              },
                            }}
                          >
                            <span>{singleData?.asset?.label}</span>
                          </Typography>
                        </div>
                      </div>
                      <div
                        className="d-flex justify-content-between"
                        style={{ padding: "8px 0" }}
                      >
                        <Typography
                          sx={{
                            "&.MuiTypography-root": {
                              fontSize: "14px",
                              fontWeight: "400",
                              lineHeight: "16.41px",
                            },
                          }}
                        >
                          <h6>Asset Item Code</h6>
                        </Typography>
                        <div className="d-flex justify-content-between align-items-center">
                          <Typography
                            sx={{
                              "&.MuiTypography-root": {
                                fontSize: "16px",
                                fontWeight: "500",
                                lineHeight: "16.41px",
                              },
                            }}
                          >
                            <span>{singleData?.AssetCode}</span>
                          </Typography>
                        </div>
                      </div>
                      <div
                        className="d-flex justify-content-between"
                        style={{ padding: "8px 0" }}
                      >
                        <Typography
                          sx={{
                            "&.MuiTypography-root": {
                              fontSize: "14px",
                              fontWeight: "400",
                              lineHeight: "16.41px",
                            },
                          }}
                        >
                          <h6>Employee Name</h6>
                        </Typography>
                        <div className="d-flex justify-content-between align-items-center">
                          <Typography
                            sx={{
                              "&.MuiTypography-root": {
                                fontSize: "16px",
                                fontWeight: "500",
                                lineHeight: "16.41px",
                              },
                            }}
                          >
                            <span>{singleData?.EmployeeName}</span>
                          </Typography>
                        </div>
                      </div>
                      <div
                        className="d-flex justify-content-between"
                        style={{ paddingTop: "8px" }}
                      >
                        <Typography
                          sx={{
                            "&.MuiTypography-root": {
                              fontSize: "14px",
                              fontWeight: "400",
                              lineHeight: "16.41px",
                            },
                          }}
                        >
                          <h6>Receive Date</h6>
                        </Typography>
                        <div className="d-flex justify-content-between align-items-center">
                          <Typography
                            sx={{
                              "&.MuiTypography-root": {
                                fontSize: "16px",
                                fontWeight: "500",
                                lineHeight: "16.41px",
                                width: "250px",
                              },
                            }}
                          >
                            <FormikInput
                              classes="input-sm"
                              placeholder=""
                              value={values?.receiveDate}
                              min={dateFormatterForInput(singleData?.FromDate)}
                              name="receiveDate"
                              type="date"
                              onChange={(e) => {
                                setFieldValue("receiveDate", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </Typography>
                        </div>
                      </div>
                      <div
                        className="d-flex justify-content-between"
                        // style={{ padding: "8px 0" }}
                      >
                        <Typography
                          sx={{
                            "&.MuiTypography-root": {
                              fontSize: "14px",
                              fontWeight: "400",
                              lineHeight: "16.41px",
                            },
                          }}
                        >
                          <h6>Cost</h6>
                        </Typography>
                        <div className="d-flex justify-content-between align-items-center">
                          <Typography
                            sx={{
                              "&.MuiTypography-root": {
                                fontSize: "16px",
                                fontWeight: "500",
                                lineHeight: "16.41px",
                                width: "250px",
                              },
                            }}
                          >
                            <FormikInput
                              classes="input-sm"
                              placeholder=" "
                              value={values?.cost}
                              name="cost"
                              type="number"
                              onChange={(e) => {
                                if (e.target.value > 0) {
                                  setFieldValue("cost", e.target.value);
                                } else {
                                  setFieldValue("cost", "");
                                }
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </Typography>
                        </div>
                      </div>
                      <hr
                        style={{
                          margin: "8px 0",
                          backgroundColor: "var(--black400)",
                        }}
                      />

                      <div
                        className="justify-content-between"
                        style={{ padding: "5px 0 0 0" }}
                      >
                        <Typography
                          sx={{
                            "&.MuiTypography-root": {
                              fontSize: "14px",
                              fontWeight: "400",
                              lineHeight: "16.41px",
                            },
                          }}
                        >
                          <h6>Description</h6>
                        </Typography>
                        <div className="d-flex justify-content-between align-items-center">
                          <Typography
                            sx={{
                              "&.MuiTypography-root": {
                                fontSize: "14px",
                                fontWeight: "400",
                                lineHeight: "16.41px",
                              },
                            }}
                            style={{ padding: "10px 0 0 0" }}
                          >
                            <span>{singleData?.Narration}</span>
                          </Typography>
                        </div>
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

export default ReceiveAssetDetails;
