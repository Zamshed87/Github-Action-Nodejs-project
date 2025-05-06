import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "common/loading/Loading";
import {
  DataTable,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
} from "Components";
import { Form } from "antd";
import { getHeader } from "./helper";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useHistory } from "react-router-dom";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import PfPolicyFilters from "./components/filter/PfPolicyFilters";
import usePfPolicy from "./hooks/usePfPolicy";

const PFPolicy = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();

  const {
    permissionList,
  } = useSelector((store) => store?.auth, shallowEqual);

  const { data, fetchPfPolicy, loading, pages, setPages } = usePfPolicy(form);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Benefits Management"));
    document.title = "Benefits Management - PF Policy";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30541) {
      permission = item;
    }
  });

  return !permission?.isView ? (
    <PForm
      form={form}
      initialValues={{
      }}
      onFinish={() => {
        fetchPfPolicy();
      }}
    >
      {loading && <Loading />}
      <PCard>
        <PCardHeader
          title={`Total PF Policy ${data?.totalCount || 0}`}
          // onSearch={(e) => {
          //   form.setFieldsValue({
          //     search: e?.target?.value,
          //   });
          //   fetchPfPolicy({ search: e.target.value });
          // }}
        />
        <PCardBody className="mb-3">
          <PfPolicyFilters
            form={form}
          />
        </PCardBody>
        <DataTable
          header={getHeader(pages,history)}
          bordered
          data={data?.data || []}
          loading={loading}
          pagination={{
            pageSize: data?.pageSize,
            total: data?.totalCount,
            pageSizeOptions: ["25", "50", "100"],
          }}
          onChange={(pagination, _, __, extra) => {
            if (extra.action === "paginate") {
              fetchPfPolicy();
              setPages(pagination);
            }
          }}
        />
      </PCard>
    </PForm>
  )
  :
  (
    <NotPermittedPage/>
  )
};

export default PFPolicy;
