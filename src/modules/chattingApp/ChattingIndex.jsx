import ChattingLeftSideBar from "./ChattingLeftSideBar";
import Card from "@mui/material/Card";
import "./style.css";
import ChattingBorad from "./ChattingBorad";

const ChattingIndex = () => {
  // const [taypingList, setTypeingList] = useState([]);

  // const connection = useSelector(
  //   (state) => state?.chattingApp?.signalRConnection,
  //   shallowEqual
  // );

  // connection.on(`sendTo_`, (data) => {});

  return (
    <div className="container" style={{ marginTop: "50px" }}>
      <Card>
        <div className="row">
          <div className="col-4" style={{ paddingRight: 0 }}>
            <ChattingLeftSideBar />
          </div>
          <div className="col-8 chat_messenger_box" style={{ paddingLeft: 0 }}>
            <ChattingBorad />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChattingIndex;
