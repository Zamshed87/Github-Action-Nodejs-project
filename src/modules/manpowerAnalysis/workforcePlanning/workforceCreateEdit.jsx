import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "common/loading/Loading";
import { DataTable, PCard, PCardBody, PCardHeader, PForm, PSelect } from "Components";
import { Col, Form, Row } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useHistory } from "react-router-dom";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { toast } from "react-toastify";

const WorkForceCreate = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();

  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);


  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Benefits Management - Income Tax Challan";
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
        fetchTdsChallan();
      }}
    >
      {loading && <Loading />}
      <PCard>
        <PCardHeader
          title={`Tax Challan`}
          buttonList={[
            {
              type: "primary",
              content: "Create New",
              icon: "plus",
              onClick: () => {
                if (permission?.isCreate) {
                  history.push(
                    "/compensationAndBenefits/incometaxmgmt/taxChallan/create"
                  );
                } else {
                  toast.warn("You don't have permission");
                }
              },
            },
          ]}
        />
        <PCardBody className="mb-3">
          <Row gutter={[10, 2]}>
                <Col md={5} sm={12} xs={24}>
                  <PSelect
                    options={fiscalYearDDL?.data?.length > 0 ? fiscalYearDDL?.data : []}
                    name="ListOfFiscalYear"
                    showSearch
                    filterOption={true}
                    label="Financial Year"
                    placeholder="Financial Year"
                    onChange={(_, op) => {
                      form.setFieldsValue({ fiscalYear: op });
                    }}
                    rules={[{ required: true, message: "Fiscal Year is required" }]}
                  />
                </Col>
                <Col md={5} sm={12} xs={24}>
                  <PSelect
                    options={workplaceDDL.data}
                    name="ListOfWorkplace"
                    label="Workplace"
                    placeholder="Select Workplace"
                    onChange={(_, op) => {
                      form.setFieldsValue({ workplace: op });
                    }}
                    loading={workplaceDDL.loading}
                    rules={[{ required: true, message: "Workplace Is Required" }]}
                  />
                </Col>
                {moreFields}
                {!hideSubmitBtn && (
                  <Col style={{ marginTop: "23px" }}>
                    <PButton type="primary" action="submit" content="View" />
                  </Col>
                )}
              </Row>
        </PCardBody>
        <DataTable
          header={getHeader(pages, history)}
          bordered
          data={data?.data || []}
          loading={loading}
        />
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default WorkForceCreate;
