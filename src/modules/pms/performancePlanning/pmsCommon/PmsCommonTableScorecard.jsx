import React from "react";
import PmsCommonTable from "./PmsCommonTable";
import IView from "./IView";

const PmsCommonTableScorecard = ({ report, actionHandler }) => {
  let arr = [
    { name: "BSC" },
    { name: "Objective" },
    { name: "KPI" },
    { name: "SRF" },
    { name: "Weight" },
    { name: "Target" },
    { name: "Achievement" },
    { name: "Progress" },
  ];

  if (actionHandler) {
    arr.push({ name: "Action", style: { width: "50px" } });
  }

  return (
    <PmsCommonTable ths={arr}>
      {report?.infoList?.map((itm, indx) => (
        <>
          {itm.dynamicList.map((item, index) => (
            <tr>
              {index === 0 && (
                <td
                  className={`bsc bsc${indx}`}
                  rowspan={itm.dynamicList.length}
                >
                  <div>{itm?.bsc}</div>
                </td>
              )}
              {item?.isParent && (
                <td className="obj" rowspan={item?.numberOfChild}>
                  {" "}
                  {item?.parentName}{" "}
                </td>
              )}
              <td> {item?.label} </td>
              <td> {item?.strFrequency} </td>
              <td> {item?.numWeight} </td>
              <td> {item?.numTarget} </td>
              <td> {item?.numAchivement} </td>
              <td>
                {indx !== report?.infoList.length - 1 && (
                  <div className="text-right">
                    {item?.progress}%{" "}
                    <i
                      className={`ml-2 fas fa-arrow-alt-${item?.arrowText}`}
                    ></i>
                  </div>
                )}
              </td>
              {actionHandler && (
                <td className="text-center">
                  {indx !== report?.infoList.length - 1 && (
                    <div
                      className="text-primary pointer text-center"
                      onClick={() => {
                        actionHandler(item);
                      }}
                    >
                      <IView />
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </>
      ))}
    </PmsCommonTable>
  );
};

export default PmsCommonTableScorecard;
