export const formatFilterValue = (
  value: number | string | (number | string)[] | null | undefined
): string | number => {
  console.log(value);
  if (value == null || value === undefined) {
    return 0;
  } else if (Array.isArray(value)) {
    return value.length > 0 ? value.join(",") : 0;
  } else if (
    (typeof value === "number" || typeof value === "string") &&
    value !== 0
  ) {
    return value;
  } else {
    return 0;
  }
};

export const typeDataSetForTitle = (
  data: any,
  setState: any,
  isAll?: boolean
) => {
  const list: any[] = [];
  data?.data?.map((d: any) => {
    if (d?.isActive === true) list.push({ label: d?.name, value: d?.id });
  });
  if (isAll) {
    list.unshift({ label: "All", value: 0 });
  }
  setState(list);
};

export const typeDataSetForTrainerOrg = (
  data: any,
  setState: any,
  isAll?: boolean
) => {
  const list: any[] = [];
  data?.data?.map((d: any) => {
    if (d?.isActive === true)
      list.push({
        label: `${d?.name} - ${d?.organization}`,
        value: d?.id,
        ...d,
      });
  });
  if (isAll) {
    list.unshift({ label: "All", value: 0 });
  }
  setState(list);
};
