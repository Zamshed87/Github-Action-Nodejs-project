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
