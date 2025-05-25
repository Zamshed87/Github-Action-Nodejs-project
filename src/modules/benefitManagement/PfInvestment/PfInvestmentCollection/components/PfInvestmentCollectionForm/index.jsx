import { Checkbox, Form } from "antd";
import InvestmentDetailsTable from "./InvestmentDetailsTable";
import PFInvestmentTracking from "./PFInvestmentTracking";
import { toast } from "react-toastify";
import { DataTable, PCardBody } from "Components";
import { detailsHeader } from "./helper";

const PfInvestmentCollectionForm = ({
  form,
  saveData,
  setSaveData,
  isViewMode,
}) => {
  const removeData = (index) => {
    const newData = saveData?.filter((_, i) => i !== index);
    setSaveData(newData);
  };
  const addData = () => {
    form
      .validateFields([
        "collectionDate",
        "collectionAmount",
        "interestAmount",
        "principalAmount",
        "remark",
      ])
      .then((values) => {
        const collectionDate = form.getFieldValue("collectionDate");
        console.log("collectionDate:", collectionDate); // ✅ correct

        const newEntry = {
          ...values,
          rowId: 0,
        };
        setSaveData([...saveData, newEntry]);

        // Optional: Clear the form after adding
        form.resetFields([
          "collectionDateFake",
          "collectionDate",
          "collectionAmount",
          "interestAmount",
          "principalAmount",
          "remark",
        ]);
      })
      .catch(() => {
        toast.error("Please fill all required fields.");
      });
  };

  return (
    <>
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <div style={{ width: "60%" }}>
          <InvestmentDetailsTable />
        </div>
        <div
          style={{ width: "30%", display: "flex", justifyContent: "center" }}
        >
          {!isViewMode && (
            <Form.Item
              name="isCollectionComplete"
              valuePropName="checked"
              style={{ marginTop: 23, marginBottom: 0 }}
            >
              <Checkbox>Is Collection Complete?</Checkbox>
            </Form.Item>
          )}
        </div>
      </div>
      {!isViewMode && <PFInvestmentTracking form={form} addData={addData} />}
      {saveData?.length > 0 && (
        <PCardBody className="mb-4">
          <DataTable
            bordered
            data={saveData || []}
            rowKey={(row, idx) => idx}
            header={detailsHeader({
              removeData,
              action:!isViewMode,
            })}
          />
        </PCardBody>
      )}
    </>
  );
};

export default PfInvestmentCollectionForm;
