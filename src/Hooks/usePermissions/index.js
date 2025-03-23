import { useSelector, shallowEqual } from "react-redux";
import { useMemo } from "react";

const usePermissions = (menuReferenceId) => {
  const { permissionList, profileData } = useSelector(
    (state) => state?.auth,
    shallowEqual
  );

  const { buId, wgId, wId, orgId, intAccountId } = profileData || {};

  // Memoize the specific permission lookup based on menuReferenceId
  const permission = useMemo(() => {
    return (
      permissionList?.find(
        (item) => item?.menuReferenceId === menuReferenceId
      ) || {}
    );
  }, [permissionList, menuReferenceId]);

  return { permission, buId, wgId, wId, orgId, intAccountId, profileData };
};

export default usePermissions;
