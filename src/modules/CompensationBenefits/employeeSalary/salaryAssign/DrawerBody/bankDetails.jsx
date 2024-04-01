import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import NoResult from "../../../../../common/NoResult";
import { colorLess } from "../../../../../utility/customColor";
import { numberWithCommas } from "../../../../../utility/numberWithCommas";
import { getEmployeeIncrementByEmoloyeeId } from "../helper";
import { dateFormatter } from "../../../../../utility/dateFormatter";
import { shallowEqual, useSelector } from "react-redux";

export default function BankDetails({
  show,
  onHide,
  size,
  backdrop,
  classes,
  isVisibleHeading = true,
  fullscreen,
  title,
  singleData,
  orgId,
  loading,
  setLoading,
}) {
  const [incrementHistoryList, setIncrementHistoryList] = useState([]);

  const { buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    if (singleData?.EmployeeId) {
      getEmployeeIncrementByEmoloyeeId(
        orgId,
        singleData?.EmployeeId,
        setIncrementHistoryList,
        setLoading,
        wgId,
        buId
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData, orgId]);

  return (
    <>
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
          {isVisibleHeading && (
            <Modal.Header className="bg-custom">
              <div className="d-flex w-100 justify-content-between align-items-center">
                <Modal.Title className="text-center">{title}</Modal.Title>
                <div>
                  <IconButton onClick={() => onHide()}>
                    <Close />
                  </IconButton>
                </div>
              </div>
            </Modal.Header>
          )}

          <Modal.Body id="example-modal-sizes-title-xl">
            <div className="businessUnitModal">
              <div className="modalBody pt-0">
                <div className="row mx-0">
                  <div className="table-card-body">
                    <div className="table-card-styled tableOne">
                      <table className="table table-bordered table-colored">
                        <thead>
                          <tr>
                            <th className="sortable" style={{ width: "30px" }}>
                              SL
                            </th>
                            <th>Increment Date</th>
                            <th>Increment Amount</th>
                            <th>New Gross Salary</th>
                            <th>Previous Gross Salary</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* incrementHistoryList */}
                          {incrementHistoryList?.length > 0 ? (
                            <>
                              {incrementHistoryList?.map((data, index) => (
                                <tr key={index}>
                                  <td
                                    style={{
                                      background:
                                        data?.strStatus === "Pending"
                                          ? "#FEF9DF"
                                          : "",
                                    }}
                                  >
                                    <div className="tableBody-title pl-1">
                                      {index + 1}
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      background:
                                        data?.strStatus === "Pending"
                                          ? "#FEF9DF"
                                          : "",
                                    }}
                                  >
                                    {dateFormatter(data?.dteEffectiveDate)}
                                  </td>
                                  <td
                                    style={{
                                      background:
                                        data?.strStatus === "Pending"
                                          ? "#FEF9DF"
                                          : "",
                                    }}
                                  >
                                    <div className="text-right">
                                      {data?.numIncrementAmount}
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      background:
                                        data?.strStatus === "Pending"
                                          ? "#FEF9DF"
                                          : "",
                                    }}
                                  >
                                    <div className="text-right">
                                      {numberWithCommas(
                                        data?.numCurrentGrossAmount
                                      )}
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      background:
                                        data?.strStatus === "Pending"
                                          ? "#FEF9DF"
                                          : "",
                                    }}
                                  >
                                    <div className="text-right">
                                      {numberWithCommas(
                                        data?.numOldGrossAmount
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </>
                          ) : (
                            <>
                              {!loading && (
                                <tr className="boxShadowNone">
                                  <td
                                    colSpan="8"
                                    style={{
                                      border: `1px solid ${colorLess}`,
                                    }}
                                  >
                                    <NoResult title="No Result Found" para="" />
                                  </td>
                                </tr>
                              )}
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="form-modal-footer">
            <button
              type="button"
              className="btn btn-cancel"
              sx={{
                marginRight: "10px",
              }}
              onClick={() => {
                onHide();
              }}
            >
              Cancel
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
