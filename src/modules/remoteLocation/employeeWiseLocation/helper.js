import axios from "axios";
import { toast } from "react-toastify";
import Chips from "../../../common/Chips";
import FormikCheckBox from "../../../common/FormikCheckbox";
import { gray900, greenColor } from "../../../utility/customColor";

export const getAllLocationAssignLanding = async (
  orgId,
  empId,
  setAllData,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/TimeSheet/EmployeeWiseLocation?AccountId=${orgId}&EmployeeId=${empId}`
    );
    if (res?.data) {
      const modifiedData = res?.data?.resultList?.map((item) => {
        return {
          ...item,
          selectCheckbox: item?.strStatus ? true : false,
        };
      });
      setAllData &&
        setAllData({
          ...res.data,
          resultList: modifiedData,
        });
      setter &&
        setter({
          ...res.data,
          resultList: modifiedData,
        });
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const createNUpdateEmployeeWiseLocation = async (
  payload,
  setter,
  setAllData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `TimeSheet/CreateNUpdateEmployeeWiseLocationAssaign`,
      payload
    );
    if (res?.data) {
      toast.success(res?.data?.message || "Submitted Successfully");
      setAllData && setAllData(res?.data);
      setter && setter(res?.data);
    }
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setter && setter([]);
    setLoading && setLoading(false);
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
              filterData?.resultList?.length > 0
                ? filterData?.resultList?.every((item) => item?.selectCheckbox)
                : false
            }
            onChange={(e) => {
              setFilterData({
                ...filterData,
                resultList: filterData?.resultList?.map((item) => ({
                  ...item,
                  selectCheckbox:
                    item?.strStatus === "process" ? true : e.target.checked,
                })),
              });
              setRowDto({
                ...rowDto,
                resultList: rowDto?.resultList?.map((item) => ({
                  ...item,
                  selectCheckbox:
                    item?.strStatus === "process" ? true : e.target.checked,
                })),
              });
              setFieldValue("allSelected", e.target.checked);
            }}
          />
        </div>
      ),
      dataIndex: "",
      render: (_, record) => (
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
              const data = filterData?.resultList?.map((item) => {
                if (item?.intMasterLocationId === record?.intMasterLocationId) {
                  return {
                    ...item,
                    selectCheckbox:
                      item?.strStatus === "process" ? true : e.target.checked,
                  };
                } else return item;
              });
              const data2 = rowDto?.resultList?.map((item) => {
                if (item?.intMasterLocationId === record?.intMasterLocationId) {
                  return {
                    ...item,
                    selectCheckbox:
                      item?.strStatus === "process" ? true : e.target.checked,
                  };
                } else return item;
              });
              setRowDto({ ...rowDto, resultList: [...data2] });
              setFilterData({ ...filterData, resultList: [...data] });
            }}
            disabled={record?.strStatus === "process"}
          />
        </div>
      ),
    },
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
    },
    {
      title: "Code",
      dataIndex: "strLocationCode",
      filter: true,
      sorter: true,
    },
    {
      title: "Location Name",
      dataIndex: "locationName",
      filter: true,
      sorter: true,
    },
    {
      title: "Location Log",
      dataIndex: "locationLog",
    },
    {
      title: "Status",
      dataIndex: "strStatus",
      render: (_, record) => (
        <div className="text-center action-chip" style={{ width: "70px" }}>
          {record?.strStatus === "approved" && (
            <Chips label="Approved" classess="success" />
          )}
          {record?.strStatus === "pending" && (
            <Chips label="Pending" classess=" warning" />
          )}
          {record?.strStatus === "rejected" && (
            <Chips label="Rejected" classess="danger" />
          )}
        </div>
      ),
      filter: false,
      sorter: false,
    },
  ];
};
