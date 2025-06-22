import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "common/loading/Loading";
import { DataTable, PCard, PCardBody, PCardHeader, PForm } from "Components";
import { Form } from "antd";
import { getHeader } from "./helper";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useHistory } from "react-router-dom";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import TdsChallanFilters from "./components/filter/TaxSalaryCertificateFilters";
import useTdsChallan from "./hooks/useTaxSalaryCertificate";
import { toast } from "react-toastify";

const TaxSalaryCertificate = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();

  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const { data, setData, fetchTaxSalaryCertificates, loading, pages, setPages } =
    useTdsChallan(form);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Benefits Management - TDS CHALLAN";
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
        <PCardHeader
          title={`TDS Challan`}
          // onSearch={(e) => {
          //   form.setFieldsValue({
          //     search: e?.target?.value,
          //   });
          //   fetchPfPolicy({ search: e.target.value });
          // }}
          buttonList={[
            {
              type: "primary",
              content: "Create New",
              icon: "plus",
              onClick: () => {
                if (permission?.isCreate) {
                  history.push(
                    "/compensationAndBenefits/incometaxmgmt/tdsChallan/create"
                  );
                } else {
                  toast.warn("You don't have permission");
                }
              },
            },
          ]}
        />
        <PCardBody className="mb-3">
          <TdsChallanFilters form={form} />
        </PCardBody>
        <DataTable
          header={getHeader(pages, history)}
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
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default TaxSalaryCertificate;
