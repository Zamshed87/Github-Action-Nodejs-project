import axios from "axios";
export const getBuDetails=async(buId,setter,setLoading)=>{
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
}
// salary generate landing
export const getBankAdviceRequestLanding = async (
  orgId,
  buId,
  values,
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
     `/Payroll/BankAdvaiceReport?partName=SalaryAdvice&intAccountId=${orgId}&intBusinessUnitId=${buId}&intMonthId=${values?.monthId}&intYearId=${values?.yearId}&intSalaryGenerateRequestId=${values?.adviceName?.value}&BankAccountNo=${values?.bankAccountNo?.value}&strAdviceType=${values?.adviceTo?.value}`
      );
    if (res?.data) {
      setAllData && setAllData(res?.data);
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
