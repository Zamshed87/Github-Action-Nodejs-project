import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "common/loading/Loading";
import { DataTable, PCard, PCardBody, PCardHeader, PForm } from "Components";
import { Form } from "antd";
import { getHeader, fetchTaxSalaryCertificateApi } from "./helper";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import useTaxSalaryCertificate from "./hooks/useTaxSalaryCertificate";
import TaxSalaryCertificateFilters from "./components/TaxSalaryCertificateFilters";
import { PModal } from "Components/Modal";
import TaxSalaryCertificatePreview from "./components/TaxSalaryCertificatePreview";
import { toast } from "react-toastify";

const TaxSalaryCertificate = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [openPreview, setOpenPreview] = useState({ open: false, data: {} });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const { data, fetchTaxSalaryCertificates, loading, pages } =
    useTaxSalaryCertificate(form);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Benefits Management - Tax Salary Certificate";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30628) {
      permission = item;
    }
  });

  // Bulk Download Handler
  const handleBulkDownload = async () => {
    if (!selectedRows.length) {
      toast.warning("Please select at least one employee.");
      return;
    }
    try {
      setPreviewLoading(true);
      const response = await fetchTaxSalaryCertificateApi(
        "pdf",
        selectedRows.map((row) => ({
          intEmployeeId: row.intEmployeeId,
          intFiscalYearId: row.intFiscalYearId,
        })),
        { responseType: "blob" }
      );
      setPreviewLoading(false);

      // Download the PDF file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "TaxSalaryCertificates.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch {
      setPreviewLoading(false);
      toast.error("Bulk download failed.");
    }
  };

  // Preview Handler
  const handlePreview = async (row) => {
    setPreviewLoading(true);
    try {
      const response = await fetchTaxSalaryCertificateApi("html", [
        {
          intEmployeeId: row.intEmployeeId,
          intFiscalYearId: row.intFiscalYearId,
        },
      ]);
      setOpenPreview({ open: true, data: response.data });
      setPreviewLoading(false);
    } catch {
      toast.error("Failed to load preview.");
    } finally {
      setPreviewLoading(false);
    }
  };

  return permission?.isView ? (
    <PForm
      form={form}
      initialValues={{}}
      onFinish={() => {
        fetchTaxSalaryCertificates();
      }}
    >
      {(loading || previewLoading) && <Loading />}
      <PCard>
        <PCardHeader
          title={`Tax Salary Certificate`}
          buttonList={[
            {
              disabled: !selectedRows.length,
              type: "primary",
              content: "Bulk Download",
              onClick: handleBulkDownload,
            },
          ]}
        />
        <PCardBody className="mb-3">
          <TaxSalaryCertificateFilters form={form} />
        </PCardBody>
        <DataTable
          scroll={{ x: 2000 }}
          header={getHeader(pages, (row) => handlePreview(row))}
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
      <PModal
        title={"Tax Salary Certificate Preview"}
        open={openPreview.open}
        onCancel={() => {
          setOpenPreview({ open: false, data: {} });
        }}
        components={
          <TaxSalaryCertificatePreview
            data={openPreview.data}
            setOpenPreview={setOpenPreview}
            loading={previewLoading}
          />
        }
        width={1200}
      />
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default TaxSalaryCertificate;
