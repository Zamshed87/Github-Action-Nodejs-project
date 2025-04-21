import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Input, Spin } from "antd";
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
  columnFinalSettlement,
  columnIncrement,
  columnOvertime,
  columnsAdvancedSalary,
  columnSalaryGenerate,
  columnsAsset,
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
  columnTransferPromotion,
} from "./utils";
import ApprovalModel from "./ApprovalModel";
import ViewFormComponent from "./utils/ViewFormComponent";
import { getFilteredValues } from "./filterValues";
import { SearchOutlined } from "@mui/icons-material";
import { debounce } from "lodash";

const CommonApprovalComponent = () => {
  // redux
  const { orgId, employeeId, wId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const isFirstRun = useRef(true);
  // props
  const location = useLocation();
  const state = location.state;
  const id = state?.state?.applicationTypeId;
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  // state
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [data, setData] = useState([]);
  const [viewData, setViewData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedRow, setSelectedRow] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [page, setpage] = useState({ pageSize: 25, pageNo: 1 });
  const [totalRecords, setTotalRecords] = useState(0);

  const [filteredWId, setFilteredWId] = useState(wId);
  const [filteredWgId, setFilteredWgId] = useState(wgId);

  useEffect(() => {
    const { workplace, workplaceGroup } = getFilteredValues({}, wId, wgId);

    if (isFirstRun.current) {
      isFirstRun.current = false;
      setFilteredWId(workplace);
      setFilteredWgId(workplaceGroup);
    }
  }, [wId, wgId]);

  useEffect(() => {
    const fetchData = debounce(() => {
      fetchPendingApprovals({
        id,
        setLoading,
        orgId,
        buId,
        wgId: filteredWgId,
        wId: filteredWId,
        employeeId,
        setData,
        setTotalRecords,
        departmentId: filterData?.department?.value || 0,
        designationId: filterData?.designation?.value || 0,
        searchText: searchTerm,
        page,
      });
    }, 300);

    fetchData();
    return () => fetchData.cancel(); // Cleanup on unmount
  }, [filteredWgId, filteredWId, page]);

  // Handle filter logic
  const handleFilter = (values) => {
    setFilterData(values);
    const { workplaceGroup, workplace } = getFilteredValues(values, wId, wgId);
    setFilteredWId(workplace);
    setFilteredWgId(workplaceGroup);

    fetchPendingApprovals({
      id,
      setLoading,
      orgId,
      buId,
      wgId: workplaceGroup,
      wId: workplace,
      employeeId,
      setData,
      setTotalRecords,
      departmentId: values?.department?.value || 0,
      designationId: values?.designation?.value || 0,
      searchText: searchTerm,
      page,
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
    document.title = `${state?.state?.applicationType} Approval`;
    return () => {
      document.title = "";
    };
  }, []);

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
        applicationTypeId: id || 0,
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
        wgId: filteredWgId,
        wId: filteredWId,
        employeeId,
        setData,
        setTotalRecords,
        departmentId: filterData?.department?.value || 0,
        designationId: filterData?.designation?.value || 0,
        searchText: searchTerm,
        page,
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
  const handleSearch = debounce((value) => {
    fetchPendingApprovals({
      id,
      setLoading,
      orgId,
      buId,
      wgId: filteredWgId,
      wId: filteredWId,
      employeeId,
      setData,
      setTotalRecords,
      departmentId: filterData?.department?.value || 0,
      designationId: filterData?.designation?.value,
      searchText: value,
    });
  }, 300);

  // render
  return (
    <div className="approval-container mt-4">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <BackButton title={`${state?.state?.applicationType} Approval`} />
          {selectedRow?.length > 0 && (
            <ApproveRejectComp
              props={{
                className: "ml-3",
                onApprove: () => showConfirmationModal("approve"),
                onReject: () => showConfirmationModal("reject"),
              }}
            />
          )}
        </div>

        <div className="d-flex align-items-center gap-3">
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch(e.target.value);
            }}
            style={{
              width: 300,
              marginRight: 10,
              borderRadius: 5,
              marginBottom: 5,
            }}
          />

          <CommonFilter
            visible={isFilterVisible}
            onClose={(visible) => setIsFilterVisible(visible)}
            onFilter={handleFilter}
            isDate={false}
            isWorkplaceGroup={true}
            isWorkplace={true}
            isDepartment={true}
            isDesignation={true}
            isEmployee={true}
            isAllValue={true}
          />
        </div>
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
              ? columnsManual(page)
              : id == 14
              ? columnsMovement(page)
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
              : id == 24
              ? columnTransferPromotion
              : id == 20
              ? columnSalaryGenerate
              : id == 30
              ? columnFinalSettlement
              : id == 29
              ? columnsSeparation(setViewData, setViewModal)
              : id == 32
              ? columnsAsset
              : columnsDefault
          }
          bordered
          data={data.map((item) => ({ ...item, key: item.id }))}
          pagination={{
            pageSize: page.pageSize,
            current: page.pageNo,
            total: totalRecords,
            showSizeChanger: true,
            onChange: (pageNo, pageSize) => {
              setpage({ pageNo, pageSize });
            },
            showTotal: (total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} items`,
          }}
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
          setViewData,
        }}
      />
    </div>
  );
};

export default CommonApprovalComponent;
