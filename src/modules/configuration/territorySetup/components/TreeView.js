import { Tree } from "antd";
import React, { useEffect, useState } from "react";
import FormikToggle from "../../../../common/FormikToggle";
import TerritorySetupForm from "./TerritorySetupForm";
import PrimaryButton from "../../../../common/PrimaryButton";
import { AddOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";

const TreeView = ({
  index,
  tabIndex,
  territoryType,
  permission,
  getTableViewLanding,
}) => {
  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [visible, setVisible] = useState(false);
  const [showLine] = useState(true);
  const [showIcon] = useState(false);
  const [showLeafIcon] = useState(true);
  const [isExpandAll, setIsExpandAll] = useState(false);
  const [expandKeys, setExpandKeys] = useState([]);
  const [currentData, setCurrentData] = useState({});
  const [rowDto, setRowDto] = useState([]);

  const [, getTerritorySetup, , setTerritorySetup] = useAxiosGet([]);

  const getData = () => {
    getTerritorySetup(
      `/SaasMasterData/GetTerritorySetup?AccountId=${orgId}&BusinessUnitId=${buId}`,
      (data) => {
        setRowDto(data);
        var result = treeData(data);
        setTerritorySetup(result);
      }
    );
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  const treeData = (items, territoryId = 0, link = "parentTerritoryId") =>
    items
      .filter((item) => item[link] === territoryId)
      .map((item) => ({
        title: item?.territoryName,
        key: item?.territoryId,
        ...item,
        children: treeData(items, item.territoryId),
      }));

  const onSelect = (_, info) => {
    setCurrentData({
      parentTerritoryId: info?.node?.key,
      salesOrganizationId: info?.node?.salesOrganizationId,
      salesOrganizationName: info?.node?.salesOrganizationName,
      territoryTypeId: info?.node?.territoryTypeId,
    });
    setVisible(true);
  };

  const expandHandler = (status) => {
    if (status) {
      setExpandKeys(rowDto?.map((item) => item?.territoryId));
    } else {
      setExpandKeys([]);
    }
  };

  const onExpand = (expandedKeysValue) => {
    setExpandKeys(expandedKeysValue);
  };

  return (
    index === tabIndex && (
      <div className="mt-1 territory-setup">
        <h5>
          Expand All: &nbsp; &nbsp;
          <FormikToggle
            checked={isExpandAll}
            onChange={() => {
              expandHandler(!isExpandAll);
              setIsExpandAll(!isExpandAll);
            }}
          />
        </h5>
        <div className="card-style py-3">
          <PrimaryButton
            type="button"
            className="btn btn-default flex-center mb-2"
            label={"Add New"}
            icon={
              <AddOutlined
                sx={{
                  marginRight: "0px",
                  fontSize: "15px",
                }}
              />
            }
            onClick={(e) => {
              if (!permission?.isCreate)
                return toast.warn("You don't have permission");
              e.stopPropagation();
              setVisible(true);
            }}
          />
          <Tree
            showLine={
              showLine
                ? {
                    showLeafIcon,
                  }
                : false
            }
            showIcon={showIcon}
            onSelect={onSelect}
            onExpand={onExpand}
            treeData={treeData(rowDto)}
            expandedKeys={expandKeys}
            treeNodeFilterProp="Region Territory [Unassign]"
          />
        </div>

        <TerritorySetupForm
          show={visible}
          title="Territory Setup"
          setOpenModal={setVisible}
          size="lg"
          backdrop="static"
          classes="default-modal approval-pipeline-modal"
          territoryType={territoryType}
          currentData={currentData}
          setCurrentData={setCurrentData}
          getData={getData}
          getTableViewLanding={getTableViewLanding}
        />
      </div>
    )
  );
};

export default TreeView;
