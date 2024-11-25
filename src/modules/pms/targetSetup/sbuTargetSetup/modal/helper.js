import moment from "moment";

export const onChangeTargetFrequency = ({
  valueOption,
  values,
  setTargetList,
  year,
}) => {
  if (valueOption?.value === "Monthly") {
    let startMonth = moment(`Jun, ${year?.split("-")[0]}`, "MMM, YYYY");
    let next12Months = [];
    for (let i = 0; i < 12; i++) {
      next12Months.push({
        id: i + 1,
        intTargetId: null,
        intKPIsId: null,
        intYearId: i + 1,
        strYearName: null,
        numTarget: null,
        numAchivement: null,
        intFrequencyValue: 1,
        strTargetFrequency: "",
        intKPIForId: null,
        intEmployeeId: null,
        departmentId: null,
        intBusinessUnitId: null,
        strFrequencyValue: startMonth.add(1, "month").format("MMM, YYYY"),
      });
    }
    setTargetList(next12Months);
  } else if (valueOption?.value === "Quarterly") {
    let quarters = [];
    for (let i = 0; i < 4; i++) {
      quarters.push({
        id: i + 1,
        intTargetId: null,
        intKPIsId: null,
        intYearId: i + 1,
        strYearName: null,
        numTarget: null,
        numAchivement: null,
        intFrequencyValue: 1,
        strTargetFrequency: "",
        intKPIForId: null,
        intEmployeeId: null,
        departmentId: null,
        intBusinessUnitId: null,
        strFrequencyValue: `Quarter-${i + 1}`,
      });
    }
    setTargetList(quarters);
  } else if (valueOption?.value === "Yearly") {
    setTargetList([
      {
        id: 1,
        intTargetId: null,
        intKPIsId: null,
        intYearId: 1,
        strYearName: null,
        numTarget: null,
        numAchivement: null,
        intFrequencyValue: 1,
        strTargetFrequency: "",
        intKPIForId: null,
        intEmployeeId: null,
        departmentId: null,
        intBusinessUnitId: null,
        strFrequencyValue: year,
      },
    ]);
  } else {
    setTargetList([]);
  }
};
