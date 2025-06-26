import { AppstoreAddOutlined } from "@ant-design/icons";
import { PButton, PCardHeader, PSelect } from "Components";
import ViewModal from "common/ViewModal";
import { downloadFile, getPDFAction } from "utility/downloadFile";
import HeaderView from "../components/HeaderView";
import PfLoanTable from "../components/pfLoanTable";
import { Form } from "antd";
import PrintTypeButton from "common/PrintTypeButton";
import { toast } from "react-toastify";
import axios from "axios";

const LoanDetailsView = ({
  loanByIdLoading,
  viewDetails,
  setViewDetails,
  loanByIdDto,
  setViewEarlySettled,
  setLoading,
  buId,
  wgId,
  values,
  setFieldValue,
  employeeId,
  getData,
  pages,
  singleData,
  onlyViewDetails = null,
}) => {
  const [form] = Form.useForm();

  const loanDetailsReport = async () => {
    const values = form.getFieldsValue(true);

    const type = values?.printType?.value === 2 ? "pdfView" : "excelView";
    setLoading?.(true);
    try {
      downloadFile(
        `/PdfAndExcelReport/PfLoanLifecycleGetByIdReport?Type=${type}&HeaderId=${loanByIdDto?.objHeader?.intEmployeeLoanHeaderId}`,
        "PF Loan Details Report",
        type === "pdfView" ? "pdf" : "xlsx",
        setLoading
      );
      //   const res = await axios.get(
      //     `/PdfAndExcelReport/PfLoanLifecycleGetByIdReport?Type=${type}&HeaderId=${loanByIdDto?.objHeader?.intEmployeeLoanHeaderId}`
      //   );
      //   if (res?.data) {
      //     setLoading?.(false);
      //   } else {
      //     toast.warn("No data received !");
      //     setLoading?.(false);
      //   }
    } catch (error) {
      setLoading?.(false);
      toast.warn(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <ViewModal
      size="xl"
      title="View Loan Details"
      backdrop="static"
      classes="default-modal preview-modal"
      show={!loanByIdLoading && viewDetails}
      onHide={() => setViewDetails(false)}
    >
      <div className="mx-3">
        <div className="d-flex justify-content-between">
          <HeaderView loanByIdDto={loanByIdDto} />
          {!onlyViewDetails && !loanByIdDto?.objHeader?.isEarlySettlement && (
            <div className="" style={{ marginTop: "0" }}>
              <PButton
                type="primary"
                content={"Early Settled"}
                icon={<AppstoreAddOutlined />}
                onClick={() => {
                  setViewDetails(false);
                  setViewEarlySettled(true);
                }}
              />
            </div>
          )}

          {onlyViewDetails ? (
            <PrintTypeButton form={form} onClick={loanDetailsReport} />
          ) : (
            <div className="" style={{ marginTop: "0" }}>
              <PButton
                type="primary"
                content={"Print"}
                icon={<i className="fa fa-print mr-2" />}
                onClick={() => {
                  getPDFAction(
                    `/PdfAndExcelReport/EmployeeLoanPdf?BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&LoanHeaderId=${loanByIdDto?.objHeader?.intEmployeeLoanHeaderId}`,
                    setLoading
                  );
                }}
              />
            </div>
          )}
        </div>

        <div
          style={{ maxHeight: "900px", overflowY: "scroll" }}
          className="pfLoan mt-2 mb-3"
        >
          {loanByIdDto?.objRow?.length > 0 && (
            <PfLoanTable
              header={loanByIdDto?.objHeader}
              generatedData={loanByIdDto?.objRow}
              isModal={true}
              totalInterest={loanByIdDto?.objHeader?.numTotalInterest}
              totalPrinciple={loanByIdDto?.objHeader?.numTotalPrincipal}
              totalInstallment={loanByIdDto?.objHeader?.numTotalInstallment}
              values={values}
              setFieldValue={setFieldValue}
              employeeId={employeeId}
              close={() => setViewDetails(false)}
              landing={() => getData("", pages)}
              singleData={singleData}
              onlyViewDetails={onlyViewDetails}
            />
          )}
        </div>
      </div>
    </ViewModal>
  );
};

export default LoanDetailsView;
