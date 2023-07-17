import { banglaLang } from "./langData/banglaLang";
import { englishLang } from "./langData/englishLang";
import { localStorageSlice } from "./slice";
import * as requestFromServer from "./api";
const { actions: slice } = localStorageSlice;

// this redux is for store data to local storage by redux persist

export const setLanguageAction = (payload) => (dispatch) => {
  dispatch(slice.setLanguage(payload));
  let langData = payload?.label === "English" ? englishLang : banglaLang;
  dispatch(slice.setLangData(langData));
};

export const setFirstLevelNameAction = (payload) => (dispatch) => {
  dispatch(slice.setFirstLevelName(payload));
};

export const compensationBenefitsLSAction = (payload) => (dispatch) => {
  dispatch(slice.setCompensationBenefits(payload));
};

export const clearCompensationBenefitsLSAction = () => (dispatch) => {
  dispatch(slice.clearCompensationBenefits());
};

// setPyrGrossWiseBasic
export const getPyrGrossWiseBasicAction = (accId, buId) => (dispatch) => {
  requestFromServer.getPyrGrossWiseBasicLS(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.setPyrGrossWiseBasic(res.data));
    }
  });
};

export const administrationLSAction = (payload) => (dispatch) => {
  dispatch(slice.setAdministration(payload));
};

export const setDataAction = (name, key, value) => (dispatch) => {
  // common data setter for init
  dispatch(slice.setData({ name, key, value }));
};
