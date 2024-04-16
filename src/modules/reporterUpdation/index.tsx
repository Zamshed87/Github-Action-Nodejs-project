import {
  DataTable,
  PCard,
  PCardHeader,
  PForm,
  PSelect,
  TableButton,
} from "Components";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getEmployee, header } from "./utils";
import { PModal } from "Components/Modal";
import AddEditForm from "./AddEditForm";
import { toast } from "react-toastify";

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

  const getEmployeeLandingForBulkReporter = (
    pagination = { currentPage: 1, pageSize: 25 }
  ) => {
    const { employee } = form.getFieldsValue(true);

    const payload = {
      accountId: orgId,
      workplaceId: wId,
      isPaginated: true,
      // employeecode will be employeeId for this api that is set on employee ddl api call
      intEmployeeId: employee?.value,
      pageNo: pagination?.currentPage,
      pageSize: pagination?.pageSize,
    };

    BulkReporterLandinApi?.action({
      urlKey: "GetLandingForBulkReporter",
      method: "post",
      payload,
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // table action component
  const actionObj = {
    width: 20,
    align: "center",
    render: (_: any, rec: any) => (
      <>
        <TableButton
          buttonsList={[
            {
              type: "edit",
              isActive: selectedRow?.length === 0 ? true : false,
              onClick: (e: any) => {
                if (!employeeFeature?.isEdit) {
                  return toast.warn("You don't have permission");
                  e.stopPropagation();
                }
                setOpen(true);
                setId(rec);
              },
            },
          ]}
        />
      </>
    ),
  };

  return employeeFeature?.isView ? (
    <PForm formName="bulkReporterChange" form={form}>
      <PCard>
        <PCardHeader
          title="Bulk Reporter Update"
          buttonList={[
            {
              content: "Change Reporter",
              disabled: selectedRow?.length === 0 ? true : false,
              onClick: () => {
                CommonEmployeeDDL.reset();
                selectedRow?.length > 0 && setOpen(true);
              },
              type: "primary",
            },
          ]}
        ></PCardHeader>
        <Row gutter={[10, 2]} className="mb-3">
          <Form.Item shouldUpdate noStyle>
            <>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  name="employee"
                  label="Select an Employee"
                  placeholder={"Search Min 2 char"}
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
                    getEmployee(value, CommonEmployeeDDL, buId, wgId);
                  }}
                  showSearch
                  filterOption={false}
                />
              </Col>
            </>
          </Form.Item>
        </Row>
        <DataTable
          header={header(actionObj)}
          bordered
          data={BulkReporterLandinApi?.data?.data || []}
          loading={BulkReporterLandinApi?.loading}
          scroll={{ x: 1500 }}
          pagination={{
            pageSize: BulkReporterLandinApi?.data?.pageSize,
            total: BulkReporterLandinApi?.data?.totalCount,
          }}
          onChange={(pagination, filters, sorter, extra) => {
            // Return if sort function is called
            if (extra.action === "sort") return;
            getEmployeeLandingForBulkReporter({
              ...pagination,
              currentPage: pagination?.current,
            });
          }}
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
          setOpen(false);
        }}
        maskClosable={false}
        components={
          <>
            <AddEditForm
              getData={getEmployeeLandingForBulkReporter}
              setIsAddEditForm={setOpen}
              CommonEmployeeDDL={CommonEmployeeDDL}
              selectedRow={selectedRow}
              setSelectedRow={setSelectedRow}
              id={id}
              setId={setId}
              BulkReporterLandinApi={BulkReporterLandinApi}
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
