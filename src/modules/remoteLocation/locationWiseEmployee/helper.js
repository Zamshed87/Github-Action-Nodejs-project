import axios from "axios";
import { toast } from "react-toastify";
import FormikCheckBox from "../../../common/FormikCheckbox";
import { gray900, greenColor } from "../../../utility/customColor";

export const getLocationwiseEmpLanding = async (
  orgId,
  buId,
  locationId,
  setAllData,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/TimeSheet/GetLocationWiseEmployee?LocationMasterId=${locationId}&AccountId=${orgId}&BusineesUint=${buId}`
    );
    if (res?.data) {
      const modifiedData = res?.data?.map((item) => {
        return {
          ...item,
          selectCheckbox: item?.strStatus ? true : false,
        };
      });
      setAllData && setAllData(modifiedData);
      setter && setter(modifiedData);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const createNUpdateLocationWiseEmployee = async (
  payload,
  setter,
  setAllData,
  setLoading,
  cb
) => {
  try {
    const res = await axios.post(
      `/TimeSheet/CreateNUpdateLocationWiseEmployee`,
      payload
    );
    if (res?.data) {
      setAllData && setAllData(res?.data);
      setter(res?.data);
    }
    cb && cb();
    toast.success(res?.data || "Submitted Successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setter && setter([]);
  }
};

export const remoteLocColumns = (
  page,
  paginationSize,
  filterData,
  setFilterData,
  rowDto,
  setRowDto,
  setFieldValue
) => {
  return [
    {
      title: () => (
        <div>
          <FormikCheckBox
            styleObj={{
              margin: "0 auto!important",
              padding: "0 !important",
              color: gray900,
              checkedColor: greenColor,
            }}
            name="allSelected"
            checked={
              filterData?.length > 0
                ? filterData?.every((item) => item?.selectCheckbox)
                : false
            }
            onChange={(e) => {
              let data = filterData.map((item) => ({
                ...item,
                selectCheckbox:
                  item?.strStatus === "process" ? true : e.target.checked,
              }));
              let data2 = rowDto.map((item) => ({
                ...item,
                selectCheckbox:
                  item?.strStatus === "process" ? true : e.target.checked,
              }));
              setFilterData(data);
              setRowDto(data2);
              setFieldValue("allSelected", e.target.checked);
            }}
          />
          <span style={{ marginLeft: "5px" }}>Code</span>
        </div>
      ),
      dataIndex: "strEmployeeCode",
      render: (_, record, index) => (
        <div>
          <FormikCheckBox
            styleObj={{
              margin: "0 auto!important",
              color: gray900,
              checkedColor: greenColor,
              padding: "0px",
            }}
            name="selectCheckbox"
            color={greenColor}
            checked={record?.selectCheckbox === true}
            onChange={(e) => {
              let data = filterData?.map((item) => {
                if (
                  item?.intEmployeeBasicInfoId ===
                  record?.intEmployeeBasicInfoId
                ) {
                  return {
                    ...item,
                    selectCheckbox:
                      item?.strStatus === "process" ? true : e.target.checked,
                  };
                } else return item;
              });
              let data2 = rowDto?.map((item) => {
                if (
                  item?.intEmployeeBasicInfoId ===
                  record?.intEmployeeBasicInfoId
                ) {
                  return {
                    ...item,
                    selectCheckbox:
                      item?.strStatus === "process" ? true : e.target.checked,
                  };
                } else return item;
              });
              setFilterData(data);
              setRowDto(data2);
            }}
            disabled={record?.strStatus === "process"}
          />
          <span style={{ marginLeft: "5px" }}>{record?.strEmployeeCode}</span>
        </div>
      ),
    },
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
    },
    {
      title: "Employee",
      dataIndex: "strEmployeeName",
      filter: true,
      sorter: true,
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      filter: true,
      sorter: true,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      filter: true,
      sorter: true,
    },
  ];
};
