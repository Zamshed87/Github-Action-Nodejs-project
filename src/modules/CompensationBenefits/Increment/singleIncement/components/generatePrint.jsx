import { useEffect, useRef, useState } from "react";
import { Card, Modal, Form } from "antd";
import { useLocation, useHistory } from "react-router-dom";
import { PButton, PSelect } from "Components";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { numberToWords } from "Utils";
import { useApiRequest } from "Hooks";

const GeneratePrint = () => {
  const location = useLocation();
  const history = useHistory();
  const [rowDto, setRowDto] = useState([]);
  const [empBasic, setEmpBasic] = useState({});
  const contentRef = useRef(null);
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);

  const [signatureInfo, setSignatureInfo] = useState({
    name: "",
    designation: "",
    department: "",
    workplace: "",
  });
  const employeeDDLApi = useApiRequest([]);
  const getEmployee = (value) => {
    if (value?.length < 2) return employeeDDLApi?.reset();

    employeeDDLApi?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };
  const [form] = Form.useForm();
  const { buId, wgId } = location.state?.globalSetting || { buId: 0, wgId: 0 };

  useEffect(() => {
    if (location.state) {
      setRowDto(location.state.rowDto || []);
      setEmpBasic(location.state.empBasic || {});
    }
  }, [location]);

  // Use a basic print function with minimal options
  const handlePrint = () => {
    if (contentRef.current) {
      // Save the original content to restore after printing
      const printContents = contentRef.current.innerHTML;
      const originalContents = document.body.innerHTML;

      // Add print-specific styles
      document.body.innerHTML = `
        <html>
          <head>
            <style>
              @page {
                size: A4;
                margin: 20mm;
              }
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
              }
              .no-print {
                display: none !important;
              }
              table {
                page-break-inside: avoid;
              }
              .print-container {
                padding: 10mm;
                box-sizing: border-box;
              }
              .footer-note {
                position: fixed;
                bottom: 10mm;
                left: 0;
                right: 0;
                text-align: center;
                font-style: italic;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${printContents}
            </div>
          </body>
        </html>
      `;

      // Trigger browser print
      window.print();

      // Restore original content
      document.body.innerHTML = originalContents;

      // This is needed to restore React event handlers
      window.location.reload();
    }
  };

  // Calculate total salary amount
  const totalSalary = rowDto.reduce((sum, item) => sum + item.numAmount, 0);

  const formatCurrency = (amount) => {
    return (
      amount?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      }) || "0.00"
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };


  const previousSalary = location?.state?.oldAmount || 0;
  const incrementPercentage = (
    ((totalSalary - previousSalary) / previousSalary) *
    100
  ).toFixed(2);

  // Handle signature modal
  const handleSignatureModal = () => {
    setSignatureModalVisible(true);
  };

  return (
    <div className="mx-auto p-4">
      <Card>
        <div className="d-flex align-items-center justify-content-between mb-3 no-print">
          <div className="d-flex align-items-center">
            <PButton
              type="default"
              icon={
                <ArrowBackIcon
                  style={{
                    fontSize: "16px",
                    marginRight: "5px",
                    color: "#000000",
                  }}
                />
              }
              content="Back"
              onClick={() => history.goBack()}
              style={{ marginRight: "15px" }}
            />
            <h2
              style={{
                fontWeight: "bold",
                margin: "0",
                fontSize: "18px",
                color: "#000000",
              }}
            >
              Increment Letter
            </h2>
          </div>
          <div className="d-flex">
            <PButton
              type="primary"
              content="Signature"
              style={{ marginRight: "15px" }}
              onClick={handleSignatureModal}
            />
            <PButton
              type="primary"
              icon={
                <LocalPrintshopIcon
                  style={{ fontSize: "18px", marginRight: "5px" }}
                />
              }
              content="Print"
              onClick={handlePrint}
            />
          </div>
        </div>

        <div
          ref={contentRef}
          style={{
            padding: "20px",
            fontSize: "16px",
            color: "#000000",
            lineHeight: "1.6",
            position: "relative",
            height: "auto",
            marginTop: "20px",
            width: "100%",
            boxSizing: "border-box",
            // Remove maxHeight constraint which can cause issues
            // Add proper page breaks
            pageBreakInside: "avoid",
            pageBreakAfter: "auto",
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              marginTop: "20px",
              fontSize: "16px",
              marginBottom: "30px",
              color: "#000000",
            }}
          >
            Date: {formatDate(new Date())}
          </p>

          <div style={{ marginTop: "20px" }}>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
                margin: "6px 0",
                color: "#000000",
              }}
            >
              To,
            </p>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
                margin: "6px 0",
                color: "#000000",
              }}
            >
              <strong>
                {empBasic?.employeeProfileLandingView?.strEmployeeName ||
                  "[Employee Name]"}
              </strong>
            </p>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
                margin: "6px 0",
                color: "#000000",
              }}
            >
              Employee Code:{" "}
              {empBasic?.employeeProfileLandingView?.strEmployeeCode ||
                "[Code]"}
            </p>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
                margin: "6px 0",
                color: "#000000",
              }}
            >
              {empBasic?.employeeProfileLandingView?.strDesignation ||
                "[Designation]"}
            </p>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
                margin: "6px 0",
                color: "#000000",
              }}
            >
              {empBasic?.employeeProfileLandingView?.strDepartment ||
                "[Department]"}
            </p>
          </div>

          <p
            style={{
              marginTop: "20px",
              fontWeight: "bold",
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#000000",
            }}
          >
            Subject: Salary Increment Notification
          </p>

          <p
            style={{
              marginTop: "15px",
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#000000",
            }}
          >
            Dear{" "}
            {empBasic?.employeeProfileLandingView?.strEmployeeName ||
              "[Employee Name]"}
            ,
          </p>

          <p
            style={{
              marginTop: "15px",
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#000000",
            }}
          >
            We are pleased to inform you that your monthly remuneration has been
            revised from{" "}
            <strong style={{ color: "#000000" }}>
              BDT {formatCurrency(previousSalary)}
            </strong>{" "}
            to{" "}
            <strong style={{ color: "#000000" }}>
              BDT {formatCurrency(totalSalary)}
            </strong>{" "}
            (an increment of{" "}
            <strong style={{ color: "#000000" }}>{incrementPercentage}%</strong>
            ), effective from{" "}
            <strong style={{ color: "#000000" }}>
              {formatDate(new Date())}
            </strong>
            , in recognition of your exceptional performance.
          </p>

          <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#000000" }}>
            The revised monthly remuneration details are as follows:
          </p>

          <table
            style={{
              width: "100%",
              border: "1px solid #000",
              borderCollapse: "collapse",
              marginTop: "15px",
              fontSize: "16px",
              color: "#000000",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "8px",
                    textAlign: "center",
                    fontSize: "16px",
                    color: "#000000",
                  }}
                >
                  SL
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "8px",
                    textAlign: "center",
                    fontSize: "16px",
                    color: "#000000",
                  }}
                >
                  Particulars
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "8px",
                    textAlign: "center",
                    fontSize: "16px",
                    color: "#000000",
                  }}
                >
                  Remuneration
                </th>
              </tr>
            </thead>
            <tbody>
              {rowDto.map((item, index) => (
                <tr key={item.intSalaryBreakdownRowId}>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      textAlign: "center",
                      fontSize: "16px",
                      color: "#000000",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      fontSize: "16px",
                      color: "#000000",
                    }}
                  >
                    {item.strPayrollElementName}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      textAlign: "right",
                      fontSize: "16px",
                      color: "#000000",
                    }}
                  >
                    {formatCurrency(item.numAmount)}
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan={2}
                  style={{
                    border: "1px solid #000",
                    padding: "8px",
                    textAlign: "right",
                    fontWeight: "bold",
                    fontSize: "16px",
                    color: "#000000",
                  }}
                >
                  Total Remuneration
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    padding: "8px",
                    textAlign: "right",
                    fontWeight: "bold",
                    fontSize: "16px",
                    color: "#000000",
                  }}
                >
                  {formatCurrency(totalSalary)}
                </td>
              </tr>
            </tbody>
          </table>

          <p
            style={{
              marginTop: "15px",
              fontWeight: "bold",
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#000000",
            }}
          >
            In Word: {numberToWords(totalSalary)} BDT Only
          </p>

          <p
            style={{
              marginTop: "20px",
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#000000",
            }}
          >
            We appreciate your dedication and look forward to your continued
            contributions. For any clarifications, contact HR Team.
          </p>

          <p
            style={{
              marginTop: "15px",
              fontWeight: "bold",
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#000000",
            }}
          >
            Congratulations!
          </p>

          {/* Place footer at the end of content rather than absolute positioning */}
          <div style={{ marginTop: "100px" }}>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
                margin: "6px 0",
                color: "#000000",
              }}
            >
              Sincerely,
            </p>
            <p
              style={{
                marginTop: "15px",
                fontSize: "16px",
                lineHeight: "1.6",
                margin: "6px 0",
                color: "#000000",
              }}
            >
              <strong style={{ color: "#000000" }}>
                {signatureInfo.name ||
                  empBasic?.employeeProfileLandingView?.supervisorName ||
                  ""}
              </strong>
            </p>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
                margin: "6px 0",
                color: "#000000",
              }}
            >
              {signatureInfo.designation ||
                empBasic?.employeeProfileLandingView?.supervisorDesignation ||
                ""}
            </p>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
                margin: "6px 0",
                color: "#000000",
              }}
            >
              {signatureInfo.department ||
                empBasic?.employeeProfileLandingView?.strDepartment ||
                ""}
            </p>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
                margin: "6px 0",
                color: "#000000",
              }}
            >
              {signatureInfo.workplace ||
                empBasic?.employeeProfileLandingView?.strWorkplace ||
                ""}
            </p>
          </div>
        </div>
      </Card>

      {/* Signature Modal */}
      <Modal
        title="Select Signatory"
        open={signatureModalVisible}
        onCancel={() => setSignatureModalVisible(false)}
        footer={[
          <PButton
            key="apply"
            type="primary"
            content="Apply Signature"
            onClick={() => setSignatureModalVisible(false)}
          />,
        ]}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item>
            <PSelect
              options={employeeDDLApi?.data || []}
              name="employee"
              label="Select Employee"
              placeholder="Search minimum 2 character"
              onChange={(value, op) => {
                setSignatureInfo({
                  name: op?.employeeNameWithCode || "",
                  designation: op?.designationName || "",
                  department: op?.strDepartment || "",
                  workplace: op?.workplace || "",
                });
                form.setFieldsValue({
                  employee: op,
                });
              }}
              showSearch
              filterOption={false}
              loading={employeeDDLApi?.loading}
              onSearch={(value) => {
                getEmployee(value);
              }}
              rules={[{ required: true, message: "Employee is required" }]}
            />
          </Form.Item>
        </Form>

        <div style={{ marginTop: "20px" }}>
          <h4>Preview:</h4>
          <div
            style={{
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          >
            <p style={{ margin: "3px 0" }}>Sincerely,</p>
            <p style={{ margin: "3px 0", fontWeight: "bold" }}>
              {signatureInfo.name || ""}
            </p>
            <p style={{ margin: "3px 0" }}>
              {signatureInfo.designation || ""}
            </p>
            <p style={{ margin: "3px 0" }}>
              {signatureInfo.department || ""}
            </p>
            <p style={{ margin: "3px 0" }}>
              {signatureInfo.workplace || ""}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GeneratePrint;
