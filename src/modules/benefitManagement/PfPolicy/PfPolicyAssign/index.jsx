import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "common/loading/Loading";
import { DataTable, PCard, PCardBody, PCardHeader, PForm } from "Components";
import { Form } from "antd";
import { getHeader } from "./helper";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import usePfPolicyAssign from "./hooks/usePfPolicyAssign";
import TaxSalaryCertificateFilters from "./components/PfPolicyAssignFilters";

const PfPolicyAssign = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const { data, fetchPfPolicyAssign, loading, pages } =
    usePfPolicyAssign(form);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Benefits Management"));
    document.title = "Benefits Management - PF Policy Assign";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30628) {
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
      {(loading) && <Loading />}
      <PCard>
        <PCardHeader
          title={`Tax Salary Certificate`}
          buttonList={[
            {
              disabled: !selectedRows.length,
              type: "primary",
              content: "Save",
              onClick: () => {},
            },
          ]}
        />
        <PCardBody className="mb-3">
          <TaxSalaryCertificateFilters form={form} />
        </PCardBody>
        <DataTable
          scroll={{ x: 2000 }}
          header={getHeader(pages)}
          bordered
          data={data?.data || []}
          loading={loading}
          checkBoxColWidth={40}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys, rows) => {
              setSelectedRowKeys(keys);
              setSelectedRows(rows);
            },
            getCheckboxProps: (record) => ({
              disabled: !record.intEmployeeId || !record.intFiscalYearId,
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
