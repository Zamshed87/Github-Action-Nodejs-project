/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getCafeteriaMenuListReport } from "../helper";



const MenuList = ({setLoading}) => {
  const { orgId, buId, employeeId } = useSelector((state) => state?.auth?.profileData, shallowEqual);
  const [menuList, setMenuList] = useState([]);
  useEffect(() => {
    getCafeteriaMenuListReport(employeeId, setMenuList, setLoading, "");
  }, [orgId, buId])
  return (
    <>
      <div className="card-style mt-3">
        <div className="card-body p-0">
          <div className="table-card-styled">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th width="20%">Day</th>
                  <th>Menu List</th>
                </tr>
              </thead>
              <tbody>
                { menuList?.length > 0 &&
                  menuList?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item?.strDayName}</td>
                        <td>{item?.strMenuList}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuList;
