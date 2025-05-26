import { Form } from "antd";
import Loading from "common/loading/Loading";
import { DataTable, PCard, PCardHeader, PForm } from "Components";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { toast } from "react-toastify";
import PfProfitShareConfiguration from "./components/PfProfitShareConfiguration";
import { createPFPolicy } from "./helper";
import { useHistory } from "react-router-dom";
import { getHeader } from "./helper";
import usePfShare from "./hook/usePfShare";

const PfProfitShareCreate = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  // redux
  const {
    permissionList,
  } = useSelector((store) => store?.auth, shallowEqual);

  const dispatch = useDispatch();
  const [permission, setPermission] = useState(null);
  const { data, setData, fetchPfShare, loading, pages, setPages, setLoading } =
    usePfShare(form);
  useEffect(() => {
    setPermission(
      permissionList.find((item) => item?.menuReferenceId === 30597)
    );
  }, [permissionList]);
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Benefits Management"));
    document.title = "Benefits Management - PF Profit Share Create";
    return () => {
      document.title = "PeopleDesk";
    };
  }, []);

  return permission?.isCreate ? (
    <div>
      {loading && <Loading />}
      <PForm form={form} initialValues={{}}>
        <PCard>
          <PCardHeader
            backButton
            title={`PF Profit Share Create`}
            buttonList={[
              {
                type: "primary",
                content: "Save",
                onClick: () => {
                  const commonFields = [];
                  form
                    .validateFields(commonFields)
                    .then((values) => {
                      if (' ') {
                        toast.error(
                          "Please add at least one employee or company contribution."
                        );
                        return;
                      }

                      const payload = {};
                      createPFPolicy(payload, setLoading, () => {
                        
                        form.resetFields();
                        history.push(
                          `/BenefitsManagement/providentFund/pfPolicy`
                        );
                      });
                    })
                    .catch(() => {
                      toast.error("Please fill all required fields.");
                    });
                },
              },
            ]}
          />
          <PfProfitShareConfiguration
            form={form}
            data={data}
            setData={setData}
            fetchPfShare={fetchPfShare}
          />
          <DataTable
            header={getHeader(pages)}
            bordered
            data={data?.detailsData || []}
            loading={loading}
            scroll={{ x: 1800 }}
            pagination={{
              pageSize: data?.pageSize,
              total: data?.totalCount,
              pageSizeOptions: ["25", "50", "100"],
            }}
            onChange={(pagination, _, __, extra) => {
              if (extra.action === "paginate") {
                fetchPfShare();
                setPages(pagination);
              }
            }}
          />
        </PCard>
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default PfProfitShareCreate;
