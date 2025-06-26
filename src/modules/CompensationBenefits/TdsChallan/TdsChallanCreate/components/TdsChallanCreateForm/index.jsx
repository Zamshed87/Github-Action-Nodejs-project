import TdsChallanFormFields from "./TdsChallanFormFields";
import { toast } from "react-toastify";
import { detailsHeader } from "./helper";
import { DataTable, PCardBody } from "Components";
import { useDispatch } from "react-redux";
import { useState } from "react";
import Loading from "common/loading/Loading";

const TdsChallanCreateForm = ({ form, saveData, setSaveData, edit, view }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const removeData = (index) => {
    const newData = saveData?.filter((_, i) => i !== index);
    setSaveData(newData);
  };
  const addData = (attachmentId) => {
    const validateFields = [
      "strTransactionMode",
      "intBankWalletId",
      "strBankWallet",
      "strBranchName",
      "dteChallanDateF",
      "dteChallanDate",
      "strChallanNumber",
      "numChallanAmount",
      "strComment",
    ];

    form
      .validateFields(validateFields)
      .then((values) => {
        if (
          saveData.find(
            (data) => data?.strChallanNumber == values?.strChallanNumber
          )
        ) {
          toast.error(
            "Overlapping challan detected. Please adjust the values."
          );
          return;
        }
        const payload = {
          ...values,
          intBankWalletId: values?.intBankWalletId?.value,
          strBankWallet: values?.intBankWalletId?.label,
          strBranchName: values?.strBranchName?.toString(),
          intDocumentId: attachmentId ?? 0,
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
      <TdsChallanFormFields
        form={form}
        addData={addData}
        edit={edit}
        view={view}
      />
      {saveData?.length > 0 && (
        <PCardBody className="mb-4">
          <DataTable
            bordered
            data={saveData || []}
            rowKey={(row, idx) => idx}
            header={detailsHeader({
              action: !view,
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
