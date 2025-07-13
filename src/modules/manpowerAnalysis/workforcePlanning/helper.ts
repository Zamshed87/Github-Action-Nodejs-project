import axios from "axios";

/**
 * Fetch workforce planning data by type.
 * @param params { yearType, fromDate, workplaceId, planningTypeId }
 * @returns Promise<{statusCode: number, data: any[]>}
 */
export const fetchWorkforceTypeWiseData = async ({
  yearType,
  fromDate,
  toDate = "",
  workplaceId,
  planningTypeId,
}: {
  yearType: number;
  fromDate: string | number;
  toDate?: string | number; 
  workplaceId: number | string;
  planningTypeId: number;
}) => {
  const res = await axios.get(
    `/WorkforcePlanning/TypeWiseData`,
    {
      params: {
        YearType: yearType,
        FromDate: fromDate,
        ToDate: toDate,
        WorkplaceId: workplaceId,
        PlanningTypeId: planningTypeId,
      },
    }
  );
  return res.data;
};
