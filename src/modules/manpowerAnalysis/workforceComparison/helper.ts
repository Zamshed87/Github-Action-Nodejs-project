import axios from "axios";


/**
 * Fetch workforce planning data by type.
 * @param params { yearType, fromDate, toDate, workplaceId, planningTypeId, pageNo, pageSize }
 * @returns Promise<{statusCode: number, data: any[], totalCount: number, pageNo: number, pageSize: number}>
 */
export const fetchWorkforceTypeWiseData = async ({
  yearType,
  fromDate,
  toDate = "",
  workplaceId,
  planningTypeId,
  pageNo = 1,
  pageSize = 10,
  setTableData,
  setPagination,
  setShowData
}: {
  yearType: number;
  fromDate: string | number;
  toDate?: string | number; 
  workplaceId: number | string;
  planningTypeId: number;
  pageNo?: number;
  pageSize?: number;
  setTableData: (data: any[]) => void;
  setPagination: (pagination: { current: number; pageSize: number; total: number }) => void;
  setShowData?: (data: any) => void;
}) => {
  const res = await axios.get(
    `/WorkforcePlanning/GetAllManpowerComparison`,
    {
      params: {
        YearTypeId: yearType,
        FromDate: fromDate,
        ToDate: toDate,
        WorkplaceId: workplaceId,
        PlanningTypeId: planningTypeId,
        pageNo,
        pageSize,
      },
    }
  );
  if(res?.data?.data){
    if (setShowData) {
      setShowData(true);
    }
  }
   setTableData(res?.data?.data);
          setPagination({
            current: res?.data.pageNo,
            pageSize: res?.data.pageSize || pageSize,
            total: res?.data?.totalCount || 0,
          });
};

