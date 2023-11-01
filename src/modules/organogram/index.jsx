/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { shallowEqual, useSelector } from "react-redux";
import NotPermittedPage from "../../common/notPermitted/NotPermittedPage";
import { getOrganogramAction } from "./helper";
import "./organogram.css";
import PersonCard from "./PersonCard";

const RecursiveComponent = ({
  employeeName,
  childList,
  designationName,
  positionName,
  email,
  employeeImageUrlId,
  sequence,
  parentId,
  autoId,
  getData,
  positionId,
  employeeId,
  employeeNameDetails,
}) => {
  return (
    <>
      <TreeNode
        label={
          positionName && parentId ? (
            <PersonCard
              employeeName={employeeName}
              employeeNameDetails={employeeNameDetails}
              designation={designationName}
              position={positionName}
              email={email}
              employeeImageUrl={employeeImageUrlId}
              childList={childList}
              parentId={parentId}
              autoId={autoId}
              getData={getData}
              employeeId={employeeId}
              positionId={positionId}
              sequence={sequence}
            />
          ) : null
        }
      >
        {childList?.length > 0
          ? childList.map((item, index) => (
              <RecursiveComponent key={index} getData={getData} {...item} />
            ))
          : null}
      </TreeNode>
    </>
  );
};

const Organogram = () => {
  const { buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [data, setData] = useState({});

  const getData = () => {
    getOrganogramAction(buId, setData);
  };

  useEffect(() => {
    getData();
  }, [buId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 56) {
      permission = item;
    }
  });

  return (
    <div className="organogram">
      <div className="p-2 mb-5">
        <div className="d-flex align-items-center">
          <div className="p-2 mb-1"></div>
          {/* <BackButton /> */}
        </div>
      </div>
      <div style={{ marginTop: "50px" }}>
        {permission?.isView ? (
          <Tree
            ineWidth={"2px"}
            lineColor={"green"}
            lineBorderRadius={"10px"}
            label={
              <PersonCard
                employeeName={data?.employeeName}
                designation={data?.designationName}
                childList={data?.childList}
                position={data?.positionName}
                email={data?.email}
                employeeImageUrl={data?.employeeImageUrlId}
                parentId={data?.parentId}
                autoId={data?.autoId}
                getData={getData}
                employeeId={data?.employeeId}
                positionId={data?.positionId}
                employeeNameDetails={data?.employeeNameDetails}
                sequence={data?.sequence}
              />
            }
          >
            <RecursiveComponent getData={getData} {...data} />
          </Tree>
        ) : (
          <NotPermittedPage />
        )}
      </div>
    </div>
  );
};

export default Organogram;
