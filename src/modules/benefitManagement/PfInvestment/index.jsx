import { useEffect, useState } from "react";
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
import { PModal } from "Components/Modal";
import PfInvestmentFilters from "./components/filter/PfInvestmentFilters";
import moment from "moment";

const PFInvestment = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();

  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const [openView, setOpenView] = useState({ open: false, data: {} });
  const { data, setData, fetchPfInvestment, loading, pages } =
  usePfInvestments(form);

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
  
  const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
  const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
  
  return permission?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{
          FromDateF: moment(startOfMonth, "YYYY-MM-DD"),
          FromDate: startOfMonth,
          ToDateF: moment(endOfMonth, "YYYY-MM-DD"),
          ToDate: endOfMonth,
        }}
        onFinish={() => {
          fetchPfInvestment();
        }}
      >
        {loading && <Loading />}
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
                    history.push("/BenefitsManagement/providentFund/pfInvestment/create");
                  } else {
                    toast.warn("You don't have permission");
                  }
                },
              },
            ]}
          />
          <PCardBody className="mb-3">
            <PfInvestmentFilters form={form} />
          </PCardBody>
          <DataTable
            header={getHeader(pages, setData, setOpenView)}
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
      <PModal
        title="PF Policy View"
        open={openView.open}
        onCancel={() => {
          setOpenView({ open: false, data: {} });
        }}
        components={<></>}
        width={1000}
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default PFInvestment;
