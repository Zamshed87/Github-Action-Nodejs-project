import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "common/loading/Loading";
import { DataTable, PCard, PCardBody, PCardHeader, PForm } from "Components";
import { Form } from "antd";
import { getHeader } from "./helper";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useHistory } from "react-router-dom";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import useTaxSalaryCertificate from "./hooks/useTaxSalaryCertificate";
import TaxSalaryCertificateFilters from "./components/TaxSalaryCertificateFilters";
import { PModal } from "Components/Modal";
import TaxSalaryCertificatePreview from "./components/TaxSalaryCertificatePreview";

const TaxSalaryCertificate = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const [openPreview, setOpenPreview] = useState({ open: false, data: {} });
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const {
    data,
    setData,
    fetchTaxSalaryCertificates,
    loading,
    pages,
    setPages,
  } = useTaxSalaryCertificate(form);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Benefits Management - Tax Salary Certificate";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        fetchTaxSalaryCertificates();
      }}
    >
      {loading && <Loading />}
      <PCard>
        <PCardHeader title={`Tax Salary Certificate`} />
        <PCardBody className="mb-3">
          <TaxSalaryCertificateFilters form={form} />
        </PCardBody>
        <DataTable
          header={getHeader(pages, setOpenPreview)}
          bordered
          data={data?.data || []}
          loading={loading}
          // pagination={{
          //   pageSize: data?.pageSize,
          //   total: data?.totalCount,
          //   pageSizeOptions: ["25", "50", "100"],
          // }}
          // onChange={(pagination, _, __, extra) => {
          //   if (extra.action === "paginate") {
          //     fetchPfPolicy();
          //     setPages(pagination);
          //   }
          // }}
        />
      </PCard>
      <PModal
        title={"Update Investment Organization"}
        open={openPreview.open}
        onCancel={() => {
          setOpenPreview({ open: false, data: {} });
        }}
        components={
          <TaxSalaryCertificatePreview
            data={openPreview.data}
            setOpenPreview={setOpenPreview}
          />
        }
        width={1000}
      />
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default TaxSalaryCertificate;
