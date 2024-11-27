import axios from "axios";
import moment from "moment";

export const getAsyncEmployeeCommonApi = async ({
    orgId,
    buId,
    intId,
    value,
    minSearchLength = 3,
}) => {
    if (value?.length < minSearchLength) return;
    try {
        const response = await axios.get(`/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeBasicInfoSearchDDL&AccountId=${orgId || 0
            }&BusinessUnitId=${buId || 0}&intId=${intId || 0}&SearchText=${value || ""}`
        );
        const modifiedEmployeeDDL = Array.from(response?.data, (item) => ({
            ...item,
            value: item?.EmployeeId,
            label: item?.EmployeeName,
        }));
        return modifiedEmployeeDDL;
    } catch (_) {
        return [];
    }
};

export const getFiscalYearForNowOnLoad = () => {
    const monthYear = moment().format("MM-YYYY");
    let theYear;
    if (monthYear.split("-")[0] < 6) {
        let prevYear = moment(monthYear, "MM-YYYY")
            .subtract(1, "years")
            .format("YYYY");
        theYear = prevYear + "-" + monthYear.split("-")[1];
    } else {
        theYear =
            monthYear.split("-")[1] + "-" + (Number(monthYear.split("-")[1]) + 1);
    }
    return theYear;
};