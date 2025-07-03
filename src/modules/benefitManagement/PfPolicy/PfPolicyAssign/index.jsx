import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "common/loading/Loading";
import { DataTable, PCard, PCardBody, PCardHeader, PForm } from "Components";
import { Form } from "antd";
import { assignPFPolicy, getHeader } from "./helper";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import usePfPolicyAssign from "./hooks/usePfPolicyAssign";
import PfPolicyAssignFilters from "./components/PfPolicyAssignFilters";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const PfPolicyAssign = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const {
    data,
    fetchPfPolicyAssign,
    loading: LandingDataLoading,
    pages,
    setPages,
  } = usePfPolicyAssign(form);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Benefits Management"));
    document.title = "Benefits Management - PF Policy Assign";
    // Sync data to tableData for inline editing
    if (data?.data) setTableData(data.data.map((row) => ({ ...row, StrPfCode: state?.strPolicyCode })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data]);

  // Inline edit handler
  const handleInputChange = (record, field, value) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.intEmployeeId === record.intEmployeeId
          ? { ...row, [field]: value }
          : row
      )
    );
  };

  // Save handler with validation
  const handleSave = () => {
    if (selectedRowKeys.length < 1) {
      toast.error("Please Select at least one Row.");
      return;
    }
    // Always get the latest selected rows from tableData
    const latestSelectedRows = tableData.filter(row => selectedRowKeys.includes(row.intEmployeeId));
    // Validate PF Code and Effective Month
    const invalid = latestSelectedRows.some(
      (row) => !row.StrPfCode || !row.DteEffectiveMonth
    );
    if (invalid) {
      toast.error(
        "Please fill PF Code and Effective Month for all selected rows."
      );
      return;
    }
    assignPFPolicy(latestSelectedRows, setLoading, () => {
      setSelectedRowKeys([]);
      setTableData(data.data.map((row) => ({ ...row, StrPfCode: state?.strPolicyCode })));
      setSelectedRows([]);
    });
  };

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30597) {
      permission = item;
    }
  });

  return permission?.isView ? (
    <PForm
      form={form}
      initialValues={{}}
      onFinish={() => {
        fetchPfPolicyAssign();
      }}
    >
      {(LandingDataLoading || loading) && <Loading />}
      <PCard>
        <PCardHeader
          backButton
          title={`Pf Policy Assign`}
          buttonList={[
            {
              disabled: !selectedRows.length,
              type: "primary",
              content: "Save",
              onClick: handleSave,
            },
          ]}
        />
        <PCardBody className="mb-3">
          <PfPolicyAssignFilters form={form} />
        </PCardBody>
        <DataTable
          scroll={{ x: 1200 }}
          header={getHeader(pages, handleInputChange)}
          bordered
          data={tableData}
          loading={LandingDataLoading}
          pagination={{
            pageSize: pages?.pageSize,
            total: pages?.total,
            pageSizeOptions: ["25", "50", "100"],
          }}
          onChange={(pagination, _, __, extra) => {
            if (extra.action === "paginate") {
              fetchPfPolicyAssign();
              setPages(pagination);
            }
          }}
          checkBoxColWidth={40}
          rowKey="intEmployeeId"
          rowSelection={{
            selectedRowKeys,
            onChange: (keys, rows) => {
              setSelectedRowKeys(keys);
              setSelectedRows(rows);
            },
            getCheckboxProps: (record) => ({
              disabled: !record.intEmployeeId,
            }),
          }}
        />
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default PfPolicyAssign;
