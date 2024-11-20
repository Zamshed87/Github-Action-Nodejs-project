import { QuestionCircleOutlined } from "@ant-design/icons";
import SingleInfo from "common/SingleInfo";
import { Flex, PButton, PInput, PRadio, PSelect } from "Components";
import { useApiRequest } from "Hooks";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import { shallowEqual, useSelector } from "react-redux";
import { assignToEmployee } from "./helper";
import Loading from "common/loading/Loading";

const QuestionaireView = ({ singleData }: any) => {
  const { type, title, description, questions } = singleData;

  const { profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const { buId, wgId } = profileData;

  const getValueLabel = (dataArr: any) => {
    return dataArr?.map((item: any) => ({
      value: item.optionName,
      label: item.optionName,
    }));
  };

  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const CommonEmployeeDDL = useApiRequest([]);
  const getEmployee = (value: any) => {
    if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.employeeNameWithCode;
          res[i].value = item?.employeeId;
        });
      },
    }).then();
  };
  return (
    <div>
      {loading && <Loading />}
      <Flex justify="space-between">
        <div>
          <SingleInfo label={"Questionaire Type"} value={type || "N/A"} />
          <SingleInfo label={"Questionaire Title"} value={title || "N/A"} />
          <SingleInfo
            label={"Questionaire Description"}
            value={description || "N/A"}
          />
        </div>
        <div>
          <PSelect
            style={{ width: "250px" }}
            name="employee"
            label="Assign to"
            placeholder="Search Min 2 char"
            options={CommonEmployeeDDL?.data || []}
            loading={CommonEmployeeDDL?.loading}
            onChange={(value, op: any) => {
              setEmployee(op);
            }}
            onSearch={(value) => {
              getEmployee(value);
            }}
            showSearch
            filterOption={false}
            allowClear={true}
          />
          <PButton
            disabled={!employee}
            style={{ marginLeft: "auto", marginTop: "4px" }}
            type="primary"
            content="Assign"
            onClick={() => {
              assignToEmployee(
                singleData?.id,
                employee?.value,
                setEmployee,
                setLoading
              );
            }}
          />
        </div>
      </Flex>
      <div style={{ marginTop: "10px" }}>
        <h2>
          <QuestionCircleOutlined style={{ fontSize: "16px" }} /> Application
          Questions
        </h2>
        {questions?.map((data: any, index: number) => (
          <div className="mt-2" key={index}>
            <h1>
              {index + 1}. {data?.title}
            </h1>
            {data?.typeId === 0 && (
              <PRadio type="group" options={getValueLabel(data?.options)} />
            )}
            {data?.typeId === 1 &&
              getValueLabel(data?.options)?.map((checkDto: any) => (
                <PInput
                  key={checkDto?.label}
                  type="checkbox"
                  layout="horizontal"
                  label={checkDto?.label}
                />
              ))}
            {data?.typeId === 2 && (
              <PSelect
                style={{ maxWidth: "250px" }}
                options={getValueLabel(data?.options) || []}
                placeholder="Select"
              />
            )}
            {data?.typeId === 3 && (
              <div style={{ maxWidth: "250px" }}>
                <PInput type="text" placeholder="Text" />
              </div>
            )}
            {data?.typeId === 4 && (
              <ReactQuill preserveWhitespace={true} placeholder="Write..." />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionaireView;
