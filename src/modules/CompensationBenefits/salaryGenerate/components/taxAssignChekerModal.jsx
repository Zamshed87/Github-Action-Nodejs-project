import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import NoResult from "../../../../common/NoResult";
import {
  createSalaryGenerateRequest,
  getSalaryGenerateRequestLandingById,
} from "../helper";
import { lastDayOfMonth } from "./../../../../utility/dateFormatter";

export default function TaxAssignCheckerModal({
  show,
  onHide,
  size,
  backdrop,
  classes,
  isVisibleHeading = true,
  fullscreen,
  title,
  takeHomePayTax,
  values,
  singleData,
  isEdit,
  resetForm,
  initialValues,
  setIsEdit,
  setRowDto,
  setLoading,
  loading,
  rowDto,
  params,
  state,
  setAllData,
}) {
  const { orgId, employeeId, wgId, wId, wName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // on Save
  const salaryGenerateHandler = (values) => {
    const modifyRowDto = rowDto
      ?.filter((itm) => itm?.isSalaryGenerate === true)
      ?.map((itm) => {
        return {
          intEmployeeId: itm?.intEmployeeId,
          strEmployeeName: itm?.strEmployeeName,
          intPayrollGroupId: itm?.intPayrollGroupId,
          strPayrollGroup: itm?.strPayrollGroup,
        };
      });

    const payload = {
      strPartName: "SalaryGenerateNReGenerateRequest",
      intSalaryGenerateRequestId: +params?.id
        ? state?.intSalaryGenerateRequestId
        : 0,
      strSalaryCode: " ",
      intAccountId: orgId,
      intWorkplaceGroupId: wgId,
      intWorkplaceId: wId,
      strWorkplace: wName,
      intBusinessUnitId: values?.businessUnit?.value,
      strBusinessUnit: values?.businessUnit?.label,
      intMonthId: values?.monthId,
      intYearId: values?.yearId,
      strDescription: values?.description,
      intCreatedBy: employeeId,
      strSalryType: values?.salaryTpe?.value,
      dteFromDate:
        values?.fromDate ||
        `${values?.yearId}-${
          values?.monthId <= 9 ? `0${values?.monthId}` : values?.monthId
        }-01`,
      dteToDate:
        values?.toDate || lastDayOfMonth(values?.monthId, values?.yearId),
      generateRequestRows: modifyRowDto,
    };
    const callback = () => {
      if (+params?.id) {
        getSalaryGenerateRequestLandingById(
          "SalaryGenerateRequestById",
          orgId,
          values?.businessUnit?.value,
          +params?.id,
          false,
          values?.intMonth,
          values?.intYear,
          values?.fromDate,
          values?.toDate,
          setRowDto,
          setAllData,
          setLoading,
          wId
        );
        getSalaryGenerateRequestLandingById(
          "SalaryGenerateRequestById",
          orgId,
          values?.businessUnit?.value,
          +params?.id,
          false,
          values?.intMonth,
          values?.intYear,
          values?.fromDate,
          values?.toDate,
          setRowDto,
          setAllData,
          setLoading,
          wId
        );
        resetForm(initialValues);
        setIsEdit(true);
        onHide();
      } else {
        resetForm(initialValues);
        setIsEdit(false);
        setRowDto([]);
        onHide();
      }
    };
    createSalaryGenerateRequest(payload, setLoading, callback);
  };

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
              <div className="modalBody pt-0 px-0">
                <div className="table-card-body px-2">
                  <div className="table-card-styled tableOne mt-1">
                    {takeHomePayTax?.length > 0 ? (
                      <table className="table">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>
                              <div>SL</div>
                            </th>
                            <th>
                              <div className="sortable" onClick={() => {}}>
                                <span>Employee Name</span>
                              </div>
                            </th>
                            <th>
                              <div className="sortable" onClick={() => {}}>
                                <span>Designation</span>
                              </div>
                            </th>
                            <th>
                              <div className="sortable" onClick={() => {}}>
                                <span>Payroll Group</span>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {takeHomePayTax.map((item, index) => (
                            <tr className="hasEvent" key={index}>
                              <td>
                                <div className="content tableBody-title">
                                  {index + 1}
                                </div>
                              </td>
                              <td>
                                <div className="content tableBody-title">
                                  {item?.strEmployeeName}
                                </div>
                              </td>
                              <td>
                                <div className="content tableBody-title">
                                  {item?.strDesignation}
                                </div>
                              </td>
                              <td>
                                <div className="content tableBody-title">
                                  {item?.strPayrollGroupName}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <>
                        {(loading && <Loading />) || (
                          <NoResult title="No Result Found" para="" />
                        )}
                      </>
                    )}
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
            <button
              className="btn btn-green btn-green-disable"
              style={{ width: "auto" }}
              type="button"
              onClick={() => salaryGenerateHandler(values)}
            >
              {singleData?.intSalaryGenerateRequestId
                ? "Skip &  Re-Generate"
                : "Skip & Generate"}
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
