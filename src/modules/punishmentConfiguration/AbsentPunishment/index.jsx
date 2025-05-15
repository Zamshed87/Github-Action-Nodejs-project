import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "common/loading/Loading";
import { DataTable, PCard, PCardBody, PCardHeader, PForm } from "Components";
import { Form } from "antd";
import { getHeader } from "./helper";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useHistory } from "react-router-dom";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import AbsentPunishmentFilters from "./components/filter/AbsentPunishmentFilters";
import useAbsentPunishment from "./hooks/useAbsentPunishment";
import { toast } from "react-toastify";
import { PModal } from "Components/Modal";
import PolicyView from "./components/view/PolicyView";
import PolicyExtend from "./components/Extend/PolicyExtend";

const AbsentPunishment = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const [openView, setOpenView] = useState({open: false, data: {}});
  const [openExtend, setOpenExtend] = useState({extend: false, data: {}});
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);

  const { data, setData, fetchAbsentPunishment, loading, pages, setPages } =
    useAbsentPunishment(form);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Absent Punishment";
  }, []);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30591) {
      permission = item;
    }
  });

  return permission?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{ status: 0 }}
        onFinish={() => {
          fetchAbsentPunishment();
        }}
      >
        {loading && <Loading />}
        <PCard>
          <PCardHeader
            title={`Total Absent Punishment ${data?.totalCount || 0}`}
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
                      "/administration/punishmentConfiguration/absentPunishment/configuration"
                    );
                  } else {
                    toast.warn("You don't have permission");
                  }
                },
              },
            ]}
          />
          <PCardBody className="mb-3">
            <AbsentPunishmentFilters form={form} />
          </PCardBody>
          <DataTable
            header={getHeader(pages, history, data, setData)}
            bordered
            data={data?.absentPunishmentList || []}
            loading={loading}
            pagination={{
              pageSize: data?.pageSize,
              total: data?.totalCount,
              pageSizeOptions: ["25", "50", "100"],
            }}
            onChange={(pagination, _, __, extra) => {
              if (extra.action === "paginate") {
                fetchAbsentPunishment();
                setPages(pagination);
              }
            }}
          />
        </PCard>
      </PForm>
      <PModal
        title="Absent Punishment View"
        open={openView.open}
        onCancel={() => {
          setOpenView({open: false, data: {}});
        }}
        components={<PolicyView data={openView.data} />}
        width={1000}
      />
      <PModal
        title="Absent Punishment Extend"
        open={openExtend.extend}
        onCancel={() => {
          setOpenExtend({extend: false, data: {}});
        }}
        components={<PolicyExtend data={openExtend.data} />}
        width={1000}
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default AbsentPunishment;
