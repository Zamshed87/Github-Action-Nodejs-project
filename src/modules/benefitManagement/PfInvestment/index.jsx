import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "common/loading/Loading";
import { DataTable, PCard, PCardBody, PCardHeader, PForm } from "Components";
import { Form } from "antd";
import { getHeader } from "./helper";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useHistory } from "react-router-dom";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import usePfInvestments from "./hooks/usePfInvestments";
import { toast } from "react-toastify";
import PfInvestmentFilters from "./components/filter/PfInvestmentFilters";
import moment from "moment";
import PfInvestmentDetails from "./PfInvestmentCreate/components/PfInvestmentConfig/PfInvestmentDetails";

const PFInvestment = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();

  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const {
    data,
    fetchPfInvestment,
    loading,
    pages,
    otherLoading,
    inActivatePfInvestment,
  } = usePfInvestments(form);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Benefits Management"));
    document.title = "Benefits Management - PF Investment";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30598) {
      permission = item;
    }
  });

  const startOfYear = moment().startOf("year").format("YYYY-MM-DD");
  const endOfYear = moment().endOf("year").format("YYYY-MM-DD");  

  return permission?.isView ? (
    <PForm
      form={form}
      initialValues={{
        FromDateF: moment(startOfYear, "YYYY-MM-DD"),
        FromDate: startOfYear,
        ToDateF: moment(endOfYear, "YYYY-MM-DD"),
        ToDate: endOfYear,
        InvestmentTypeId: [0],
        status: "Running"
      }}
      onFinish={() => {
        fetchPfInvestment();
      }}
    >
      {loading || (otherLoading && <Loading />)}
      <PCard>
        <PCardHeader
          title={`Total PF Investment`}
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
                    "/BenefitsManagement/providentFund/pfInvestment/create"
                  );
                } else {
                  toast.warn("You don't have permission");
                }
              },
            },
          ]}
        />
        <PCardBody className="mb-3">
          <div className="d-flex justify-content-between">
            <div style={{ width: "60%" }}>
              <PfInvestmentFilters form={form} />
            </div>
            <div style={{ width: "40%" }}>
              <PfInvestmentDetails landing />
            </div>
          </div>
        </PCardBody>
        <DataTable
          header={getHeader(pages, history, inActivatePfInvestment)}
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

export default PFInvestment;
