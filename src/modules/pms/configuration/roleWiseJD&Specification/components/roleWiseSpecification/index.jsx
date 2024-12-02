import React, { useEffect, useState } from "react";
import useAxiosGet from "../../../../../../utility/customHooks/useAxiosGet";
import Loading from "../../../../../../common/loading/Loading";
import AntTable from "../../../../../../common/AntTable";
import { roleWiseSpecificationLandingTable } from "./helper";
import NoResult from "../../../../../../common/NoResult";
import { isArray } from "lodash";
import AntScrollTable from "../../../../../../common/AntScrollTable";

const RoleWiseSpecification = () => {
  const [
    roleWiseSpecification,
    getRoleWiseSpecification,
    loadingOnGetSpecification,
    setRoleWiseSpecification,
  ] = useAxiosGet();

  const [pages, setPages] = useState({
    current: 1,
    pageSize: 30,
    total: 0,
  });

  const getData = (pages) => {
    getRoleWiseSpecification(
      `/Employee/GetEmpRoleWiseSpecification?pageNo=${pages?.current}&pageSize=${pages?.pageSize}`,
      (data) => {
        setPages((prev) => ({
          ...prev,
          total: data?.totalCount,
        }));
        setRoleWiseSpecification(data?.data);
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
      {loadingOnGetSpecification && <Loading />}
      {roleWiseSpecification?.length <= 0 ? (
        <NoResult />
      ) : (
        <div className="table-card-body">
          <div className="table-card-styled table-responsive tableOne">
            <AntScrollTable
              data={isArray(roleWiseSpecification) ? roleWiseSpecification : []}
              columnsData={roleWiseSpecificationLandingTable()}
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

export default RoleWiseSpecification;
