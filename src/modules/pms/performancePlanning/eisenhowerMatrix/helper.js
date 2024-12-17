import moment from "moment";

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