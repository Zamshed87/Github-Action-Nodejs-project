import axios from "axios";
import { toast } from "react-toastify";
import AvatarComponent from "../../../common/AvatarComponent";
import FormikCheckBox from "../../../common/FormikCheckbox";
import { gray900, greenColor } from "../../../utility/customColor";

export const getBuDetails = async (buId, setter, setLoading) => {
  try {
    const res = await axios.get(
      `/SaasMasterData/GetBusinessDetailsByBusinessUnitId?businessUnitId=${buId}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
  }
};
// bonus name DDL
export const getBonusNameDDL = async (payload, setter) => {
  try {
    const res = await axios.post(`/Employee/BonusAllLanding`, payload);
    setter(res?.data);
  } catch (error) {}
};

// bonus generate landing
export const getBonusGenerateLanding = async (
  payload,
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/BonusAllLanding`, payload);
    if (res?.data) {
      console.log("res", res?.data)
      setAllData && setAllData(res?.data);
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

// bonus generate request
export const createBonusGenerateRequest = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/CRUDBonusGenerate`, payload);
    cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong!");
    setLoading && setLoading(false);
  }
};

// get bonus generate list data for approval
export const getAllBonusGenerateListDataForApproval = async (
  payload,
  setter,
  setFilterData,
  setLoading,
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/BonusGenerateHeaderLandingEngine`,
      payload
    );
    if (res?.data) {
      setter(res?.data);
      setFilterData(res?.data)
    }
    // cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    setFilterData([]);
    setLoading && setLoading(false);
  }
};

// bonus generate approve and reject
export const bonusGenerateApproveReject = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/BonusGenerateHeaderApprovalEngine`,
      payload
    );
    cb && cb();
    toast.success(res?.data || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const columns = (rowDto, setRowDto, setFieldValue) => {
  return [
    {
      title: () => <div style={{ color: "#475467" }}>SL</div>,
      render: (text, record, index) => index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
    },
    {
      title: () => (
        <div className="d-flex align-items-center">
          <div className="mr-2" onClick={(e) => e.stopPropagation()}>
            <FormikCheckBox
              styleObj={{
                margin: "0 auto!important",
                padding: "0 !important",
                color: gray900,
                checkedColor: greenColor,
              }}
              name="allSelected"
              checked={
                rowDto?.length > 0 && rowDto?.every((item) => item?.isChecked)
              }
              onChange={(e) => {
                e.stopPropagation();
                let modifyRowDto = rowDto?.map((item) => ({
                  ...item,
                  isChecked: e.target.checked,
                }));
                setRowDto(modifyRowDto);
                setFieldValue("allSelected", e.target.checked);
              }}
            />
          </div>
          <div>Employee Name</div>
        </div>
      ),
      dataIndex: "strEmployeeName",
      render: (strEmployeeName, record) => (
        <div className="d-flex align-items-center">
          <div className="mr-2" onClick={(e) => e.stopPropagation()}>
            <FormikCheckBox
              styleObj={{
                margin: "0 auto!important",
                color: gray900,
                checkedColor: greenColor,
                padding: "0px",
              }}
              name="isBonusGenerate"
              color={greenColor}
              checked={record?.isChecked}
              onChange={(e) => {
                const modifiedRowDto = rowDto.map((item) =>
                  item?.intEmployeeId === record?.intEmployeeId
                    ? { ...item, isChecked: e.target.checked }
                    : item
                );
                setRowDto(modifiedRowDto);
              }}
              // disabled={item?.ApplicationStatus === "Approved"}
            />
          </div>
          <AvatarComponent
            classess=""
            letterCount={1}
            label={strEmployeeName}
          />
          <span className="ml-2">{strEmployeeName}</span>
        </div>
      ),
      sorter: true,
      filter: true,
    },
    {
      title: "Employee Id",
      dataIndex: "strEmployeeCode",
      sorter: true,
      filter: true,
    },
    {
      title: "Type",
      dataIndex: "strEmploymentType",
      sorter: true,
      filter: true,
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sorter: true,
      filter: true,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sorter: true,
      filter: true,
    },
    {
      title: "Department Section",
      dataIndex: "strDepartmentSection",
      sorter: true,
      filter: true,
    },
    {
      title: "Workplace Group",
      dataIndex: "strWorkplaceGroup",
      sorter: true,
      filter: true,
    },
    {
      title: "Workplace",
      dataIndex: "strWorkplace",
      sorter: true,
      filter: true,
    },
    {
      title: "Payroll Group",
      dataIndex: "strPayrollGroup",
      sorter: true,
      filter: true,
    },
  ];
};
