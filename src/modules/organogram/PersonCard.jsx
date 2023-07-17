import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { APIUrl } from "../../App";
import profile from "../../assets/images/profile.png";
import Loading from "../../common/loading/Loading";
import ActionMenuCom from "./components/ActionMenuCom";
import PopoverCom from "./components/PopoverCom";
import { organogramSaveUpdate } from "./helper";
import AddChild from "./popoverComponents/AddChild";
import EditCom from "./popoverComponents/EditCom";
import OrderBy from "./popoverComponents/OrderBy";

const PersonCard = ({
  employeeName,
  designation,
  position,
  email,
  employeeImageUrl,
  parentId,
  autoId,
  childList,
  getData,
  positionId,
  employeeId,
  employeeNameDetails,
  sequence,
}) => {
  // popover

  const { buId, userId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElForAction, setAnchorElForAction] = useState(null);
  const [editData, setEditData] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const customStyleObj = {
    root: {
      minWidth: "650px",
    },
  };
  const [component, setComponet] = useState("");

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 56) {
      permission = item;
    }
  });

  return (
    <>
      <div>
        {loading && <Loading />}
        <button className="btn">
          <div className="d-flex align-items-center">
            <img
              src={
                employeeImageUrl
                  ? `${APIUrl}/Document/DownloadFile?id=${employeeImageUrl}`
                  : profile
              }
              alt="person"
              className="mr-2"
            />
            <div className="text-left">
              <div className="d-flex">
                <div className="">
                  {employeeName && <b className="mr-2">{employeeName}</b>}
                  <div className="threedot">
                    <ActionMenuCom
                      setAnchorEl={setAnchorElForAction}
                      anchorEl={anchorElForAction}
                      options={[
                        {
                          value: 1,
                          label: autoId ? "Add Child" : "Create Root",
                          onClick: (event) => {
                            if (!permission?.isCreate)
                              return toast.warn("You don't have permission");
                            setAnchorEl(event.currentTarget);
                            setComponet("AddChildCom");
                          },
                        },
                        {
                          value: 2,
                          label: "Edit",
                          onClick: (event) => {
                            if (!permission?.isEdit)
                              return toast.warn("You don't have permission");
                            if (!autoId) return toast.warn("Data is empty");
                            setEditData({
                              position: { value: positionId, label: position },
                              employee: employeeId
                                ? {
                                    value: employeeId,
                                    label: employeeNameDetails,
                                    EmployeeOnlyName: employeeName,
                                  }
                                : "",
                            });
                            setAnchorEl(event.currentTarget);
                            setComponet("EditCom");
                          },
                        },
                        {
                          value: 3,
                          label: "Order Child",
                          onClick: (event) => {
                            if (!permission?.isEdit)
                              return toast.warn("You don't have permission");
                            if (childList < 1)
                              return toast.warn("No child found");
                            setAnchorEl(event.currentTarget);
                            setComponet("OrderByCom");
                          },
                        },
                        {
                          value: 4,
                          label: "Remove",
                          onClick: () => {
                            if (!permission?.isClose)
                              return toast.warn("You don't have permission");
                            if (!autoId) return toast.warn("Data is empty");
                            organogramSaveUpdate({
                              position: { value: positionId, label: position },
                              employee: {
                                value: employeeId,
                                EmployeeOnlyName: employeeName,
                              },
                              autoId: autoId,
                              parentId: parentId,
                              childList,
                              userId,
                              isActive: false,
                              buId,
                              setLoading,
                              cb: () => {
                                setAnchorEl(null);
                                setAnchorElForAction(null);
                                getData();
                              },
                            });
                          },
                        },
                      ]}
                      color="gray"
                      menuStyle={{
                        "& .MuiMenuItem-root": {
                          fontSize: "12px",
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="mr-2">
                <span>{designation}</span>
              </div>
              <div className="mr-2">
                <span>{position}</span>
              </div>
              {/* <div>
                <span>{email}</span>
              </div> */}
            </div>
          </div>
        </button>
      </div>
      <PopoverCom
        propsObj={{
          id,
          open,
          anchorEl,
          setAnchorEl,
          customStyleObj,
        }}
      >
        {component === "AddChildCom" && (
          <AddChild
            parentId={parentId}
            autoId={autoId}
            setAnchorEl={setAnchorEl}
            childList={childList}
            getData={getData}
            setAnchorElForAction={setAnchorElForAction}
          />
        )}
        {component === "EditCom" && (
          <EditCom
            setAnchorElForAction={setAnchorElForAction}
            setAnchorEl={setAnchorEl}
            editData={editData}
            parentId={parentId}
            childList={childList}
            getData={getData}
            autoId={autoId}
            sequence={sequence}
          />
        )}
        {component === "OrderByCom" && (
          <OrderBy
            setAnchorElForAction={setAnchorElForAction}
            setAnchorEl={setAnchorEl}
            getData={getData}
            childList={childList}
          />
        )}
      </PopoverCom>
    </>
  );
};

export default PersonCard;
