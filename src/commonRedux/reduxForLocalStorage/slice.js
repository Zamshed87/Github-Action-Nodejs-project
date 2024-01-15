import { createSlice } from "@reduxjs/toolkit";
import { monthFirstDate, monthLastDate } from "../../utility/dateFormatter";
import { todayDate } from "../../utility/todayDate";
import { englishLang } from "./langData/englishLang";

const initState = {
  language: { value: 1, label: "English" },
  langData: { ...englishLang },
  firstLevelName: "Overview",
  pyrGrossWiseBasic: [],
  compensationBenefits: {
    salaryGenerate: {
      fromDate: monthFirstDate(),
      toDate: monthLastDate(),
    },
    arrearSalaryGenerate: {
      fromDate: monthFirstDate(),
      toDate: monthLastDate(),
    },
    bonusGenerate: {
      fromDate: monthFirstDate(),
      toDate: monthLastDate(),
    },
    incrementLanding: {
      fromDate: monthFirstDate(),
      toDate: todayDate(),
    },
    salarySummaryLanding: {
      fromDate: monthFirstDate(),
      toDate: todayDate(),
    },
  },
  empManegmentData: {
    current: 1,
    pageSize: 100,
  },
};

export const localStorageSlice = createSlice({
  name: "localStorage",
  initialState: initState,
  reducers: {
    setLanguage: (state, action) => {
      const { payload } = action;
      state.language = payload;
    },
    setLangData: (state, action) => {
      const { payload } = action;
      state.langData = payload;
    },
    setFirstLevelName: (state, action) => {
      const { payload } = action;
      state.firstLevelName = payload;
    },
    setCompensationBenefits: (state, action) => {
      const { payload } = action;
      state.compensationBenefits = payload;
    },
    clearCompensationBenefits: (state) => {
      state.compensationBenefits = "";
    },
    setPyrGrossWiseBasic: (state, action) => {
      const { payload } = action;
      state.pyrGrossWiseBasic = payload;
    },
    setData: (state, action) => {
      // common data setter for init
      const { payload } = action;
      state[payload?.name] = {
        ...state[payload?.name],
        [payload?.key]: payload?.value,
      };
    },
  },
});
