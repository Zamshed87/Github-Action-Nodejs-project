export const uuid = () => {
  const randomNumber = Math.random().toString(36).substring(2, 9);

  const timestamp = new Date().getTime().toString(36);
  const uniqueId = randomNumber + timestamp;

  return uniqueId;
};

export const isAlreadyPresent = (obj, listData, uniqueKey) => {
  for (let i = 0; i < listData.length; i++) {
    if (listData[i][uniqueKey] === obj[uniqueKey]) {
      return i;
    }
  }
  return -1;
};

export const sortDataList = (
  arrayOfObject,
  key,
  type = "string",
  order = "asce"
) => {
  if (order === "asce") {
    if (type === "string") {
      arrayOfObject?.sort((a, b) => {
        if (a[key] > b[key]) return -1;
        return 1;
      });
    }

    if (type === "number") {
      arrayOfObject?.sort((a, b) => {
        if (a[key] > b[key]) return -1;
        return 1;
      });
    }

    if (type === "date") {
      arrayOfObject?.sort((a, b) => {
        if (new Date(a[key]) > new Date(b[key])) return -1;
        return 1;
      });
    }
  } else {
    if (type === "string") {
      arrayOfObject?.sort((a, b) => {
        if (b[key] > a[key]) return -1;
        return 1;
      });
    }

    if (type === "number") {
      arrayOfObject?.sort((a, b) => {
        if (b[key] > a[key]) return -1;
        return 1;
      });
    }

    if (type === "date") {
      arrayOfObject?.sort((a, b) => {
        if (new Date(b[key]) > new Date(a[key])) return -1;
        return 1;
      });
    }
  }
};

export const createPayloadStructure = ({
  initHeaderList,
  currentFilterSelection,
  checkedHeaderList,
  filterOrderList,
}) => {
  let modifiedPayload = { ...initHeaderList };
  if (
    currentFilterSelection === -1 ||
    (currentFilterSelection !== -1 &&
      checkedHeaderList[`${currentFilterSelection}List`]?.length > 0)
  ) {
    for (const key in initHeaderList) {
      modifiedPayload[`${key}`] = checkedHeaderList[`${key}`];
    }
  } else if (filterOrderList?.length > 0) {
    const index = filterOrderList?.findIndex(
      (item) => item === currentFilterSelection
    );

    if (index > 1) {
      let previousSelectedFilter = {};
      for (let i = 0; i < index - 1; i++) {
        previousSelectedFilter[`${filterOrderList[i]}List`] =
          checkedHeaderList[`${filterOrderList[i]}List`];
      }
      modifiedPayload = {
        ...modifiedPayload,
        ...previousSelectedFilter,
      };
    } else if (index === 0 || index === 1) {
      modifiedPayload = {
        ...modifiedPayload,
        [`${filterOrderList[0]}List`]:
          checkedHeaderList[`${filterOrderList[0]}List`],
      };
    }
  }

  return modifiedPayload;
};

export const setHeaderListDataDynamically = ({
  currentFilterSelection,
  checkedHeaderList,
  headerListKey,
  headerList,
  setHeaderList,
  response,
  filterOrderList,
  setFilterOrderList,
  initialHeaderListData,
  setInitialHeaderListData,
  setEmpLanding = null,
  setPages,
}) => {
  if (currentFilterSelection !== -1) {
    if (
      currentFilterSelection !== -1 &&
      checkedHeaderList[`${currentFilterSelection}List`]?.length > 0
    ) {
      const currentList = headerList[`${currentFilterSelection}List`];
      setHeaderList({
        ...response[headerListKey],
        [`${currentFilterSelection}List`]: currentList,
      });
    } else {
      const index = filterOrderList?.findIndex(
        (item) => item === currentFilterSelection
      );
      if (index === 0) {
        setHeaderList({
          ...initialHeaderListData,
        });
      } else if (index === 1) {
        setHeaderList({
          ...response[headerListKey],
          [`${filterOrderList[index - 1]}List`]:
            initialHeaderListData[`${filterOrderList[index - 1]}List`],
        });
      } else {
        setHeaderList(response[headerListKey]);
      }
    }
  } else if (currentFilterSelection === -1) {
    setInitialHeaderListData(response[headerListKey]);
    setHeaderList(response[headerListKey]);
  }

  if (
    currentFilterSelection !== -1 &&
    checkedHeaderList[`${currentFilterSelection}List`]?.length === 0
  ) {
    let updatedFilterOrderList = filterOrderList?.filter(
      (item) => item !== currentFilterSelection
    );
    setFilterOrderList(updatedFilterOrderList);
  }

  if (typeof setEmpLanding === "function") {
    const modifiedResponseData = response?.data?.map((data, index) => ({
      ...data,
      initialSerialNumber: index + 1,
      isSelected: false,
    }));
    setEmpLanding?.(modifiedResponseData);
  }

  setPages?.({
    current: response?.currentPage,
    pageSize: response?.pageSize,
    total: response?.totalCount,
  });
};
