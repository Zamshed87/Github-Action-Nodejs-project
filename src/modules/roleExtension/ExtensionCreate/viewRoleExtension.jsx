/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import BackButton from "../../../common/BackButton";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import SortingIcon from "../../../common/SortingIcon";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../utility/customColor";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import { getEmployeeProfileViewData } from "../../CompensationBenefits/salaryAssignAndDeduction/helper";
import Accordion from "../accordion";

export default function ViewRoleExtension() {
  const dispatch = useDispatch();

  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [empBasic, setEmpBasic] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [employeeRoles, getEmployeeRoles] = useAxiosGet();
  const [orgTypeOrder, setOrgTypeOrder] = useState("desc");
  const [orgNameOrder, setOrgNameOrder] = useState("desc");

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const location = useLocation();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    getEmployeeProfileViewData(
      +params?.id,
      setEmpBasic,
      setLoading,
      location?.state?.businessUnitId,
      location?.state?.workplaceGroupId
    );
  };

  useEffect(() => {
    getData();
    getEmployeeRoles(
      `/Auth/GetAllRoleExtensionLanding?strReportType=ListForCreatePage&intEmployeeId=${+params.id}&intAccountId=${orgId}`,
      (data) => {
        setRowDto([...data]);
        setAllData([...data]);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  // ascending & descending
  const commonSortByFilter = (filterType, property) => {
    const newRowData = [...allData];
    let modifyRowData = [];

    if (filterType === "asc") {
      modifyRowData = newRowData?.sort((a, b) => {
        if (a[property] > b[property]) return -1;
        return 1;
      });
    } else {
      modifyRowData = newRowData?.sort((a, b) => {
        if (b[property] > a[property]) return -1;
        return 1;
      });
    }
    setRowDto(modifyRowData);
  };
  
  return (
    <>
      {loading && <Loading />}
      <div className="employeeProfile-form-main w-100">
        <div className="employee-profile-main">
          <div className="table-card w-100 mt-2">
            <div className="table-card-heading">
              <div className="d-flex justify-content-center align-items-center">
                <BackButton title={"View Role Extension"} />
              </div>
            </div>
            <div className="card-style">
              <div className="px-1 mt-2">
                <Accordion empBasic={empBasic} />
              </div>
              <div>
                <h2
                  style={{
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    color: gray500,
                    fontSize: "14px",
                  }}
                >
                  Role Extension List
                </h2>
                <div className="table-card-body">
                  <div className="table-card-styled tableOne">
                    {rowDto?.length > 0 ? (
                      <>
                        <table className="table">
                          <thead>
                            <tr>
                              <th style={{ width: "30px" }}>
                                <div className="d-flex align-items-center pointer">
                                  SL
                                </div>
                              </th>

                              <th>
                                <div
                                  className="d-flex align-items-center pointer"
                                  onClick={() => {
                                    setOrgTypeOrder(
                                      orgTypeOrder === "desc" ? "asc" : "desc"
                                    );
                                    commonSortByFilter(
                                      orgTypeOrder,
                                      "strOrganizationTypeName"
                                    );
                                  }}
                                >
                                  Org. Type
                                  <div>
                                    <SortingIcon>
                                      viewOrder={orgTypeOrder}
                                    </SortingIcon>
                                  </div>
                                </div>
                              </th>
                              <th>
                                <div
                                  className="d-flex align-items-center pointer"
                                  onClick={() => {
                                    setOrgNameOrder(
                                      orgNameOrder === "desc" ? "asc" : "desc"
                                    );
                                    commonSortByFilter(
                                      orgNameOrder,
                                      "strOrganizationReffName"
                                    );
                                  }}
                                >
                                  Org. Name
                                  <div>
                                    <SortingIcon>
                                      viewOrder={orgNameOrder}
                                    </SortingIcon>
                                  </div>
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto?.map((item, index) => {
                              return (
                                <>
                                  <tr key={index} onClick={(e) => {}}>
                                    <td>{index + 1}</td>

                                    <td>
                                      <div className="content tableBody-title">
                                        {item?.strOrganizationTypeName}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="content tableBody-title">
                                        {item?.strOrganizationReffName}
                                      </div>
                                    </td>
                                  </tr>
                                </>
                              );
                            })}
                          </tbody>
                        </table>
                      </>
                    ) : (
                      <>
                        {rowDto.length < 1 && (
                          <NoResult title="No Result Found" para="" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
