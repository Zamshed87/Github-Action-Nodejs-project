import axios from "axios";

// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    if (!keywords) {
      setRowDto(allData);
      return;
    }
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter((item) =>
      regex.test(item?.employeeName?.toLowerCase())
    );
    setRowDto(newDta);
  } catch (e) {
    setRowDto([]);
  }
};

export const getLoanApplicationByAdvanceFilter = async (
  setAllData,
  setter,
  setIsLoading,
  payload,
  cb
) => {
  setIsLoading(true);
  try {
    let res = await axios.post(
      `/Employee/GetLoanApplicationByAdvanceFilter`,
      payload
    );
    cb && cb();
    setIsLoading(false);
    setAllData && setAllData(res?.data);
    setter(res?.data);
  } catch (err) {
    setIsLoading(false);
    setter([]);
  }
};
