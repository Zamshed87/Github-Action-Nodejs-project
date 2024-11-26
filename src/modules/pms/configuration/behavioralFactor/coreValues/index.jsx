/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { AddOutlined } from "@mui/icons-material";
import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AntTable from "../../../../../common/AntTable";
import PrimaryButton from "../../../../../common/PrimaryButton";
import ViewModal from "../../../../../common/ViewModal";
import Loading from "../../../../../common/loading/Loading";
import NotPermittedPage from "../../../../../common/notPermitted/NotPermittedPage";
import useAxiosGet from "../../../../../utility/customHooks/useAxiosGet";
import CreateEditCoreValues from "./cerateEditCoreValues";
import { coreValuesLandingTableColumn, onGetCoreValuesLanding } from "./helper";
import CoreValuesView from "./viewCoreValues";
import AntScrollTable from "../../../../../common/AntScrollTable";

const CoreValues = () => {
  const {
    permissionList,
    profileData: { buId, orgId, employeeId },
  } = useSelector((state) => state?.auth, shallowEqual);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [
    competencyList,
    getCoreValuesList,
    loadingOnGetCompetencyList,
    setCoreValuesList,
  ] = useAxiosGet();
  const [coreValueId, setCoreValueId] = useState(null);

  useEffect(() => {
    onGetCoreValuesLanding({
      getCoreValuesList,
      setCoreValuesList,
      pagination,
      setPagination,
      buId,
      orgId,
    });
  }, [buId, orgId]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });
  const permission = useMemo(
    () => permissionList?.find((item) => item?.menuReferenceId === 30438),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <>
      {loadingOnGetCompetencyList && <Loading />}
      <>
        <div>
          <div className="table-card-heading d-flex justify-content-end">
            <ul>
              <li>
                <PrimaryButton
                  type="button"
                  className="btn btn-default flex-center"
                  label="Create"
                  icon={
                    <AddOutlined
                      sx={{
                        marginRight: "0px",
                        fontSize: "15px",
                      }}
                    />
                  }
                  onClick={() => {
                    // if (!permission?.isCreate)
                    //   return toast.warn("You don't have permission");
                    setShowCreateModal(true);
                  }}
                />
              </li>
            </ul>
          </div>
          <div className="table-card-body">
            <div className="table-card-styled table-responsive tableOne">
              <AntScrollTable
                rowClassName="pointer"
                pagination={pagination}
                pages={pagination?.pageSize}
                onRowClick={(record) => {
                  setCoreValueId(record?.intCoreValueId);
                  setShowViewModal(true);
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
                    onGetCoreValuesLanding({
                      getCoreValuesList,
                      setCoreValuesList,
                      pagination: newPagination,
                      setPagination,
                      buId,
                      orgId,
                    });
                  }
                }}
                data={Array.isArray(competencyList) ? competencyList : []}
                columnsData={coreValuesLandingTableColumn({
                  setShowCreateModal,
                  permission,
                  setCoreValueId,
                  pagination,
                })}
              />
            </div>
          </div>
        </div>

        <ViewModal
          size="lg"
          title="Create Core Values"
          backdrop="static"
          classes="default-modal preview-modal"
          show={showCreateModal}
          onHide={() => {
            setShowCreateModal(false);
            setCoreValueId(null);
            onGetCoreValuesLanding({
              getCoreValuesList,
              setCoreValuesList,
              pagination,
              setPagination,
              buId,
              orgId,
            });
          }}
        >
          <CreateEditCoreValues
            coreValueId={coreValueId}
            orgId={orgId}
            buId={buId}
            employeeId={employeeId}
            onHide={() => {
              setShowCreateModal(false);
              setCoreValueId(null);
              onGetCoreValuesLanding({
                getCoreValuesList,
                setCoreValuesList,
                pagination,
                setPagination,
                buId,
                orgId,
              });
            }}
            permission={permission}
          />
        </ViewModal>

        <ViewModal
          size="lg"
          title="Core Values Details"
          backdrop="static"
          classes="default-modal preview-modal"
          show={showViewModal}
          onHide={() => {
            setShowViewModal(false);
            setCoreValueId(null);
          }}
        >
          <CoreValuesView buId={buId} coreValueId={coreValueId} />
        </ViewModal>
      </>
    </>
  );
};

export default CoreValues;
