import React, { useEffect } from "react";
import Loading from "common/loading/Loading";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import { itemSubCategoryColumn } from "../utils";
import PeopleDeskTable from "common/peopleDeskTable";
import NoResult from "common/NoResult";

const ItemSubCategoryLanding = ({
  itemSubcategoryDDL,
  setItemSubcategoryDDL,
  getItemSubcategory,
}) => {
  const { orgId, buId, wgId, wId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [, saveItemSubCategory, loading] = useAxiosPost({});

  const saveHandler = (data, cb) => {
    const payload = {
      accountId: orgId,
      businessUnitId: buId,
      workplaceId: wId,
      workplaceGroupId: wgId,
      createdBy: employeeId,
      itemCategoryId: data?.itemCategoryValue,
      itemSubCategoryId: data?.value,
      strItemSubCategory: data?.label,
    };
    saveItemSubCategory(
      `/AssetManagement/CreateItemSubCategory`,
      payload,
      cb,
      true
    );
  };

  const getData = () => {
    getItemSubcategory(
      `/AssetManagement/ItemSubCategoryDDL?accountId=${orgId}&businessUnitId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}&itemCategoryId=${0}`,
      (res) => {
        const modifyData = res?.map((item) => ({
          ...item,
          isEdit: false,
        }));
        setItemSubcategoryDDL(modifyData);
      }
    );
  };

  useEffect(() => {
    getData();
  }, [orgId, buId, wId, wgId]);
  return (
    <>
      {loading && <Loading />}
      <div className="row">
        <div className="col-lg-12">
          <div className="table-card-body p-3">
            {itemSubcategoryDDL?.length > 0 ? (
              <PeopleDeskTable
                columnData={itemSubCategoryColumn(
                  itemSubcategoryDDL,
                  setItemSubcategoryDDL,
                  saveHandler,
                  getData
                )}
                rowDto={itemSubcategoryDDL}
                setRowDto={setItemSubcategoryDDL}
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

export default ItemSubCategoryLanding;
