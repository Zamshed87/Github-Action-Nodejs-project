import { DataTable, PCard, PCardHeader, PForm, PSelect } from "Components";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { header } from "./utils";
import { AddOutlined } from "@mui/icons-material";
import { PModal } from "Components/Modal";
import AddEditForm from "./AddEditForm";

const ReporterUpdation = () => {
  // Data From Store
  const { orgId, buId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const dispatch = useDispatch();
  // Form Instance
  const [form] = Form.useForm();

  // States
  const [selectedRow, setSelectedRow] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");

  // menu permission
  let employeeFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30400) {
      employeeFeature = item;
    }
  });

  // api requests
  const CommonEmployeeDDL = useApiRequest([]);
  const BulkReporterLandinApi = useApiRequest([]);

  // api calls

  const getEmployeeLandingForBulkReporter = () => {
    const { employee } = form.getFieldsValue(true);

    const payload = {
      accountId: orgId,
      workplaceId: wId,
      isPaginated: true,
      // employeecode will be employeeId for this api that is set on employee ddl api call
      intEmployeeId: employee?.value,
      pageNo: 1,
      pageSize: 25,
    };

    BulkReporterLandinApi?.action({
      urlKey: "GetLandingForBulkReporter",
      method: "post",
      payload,
    });
  };

  const getEmployee = (value: any) => {
    if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        // workplaceId: wId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.employeeNameWithCode;
          res[i].value = item?.employeeId;
        });
      },
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return employeeFeature?.isView ? (
    <PForm
      form={form}
      initialValues={{
        employee: "",
      }}
    >
      <PCard>
        <PCardHeader
          title="Bulk Reporter Update"
          submitText="Change Reporter"
          submitIcon={<AddOutlined />}
          buttonList={[]}
        ></PCardHeader>
        <Row gutter={[10, 2]} className="mb-3">
          <Form.Item shouldUpdate noStyle>
            <>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  name="employee"
                  label="Select a Employee"
                  placeholder="Search Min 2 char"
                  options={CommonEmployeeDDL?.data || []}
                  loading={CommonEmployeeDDL?.loading}
                  onChange={(value, op) => {
                    setSelectedRow([]);
                    form.setFieldsValue({
                      employee: op,
                    });
                    getEmployeeLandingForBulkReporter();
                  }}
                  onSearch={(value) => {
                    getEmployee(value);
                  }}
                  showSearch
                  filterOption={false}
                />
              </Col>
            </>
          </Form.Item>
        </Row>
        <DataTable
          header={header}
          bordered
          data={BulkReporterLandinApi?.data?.Data || []}
          loading={BulkReporterLandinApi?.loading}
          scroll={{ x: 1500 }}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectedRow.map((item) => item?.key),
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRow(selectedRows);
            },
            getCheckboxProps: (rec) => {
              return {
                disabled: rec?.ApplicationStatus === "Approved",
              };
            },
          }}
        />
      </PCard>
      <PModal
        open={open}
        title={"Change Reporter"}
        width=""
        onCancel={() => {
          setId("");
          setOpen(false);
        }}
        maskClosable={false}
        components={
          <>
            <AddEditForm
              getData={getEmployeeLandingForBulkReporter}
              setIsAddEditForm={setOpen}
              isEdit={id ? true : false}
              singleData={id}
              setId={setId}
            />
          </>
        }
      />
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default ReporterUpdation;
