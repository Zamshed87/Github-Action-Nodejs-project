import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Spin } from "antd";
import { fetchPendingApprovals } from "./helper";
import { DataTable } from "Components";
import { useLocation } from "react-router";
import ApproveRejectComp from "common/ApproveRejectComp";
import BackButton from "common/BackButton";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import CommonFilter from "common/CommonFilter";
import "./index.css";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  columnAdditionDeduction,
  columnDeposit,
  columnDisbursment,
  columnIncrement,
  columnOvertime,
  columnsAdvancedSalary,
  columnsBonusGenerate,
  columnsDefault,
  columnsExpense,
  columnsIOU,
  columnsIOUAdjustment,
  columnsLeave,
  columnsLoan,
  columnsLocationDevice,
  columnsManual,
  columnsMarketVisit,
  columnsMasterLocation,
  columnsMovement,
  columnsRemoteAttendance,
  columnsSalaryCertificate,
  columnsSalaryIncrement,
  columnsSeparation,
  columnsShiftChange,
} from "./utils";
import ApprovalModel from "./ApprovalModel";
import ViewFormComponent from "./utils/ViewFormComponent";

const CommonApprovalComponent = () => {
  // props
  const location = useLocation();
  const state = location.state;
  const id = state?.state?.applicationTypeId;
  const dispatch = useDispatch();

  // state
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [data, setData] = useState([]);
  const [viewData, setViewData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedRow, setSelectedRow] = useState([]);
  const [viewModal, setViewModal] = useState(false);

  // redux
  const { orgId, employeeId, wId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // fetch data
  useEffect(() => {
    fetchPendingApprovals({
      id,
      setLoading,
      orgId,
      buId,
      wgId,
      wId,
      employeeId,
      setData,
    });
  }, [id, wgId, wId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
    document.title = `${state?.state?.applicationType} Approval`;
    return () => {
      document.title = "";
    };
  }, []);

  // handle filter
  const handleFilter = (values) => {
    const { workplace, workplaceGroup } = values;
    fetchPendingApprovals({
      id,
      setLoading,
      orgId,
      buId,
      wgId: workplaceGroup?.value || wgId,
      wId: workplace?.value || wId,
      employeeId,
      setData,
    });
  };

  // handle approve or reject
  const handleApproveReject = async (isApprove) => {
    const payload = selectedRow.map((key) => {
      const row = data.find((item) => item.id === key?.key);
      return {
        configHeaderId: row.configHeaderId,
        approvalTransactionId: row.id,
        applicationId: row.applicationId,
        isApprove,
        isReject: !isApprove,
        actionBy: employeeId,
      };
    });

    try {
      await axios.post(`/Approval/ApproveApplications`, payload);
      toast.success(
        `Applications ${isApprove ? "approved" : "rejected"} successfully.`
      );
      fetchPendingApprovals({
        id,
        setLoading,
        orgId,
        buId,
        wgId,
        wId,
        employeeId,
        setData,
      });
      setSelectedRow([]);
    } catch (error) {
      toast.error("Failed to process approvals.");
    }
  };

  // show confirmation modal
  const showConfirmationModal = (action) => {
    setModalAction(action);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    handleApproveReject(modalAction === "approve");
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setModalAction(null);
  };

  const handleOpen = () => {
    setViewModal(false);
  };

  // for view Modal
  const handleViewClose = () => setViewModal(false);

  // render
  return (
    <div className="approval-container mt-4">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <BackButton title={`${state?.state?.applicationType} Approval`} />
          {selectedRow?.length > 0 ? (
            <ApproveRejectComp
              props={{
                className: "ml-3",
                onApprove: () => {
                  showConfirmationModal("approve");
                },
                onReject: () => {
                  showConfirmationModal("reject");
                },
              }}
            />
          ) : null}
        </div>
        <CommonFilter
          visible={isFilterVisible}
          onClose={(visible) => setIsFilterVisible(visible)}
          onFilter={handleFilter}
          isDate={true}
          isWorkplaceGroup={true}
          isWorkplace={true}
          isAllValue={true}
        />
      </div>

      {loading ? (
        <Spin size="large" />
      ) : (
        <DataTable
          scroll={{ x: 1500 }}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectedRow.map((item) => item.key),
            preserveSelectedRowKeys: true,
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRow(selectedRows);
            },
          }}
          header={
            id == 8
              ? columnsLeave(dispatch)
              : id == 15
              ? columnOvertime
              : id == 4
              ? columnIncrement
              : id == 11
              ? columnsManual
              : id == 14
              ? columnsMovement
              : id == 21
              ? columnsSeparation(setViewData, setViewModal)
              : id == 26
              ? columnsAdvancedSalary
              : id == 3
              ? columnsExpense
              : id == 6
              ? columnsIOU
              : id == 9
              ? columnsLoan
              : id == 12
              ? columnsMarketVisit
              : id == 13
              ? columnsMasterLocation
              : id == 17
              ? columnsRemoteAttendance
              : id == 10
              ? columnsLocationDevice
              : id == 5
              ? columnsSalaryIncrement
              : id == 19
              ? columnsSalaryCertificate
              : id == 2
              ? columnsBonusGenerate
              : id == 7
              ? columnsIOUAdjustment
              : id == 25
              ? columnsShiftChange
              : id == 28
              ? columnDisbursment
              : id == 27
              ? columnDeposit
              : id == 18
              ? columnAdditionDeduction
              : columnsDefault
          }
          bordered
          data={data.map((item) => ({ ...item, key: item.id }))}
        />
      )}

      {/* approve or reject confirmation model  */}
      <ApprovalModel
        isModalVisible={isModalVisible}
        handleModalOk={handleModalOk}
        handleModalCancel={handleModalCancel}
        modalAction={modalAction}
      />
      <ViewFormComponent
        objProps={{
          show: viewModal,
          title: "Separation Details",
          onHide: handleViewClose,
          size: "lg",
          backdrop: "static",
          classes: "default-modal",
          handleOpen,
          viewData,
          setViewData
        }}
      />
    </div>
  );
};

export default CommonApprovalComponent;
