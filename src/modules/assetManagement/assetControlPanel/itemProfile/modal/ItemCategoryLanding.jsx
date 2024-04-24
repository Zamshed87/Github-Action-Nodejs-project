import NoResult from "common/NoResult";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import { todayDate } from "utility/todayDate";
import { itemCategoryColumn } from "../utils";
import PeopleDeskTable from "common/peopleDeskTable";
import Loading from "common/loading/Loading";

const ItemCategoryLanding = ({ rowDto, setRowDto, getData }) => {
  const { orgId, buId, wgId, wId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [, saveItemCategory, loading] = useAxiosPost({});
  const saveHandler = (data, cb) => {
    const payload = {
      accountId: orgId,
      businessUnitId: buId,
      workplaceId: wId,
      workplaceGroupId: wgId,
      createdBy: employeeId,
      itemCategoryId: data?.value,
      itemCategory: data?.label,
      active: true,
      createdAt: todayDate(),
    };
    saveItemCategory(`/AssetManagement/CreateItemCategory`, payload, cb, true);
  };
  return (
    <>
      {loading && <Loading />}
      <div className="row">
        <div className="col-lg-12">
          <div className="table-card-body p-3">
            {rowDto?.length > 0 ? (
              <PeopleDeskTable
                columnData={itemCategoryColumn(
                  rowDto,
                  setRowDto,
                  saveHandler,
                  getData
                )}
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

export default ItemCategoryLanding;
