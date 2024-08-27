import { InfoCircleOutlined } from "@ant-design/icons";
import { Flex } from "Components";

const PInfo = ({ children }: any) => {
  return (
    <Flex className="policyInfo">
      <div>
        <InfoCircleOutlined className="policyInfo_icon" />
      </div>
      <div className="ml-2" style={{ marginTop: "2px" }}>
        {children}
      </div>
    </Flex>
  );
};

export default PInfo;
