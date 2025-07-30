import moment from "moment";
import "../pfloan.css";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";
import { Tooltip } from "@mui/material";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import { useEffect, useState } from "react";
import ViewModal from "common/ViewModal";
import FormikCheckBox from "common/FormikCheckbox";
import { gray900, greenColor } from "utility/customColor";
import DefaultInput from "common/DefaultInput";
import { ModalFooter } from "Components/Modal";
const PfLoanTable = ({
  header,
  generatedData = [],
  isModal = false,
  totalInterest,
  totalPrinciple,
  totalInstallment,
  values,
  setFieldValue,
  employeeId,
  close,
  landing,
  singleData,
}) => {
  const [row, getLanding, loading, setRow] = useAxiosGet();
  const [, postData] = useAxiosPost();
  const [modalView, setModalView] = useState(false);
  const [generateRow, setGenerateRow] = useState(generatedData);
  const [holdOrCollect, setHoldOrCollect] = useState(false);
  const handleAmendmentClick = (
    tableData,
    setTableData,
    item,
    clickedRowIndex
  ) => {
    // Clone the existing tableData
    const updatedTableData = [...tableData];

    // Calculate the new date based on the clicked row or the last row
    const referenceIndex =
      clickedRowIndex >= 0 ? clickedRowIndex : updatedTableData.length - 1;
    const date =
      `${updatedTableData[referenceIndex]?.intYearId}` +
      `-${updatedTableData[referenceIndex].intMonthId
        ?.toString()
        .padStart(2, "0")}-01`;
    const referenceDate = moment(date);
    const newDate = referenceDate.isValid()
      ? referenceDate.add(1, "months")
      : moment();

    // Find the next available month that follows the sequence
    let nextDate = newDate.clone();
    while (
      updatedTableData.some((row) =>
        moment(
          `${row?.intYearId}` +
            `-${row.intMonthId?.toString().padStart(2, "0")}-01`
        ).isSame(nextDate, "month")
      )
    ) {
      nextDate.add(1, "month");
    }

    // Create a new data object for the last index with the new date
    // const newDataRow = {
    //   intRowId: 0,
    //   intEmployeeLoanHeaderId: item?.intEmployeeLoanHeaderId,
    //   intSerialNumber: updatedTableData.length + 1,
    //   intMonthId: nextDate.month() + 1,
    //   intYearId: nextDate.year() || 0,
    //   numPrincipalBeginingOfMonth: item?.numPrincipalBeginingOfMonth,
    //   numInterest: item?.numInterest,
    //   numPrincipal: item?.numPrincipal,
    //   numInstallment: item?.numInstallment,
    //   numPrincipalEndOfMonth: item?.numPrincipalEndOfMonth,
    //   strStatus: "Pending",
    //   strRemark: null,
    //   isHold: null,
    // };
    const newDataRow = {
      ...updatedTableData[updatedTableData.length - 1],
      intRowId: 0,
      intSerialNumber: updatedTableData.length + 1,
      intMonthId: nextDate.month() + 1,
      intYearId: nextDate.year() || 0,
    };

    updatedTableData.push(newDataRow);
    const temp = [...updatedTableData];
    updatedTableData?.forEach((item, index) => {
      if (index > clickedRowIndex && index < updatedTableData.length - 1) {
        updatedTableData[index] = {
          ...temp[index - 1],
          intSerialNumber: temp[index].intSerialNumber,
          intMonthId: temp[index].intMonthId,
          intYearId: temp[index].intYearId,
        };
      }
    });
    if (clickedRowIndex >= 0 && clickedRowIndex < updatedTableData.length - 1) {
      updatedTableData[clickedRowIndex] = {
        ...updatedTableData[clickedRowIndex],
        numPrincipalBeginingOfMonth: 0,
        numInterest: 0,
        numPrincipal: 0,
        numInstallment: 0,
        numPrincipalEndOfMonth: 0,
        isHold: "Hold",
        strStatus: "Hold",
        strRemarks: "",
      };
    }

    // Set the state with the updated array
    setTableData(updatedTableData);
  };
  useEffect(() => {
    setGenerateRow(generatedData);
  }, [generatedData]);
  return (
    <>
      {holdOrCollect && (
        <div
          className="d-flex align-items-center justify-content-end mb-3"
          style={{ position: "sticky" }}
        >
          <button
            type="button"
            className="btn btn-cancel"
            style={{
              marginRight: "15px",
            }}
            onClick={() => {
              setHoldOrCollect(false);
              setGenerateRow(generatedData);
            }}
          >
            Cancel
          </button>
          <button
            className="btn btn-green btn-green-disable"
            style={{ width: "auto" }}
            type="button"
            onClick={() => {
              setHoldOrCollect(false);
              const modifiedData = generateRow.map((obj) => ({
                rowId: 0,
                headerId: obj?.intEmployeeLoanHeaderId,
                serialNumber: obj?.intSerialNumber,
                monthId: obj?.intMonthId,
                yearId: obj?.intYearId,
                beginPrincipalAmountofMonth: obj?.numPrincipalBeginingOfMonth,
                interestAmount: obj?.numInterest,
                principalAmount: obj?.numPrincipal,
                installmentAmount: obj?.numInstallment,
                endPrincipalAmountofMonth: obj?.numPrincipalEndOfMonth,
                status: obj?.strStatus,
                isHold: obj?.isHold,
                remark: obj?.strRemark,
              }));
              postData(
                `/PfLoan/PfLoanHoldOrCollect`,
                {
                  isPfLoanHold: true,
                  pfLoanId: generateRow[0].intEmployeeLoanHeaderId,
                  businessUnitId: +header?.intBusinessUnitId,
                  workplaceGroupId: +header?.intWorkplaceGroupId,
                  rowData: modifiedData,
                },

                () => {
                  setModalView(false);
                  setHoldOrCollect(false);
                  close();

                  landing();
                },
                true
              );
            }}
          >
            Save
          </button>
        </div>
      )}
      <div className="pfLoan">
        <table className="w-100">
          <thead>
            <tr>
              <th rowSpan="2" className="left-align">
                Sl No.
              </th>
              <th rowSpan="2" className="left-align">
                Months
              </th>
              <th rowSpan="2">Principal (Beginning of month)</th>
              <th colSpan="2">Deduction</th>
              <th rowSpan="2">Installment</th>
              <th rowSpan="2">Principal (End of month)</th>
              {isModal && singleData?.strStatus === "Approved" && (
                <th rowSpan="0">Paid Status</th>
              )}
              {isModal && singleData?.strStatus === "Approved" && (
                <th rowSpan="0">Remark</th>
              )}
              {isModal && singleData?.strStatus === "Approved" && (
                <th rowSpan="0">Actions</th>
              )}
            </tr>
            <tr className="secondRow">
              <th>Interest</th>
              <th>Principal</th>
            </tr>
          </thead>
          <tbody>
            {generateRow?.map((dto, index) => (
              <tr key={index}>
                <td align="center">
                  {isModal ? dto?.intSerialNumber : dto?.sl}
                </td>
                <td align="center">
                  {isModal
                    ? moment(
                        `${dto?.intMonthId?.toString().padStart(2, "0")}-${
                          dto?.intYearId
                        }`,
                        "MM-YYYY"
                      ).format("MMM, YYYY")
                    : dto?.month}
                </td>
                <td align="center">
                  {isModal
                    ? dto?.numPrincipalBeginingOfMonth
                    : dto?.beginningBalance?.toFixed(2)}
                </td>
                <td align="center">
                  {isModal ? dto?.numInterest : dto?.interest?.toFixed(2)}
                </td>
                <td align="center">
                  {isModal ? dto?.numPrincipal : dto?.principal?.toFixed(2)}
                </td>
                <td align="center">
                  {isModal ? dto?.numInstallment : dto?.installment?.toFixed(2)}
                </td>
                <td align="center">
                  {isModal
                    ? dto?.numPrincipalEndOfMonth
                    : dto?.endingBalance?.toFixed(2)}
                </td>
                {isModal && singleData?.strStatus === "Approved" && (
                  <td align="center">{dto?.strStatus}</td>
                )}
                {isModal && singleData?.strStatus === "Approved" && (
                  <td align="center">{dto?.strRemark}</td>
                )}

                {isModal && singleData?.strStatus === "Approved" && (
                  <td
                    align="center"
                    className={`d-flex justify-content-between ${
                      dto?.strStatus === "Paid" ||
                      dto?.strStatus === "Hold" ||
                      dto?.isHold === "Hold"
                        ? "border-0"
                        : "py-3"
                    } `}
                  >
                    {dto?.strStatus !== "Paid" &&
                      dto?.strStatus !== "Hold" &&
                      dto?.isHold !== "Hold" && (
                        <div>
                          <Tooltip title="Hold" arrow>
                            <span>
                              <button
                                className="iconButton"
                                type="button"
                                title="Hold"
                              >
                                <BlockOutlinedIcon
                                  sx={{
                                    cursor: "pointer",
                                    fontSize: "15px",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setHoldOrCollect(true);
                                    // getLanding(
                                    //   `/Employee/GetPfLoanRowById?BusinessUnitId=${header?.intBusinessUnitId}&WorkplaceGroupId=${header?.intWorkplaceGroupId}&LoanHeaderId=${dto?.intEmployeeLoanHeaderId}&LoanRowId=${dto?.intRowId}`,
                                    //   (data) => {
                                    //     setModalView(true);
                                    //     setHoldOrCollect(true);
                                    //   }
                                    // );
                                    handleAmendmentClick(
                                      generateRow,
                                      setGenerateRow,
                                      dto,
                                      index
                                    );
                                  }}
                                />
                              </button>
                            </span>
                          </Tooltip>
                        </div>
                      )}
                    {dto?.strStatus !== "Paid" &&
                      dto?.strStatus !== "Hold" &&
                      dto?.isHold !== "Hold" && (
                        <div>
                          <Tooltip title="Collect" arrow placement="top">
                            <span>
                              <button
                                className="iconButton"
                                type="button"
                                title="Collect"
                              >
                                <PlaylistAddOutlinedIcon
                                  sx={{
                                    cursor: "pointer",
                                    fontSize: "15px",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    getLanding(
                                      `/PfLoan/GetPfLoanRowById?BusinessUnitId=${header?.intBusinessUnitId}&WorkplaceGroupId=${header?.intWorkplaceGroupId}&LoanHeaderId=${dto?.intEmployeeLoanHeaderId}&LoanRowId=${dto?.intRowId}`,
                                      (data) => {
                                        setModalView(true);
                                        setHoldOrCollect(false);
                                      }
                                    );
                                  }}
                                />
                              </button>
                            </span>
                          </Tooltip>
                        </div>
                      )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td align="center" colSpan="3">
                Total
              </td>
              <td align="center">
                {isModal
                  ? totalInterest
                  : generateRow
                      .reduce((sum, item) => sum + item.interest, 0)
                      ?.toFixed(2)}
              </td>
              <td align="center">
                {isModal
                  ? totalPrinciple
                  : generateRow
                      .reduce((sum, item) => sum + item.principal, 0)
                      ?.toFixed(2)}
              </td>
              <td align="center">
                {isModal
                  ? totalInstallment
                  : generateRow
                      ?.reduce((sum, item) => sum + item.installment, 0)
                      ?.toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        <ViewModal
          size="lg"
          title={holdOrCollect ? "Loan Hold" : "Loan Collect"}
          backdrop="static"
          classes="default-modal preview-modal"
          show={modalView}
          onHide={() => {
            setModalView(false);
            landing();
          }}
        >
          <div className="mx-3">
            <div
              style={{ maxHeight: "300px", overflowY: "scroll" }}
              className="pfLoan mt-2 mb-3"
            >
              {modalView && (
                <div className="pfLoan">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th rowSpan="2" className="left-align">
                          Sl No.
                        </th>
                        <th rowSpan="2" className="left-align">
                          Months
                        </th>
                        <th rowSpan="2">Principal (Beginning of month)</th>
                        <th colSpan="2">Deduction</th>
                        <th rowSpan="2">Installment</th>
                        <th rowSpan="2">Principal (End of month)</th>
                        <th rowSpan="2">Paid Status</th>
                        <th rowSpan="2">Remarks</th>
                      </tr>
                      <tr className="secondRow">
                        <th>Interest</th>
                        <th>Principal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td align="center">{row[0]?.intSerialNumber}</td>
                        <td align="center">
                          {moment(
                            `${row[0]?.intMonthId
                              ?.toString()
                              .padStart(2, "0")}-${row[0]?.intYearId}`,
                            "MM-YYYY"
                          ).format("MMM, YYYY")}
                        </td>
                        <td align="center">
                          {row[0]?.numPrincipalBeginingOfMonth}
                        </td>
                        <td align="center">{row[0]?.numInterest}</td>
                        <td align="center">{row[0]?.numPrincipal}</td>
                        <td align="center">{row[0]?.numInstallment}</td>
                        <td align="center">{row[0]?.numPrincipalEndOfMonth}</td>
                        <td align="center">{row[0]?.strStatus}</td>
                        <td align="center">{row[0]?.strRemark}</td>
                      </tr>
                    </tbody>
                    {/* <tfoot>
                    <tr>
                      <td align="center" colSpan="3">
                        Total
                      </td>
                      <td align="center">
                        {isModal
                          ? totalInterest
                          : generatedData
                              .reduce((sum, item) => sum + item.interest, 0)
                              ?.toFixed(2)}
                      </td>
                      <td align="center">
                        {isModal
                          ? totalPrinciple
                          : generatedData
                              .reduce((sum, item) => sum + item.principal, 0)
                              ?.toFixed(2)}
                      </td>
                      <td align="center">
                        {isModal
                          ? totalInstallment
                          : generatedData
                              ?.reduce((sum, item) => sum + item.installment, 0)
                              ?.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot> */}
                  </table>
                </div>
              )}
            </div>
            <div className="table-card-body">
              <div className="card-style my-2">
                <div className="row">
                  <div className="col-1 my-4">
                    <FormikCheckBox
                      height="25px"
                      styleObj={{
                        color: gray900,
                        checkedColor: greenColor,
                        padding: "0px 0px 0px 5px",
                      }}
                      label={holdOrCollect ? "Hold" : "Collect"}
                      name="isHold"
                      // value={isHoldSalary}
                      checked={values?.isHold}
                      onChange={(e) => {
                        // setIsHoldSalary(e.target.checked);
                        // holdSalaryHandler(e);
                        setFieldValue("isHold", e.target.checked);
                      }}
                    />
                  </div>
                  {holdOrCollect ? (
                    <div className="col-4">
                      <div className="input-field-main">
                        <label>Next Loan Disbursement Month </label>
                        <DefaultInput
                          classes="input-sm"
                          placeholder=" "
                          value={values?.monthYear}
                          name="monthYear"
                          type="month"
                          onChange={(e) => {
                            setFieldValue(
                              "yearId",
                              +e.target.value.split("").slice(0, 4).join("")
                            );
                            setFieldValue(
                              "monthId",
                              +e.target.value.split("").slice(-2).join("")
                            );
                            setFieldValue("monthYear", e.target.value);
                          }}
                          // errors={errors}
                          // touched={touched}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="col-4">
                      <div className="input-field-main">
                        <label>Collection Amount </label>
                        <DefaultInput
                          classes="input-sm"
                          placeholder=" "
                          value={row[0]?.numInstallment}
                          name="monthYear"
                          type="text"
                          disabled={true}
                        />
                      </div>
                    </div>
                  )}
                  <div className="col-5">
                    <div className="input-field-main">
                      <label>Comments </label>
                      <DefaultInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.comment}
                        name="comment"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("comment", e.target.value);
                        }}
                        // errors={errors}
                        // touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-2" style={{ marginTop: "21px" }}>
                    <button
                      className="btn btn-green btn-green-disable"
                      type="button"
                      disabled={!values?.isHold}
                      onClick={() => {
                        // getData(values?.search, pages);
                        postData(
                          `/PfLoan/PfLoanHoldOrCollect`,
                          {
                            isPfLoanHold: false,
                            pfLoanId: row[0]?.intEmployeeLoanHeaderId,
                            businessUnitId: header?.intBusinessUnitId,
                            workplaceGroupId: header?.intWorkplaceGroupId,
                            rowData: [
                              {
                                rowId: row[0]?.intRowId,
                                headerId: row[0]?.intEmployeeLoanHeaderId,
                                serialNumber: row[0]?.intSerialNumber,
                                monthId: row[0]?.intMonthId,
                                yearId: row[0]?.intYearId,
                                beginPrincipalAmountofMonth:
                                  row[0]?.numPrincipalBeginingOfMonth,
                                interestAmount: row[0]?.numInterest,
                                principalAmount: row[0]?.numPrincipal,
                                installmentAmount: row[0]?.numInstallment,
                                endPrincipalAmountofMonth:
                                  row[0]?.numPrincipalEndOfMonth,
                                status: row[0]?.strStatus,
                              },
                            ],
                            // intRowId: row[0]?.intRowId,
                            // intEmployeeLoanHeaderId:
                            //   row[0]?.intEmployeeLoanHeaderId,
                            // intMonthId: holdOrCollect
                            //   ? values?.monthId
                            //   : row[0]?.intMonthId,
                            // intYearId: holdOrCollect
                            //   ? values?.yearId
                            //   : row[0]?.intYearId,
                            // strRemark: values?.comment,
                            // numPrincipalBeginingOfMonth:
                            //   row[0]?.numPrincipalBeginingOfMonth,
                            // numInterest: row[0]?.numInterest,
                            // numPrincipal: row[0]?.numPrincipal,
                            // numInstallment: row[0]?.numInstallment,
                            // numPrincipalEndOfMonth:
                            //   row[0]?.numPrincipalEndOfMonth,
                            // strStatus: row[0]?.strStatus,
                            // isLoanHold: holdOrCollect ? true : false,
                            // intCreatedBy: employeeId,
                          },
                          () => {
                            setModalView(false);
                            setHoldOrCollect(false);
                            setFieldValue("comment", "");
                            landing(); // Ensure parent table is refreshed after update
                          },
                          true
                        );
                      }}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ViewModal>
      </div>
    </>
  );
};

export default PfLoanTable;
