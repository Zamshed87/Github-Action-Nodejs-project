/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getCafeteriaMenuListReport } from "../helper";

const MenuList = ({ objProps }) => {
  const { setLoading, isEdit, setIsEdit, menuList, setMenuList } = objProps;
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  useEffect(() => {
    getCafeteriaMenuListReport(employeeId, setMenuList, setLoading, "");
  }, [orgId, buId]);

  const rowDtoHandler = (index, name, value) => {
    const data = [...menuList];
    data[index][name] = value;
    setMenuList(data);
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="table-card-styled">
            <table className="table">
              <thead>
                <tr>
                  <th width="20%">Day</th>
                  <th>Menu List</th>
                </tr>
              </thead>
              <tbody>
                {menuList?.length > 0 &&
                  menuList?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item?.strDayName}</td>
                        <td>
                          {isEdit ? (
                            <input
                              style={{
                                width: "100%",
                                border: "1px solid #80808042",
                                borderRadius: "5px",
                                padding: "5px",
                              }}
                              onChange={(e) => {
                                rowDtoHandler(
                                  index,
                                  "strMenuList",
                                  e.target.value
                                );
                              }}
                              value={item?.strMenuList}
                            />
                          ) : (
                            <span>{item?.strMenuList}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuList;
