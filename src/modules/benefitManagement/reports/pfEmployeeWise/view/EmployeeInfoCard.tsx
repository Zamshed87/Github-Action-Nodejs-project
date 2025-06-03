import { Col, Row } from "antd";
import { PCard, PCardBody } from "Components";

const InfoRow = ({ label, value }: { label: string; value: string | number | null }) => (
  <Col md={8} sm={12} xs={24} style={{ marginBottom: 8 }}>
    <strong>{label}: </strong> {value !== null && value !== undefined && value !== "" ? value : "Info."}
  </Col>
);

interface EmployeeInfo {
  strEmployeeStatus: string;
  strEmployeeName: string;
  strDesignation: string;
  strEmployeeCode: string;
  dteJoiningDate: string | null;
  strWorkplaceGroup: string;
  strServiceLength: string;
  strWorkplace: string;
  strEmploymentType: string;
  strDepartment: string;
  numTotalEmployeeContribution: number;
  numTotalCompanyContribution: number;
  numTotalProfitShare: number;
  numInTotalPFAmount: number;
  dteLastProfitShareDate: string | null;
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "_";
  const d = new Date(dateStr);
  return d.toLocaleDateString();
};

const EmployeeInfoCard = ({ employee }: { employee: EmployeeInfo }) => {
  return (
    <PCard>
      <PCardBody>
        <Row gutter={[16, 8]}>
          <InfoRow label="Employee Status" value={employee.strEmployeeStatus} />
          <InfoRow label="Employee Name" value={employee.strEmployeeName} />
          <InfoRow label="Designation" value={employee.strDesignation} />
          <InfoRow label="Employee Code" value={employee.strEmployeeCode} />
          <InfoRow label="Date of Joining" value={formatDate(employee.dteJoiningDate)} />
          <InfoRow label="Workplace Group" value={employee.strWorkplaceGroup} />
          <InfoRow label="Service Length" value={employee.strServiceLength} />
          <InfoRow label="Workplace" value={employee.strWorkplace} />
          <InfoRow label="Employment Type" value={employee.strEmploymentType} />
          <InfoRow label="Department" value={employee.strDepartment} />
          <InfoRow label="Total Employee Contribution" value={employee.numTotalEmployeeContribution} />
          <InfoRow label="Total Company Contribution" value={employee.numTotalCompanyContribution} />
          <InfoRow label="Total Profit Share" value={employee.numTotalProfitShare} />
          <InfoRow label="Total PF Amount" value={employee.numInTotalPFAmount} />
          <InfoRow label="Last Profit Share Date" value={formatDate(employee.dteLastProfitShareDate)} />
        </Row>
      </PCardBody>
    </PCard>
  );
};

export default EmployeeInfoCard;
