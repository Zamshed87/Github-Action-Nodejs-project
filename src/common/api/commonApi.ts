import axios from "axios";

export const getWorkplaceGroupDDL = ({
  workplaceGroupDDL,
  orgId,
  buId,
}: any) => {
  workplaceGroupDDL?.action({
    urlKey: "WorkplaceGroupIdAll",
    method: "GET",
    params: {
      accountId: orgId,
      businessUnitId: buId,
    },
    onSuccess: (res: any[]) => {
      res.forEach((item, i) => {
        res[i].label = item?.strWorkplaceGroup;
        res[i].value = item?.intWorkplaceGroupId;
      });
    },
  });
};

export const getWorkplaceDDL = ({ workplaceDDL, orgId, buId, wgId }: any) => {
  workplaceDDL?.action({
    urlKey: "WorkplaceIdAll",
    method: "GET",
    params: {
      accountId: orgId,
      businessUnitId: buId,
      workplaceGroupId: wgId,
    },
    onSuccess: (res: any[]) => {
      res.forEach((item, i) => {
        res[i].label = item?.strWorkplace;
        res[i].value = item?.intWorkplaceId;
      });
    },
  });
};

export const getEnumData = async (
  enumType: string,
  setData: any,
  setLoading?: any,
  isUnshiftAll?: boolean
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(`/Enum/GetEnums?types=${enumType}`);
    const data = res?.data[enumType];
    if (isUnshiftAll) {
      data.unshift({ label: "All", value: 0 });
    }
    setData(data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading && setLoading(false);
  }
};
