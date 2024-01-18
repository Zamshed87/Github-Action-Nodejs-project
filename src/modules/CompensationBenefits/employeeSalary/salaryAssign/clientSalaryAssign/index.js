import SalaryDrawer from "../SalaryDrawer";

export default function ClientSalaryAssignModule({
  isOpen,
  setIsOpen,
  setRowDto,
  setAllData,
  loading,
  setLoading,
  orgId,
  status,
  setBreakDownList,
  defaultPayrollElement,
  salaryInfoId,
  setSingleData,
  singleData,
  employeeId,
  payrollElementDDL,
  finalPayrollElement,
  breakDownList,
  policyData,
  defaultSalaryInitData,
  accId,
  setOpenIncrement,
  pages,
  setPages,
  setIsBulk,
  isBulk,
  setStep,
  step,
  selectedEmployee,
  setSelectedEmployee,
  cbLanding,
}) {
  const moduleRender = () => {
    return (
      <SalaryDrawer
        styles={{
          width: "50%",
        }}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        setAllData={setAllData}
        setRowDto={setRowDto}
        loading={loading}
        setLoading={setLoading}
        defaultPayrollElement={defaultPayrollElement}
        setBreakDownList={setBreakDownList}
        orgId={orgId}
        status={status}
        defaultSalaryInitData={defaultSalaryInitData}
        salaryInfoId={salaryInfoId}
        setSingleData={setSingleData}
        singleData={singleData}
        employeeId={employeeId}
        payrollElementDDL={payrollElementDDL}
        finalPayrollElement={finalPayrollElement}
        breakDownList={breakDownList}
        policyData={policyData}
        setOpenIncrement={setOpenIncrement}
        pages={pages}
        setPages={setPages}
        setIsBulk={setIsBulk}
        isBulk={isBulk}
        step={step}
        setStep={setStep}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
        cbLanding={cbLanding}
      />
    );
  };
  return <>{moduleRender(accId)}</>;
}
