import PInfo from "common/PInfo";
import { DataTable } from "Components";
import { ModalFooter } from "Components/Modal";

const BlockedEmp = ({ data, setOpen, saveFromFieldHandler }: any) => {
  const rowDto = data.map((item: any) => item.employeeCheck);
  return (
    <div>
      <PInfo>
        <p>
          If you update OT hours to{" "}
          <strong>below minimum overtime hours</strong>, the row below will be
          permanently deleted.
        </p>
      </PInfo>
      <div className="mt-2">
        <DataTable
          bordered
          data={rowDto || []}
          header={[
            {
              title: "Employee Code",
              dataIndex: "strEmployeeCode",
            },
            {
              title: "Employee Name",
              dataIndex: "strEmployeeName",
            },
          ]}
        />
      </div>
      <ModalFooter
        onCancel={() => {
          setOpen({ isActive: false, blockedEmp: [] });
        }}
        onSubmit={() => {
          saveFromFieldHandler(true);
        }}
      />
    </div>
  );
};

export default BlockedEmp;
