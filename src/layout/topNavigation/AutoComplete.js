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
    // allMenu.push({
    //   id: "approval",
    //   label: "Approval",
    //   value: "approval",
    //   to: "/approval",
    //   searchLabel: "approval", // for search compatibility
    // });
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
        console.log({ options });
        const op = options;
        if (options?.id == 98) {
          op.to = "/approval/8";
          op.applicationTypeId = 8;
          op.applicationType = "Leave";
        } else if (options?.id == 110) {
          op.to = "/approval/2";
          op.applicationTypeId = 2;
          op.applicationType = "Bonus Generate";
        } else if (options?.id == 104) {
          op.to = "/approval/21";
          op.applicationTypeId = 21;
          op.applicationType = "Movement";
        } else if (options?.id == 106) {
          op.to = "/approval/15";
          op.applicationTypeId = 15;
          op.applicationType = "Overtime";
        } else if (options?.id == 107) {
          op.to = "/approval/20";
          op.applicationTypeId = 20;
          op.applicationType = "Salary";
        } else if (options?.id == 108) {
          op.to = "/approval/9";
          op.applicationTypeId = 9;
          op.applicationType = "Loan";
        } else if (options?.id == 109) {
          op.to = "/approval/21";
          op.applicationTypeId = 21;
          op.applicationType = "Separation";
        } else if (options?.id == 141) {
          op.to = "/approval/32";
          op.applicationTypeId = 32;
          op.applicationType = "Asset Requisition";
        } else if (options?.id == 30308) {
          op.to = "/approval/31";
          op.applicationTypeId = 31;
          op.applicationType = "Pf Loan";
        } else if (options?.id == 30309) {
          op.to = "/approval/24";
          op.applicationTypeId = 24;
          op.applicationType = "Transfer & Promotion";
        } else if (options?.id == 30310) {
          op.to = "/approval/18";
          op.applicationTypeId = 18;
          op.applicationType = "Additiona & Deduction";
        } else if (options?.id == 30311) {
          op.to = "/approval/6";
          op.applicationTypeId = 6;
          op.applicationType = "IOU Application";
        } else if (options?.id == 30312) {
          op.to = "/approval/7";
          op.applicationTypeId = 7;
          op.applicationType = "IOU Adjustment";
        } else if (options?.id == 30313) {
          op.to = "/approval/4";
          op.applicationTypeId = 4;
          op.applicationType = "Increment";
        } else if (options?.id == 30320) {
          op.to = "/approval/3";
          op.applicationTypeId = 3;
          op.applicationType = "Expense";
        } else if (options?.id == 30323) {
          op.to = "/approval/19";
          op.applicationTypeId = 19;
          op.applicationType = "Salary Certificate ";
        } else if (options?.id == 30332) {
          op.to = "/approval/12";
          op.applicationTypeId = 12;
          op.applicationType = "Market Visit ";
        } else if (options?.id == 30363) {
          op.to = "/approval/13";
          op.applicationTypeId = 13;
          op.applicationType = "Master Location ";
        } else if (options?.id == 30506) {
          op.to = "/approval/5";
          op.applicationTypeId = 5;
          op.applicationType = "Increment Proposal ";
        }
        value &&
          history.push({
            pathname: `${op?.to}`,
            state: {
              state: {
                applicationTypeId: op?.applicationTypeId,
                applicationType: op?.applicationType,
              },
            },
          });
        setInputValue(null);
      }}
    />
  );
};

export default AutoCompleteWithHint;
