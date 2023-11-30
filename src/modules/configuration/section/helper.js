import axios from "axios";
import Chips from "common/Chips";
import { toast } from "react-toastify";


// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter((item) =>
      regex.test(item?.strDepartment?.toLowerCase())
    );
    setRowDto(newDta);
  } catch {
    setRowDto([]);
  }
};

export const attachment_action = async (attachment, setLoading) => {
  setLoading && setLoading(true);
  let formData = new FormData();
  formData.append("files", attachment[0]);
  try {
    let { data } = await axios.post("/emp/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setLoading && setLoading(false);
    toast.success("Upload  successfully");
    return data;
  } catch (error) {
    setLoading && setLoading(false);
    toast.error("File Size is too large or inValid File!");
  }
};

export const createSection = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/SaasMasterData/CreateSection`, payload);
    cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const getAllEmpSection = async (
  accountId,
  buId,
  setter,
  setAllData,
  setLoading,
  wId
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/SaasMasterData/GetSectionDataLanding?AccountId=${accountId}&WorkplaceId=${wId || 0}
      `
    );
    if (res?.data) {
      const modified = res?.data?.map((item) => ({
        ...item,
        // statusValue: item?.isActive ? "Active" : "Inactive",
      }));
      modified?.length > 0 ? setter(modified) : setter([]);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
export const sectionDtoCol = () => {
  return [
    {
      title: "SL",
      render: (_, index) => index + 1,
      className: "text-center",
      width: 50,
    },
    {
      title: "Section",
      dataIndex: "sectionName",
      sort: true,
      fieldType: "string",
      // filter: true,
      render: (record) => {
        return (
          <span>
            {record?.sectionName}
          </span>
        );
      },
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      sort: true,
      fieldType: "string",
      // filter: true,
      render: (record) => {
        return (
          <span>
            {record?.departmentName}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (record) => {
        return (
          <div>
            <Chips
              label={record?.isActive ? "Active" : "Inactive"}
              classess={`${record?.isActive ? "success" : "danger"} p-2`}
            />
          </div>
        );
      },
      sort: true,
      // filter: true,
      fieldType: "string",
    },
  ];
};
