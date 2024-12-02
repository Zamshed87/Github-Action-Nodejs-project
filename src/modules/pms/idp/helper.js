import { DeleteOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { dateFormatter } from "../../../utility/dateFormatter";

export const idpCol = (scrollRef, rowDto, setRowDto) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => <div>{index + 1}</div>,
      className: "text-center",
    },
    {
      title: "Type",
      dataIndex: "strType",
      render: (data) => <div>{data}</div>,
    },
    {
      title: "Type Refference",
      dataIndex: "strTypeReferenceName",
      render: (data) => <div>{data}</div>,
    },
    {
      title: "Category",
      dataIndex: "strCategoryName",
      render: (data) => <div>{data}</div>,
    },
    {
      title: "Activity Name",
      dataIndex: "taskName",
      render: (data) => <div>{data}</div>,
    },
    {
      title: "START DATE",
      dataIndex: "dteStrat",
      render: (data) => <div>{dateFormatter(data)}</div>,
    },
    {
      title: "END DATE",
      dataIndex: "dteEnd",
      render: (data) => <div>{dateFormatter(data)}</div>,
    },
    {
      title: "Comments",
      dataIndex: "strComment",
      render: (data) => <div>{data}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (data) => <div>{data}</div>,
    },
    {
      title: "",
      dataIndex: "",
      render: (data, record, index) => (
        <>
          <div className="d-flex align-items-center">
            <Tooltip title="Delete" arrow>
              <button
                type="button"
                className="iconButton mt-0 mt-md-2 mt-lg-0"
                onClick={() => {
                  let updatedData = rowDto?.row?.filter(
                    (item, i) => index !== i
                  );
                  setRowDto({
                    ...rowDto,
                    row: updatedData,
                  });
                }}
              >
                <DeleteOutlined />
              </button>
            </Tooltip>
          </div>
        </>
      ),
    },
  ];
};




export const statusData = [
   {
       "label": "1",
       "value": 1
   },
   {
       "label": "2",
       "value": 2
   },
   {
       "label": "3",
       "value": 3
   },
   {
       "label": "4",
       "value": 4
   },
   {
       "label": "5",
       "value": 5
   },
   {
       "label": "6",
       "value": 6
   },
   {
       "label": "7",
       "value": 7
   },
   {
       "label": "8",
       "value": 8
   },
   {
       "label": "9",
       "value": 9
   },
   {
       "label": "10",
       "value": 10
   },
   {
       "label": "11",
       "value": 11
   },
   {
       "label": "12",
       "value": 12
   },
   {
       "label": "13",
       "value": 13
   },
   {
       "label": "14",
       "value": 14
   },
   {
       "label": "15",
       "value": 15
   },
   {
       "label": "16",
       "value": 16
   },
   {
       "label": "17",
       "value": 17
   },
   {
       "label": "18",
       "value": 18
   },
   {
       "label": "19",
       "value": 19
   },
   {
       "label": "20",
       "value": 20
   },
   {
       "label": "21",
       "value": 21
   },
   {
       "label": "22",
       "value": 22
   },
   {
       "label": "23",
       "value": 23
   },
   {
       "label": "24",
       "value": 24
   },
   {
       "label": "25",
       "value": 25
   },
   {
       "label": "26",
       "value": 26
   },
   {
       "label": "27",
       "value": 27
   },
   {
       "label": "28",
       "value": 28
   },
   {
       "label": "29",
       "value": 29
   },
   {
       "label": "30",
       "value": 30
   },
   {
       "label": "31",
       "value": 31
   },
   {
       "label": "32",
       "value": 32
   },
   {
       "label": "33",
       "value": 33
   },
   {
       "label": "34",
       "value": 34
   },
   {
       "label": "35",
       "value": 35
   },
   {
       "label": "36",
       "value": 36
   },
   {
       "label": "37",
       "value": 37
   },
   {
       "label": "38",
       "value": 38
   },
   {
       "label": "39",
       "value": 39
   },
   {
       "label": "40",
       "value": 40
   },
   {
       "label": "41",
       "value": 41
   },
   {
       "label": "42",
       "value": 42
   },
   {
       "label": "43",
       "value": 43
   },
   {
       "label": "44",
       "value": 44
   },
   {
       "label": "45",
       "value": 45
   },
   {
       "label": "46",
       "value": 46
   },
   {
       "label": "47",
       "value": 47
   },
   {
       "label": "48",
       "value": 48
   },
   {
       "label": "49",
       "value": 49
   },
   {
       "label": "50",
       "value": 50
   },
   {
       "label": "51",
       "value": 51
   },
   {
       "label": "52",
       "value": 52
   },
   {
       "label": "53",
       "value": 53
   },
   {
       "label": "54",
       "value": 54
   },
   {
       "label": "55",
       "value": 55
   },
   {
       "label": "56",
       "value": 56
   },
   {
       "label": "57",
       "value": 57
   },
   {
       "label": "58",
       "value": 58
   },
   {
       "label": "59",
       "value": 59
   },
   {
       "label": "60",
       "value": 60
   },
   {
       "label": "61",
       "value": 61
   },
   {
       "label": "62",
       "value": 62
   },
   {
       "label": "63",
       "value": 63
   },
   {
       "label": "64",
       "value": 64
   },
   {
       "label": "65",
       "value": 65
   },
   {
       "label": "66",
       "value": 66
   },
   {
       "label": "67",
       "value": 67
   },
   {
       "label": "68",
       "value": 68
   },
   {
       "label": "69",
       "value": 69
   },
   {
       "label": "70",
       "value": 70
   },
   {
       "label": "71",
       "value": 71
   },
   {
       "label": "72",
       "value": 72
   },
   {
       "label": "73",
       "value": 73
   },
   {
       "label": "74",
       "value": 74
   },
   {
       "label": "75",
       "value": 75
   },
   {
       "label": "76",
       "value": 76
   },
   {
       "label": "77",
       "value": 77
   },
   {
       "label": "78",
       "value": 78
   },
   {
       "label": "79",
       "value": 79
   },
   {
       "label": "80",
       "value": 80
   },
   {
       "label": "81",
       "value": 81
   },
   {
       "label": "82",
       "value": 82
   },
   {
       "label": "83",
       "value": 83
   },
   {
       "label": "84",
       "value": 84
   },
   {
       "label": "85",
       "value": 85
   },
   {
       "label": "86",
       "value": 86
   },
   {
       "label": "87",
       "value": 87
   },
   {
       "label": "88",
       "value": 88
   },
   {
       "label": "89",
       "value": 89
   },
   {
       "label": "90",
       "value": 90
   },
   {
       "label": "91",
       "value": 91
   },
   {
       "label": "92",
       "value": 92
   },
   {
       "label": "93",
       "value": 93
   },
   {
       "label": "94",
       "value": 94
   },
   {
       "label": "95",
       "value": 95
   },
   {
       "label": "96",
       "value": 96
   },
   {
       "label": "97",
       "value": 97
   },
   {
       "label": "98",
       "value": 98
   },
   {
       "label": "99",
       "value": 99
   },
   {
       "label": "100",
       "value": 100
   }
]