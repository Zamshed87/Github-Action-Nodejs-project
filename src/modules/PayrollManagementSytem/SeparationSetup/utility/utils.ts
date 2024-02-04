type TGetWorkPlace = {
  workplaceDDLApi: any;
  buId: number;
  wgId: number;
  employeeId: number;
};

const getWorkplace = ({
  workplaceDDLApi,
  buId,
  wgId,
  employeeId,
}: TGetWorkPlace) => {
  workplaceDDLApi?.action({
    urlKey: "PeopleDeskAllDDL",
    method: "GET",
    params: {
      DDLType: "Workplace",
      BusinessUnitId: buId,
      WorkplaceGroupId: wgId,
      intId: employeeId,
    },
    onSuccess: (res: any) => {
      res.forEach((item: any, i: any) => {
        res[i].label = item?.strWorkplace;
        res[i].value = item?.intWorkplaceId;
      });
    },
  });
};

type TGetEmployeePosition = {
  form: any;
  positionDDLApi: any;
  buId: number;
  wgId: number;
};

const getEmployeePosition = ({
  form,
  positionDDLApi,
  buId,
  wgId,
}: TGetEmployeePosition) => {
  const { workplace } = form.getFieldsValue(true);

  positionDDLApi?.action({
    urlKey: "PeopleDeskAllDDL",
    method: "GET",
    params: {
      DDLType: "Position",
      BusinessUnitId: buId,
      WorkplaceGroupId: wgId,
      IntWorkplaceId: workplace?.value,
      intId: 0,
    },
    onSuccess: (res: any) => {
      res.forEach((item: any, i: any) => {
        res[i].label = item?.PositionName;
        res[i].value = item?.PositionId;
      });
    },
  });
};

type TGetEmployeDepartment = {
  form: any;
  empDepartmentDDLApi: any;
  buId: number;
  wgId: number;
};

// workplace wise
const getEmployeDepartment = ({
  form,
  empDepartmentDDLApi,
  buId,
  wgId,
}: TGetEmployeDepartment) => {
  const { workplace } = form.getFieldsValue(true);

  empDepartmentDDLApi?.action({
    urlKey: "PeopleDeskAllDDL",
    method: "GET",
    params: {
      DDLType: "EmpDepartment",
      BusinessUnitId: buId,
      WorkplaceGroupId: wgId,
      IntWorkplaceId: workplace?.value,
      intId: 0,
    },
    onSuccess: (res: any) => {
      res.forEach((item: any, i: any) => {
        res[i].label = item?.DepartmentName;
        res[i].value = item?.DepartmentId;
      });
    },
  });
};

type TGetEmployeDesignation = {
  form: any;
  empDesignationDDLApi: any;
  intAccountId: number;
  buId: number;
  wgId: number;
};

const getEmployeDesignation = ({
  form,
  empDesignationDDLApi,
  intAccountId,
  buId,
  wgId,
}: TGetEmployeDesignation) => {
  const { workplace } = form.getFieldsValue(true);

  empDesignationDDLApi?.action({
    urlKey: "PeopleDeskAllDDL",
    method: "GET",
    params: {
      DDLType: "EmpDesignation",
      AccountId: intAccountId,
      BusinessUnitId: buId,
      WorkplaceGroupId: wgId,
      IntWorkplaceId: workplace?.value,
      intId: 0,
    },
    onSuccess: (res: any) => {
      res.forEach((item: any, i: any) => {
        res[i].label = item?.DesignationName;
        res[i].value = item?.DesignationId;
      });
    },
  });
};

type TGetEmploymentType = {
  form: any;
  employmentTypeDDLApi: any;
  buId: number;
  wgId: number;
};

const getEmploymentType = ({
  form,
  employmentTypeDDLApi,
  buId,
  wgId,
}: TGetEmploymentType) => {
  const { workplace } = form.getFieldsValue(true);
  employmentTypeDDLApi?.action({
    urlKey: "PeopleDeskAllDDL",
    method: "GET",
    params: {
      DDLType: "EmploymentType",
      BusinessUnitId: buId,
      WorkplaceGroupId: wgId,
      IntWorkplaceId: workplace?.value,
      intId: 0,
    },
    onSuccess: (res: any) => {
      res.forEach((item: any, i: any) => {
        res[i].label = item?.EmploymentType;
        res[i].value = item?.Id;
      });
    },
  });
};


export {
  getEmployeePosition,
  getWorkplace,
  getEmployeDepartment,
  getEmployeDesignation,
  getEmploymentType,
};
