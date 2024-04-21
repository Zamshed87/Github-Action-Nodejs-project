import React from "react";
import { uomColumn } from "../utils";
import NoResult from "common/NoResult";
import PeopleDeskTable from "common/peopleDeskTable";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import Loading from "common/loading/Loading";
import { shallowEqual, useSelector } from "react-redux";
import { todayDate } from "utility/todayDate";

const UomLanding = ({ rowDto, setRowDto, getData }) => {
  const { orgId, buId, wgId, wId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [, saveUom, loading] = useAxiosPost({});
  const saveHandler = (data, cb) => {
    const payload = {
      accountId: orgId,
      businessUnitId: buId,
      workplaceId: wId,
      workplaceGroupId: wgId,
      createdBy: employeeId,
      itemUomId: data?.value,
      itemUom: data?.label,
      active: true,
      createdAt: todayDate(),
    };
    saveUom(
      `/AssetManagement/CreateItemUom`,
      payload,
      cb,
      true
    );
  }
  return (
    <>
      {loading && <Loading />}
      <div className="row">
        <div className="col-lg-12">
          <div className="table-card-body p-3">
            {rowDto?.length > 0 ? (
              <PeopleDeskTable
                columnData={uomColumn(rowDto, setRowDto, saveHandler, getData)}
                rowDto={rowDto}
                setRowDto={setRowDto}
                uniqueKey="value"
                isPagination={false}
              />
            ) : (
              <>
                <div className="col-12">
                  <NoResult title={"No Data Found"} para={""} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UomLanding;
