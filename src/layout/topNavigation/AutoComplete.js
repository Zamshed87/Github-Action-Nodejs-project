
import { PSelect } from "Components";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const AutoCompleteWithHint = () => {
  const history = useHistory();
  const { menuList } = useSelector((state) => state?.auth, shallowEqual);
  const [menu, setMenu] = useState([]);
  const [inputValue, setInputValue] = useState(null);

  React.useEffect(() => {
    const allMenu = [];
    menuList?.forEach((menu) => {
      menu?.childList?.forEach((childMenu) => {
        if (childMenu?.childList?.length) {
          childMenu?.childList.forEach((thirdChild) => {
            allMenu.push({ ...thirdChild, value: thirdChild?.id });
          });
        } else {
          allMenu.push({ ...childMenu, value: childMenu?.id });
        }
      });
    });
    // Add extra Approval menu item
    allMenu.push({
      id: "approval",
      label: "Approval",
      value: "approval",
      to: "/approval",
      searchLabel: "approval" // for search compatibility
    });
    setMenu(allMenu);
  }, [menuList]);

  return (
    <PSelect
      className="top-menu-search"
      options={menu}
      style={{ minWidth: "250px" }}
      getPopupContainer={undefined}
      placeholder="Search menu"
      showSearch
      value={inputValue}
      onChange={(value, options) => {
        value &&
          history.push({
            pathname: `${options?.to}`,
            state: {},
          });
        setInputValue(null);
      }}
    />
  );
};

export default AutoCompleteWithHint;
