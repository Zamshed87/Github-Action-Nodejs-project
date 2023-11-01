export const demo_policy = {
  policyName: "Policy -1",
  salaryFormat: "Monthly",
  salaryFormatPerDay: "Gross Salary/Actual Month Days",
  grossSalaryType: "Round Down",
  netPayableType: "Round Up",
  salaryPeriod: "1 to end of the month",
};

export const deleteSalaryPolicyById = async (id, history) => {
  try {
    // const res = await axios.get(`/Payroll/DeleteSalaryPolicyById?id=${id}`);
    history.push("/administration/payrollConfiguration/salaryPolicy");
  } catch (error) {}
};
