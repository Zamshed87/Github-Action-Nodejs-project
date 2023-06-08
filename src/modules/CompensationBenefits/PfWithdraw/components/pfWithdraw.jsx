/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Tooltip } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import Chips from "../../../../common/Chips";
import DefaultInput from "../../../../common/DefaultInput";
import NoResult from "../../../../common/NoResult";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import {
  dateFormatter,
  dateFormatterForInput
} from "../../../../utility/dateFormatter";
import { numberWithCommas } from "../../../../utility/numberWithCommas";

function PFWithdraw({ propsObj }) {
  const {
    setValues,
    values,
    errors,
    touched,
    rowDto,
    setSingleData,
    isEdit,
    setIsEdit,
    demoPopup,
    resetForm,
    initialValues,
  } = propsObj;
  const scrollRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="my-4">
      <div className="table-card-body">
        <div className="row">
          <div className="col-lg-3">
            <label>Withdrawal Amount (BDT)</label>
            <DefaultInput
              classes="input-sm"
              value={values?.withdrawAmount}
              placeholder=""
              name="withdrawAmount"
              type="number"
              className="form-control"
              onChange={(e) => {
                setValues((prev) => ({
                  ...prev,
                  withdrawAmount: e.target.value,
                }));
              }}
              errors={errors}
              touched={touched}
            />
          </div>

          <div className="col-lg-3">
            <div className="input-field-main">
              <label>Application Date</label>
              <DefaultInput
                classes="input-sm"
                value={values?.applicationDate}
                placeholder=""
                name="applicationDate"
                type="date"
                className="form-control"
                onChange={(e) => {
                  setValues((prev) => ({
                    ...prev,
                    applicationDate: e.target.value,
                  }));
                }}
                errors={errors}
                touched={touched}
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="input-field-main">
              <label>Reason (Optional)</label>
              <DefaultInput
                classes="input-sm"
                value={values?.reason}
                placeholder=""
                name="reason"
                type="text"
                className="form-control"
                onChange={(e) => {
                  setValues((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }));
                }}
                errors={errors}
                touched={touched}
              />
            </div>
          </div>

          <div className="col-md-2 d-flex">
            <button
              style={{
                marginTop: "21px",
                padding: "0px 10px",
              }}
              className="btn btn-default mt-3"
              type="submit"
            >
              {isEdit ? "Update" : "Withdraw"}
            </button>
            {isEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEdit(false);
                  resetForm(initialValues);
                  setSingleData("");
                }}
                className="btn btn-green mt-3 ml-2"
                type="button"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="table-card-styled tableOne mt-2 leave-movement-FormCard">
          {rowDto?.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: "30px" }}>
                    <div>SL</div>
                  </th>
                  <th>
                    <div>Application Date</div>
                  </th>
                  <th className="text-right" style={{ width: "200px" }}>
                    <div>Withdrawal Amount</div>
                  </th>
                  <th className="text-right" style={{ width: "200px" }}></th>
                  <th>
                    <div>Reason</div>
                  </th>
                  <th>
                    <div>Admin Status</div>
                  </th>
                  <th>
                    <div></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {!!rowDto?.length &&
                  rowDto.map((item, index) => (
                    <tr className="hasEvent" key={index}>
                      <td style={{ width: "30px" }}>
                        <div className="tableBody-title">{index + 1}</div>
                      </td>
                      <td>
                        <div className="tableBody-title">
                          {dateFormatter(item?.dteApplicationDate)}
                        </div>
                      </td>
                      <td>
                        <div className="tableBody-title text-right">
                          {numberWithCommas(item?.numWithdrawAmount)} Tk
                        </div>
                      </td>
                      <td>
                        <div className="tableBody-title text-right"></div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-start">
                          <div className="tableBody-title pl-1">
                            {item?.strReason}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="tableBody-title">
                          {item?.strStatus === "Pending" && (
                            <Chips label={item?.strStatus} classess="warning" />
                          )}
                          {item?.strStatus === "Approved" && (
                            <Chips label={item?.strStatus} classess="success" />
                          )}
                          {item?.strStatus === "Rejected" && (
                            <Chips label={item?.strStatus} classess="danger" />
                          )}
                        </div>
                      </td>
                      <td width="5%">
                        {item?.strStatus === "Pending" && (
                          <div className="d-flex">
                            <Tooltip title="Edit" arrow>
                              <button className="iconButton" type="button">
                                <EditOutlinedIcon
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEdit(true);
                                    scrollRef?.current?.scrollIntoView({
                                      behavior: "smooth",
                                    });
                                    setSingleData(item);
                                    setValues({
                                      ...item,
                                      withdrawAmount: item?.numWithdrawAmount,
                                      applicationDate: dateFormatterForInput(
                                        item?.dteApplicationDate
                                      ),
                                      reason: item?.strReason,
                                      employee: {
                                        value: item?.intEmployeeId,
                                        label: item?.strEmployee,
                                      },
                                    });
                                  }}
                                />
                              </button>
                            </Tooltip>
                            <Tooltip title="Delete" arrow>
                              <button type="button" className="iconButton">
                                <DeleteOutlineOutlinedIcon
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEdit(false);
                                    setSingleData("");
                                    demoPopup(item);
                                  }}
                                />
                              </button>
                            </Tooltip>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <NoResult />
          )}
        </div>
      </div>
    </div>
  );
}

export default PFWithdraw;
