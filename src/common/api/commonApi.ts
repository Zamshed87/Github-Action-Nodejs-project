export const getWorkplaceGroup = ({params}: any) => {
    params?.workplaceGroupDDL?.action({
        urlKey: "WorkplaceGroupIdAll",
        method: "GET",
        params: {
            accountId: params?.orgId,
            businessUnitId: params?.buId,
        },
        onSuccess: (res: any[]) => {
            res.forEach((item, i) => {
                res[i].label = item?.strWorkplaceGroup;
                res[i].value = item?.intWorkplaceGroupId;
            });
        },
    });
}