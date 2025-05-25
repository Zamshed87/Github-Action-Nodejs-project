import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "common/loading/Loading";
import { DataTable, PCard, PCardHeader, PForm } from "Components";
import { Form } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { toast } from "react-toastify";
import { PModal } from "Components/Modal";
import CreateEditInvestmentType from "./CreateInvestmentToOrganization";
import { getHeader } from "./helper";
import useInvestmentOrganization from "./useInvestmentToOrganization";

const InvestmentToOrganization = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const [openEdit, setOpenEdit] = useState({ open: false, data: {}, });
  const { data, setData, fetchInvestmentOrganization, createInvestmentOrganization, updateInvestmentOrganization, createUpdateLoading, loading, pages, } =
    useInvestmentOrganization(form);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Administration - Investable Organization";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30603) {
      permission = item;
    }
  });
  return permission?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{}}
        onFinish={() => {
          fetchInvestmentOrganization();
        }}
      >
        {loading || createUpdateLoading && <Loading />}
        <PCard>
          <PCardHeader
            title={`Investment To Organization`}
            buttonList={[
              {
                type: "primary",
                content: "Create New",
                icon: "plus",
                onClick: () => {
                  if (permission?.isCreate) {
                    setOpenEdit({ open: true, data: {}, });
                  } else {
                    toast.warn("You don't have permission");
                  }
                },
              },
            ]}
          />
          <DataTable
            header={getHeader(pages, setData, setOpenEdit, permission)}
            bordered
            data={data?.data || []}
            loading={loading}
          />
        </PCard>
      </PForm>
      <PModal
        title={openEdit?.create ? "Create Investment Organization" : "Update Investment Organization"}
        open={openEdit.open}
        onCancel={() => {
          setOpenEdit({ open: false, data: {} });
        }}
        components={<CreateEditInvestmentType data={openEdit.data} setOpenEdit={setOpenEdit} create={createInvestmentOrganization} update={updateInvestmentOrganization} />}
        width={1000}
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default InvestmentToOrganization;
