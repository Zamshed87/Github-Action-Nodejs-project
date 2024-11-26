import React, { useEffect, useState } from "react";
import Loading from "../../../../../../common/loading/Loading";
import AntTable from "../../../../../../common/AntTable";
import { roleWiseJDLandingTable } from "./helper";
import useAxiosGet from "../../../../../../utility/customHooks/useAxiosGet";
import NoResult from "../../../../../../common/NoResult";
import { isArray } from "lodash";
import AntScrollTable from "../../../../../../common/AntScrollTable";

const RoleWiseJDLanding = () => {
  const [roleWiseJD, getRoleWiseJD, loadingOnGetJD, setRoleWiseJD] =
    useAxiosGet();
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 30,
    total: 0,
  });

  const getData = (pages) => {
    getRoleWiseJD(
      `/Employee/GetEmpRoleWiseJd?pageNo=${pages?.current}&pageSize=${pages?.pageSize}`,
      (data) => {
        console.log(data);
        setPages((prev) => ({
          ...prev,
          total: data?.totalCount,
        }));
        setRoleWiseJD(data?.data);
      }
    );
  };

  useEffect(() => {
    getData(pages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = ({ pagination }) => {
    setPages((prev) => ({ ...prev, ...pagination }));
    if (
      (pages?.current === pagination?.current &&
        pages?.pageSize !== pagination?.pageSize) ||
      pages?.current !== pagination?.current
    ) {
      return getData(pagination);
    }
  };

  return (
    <>
      {loadingOnGetJD && <Loading />}
      {roleWiseJD?.length <= 0 ? (
        <NoResult />
      ) : (
        <div className="table-card-body">
          <div className="table-card-styled table-responsive tableOne">
            <AntScrollTable
              data={isArray(roleWiseJD) ? roleWiseJD : []}
              columnsData={roleWiseJDLandingTable()}
              pages={pages?.pageSize}
              pagination={pages}
              handleTableChange={handleTableChange}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default RoleWiseJDLanding;
