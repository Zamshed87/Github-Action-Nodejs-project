import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import Loading from "common/loading/Loading";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import PrimaryButton from "common/PrimaryButton";
import BackButton from "common/BackButton";
import { dateFormatter } from "utility/dateFormatter";
import { Typography } from "@mui/material";
import {
  Article,
  AttachMoney,
  LocalShipping,
  LocationOn,
} from "@mui/icons-material";
import { getReceiveActions } from "../utils";

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
      // initialValues={initialValue}
      // validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        getReceiveActions(
          singleData?.AssetId,
          singleData?.CashInHandAmount,
          singleData?.Cost,
          setDisabled,
          () => {
            history.goBack();
          }
        );
      }}
    >
      {({ handleSubmit }) => (
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
                        <Article sx={{ margin: "3px" }} />
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
                          Asset Details
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
                          <LocalShipping sx={{ margin: "16px 0" }} />
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
                              Service Provider Name
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
                              {singleData?.ServiceProviderName}
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
                              From Date
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
                              {dateFormatter(singleData?.FromDate)}
                            </Typography>
                          </div>

                          <div className="d-flex align-items-center">
                            <Typography
                              sx={{
                                "&.MuiTypography-root": {
                                  fontSize: "14px",
                                  fontWeight: "400",
                                  lineHeight: "16.00px",
                                },
                              }}
                            >
                              To Date
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
                              {dateFormatter(singleData?.ToDate)}
                            </Typography>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-start align-items-center">
                        <LocationOn sx={{ margin: "16px 0" }} />
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
                            Service Provider Address
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
                            {singleData?.ServiceProviderAddress}
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
                          Asset Item Name
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
                            {singleData?.asset?.label}
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
                          Asset Item Code
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
                            {singleData?.AssetCode}
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
                          Employee Name
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
                            {singleData?.EmployeeName}
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
                          Cost
                        </Typography>
                        <div className="d-flex justify-content-between align-items-center">
                          <AttachMoney sx={{ marginRight: "6px" }} />
                          <Typography
                            sx={{
                              "&.MuiTypography-root": {
                                fontSize: "16px",
                                fontWeight: "500",
                                lineHeight: "16.41px",
                              },
                            }}
                          >
                            {singleData?.Cost}
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
                          Description
                        </Typography>
                        <div className="d-flex justify-content-between align-items-center">
                          <Typography
                            sx={{
                              "&.MuiTypography-root": {
                                fontSize: "14px",
                                fontWeight: "700",
                                lineHeight: "16.41px",
                              },
                            }}
                            style={{ padding: "10px 0 0 0" }}
                          >
                            {singleData?.Narration}
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
