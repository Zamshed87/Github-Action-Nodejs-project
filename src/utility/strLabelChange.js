export const labelChangeByOrgId = (orgId, label) => {
  switch (orgId) {
    case 10015:
      if (label === "Supervisor") {
        return "Reporting Line";
      }
      if (label === "Line Manager") {
        return "Team Leader";
      }
      break;
    default:
      if (label === "Supervisor") {
        return "Supervisor";
      }
      if (label === "Line Manager") {
        return "Line Manager";
      }
  }
};
