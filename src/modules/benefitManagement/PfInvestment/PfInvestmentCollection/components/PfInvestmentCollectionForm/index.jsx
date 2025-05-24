import { Checkbox, Form } from "antd";
import InvestmentDetailsTable from "./InvestmentDetailsTable";
import PFInvestmentTracking from "./PFInvestmentTracking";
import { toast } from "react-toastify";

const PfInvestmentCollectionForm = ({ form, saveData, setSaveData }) => {
  const removeData = (index) => {
    const newData = saveData?.filter((_, i) => i !== index);
    setSaveData(newData);
  };
  const addData = () => {
    form
      .validateFields(["collectionDate",
          "collectionAmount",
          "interestAmount",
          "principalAmount",
          "remark"])
      .then((values) => {
        const collectionDate = form.getFieldValue("collectionDate");
        console.log("Form Values:", collectionDate);
        const newEntry = {
          ...values,
          rowId: 0,
        };
        setSaveData([...saveData, newEntry]);

        // Optional: Clear the form after adding
        form.resetFields([
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
        <div style={{ width: "30%", display: "flex", justifyContent: "center" }}>
          <Form.Item
            name="consecutiveDay"
            valuePropName="checked"
            style={{ marginTop: 23, marginBottom: 0 }}
          >
            <Checkbox
              onChange={(e) =>
                form.setFieldsValue({ consecutiveDay: e.target.checked })
              }
            >
              Is Collection Complete?
            </Checkbox>
          </Form.Item>
        </div>
      </div>
      <PFInvestmentTracking
        form={form}
        data={saveData}
        addData={() => addData()}
        removeData={(index) => removeData(index)}
      />
    </>
  );
};

export default PfInvestmentCollectionForm;
