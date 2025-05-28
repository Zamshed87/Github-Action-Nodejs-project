import { Form } from "antd";
import Loading from "common/loading/Loading";
import { DataTable, PCard, PCardHeader, PForm } from "Components";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { toast } from "react-toastify";
import PfProfitShareConfiguration from "./components/PfProfitShareConfiguration";
import { createPFProfitShare, getHeader } from "./helper";
import { useHistory } from "react-router-dom";
import usePfShare from "./hook/usePfShare";

const PfProfitShareCreate = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  // redux
  const {
    permissionList,
    profileData: { buId, intAccountId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const dispatch = useDispatch();
  const [permission, setPermission] = useState(null);
  const { data, setData, fetchPfShare, loading, pages, setPages, setLoading } =
    usePfShare(form);
  useEffect(() => {
    setPermission(
      permissionList.find((item) => item?.menuReferenceId === 30599)
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
                  const commonFields = [
                    "fromDateF",
                    "toDateF",
                    "fromDate",
                    "toDate",
                    "profitShareType",
                    "profitShare",
                  ];
                  form
                    .validateFields(commonFields)
                    .then((values) => {
                      if (!data?.detailsData || data?.detailsData?.length < 1) {
                        toast.error("There are no records to save.");
                        return;
                      }

                      const payload = {
                        accountId: intAccountId,
                        businessUnitId: buId,
                        fromDate: values?.fromDate,
                        toDate: values?.toDate,
                        totalProfitAmount: data?.totalProfitAmount,
                        profitShareTypeId: values?.profitShareType,
                        profitSharePercentage: values?.profitShare
                          ? Number(values?.profitShare)
                          : 0,
                      };
                      createPFProfitShare(payload, setLoading, () => {
                        form.resetFields();
                        history.push(
                          `/BenefitsManagement/providentFund/pfProfitShare`
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
