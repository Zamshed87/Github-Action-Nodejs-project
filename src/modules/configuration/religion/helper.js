import axios from "axios";

// search
export const filterData = (keywords, allData, setRowDto) => {
  try{
  const regex = new RegExp(keywords?.toLowerCase());
  let newDta = allData?.filter((item) =>
    regex.test(item?.strReligion?.toLowerCase())
  );
  setRowDto(newDta);
  }catch{setRowDto([])}
};

export const getAllReligion = async (setter, setAllData, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(`/MasterData/GetAllReligion`);
    setter && setter(res?.data);
   setAllData && setAllData(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
  }
};