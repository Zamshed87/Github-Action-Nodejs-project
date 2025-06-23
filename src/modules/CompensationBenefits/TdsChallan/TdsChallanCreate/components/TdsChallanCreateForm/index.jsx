import TdsChallanFormFields from "./TdsChallanFormFields";
import { toast } from "react-toastify";
import { detailsHeader } from "./helper";
import { DataTable, PCardBody } from "Components";
import { useDispatch } from "react-redux";
import { useState } from "react";
import Loading from "common/loading/Loading";

const TdsChallanCreateForm = ({ form, saveData, setSaveData,edit,view }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const removeData = (index) => {
    const newData = saveData?.filter((_, i) => i !== index);
    setSaveData(newData);
  };
  const addData = (attachmentId) => {
    const validateFields = [
      "StrTransactionMode",
      "IntBankWalletId",
      "StrBankWallet",
      "StrBranchName",
      "DteChallanDateF",
      "DteChallanDate",
      "StrChallanNumber",
      "NumChallanAmount",
      "StrComment",
    ];

    form
      .validateFields(validateFields)
      .then((values) => {
        if (saveData.find((data)=> data?.StrChallanNumber == values?.StrChallanNumber)) {
          toast.error("Overlapping challan detected. Please adjust the values.");
          return;
        }
        const payload = {
          ...values,
          IntBankWalletId: values?.IntBankWalletId?.value,
          StrBankWallet: values?.IntBankWalletId?.label,
          IntDocumentId: attachmentId ?? 0,
        };
        setSaveData((prev) => [...prev, payload]);
      })
      .catch(() => {
        toast.error("Please fill all required fields.");
      });
  };
  return (
    <>
      {loading && <Loading />}
      <TdsChallanFormFields form={form} addData={addData} edit={edit} view={view} />
      {saveData?.length > 0 && (
        <PCardBody className="mb-4">
          <DataTable
            bordered
            data={saveData || []}
            rowKey={(row, idx) => idx}
            header={detailsHeader({
              removeData,
              dispatch,
              setLoading,
            })}
          />
        </PCardBody>
      )}
    </>
  );
};

export default TdsChallanCreateForm;
