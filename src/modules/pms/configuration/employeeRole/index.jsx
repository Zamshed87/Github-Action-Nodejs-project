/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../../common/PrimaryButton";
import { AddOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import Loading from "../../../../common/loading/Loading";
import AntTable from "../../../../common/AntTable";
import { employeeRoleLandingTableColumn } from "./helper";
import NoResult from "../../../../common/NoResult";
import ViewModal from "../../../../common/ViewModal";
// import AddRoleName from "../../../employeeProfile/employeeCreate&Edit/addRole";
import AntScrollTable from "../../../../common/AntScrollTable";

const EmployeeRole = () => {
  const {
    permissionList,
    profileData: { buId, orgId, employeeId },
  } = useSelector((state) => state?.auth, shallowEqual);
  const [show, setShow] = useState(false);
  const [
    employeeRoleList,
    getEmployeeRoleList,
    employeeRoleListLoading,
    setEmployeeRoleList,
  ] = useAxiosGet();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  useEffect(() => {
    getEmployeeRoleList(
      `/Employee/GetEmployeeRoleLanding?departmentId=0&pageNo=${pagination?.current}&pageSize=${pagination?.pageSize}`
    );
  }, [buId, orgId]);

  const permission = useMemo(
    () => permissionList?.find((item) => item?.menuReferenceId === 30467),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <>
      {employeeRoleListLoading && <Loading />}
      {permission?.isView ? (
        <>
          <div className="table-card">
            <div className="table-card-heading">
              <h2>Employee Role</h2>
              <ul>
                <li>
                  <PrimaryButton
                    type="button"
                    className="btn btn-default flex-center"
                    label="Employee Role"
                    icon={
                      <AddOutlined
                        sx={{
                          marginRight: "0px",
                          fontSize: "15px",
                        }}
                      />
                    }
                    onClick={() => {
                      if (!permission?.isCreate)
                        return toast.warn("You don't have permission");
                      setShow(true);
                    }}
                  />
                </li>
              </ul>
            </div>
            {employeeRoleList?.data?.length > 0 ? (
              <div className="table-card-body">
                <div className="table-card-styled table-responsive tableOne">
                  <AntScrollTable
                    rowClassName="pointer"
                    pagination={pagination}
                    onRowClick={(record) => {
                      setShow(true);
                    }}
                    handleTableChange={({ pagination: newPagination }) => {
                      const { current, pageSize, total } = newPagination;
                      setPagination((prev) => ({
                        ...prev,
                        current,
                        pageSize,
                        total,
                      }));
                      if (
                        (pagination?.current === current &&
                          pagination?.pageSize !== pageSize) ||
                        pagination?.current !== current
                      ) {
                        // onGetCoreCompetencyLanding({
                        //   getCompetencyList,
                        //   setCompetencyList,
                        //   pagination: newPagination,
                        //   setPagination,
                        //   buId,
                        //   orgId,
                        // });
                      }
                    }}
                    data={
                      Array.isArray(employeeRoleList?.data)
                        ? employeeRoleList?.data
                        : []
                    }
                    columnsData={employeeRoleLandingTableColumn({
                      setShow,
                      permission,
                      pagination,
                    })}
                  />
                </div>
              </div>
            ) : (
              <NoResult />
            )}
          </div>
          {/* <ViewModal
            size="lg"
            title="Create Employee Role Name"
            backdrop="static"
            classes="default-modal preview-modal"
            show={setShow}
            onHide={() => {
              setShow(false);
            //   setCompetencyId(null);
            //   resetClusterList({ clusterList, setClusterList });
            //   onGetCoreCompetencyLanding({
            //     getCompetencyList,
            //     setCompetencyList,
            //     pagination,
            //     setPagination,
            //     buId,
            //     orgId,
            //   });
            }}
          >
            <AddRoleName
            //   competencyId={competencyId}
              orgId={orgId}
              buId={buId}
              employeeId={employeeId}
            //   clusterList={clusterList}
            //   setClusterList={setClusterList}
              onHide={() => {
                setShow(false);
               //  setCompetencyId(null);
               //  resetClusterList({ clusterList, setClusterList });
               //  onGetCoreCompetencyLanding({
               //    getCompetencyList,
               //    setCompetencyList,
               //    pagination,
               //    setPagination,
               //    buId,
               //    orgId,
               //  });
              }}
              permission={permission}
            />
          </ViewModal> */}
        </>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default EmployeeRole;
