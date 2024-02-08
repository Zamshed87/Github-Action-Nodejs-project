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
      const departments = res.map((item: any) => ({
        label: item?.DepartmentName,
        value: item?.DepartmentId,
      }));

      // Add the "All" value
      departments.unshift({ value: 0, label: "All" });

      // Assuming you need to set the modified result back to the response
      res.splice(0, res.length, ...departments);
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
      const designations = res.map((item: any) => ({
        label: item?.DesignationName,
        value: item?.DesignationId,
      }));

      // Add the "All" value
      designations.unshift({ value: 0, label: "All" });

      // Assuming you need to set the modified result back to the response
      res.splice(0, res.length, ...designations);
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
  getWorkplace,
  getEmployeDepartment,
  getEmployeDesignation,
  getEmploymentType,
};
