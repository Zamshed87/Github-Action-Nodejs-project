/* eslint-disable react-hooks/exhaustive-deps */
import { AddOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import AntTable from "../../../../common/AntTable";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import PrimaryButton from "../../../../common/PrimaryButton";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import "./styles.css";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";

const PolicyList = () => {
  const [searchString, setSearchString] = useState("");
  // const [filterAnchorEl, setfilterAnchorEl] = useState(null);
  const history = useHistory();
  const debounce = useDebounce();
  const [salaryPolicyList, getSalaryPolicyLandings, loading] = useAxiosGet();
  const [rowDto, setRowDto] = useState([]);
  //
  // getting account id and business unit id from redux store
  const { orgId } = useSelector((state) => state?.auth?.profileData);

  const onSearch = (value) => {
    setSearchString(value);
    debounce(() => {
      setRowDto(() => [
        ...salaryPolicyList.filter((item) =>
          item?.strPolicyName?.toLowerCase()?.includes(value.toLowerCase())
        ),
      ]);
    }, 500);
  };
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Payroll Policy";
  }, []);
  // getting all policy from server
  useEffect(() => {
    getSalaryPolicyLandings(
      `/Payroll/GetAllSalaryPolicy?accountId=${orgId}`,
      (data) => setRowDto(data)
    );
  }, [orgId]);

  const columns = [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      sorter: false,
      filter: false,
    },
    {
      title: "Policy Name",
      dataIndex: "strPolicyName",
      sorter: true,
      filter: false,
    },
    {
      title: "Per day salary calculation",
      dataIndex: "",
      render: (_, item) => (
        <div>
          {item?.isSalaryCalculationShouldBeActual
            ? "Gross Salary/Actual Month Days"
            : item?.intGrossSalaryDevidedByDays}
        </div>
      ),
      sorter: false,
      filter: false,
    },
    {
      title: "Gross Salary",
      dataIndex: "isPrimarySalary",
      render: (_, item) => (
        <div>
          {item?.isGrossSalaryRoundUp
            ? "Round Up"
            : item?.isGrossSalaryRoundDown
            ? "Round Down"
            : item?.intGrossSalaryRoundDigits}
        </div>
      ),
      sorter: false,
      filter: false,
    },
    {
      title: "Net Payable",
      dataIndex: "isAddition",
      render: (_, item) => (
        <div>
          {item?.isNetPayableSalaryRoundUp
            ? "Round Up"
            : item?.isNetPayableSalaryRoundDown
            ? "Round Down"
            : item?.intNetPayableSalaryRoundDigits}
        </div>
      ),
      sorter: false,
      filter: false,
    },
    {
      title: "Salary Period",
      dataIndex: "isTaxable",
      render: (_, item) => (
        <div>
          {" "}
          {item?.isSalaryShouldBeFullMonth
            ? "1 to end of the month"
            : item?.intPreviousMonthStartDay || item?.intNextMonthEndDay
            ? `Previous month ${item?.intPreviousMonthStartDay} to ${item?.intNextMonthEndDay}`
            : "-"}
        </div>
      ),
      sorter: false,
      filter: false,
    },
  ];

  return (
    <div className="table-card salary-policy-list-page-wrapper">
      {loading && <Loading />}
      <div className="table-card-heading">
        <div className="ml-2">
          {/* <h2 style={{ color: "#344054" }}>Policy List</h2> */}
        </div>

        <ul className="d-flex flex-wrap">
          <li>
            <form onSubmit={() => alert(searchString)}>
              <MasterFilter
                inputWidth="200px"
                width="200px"
                isHiddenFilter
                value={searchString}
                setValue={(value) => onSearch(value)}
                cancelHandler={() => {
                  setSearchString("");
                  setRowDto(salaryPolicyList);
                }}
                // handleClick={(e) => setfilterAnchorEl(e.currentTarget)}
              />
            </form>
          </li>
          <li>
            <PrimaryButton
              type="button"
              className="btn btn-default flex-center"
              label="Payroll Policy"
              icon={<AddOutlined />}
              onClick={() =>
                history.push(
                  "/administration/payrollConfiguration/salaryPolicy/create"
                )
              }
            />
          </li>
        </ul>
      </div>

      <div className="table-card-body">
        <div className="table-card-styled employee-table-card tableOne">
          {rowDto?.length > 0 ? (
            <AntTable
              data={rowDto}
              columnsData={columns}
              onRowClick={(data) => {
                history.push(
                  `/administration/payrollConfiguration/salaryPolicy/${data?.intPolicyId}`
                );
              }}
            />
          ) : (
            <NoResult title="No Result Found" para="" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PolicyList;
