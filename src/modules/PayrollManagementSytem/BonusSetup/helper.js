import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import axios from "axios";
import { setHeaderListDataDynamically } from "common/peopleDeskTable/helper";
import { toast } from "react-toastify";

export const getBonusNameDDL = async (payload, setter) => {
  try {
    const res = await axios.post(`/Employee/BonusAllLanding`, payload);
    setter(res?.data);
  } catch (error) {}
};

export const getBonusSetupLanding = async (
  payload,
  modifiedPayload,
  setter,
  setLoading,
  pagination,
  searchText,
  currentFilterSelection,
  checkedHeaderList,
  values,
  headerList,
  setHeaderList,
  filterOrderList,
  setFilterOrderList,
  initialHeaderListData,
  setInitialHeaderListData,
  setPages
) => {
  console.log({ payload });
  try {
    const res = await axios.post(`/Employee/BonusSetupLandingPagination`, {
      ...payload,
      ...modifiedPayload,
    });
    if (res?.data?.datas?.length > 0) {
      const modified = res?.data?.datas?.map((item) => ({
        ...item,
        statusValue: item?.isActive ? "Active" : "Inactive",
      }));
      modified?.length > 0 && setter(modified);
      if (res?.data?.datas) {
        setHeaderListDataDynamically({
          currentFilterSelection,
          checkedHeaderList,
          headerListKey: "headerList",
          headerList,
          setHeaderList,
          response: { ...res?.data },
          filterOrderList,
          setFilterOrderList,
          initialHeaderListData,
          setInitialHeaderListData,
          setter,
          setPages,
        });
        setLoading(false);
      }
    } else {
      setter([]);
    }

    // setter(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const createBonusSetup = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/CRUDBonusSetup`, payload);
    cb && cb();
    toast.success(res.data?.message || " Create Successfully", {
      toastId: "bonusCreate",
    });
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong", {
      toastId: "bonusCreate",
    });
    setLoading && setLoading(false);
  }
};

// export const rowGenerateFunction = (
//   hrPosition, //dd1
//   empType, //dd2
//   religion, //dd3
//   itemName,
//   setRowGenerate,
//   values,
//   setLoading,
//   rowGenerate
// ) => {

//   const result = [];
//   setLoading(true);

//   // Generate permutations
//   for (let i = 0; i < hrPosition?.length; i++) {
//     for (let j = 0; j < empType?.length; j++) {
//       for (let k = 0; k < religion?.length; k++) {
//         const permutation = {
//           intReligion: religion[k]?.value || 0,
//           strReligionName: religion[k]?.label || "",
//           intEmploymentTypeId: empType[j]?.value || 0,
//           strEmploymentType: empType[j]?.label || "",
//           intHrPositionId: hrPosition[i]?.value || 0,
//           strHrPositionName: hrPosition[i]?.label || "",
//         };
//         result.push(permutation);
//       }
//     }
//   }

//   setRowGenerate(result);
//   setTimeout(() => setLoading(false), 1);
// };
export const rowGenerateFunction = (
  hrPosition, //dd1
  empType, //dd2
  religion, //dd3
  itemName,
  setRowGenerate,
  values,
  setLoading,
  rowGenerate,
) => {
  console.log("rowgeneate", rowGenerate);
  const result = [];
  setLoading(true);

  // Generate permutations
  for (let i = 0; i < hrPosition?.length; i++) {
    for (let j = 0; j < empType?.length; j++) {
      for (let k = 0; k < religion?.length; k++) {
        const permutation = {
          intReligion: religion[k]?.value || 0,
          strReligionName: religion[k]?.label || "",
          intEmploymentTypeId: empType[j]?.value || 0,
          strEmploymentType: empType[j]?.label || "",
          intHrPositionId: hrPosition[i]?.value || 0,
          strHrPositionName: hrPosition[i]?.label || "",
        };
        // Check if permutation already exists in rowGenerate
        const exists = rowGenerate.some(
          (existingRow) =>
            existingRow.intReligion === permutation.intReligion &&
            existingRow.intEmploymentTypeId ===
              permutation.intEmploymentTypeId &&
            existingRow.intHrPositionId === permutation.intHrPositionId
        );
        // Add permutation to result if it doesn't already exist
        console.log("exists", exists);
        if (!exists) {
          result.push(permutation);
        }
      }
    }
  }

  // Concatenate existing data in rowGenerate with the new permutations
  const updatedRows = [...rowGenerate, ...result];
  setRowGenerate(updatedRows);
  setTimeout(() => setLoading(false), 1);
};

export const rowColumns = (setRowGenerate, rowGenerate) => {
  console.log("rowGenerate", rowGenerate);
  return [
    {
      title: "SL",
      render: (_, rec, index) => index + 1,
      width: 20,
    },
    {
      title: "HR Position",
      dataIndex: "strHrPositionName",
      render: (_, record) => (
        <>
          <span style={{ color: record.responceMessage ? "red" : "inherit" }}>
            {record?.strHrPositionName || record?.hrPositionName}
          </span>
        </>
      ),
      sorter: false,
    },
    {
      title: "Employee Type",
      dataIndex: "strEmploymentType",
      render: (_, record) => (
        <>
          <span style={{ color: record.responceMessage ? "red" : "inherit" }}>
            {record?.strEmploymentType}
          </span>
        </>
      ),
      sorter: false,
    },
    {
      title: "Religion",
      dataIndex: "strReligionName",
      render: (_, record) => (
        <>
          <span style={{ color: record.responceMessage ? "red" : "inherit" }}>
            {record?.strReligionName}
          </span>
        </>
      ),
      sorter: false,
    },

    {
      title: "Message",
      dataIndex: "responceMessage",
      render: (_, record) => (
        <>
          <span style={{ color: record.responceMessage ? "red" : "inherit" }}>
            {record?.responceMessage}
          </span>
        </>
      ),
      sorter: false,
    },

    {
      title: "Action",
      width: 20,
      align: "center",
      render: (_, record, index) => (
        <>
          <DeleteOutlineIcon
            title="Delete"
            style={{ color: "", cursor: "pointer", fontSize: "22px" }}
            onClick={() => {
              setRowGenerate(rowGenerate.filter((item, i) => i !== index));
            }}
          />
        </>
      ),
    },
  ];
};
