import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "common/loading/Loading";
import { DataTable, PCard, PCardBody, PCardHeader, PForm } from "Components";
import { Form } from "antd";
import { getHeader } from "./helper";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useHistory } from "react-router-dom";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import usePfProfitShare from "./hooks/usePfProfitShare";
import { toast } from "react-toastify";
import { PModal } from "Components/Modal";
import ProfitShareView from "./components/view/ProfitShareView";
import PfProfitShareFilters from "./components/filter/PfProfitShareFilters";

const PfProfitShare = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();

  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const [openView, setOpenView] = useState({ open: false, data: {} });
  const { data, fetchPfProfitShare, loading, pages, setPages } =
    usePfProfitShare(form);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Benefits Management"));
    document.title = "Benefits Management - PF Profit Share";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30599) {
      permission = item;
    }
  });

  return permission?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{}}
        onFinish={() => {
          fetchPfProfitShare();
        }}
      >
        {loading && <Loading />}
        <PCard>
          <PCardHeader
            title={`PF Profit Share`}
            // onSearch={(e) => {
            //   form.setFieldsValue({
            //     search: e?.target?.value,
            //   });
            //   fetchPfProfitShare({ search: e.target.value });
            // }}
            buttonList={[
              {
                type: "primary",
                content: "Create New",
                icon: "plus",
                onClick: () => {
                  if (permission?.isCreate) {
                    history.push(
                      "/BenefitsManagement/providentFund/pfProfitShare/create"
                    );
                  } else {
                    toast.warn("You don't have permission");
                  }
                },
              },
            ]}
          />
          <PCardBody className="mb-3">
            <PfProfitShareFilters form={form} />
          </PCardBody>
          <DataTable
            header={getHeader(pages, setOpenView)}
            bordered
            data={data?.data || []}
            loading={loading}
            scroll={{ x: 2000 }}
            pagination={{
              pageSize: data?.pageSize,
              total: data?.totalCount,
              pageSizeOptions: ["25", "50", "100"],
            }}
            onChange={(pagination, _, __, extra) => {
              if (extra.action === "paginate") {
                fetchPfProfitShare();
                setPages(pagination);
              }
            }}
          />
        </PCard>
      </PForm>
      <PModal
        title="PF Profit Share View"
        open={openView.open}
        onCancel={() => {
          setOpenView({ open: false, data: {} });
        }}
        components={<ProfitShareView data={openView.data} />}
        width={1200}
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default PfProfitShare;
