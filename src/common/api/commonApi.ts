export const getWorkplaceGroup = ({workplaceGroupDDL, orgId, buId}: any) => {
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
}