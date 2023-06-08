import axios from "axios";
import { toast } from "react-toastify";
import AvatarComponent from "../../../common/AvatarComponent";
import FormikCheckBox from "../../../common/FormikCheckbox";
import { gray600, gray900, greenColor } from "../../../utility/customColor";

export const getRequisitionAssignLanding = async (
  orgId,
  values,
  setter,
  setLoading,
  setAllData,
  buId = 0,
  wgId = 0
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/AssetManagement/GetAssetRequisition?accountId=${orgId}&businessUnitId=${buId}&workplaceGroupId=${wgId}&workplaceId=${
        values?.workplace?.value || 0
      }&employeeId=${values?.employee?.value || 0}`
    );
    setter(res?.data);
    setAllData(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const sendAssetForApproval = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/AssetManagement/SendForApprovalAssetRequisition`,
      payload
    );
    cb && cb();
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const assetRequisitionAssignColumns = (
  rowDto,
  setRowDto,
  allData,
  setAllData,
  rowDtoHandler,
  quantityHandler,
  permission,
  errors,
  touched,
  page,
  paginationSize,
  employeeId,
  deleteAssetRequisition,
  cb
) => [
  {
    title: () => (
      <span style={{ color: gray600, textAlign: "text-center" }}>SL</span>
    ),
    render: (_, __, index) => (page - 1) * paginationSize + index + 1,

    className: "text-center",
  },
  {
    title: () => (
      <div style={{ minWidth: "100px" }}>
        <FormikCheckBox
          styleObj={{
            margin: "0 auto!important",
            padding: "0 !important",
            color: gray900,
            checkedColor: greenColor,
          }}
          name="allSelected"
          checked={
            rowDto?.length > 0 && rowDto?.every((item) => item?.isAssigned)
          }
          onChange={(e) => {
            let data = rowDto?.map((item) => ({
              ...item,
              isAssigned: e.target.checked,
            }));
            let data2 = allData.map((item) => ({
              ...item,
              isAssigned: e.target.checked,
            }));
            setRowDto(data);
            setAllData(data2);
          }}
        />

        <span style={{ marginLeft: "5px", color: gray600 }}>Employee ID</span>
      </div>
    ),
    dataIndex: "employeeCode",
    render: (_, record, index) => (
      <div style={{ minWidth: "80px" }}>
        <FormikCheckBox
          styleObj={{
            margin: "0 auto!important",
            color: gray900,
            checkedColor: greenColor,
            padding: "0px",
          }}
          name="selectCheckbox"
          color={greenColor}
          checked={record?.isAssigned}
          onChange={(e) => {
            let data = rowDto?.map((item) =>
              item?.assetRequisitionId === record?.assetRequisitionId
                ? { ...item, isAssigned: !item?.isAssigned }
                : item
            );
            let data2 = allData?.map((item) =>
              item?.assetRequisitionId === record?.assetRequisitionId
                ? { ...item, isAssigned: !item?.isAssigned }
                : item
            );
            setRowDto(data);
            setAllData(data2);
          }}
        />

        <span style={{ marginLeft: "5px" }}>{record?.employeeCode}</span>
      </div>
    ),
  },
  {
    title: "Employee",
    dataIndex: "employeeName",
    render: (employeeName) => (
      <div className="d-flex align-items-center">
        <AvatarComponent classess="" letterCount={1} label={employeeName} />
        <span className="ml-2">{employeeName}</span>
      </div>
    ),
    sorter: true,
    filter: true,
  },
  {
    title: "Designation",
    dataIndex: "designation",
    sorter: true,
    filter: true,
  },
  {
    title: "Department",
    dataIndex: "department",
    sorter: true,
    filter: true,
  },
  {
    title: "Item Category",
    dataIndex: "itemCategory",
    sorter: true,
    filter: true,
  },
  {
    title: "Item Name",
    dataIndex: "itemName",
    sorter: true,
    filter: true,
  },
  {
    title: "UoM",
    dataIndex: "itemUom",
    sorter: true,
    filter: true,
  },
  {
    title: "Quantity",
    dataIndex: "reqisitionQuantity",
    sorter: true,
    filter: true,
    render: (_, record, index) => (
      <div className="input-field-main pl-2" style={{ height: "25px" }}>
        <input
          style={{
            height: "25px",
            width: "140px",
            fontSize: "12px",
          }}
          className="form-control text-right"
          value={record?.reqisitionQuantity}
          name={record?.reqisitionQuantity}
          placeholder=" "
          type="text"
          onChange={(e) => {
            if (e.target.value >= 0) {
              quantityHandler("reqisitionQuantity", index, +e.target.value);
            } else {
              toast.warn("Quantity can not be negative value", {
                toastId: 1001,
              });
            }
          }}
          required
          errors={errors}
          touched={touched}
        />
      </div>
    ),
  },
  {
    className: "text-center",

    render: (_, item, index) => (
      <div>
        {item?.assetRequisitionId && (
          <div>
            <button
              className="btn btn-default"
              style={{
                marginRight: "25px",
                width: "150px",
                height: "24px",
                fontSize: "12px",
                padding: "0px 12px",
                backgroundColor: "rgb(11, 165, 236)",
              }}
              type="submit"
              onClick={(e) => {
                if (!permission?.isCreate)
                  return toast.warn("You don't have permission");

                rowDtoHandler(item);
              }}
            >
              Send For Approval
            </button>
          </div>
        )}
      </div>
    ),
  },
  {
    render: (_, item) => (
      <div>
        {item?.assetRequisitionId && (
          <div>
            <button
              style={{
                backgroundColor: "#EA4445",
                marginRight: "25px",
                height: "24px",
                fontSize: "12px",
                padding: "0px 12px 0px 12px",
              }}
              type="button"
              className="btn btn-default"
              onClick={(e) => {
                e.stopPropagation();
                const payload = {
                  assetRequisitionId: item?.assetRequisitionId,
                  isDenied: true,
                };
                deleteAssetRequisition(
                  `/AssetManagement/AssetRequisitionDenied`,
                  payload,
                  cb,
                  true
                );
              }}
            >
              Denied
            </button>
          </div>
        )}
      </div>
    ),
  },
];
