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

export const rowGenerateFunction = (
  hrPosition, //dd1
  empType, //dd2
  religion, //dd3
  itemName,
  setRowGenerate,
  values,
  setLoading,
  wgId,
  buId,
  wgName,
  orgId,
  employeeId,
  state
) => {
  console.log("values", values);

  const result = [];
  setLoading(true);

  // Generate permutations
  for (let i = 0; i < hrPosition?.length; i++) {
    for (let j = 0; j < empType?.length; j++) {
      for (let k = 0; k < religion?.length; k++) {
        const permutation = {
          intBonusSetupId: state?.intBonusSetupId || 0,
          strBonusGroupCode: "",
          intBonusId: values?.bonusName?.intBonusId || 0,
          strBonusName: values?.bonusName?.label || "",
          strBonusDescription: values?.bonusName?.strBonusDescription || "",
          intAccountId: orgId || 0,
          intBusinessUnitId: buId || 0,
          intWorkplaceGroupId: wgId || 0,
          strWorkplaceGroupName: wgName || "",
          intWorkPlaceId: values?.workplace?.value || 0,
          strWorkPlaceName: values?.workplace?.label || "",
          intReligion: religion[k]?.value || 0,
          strReligionName: religion[k]?.label || "",
          intEmploymentTypeId: empType[j]?.value || 0,
          strEmploymentType: empType[j]?.label || "",
          intHrPositionId: hrPosition[i]?.value || 0,
          strHrPositionName: hrPosition[i]?.label || "",
          isServiceLengthInDays: values?.serviceLengthType?.value === 1,
          intMinimumServiceLengthMonth: values?.minServiceLengthMonth || 0,
          intMaximumServiceLengthMonth: values?.maxServiceLengthMonth || 0,
          intMinimumServiceLengthDays: values?.minServiceLengthDay || 0,
          intMaximumServiceLengthDays: values?.maxServiceLengthDay || 0,
          strBonusPercentageOn: values?.bounsDependOn === 1 ? "Gross" : "Basic",
          numBonusPercentage: values?.bonusPercentage || 0,
          isDividedbyServiceLength: values?.isDividedByLength || false,
          intCreatedBy: employeeId || 0,
        };
        result.push(permutation);
      }
    }
  }

  setRowGenerate(result);
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
      sorter: false,
    },
    {
      title: "Employee Type",
      dataIndex: "strEmploymentType",
      sorter: false,
    },
    {
      title: "Religion",
      dataIndex: "strReligionName",
      sorter: false,
    },

    {
      title: "Action",
      width: 20,
      align: "center",
      render: (_, record) => (
        <>
          <DeleteOutlineIcon
            title="Delete"
            style={{ color: "", cursor: "pointer", fontSize: "22px" }}
            onClick={() => {
              setRowGenerate(
                rowGenerate.filter(
                  (item) =>
                    item.strHrPositionName !== record.strHrPositionName ||
                    item.strEmploymentType !== record.strEmploymentType ||
                    item.strReligionName !== record.strReligionName
                )
              );
            }}
          />
        </>
      ),
    },
  ];
};
