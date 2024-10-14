import { DeleteOutlineOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import {
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
  TableButton,
} from "Components";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const PricingSetupForm = () => {
  const {
    permissionList,
    profileData: { buId, wgId, employeeId, orgId, wId },
  } = useSelector((state: any) => state?.auth, shallowEqual);
  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30417),
    []
  );

  // Form Instance
  const [form] = Form.useForm();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id }: any = useParams();
  const location = useLocation();
  const history = useHistory();

  //   api states
  const workplaceGroup = useApiRequest([]);
  const Cafeteria = useApiRequest([]);
  const workplace = useApiRequest([]);
  const designation = useApiRequest([]);
  const cafeApi = useApiRequest([]);
  const cafeEditApi = useApiRequest([]);
  const [rowDto, setRowDto] = useState<any>([]);

  // workplace wise
  const getWorkplaceGroup = () => {
    workplaceGroup?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "WorkplaceGroup",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId, // This should be removed
        intId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
  };
  const getById = () => {
    Cafeteria?.action({
      urlKey: "Cafeteria",
      method: "GET",
      params: {
        headerId: +id || 0,
      },
      onSuccess: (res) => {
        if (+id) {
          form.setFieldsValue({
            date: moment(res.dteCreatedAt), // You can format this if needed
            workplaceGroup: {
              label: res.workPlaceGroupName, // Assuming you want the ID for label
              value: res.workPlaceGroupId,
            },
            workplace: {
              label: res.workPlaceName, // Same for workplace
              value: res.workPlaceId,
            },
            pricingMatrixType: {
              label: res.pricingMatrixTypeName,
              value: res.pricingMatrixTypeId,
            },
            mealType: {
              label: res.mealTypeName,
              value: res.mealTypeId,
            },
          });
          const updatedData = res?.rows?.map((row: any) => ({
            minAmount: row?.minAmount,
            maxAmount: row?.maxAmount,
            ownContribution: row?.monOwnContribution,
            companyContribution: row?.monCompanyContribution,
            TotalCost: row?.monTotalCost,
            designation: {
              label: row?.strDesignationName,
              value: row?.intDesignationId,
            },
          }));

          setRowDto(updatedData);
          getDesignation();
        }
      },
    });
  };
  const getDesignation = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);
    designation?.action({
      urlKey: "ExtendedDesignationDDL",
      method: "GET",
      params: {
        AccountId: orgId,
        WorkplaceGroupId: workplaceGroup?.value || wgId,
        IntWorkplaceId: workplace?.value || wId,
        BusinessUnitId: buId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.designationName;
          res[i].value = item?.designationId;
        });
      },
    });
  };
  const getWorkplace = () => {
    const { workplaceGroup } = form.getFieldsValue(true);
    workplace?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
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
  useEffect(() => {
    getWorkplaceGroup();
    if (+id) {
      getById();
    }
  }, [id]);

  // Table Header
  const handleIsPerDayChange = (
    value: number,
    rowIndex: number,
    property: string
  ) => {
    setRowDto((prevRows: any) => {
      const updatedRows = [...prevRows];
      updatedRows[rowIndex][property] = value;

      return updatedRows;
    });
  };
  const handleDeleteRow = (index: number) => {
    setRowDto((prevRowDto: any) =>
      prevRowDto.filter((_: any, i: any) => i !== index)
    );
  };

  const headerForDesignation: any = [
    {
      title: "SL",
      render: (value: any, row: any, index: number) => index + 1,
      align: "center",
      width: 20,
    },
    {
      title: "Workplace Group",
      render: (value: any, row: any) => row?.workplaceGroup?.label,
    },
    {
      title: "Workplace",
      render: (value: any, row: any) => row?.workplace?.label,
    },
    {
      title: "Designation",
      render: (value: any, row: any) => row?.designation?.label,
    },

    {
      title: "Own Contribution/Meal",
      render: (value: any, row: any, index: number) =>
        +id ? (
          <>
            <PInput
              type="number"
              // name={`OM_${index}`}
              value={row?.ownContribution}
              placeholder="Amount"
              onPressEnter={(e: any) => {
                e.preventDefault();
              }}
              // disabled={true}
              onChange={(e: any) => {
                handleIsPerDayChange(e, index, "ownContribution");
                handleIsPerDayChange(
                  parseInt(
                    `${
                      row?.companyContribution
                        ? e + +row?.companyContribution
                        : e
                    }`
                  ),
                  index,
                  "TotalCost"
                );
              }}
            />
          </>
        ) : (
          <>
            <PInput
              type="number"
              name={`OM_${index}`}
              // value={row?.ownContribution}
              placeholder="Amount"
              onPressEnter={(e: any) => {
                e.preventDefault();
              }}
              rules={[
                // { required: true, message: "Amount Is Required" },
                {
                  validator: (_, value, callback) => {
                    const ownMeal = parseFloat(value);

                    if (isNaN(ownMeal)) {
                      callback("Amount Is Required");
                    } else if (ownMeal < 0) {
                      callback("Cant be Negative");
                    } else {
                      callback();
                    }
                  },
                },
              ]}
              // disabled={true}
              onChange={(e: any) => {
                handleIsPerDayChange(e, index, "ownContribution");
                handleIsPerDayChange(
                  parseInt(
                    `${
                      row?.companyContribution
                        ? e + +row?.companyContribution
                        : e
                    }`
                  ),
                  index,
                  "TotalCost"
                );
              }}
            />
          </>
        ),
    },

    {
      title: "Company Contribution/Meal",
      render: (value: any, row: any, index: number) =>
        +id ? (
          <>
            <PInput
              type="number"
              // name={`CCC_${index}`}
              value={row?.companyContribution}
              placeholder="Amount"
              // disabled={true}
              onPressEnter={(e: any) => {
                e.preventDefault();
              }}
              onChange={(e: any) => {
                handleIsPerDayChange(e, index, "companyContribution");

                handleIsPerDayChange(
                  row?.ownContribution + e,
                  index,
                  "TotalCost"
                );
              }}
            />
          </>
        ) : (
          <>
            <PInput
              type="number"
              name={`CCC_${index}`}
              placeholder="Amount"
              rules={[
                // { required: true, message: "Amount Is Required" },
                {
                  validator: (_, value, callback) => {
                    const companyContribution = parseFloat(value);

                    if (isNaN(companyContribution)) {
                      callback("Amount Is Required");
                    } else if (companyContribution < 0) {
                      callback("Cant be Negative");
                    } else {
                      callback();
                    }
                  },
                },
              ]}
              onPressEnter={(e: any) => {
                e.preventDefault();
              }}
              // disabled={true}
              onChange={(e: any) => {
                handleIsPerDayChange(e, index, "companyContribution");

                handleIsPerDayChange(
                  row?.ownContribution + e,
                  index,
                  "TotalCost"
                );
              }}
            />
          </>
        ),
    },
    {
      title: "Total Cost/Meal ",
      render: (value: any, row: any) => row?.TotalCost,
    },
    {
      title: "Action",
      render: (value: any, row: any, index: number) => (
        <div className="d-flex justify-content-center">
          <Tooltip title="Delete" arrow>
            <button type="button" className="iconButton">
              <DeleteOutlineOutlined onClick={() => handleDeleteRow(index)} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];
  const headerForSalary: any = [
    {
      title: "SL",
      render: (value: any, row: any, index: number) => index + 1,
      align: "center",
      width: 20,
    },
    {
      title: "Workplace Group",
      render: (value: any, row: any) => row?.workplaceGroup?.label,
    },
    {
      title: "Workplace",
      render: (value: any, row: any) => row?.workplace?.label,
    },
    {
      title: "Salary Range Min",
      render: (dto: any, row: any, index: number) =>
        +id ? (
          <>
            <PInput
              type="number"
              // name={`min_${index}`}
              value={row?.minAmount}
              placeholder="Amount"
              onPressEnter={(e: any) => {
                e.preventDefault();
              }}
              onChange={(e: any) => {
                handleIsPerDayChange(e, index, "minAmount");
              }}
            />
          </>
        ) : (
          <>
            <PInput
              type="number"
              name={`min_${index}`}
              placeholder="Amount"
              onPressEnter={(e: any) => {
                e.preventDefault();
              }}
              rules={[
                // { required: true, message: "Amount Is Required" },
                {
                  validator: (_, value, callback) => {
                    const range = parseFloat(value);
                    if (isNaN(range)) {
                      callback("Amount Is Required");
                    } else if (range < 0) {
                      callback("Cant be Negative");
                    } else if (
                      index > 0 &&
                      rowDto[index]?.minAmount <= rowDto[index - 1]?.maxAmount
                    ) {
                      callback(
                        "min amount must be greater than previous rows max amount"
                      );
                    } else {
                      callback();
                    }
                  },
                },
              ]}
              // disabled={true}
              onChange={(e: any) => {
                handleIsPerDayChange(e, index, "minAmount");
              }}
            />
          </>
        ),
    },
    {
      title: "Salary Range Max ",
      render: (value: any, row: any, index: number) =>
        +id ? (
          <>
            <PInput
              type="number"
              value={row?.maxAmount}
              placeholder="Amount"
              onPressEnter={(e: any) => {
                e.preventDefault();
              }}
              onChange={(e: any) => {
                handleIsPerDayChange(e, index, "maxAmount");
              }}
            />
          </>
        ) : (
          <>
            <PInput
              type="number"
              name={`max_${index}`}
              // value={row?.maxAmount}
              placeholder="Amount"
              rules={[
                // { required: true, message: "Amount Is Required" },
                {
                  validator: (_, value, callback) => {
                    const range = parseFloat(value);

                    if (isNaN(range)) {
                      callback("Amount Is Required");
                    } else if (range < 0) {
                      callback("Cant be Negative");
                    } else if (rowDto[index]?.minAmount >= value) {
                      callback("max amount must be greater than min amount");
                    } else {
                      callback();
                    }
                  },
                },
              ]}
              onPressEnter={(e: any) => {
                e.preventDefault();
              }}
              // disabled={true}
              onChange={(e: any) => {
                handleIsPerDayChange(e, index, "maxAmount");
              }}
            />
          </>
        ),
    },

    {
      title: "Own Contribution/Meal",
      render: (value: any, row: any, index: number) =>
        +id ? (
          <>
            <PInput
              type="number"
              // name={`OM_${index}`}
              value={row?.ownContribution}
              placeholder="Amount"
              onPressEnter={(e: any) => {
                e.preventDefault();
              }}
              // disabled={true}
              onChange={(e: any) => {
                handleIsPerDayChange(e, index, "ownContribution");
                handleIsPerDayChange(
                  parseInt(
                    `${
                      row?.companyContribution
                        ? e + +row?.companyContribution
                        : e
                    }`
                  ),
                  index,
                  "TotalCost"
                );
              }}
            />
          </>
        ) : (
          <>
            <PInput
              type="number"
              name={`OM_${index}`}
              placeholder="Amount"
              onPressEnter={(e: any) => {
                e.preventDefault();
              }}
              rules={[
                // { required: true, message: "Amount Is Required" },
                {
                  validator: (_, value, callback) => {
                    const ownMeal = parseFloat(value);

                    if (isNaN(ownMeal)) {
                      callback("Amount Is Required");
                    } else if (ownMeal < 0) {
                      callback("Cant be Negative");
                    } else {
                      callback();
                    }
                  },
                },
              ]}
              // disabled={true}
              onChange={(e: any) => {
                handleIsPerDayChange(e, index, "ownContribution");
                handleIsPerDayChange(
                  parseInt(
                    `${
                      row?.companyContribution
                        ? e + +row?.companyContribution
                        : e
                    }`
                  ),
                  index,
                  "TotalCost"
                );
              }}
            />
          </>
        ),
    },

    {
      title: "Company Contribution/Meal",
      render: (value: any, row: any, index: number) =>
        +id ? (
          <>
            <PInput
              type="number"
              // name={`CCC_${index}`}
              value={row?.companyContribution}
              placeholder="Amount"
              onPressEnter={(e: any) => {
                e.preventDefault();
              }}
              // disabled={true}
              onChange={(e: any) => {
                handleIsPerDayChange(e, index, "companyContribution");

                handleIsPerDayChange(
                  row?.ownContribution + e,
                  index,
                  "TotalCost"
                );
              }}
            />
          </>
        ) : (
          <>
            <PInput
              type="number"
              name={`CCC_${index}`}
              // value={row?.companyContribution}
              placeholder="Amount"
              onPressEnter={(e: any) => {
                e.preventDefault();
              }}
              rules={[
                // { required: true, message: "Amount Is Required" },
                {
                  validator: (_, value, callback) => {
                    const companyContribution = parseFloat(value);

                    if (isNaN(companyContribution)) {
                      callback("Amount Is Required");
                    } else if (companyContribution < 0) {
                      callback("Cant be Negative");
                    } else {
                      callback();
                    }
                  },
                },
              ]}
              // disabled={true}
              onChange={(e: any) => {
                handleIsPerDayChange(e, index, "companyContribution");

                handleIsPerDayChange(
                  row?.ownContribution + e,
                  index,
                  "TotalCost"
                );
              }}
            />
          </>
        ),
    },
    {
      title: "Total Cost/Meal ",
      render: (value: any, row: any) => row?.TotalCost,
    },
    {
      title: "Action",
      render: (value: any, row: any, index: number) => (
        <div className="d-flex justify-content-center">
          <Tooltip title="Delete" arrow>
            <button type="button" className="iconButton">
              <DeleteOutlineOutlined onClick={() => handleDeleteRow(index)} />
            </button>
          </Tooltip>
        </div>
      ),
    },
    // {
    //   width: 20,
    //   align: "center",
    //   render: () => (
    //     <TableButton
    //       buttonsList={[
    //         {
    //           type: "plus",
    //           onClick: () => {
    //             setRowDto((prev: any) => [
    //               ...prev,
    //               {
    //                 workplace: prev[0]?.workplace,
    //                 workplaceGroup: prev[0]?.workplaceGroup,
    //               },
    //             ]);
    //           },
    //         },
    //       ]}
    //       parentStyle={{ color: "green" }}
    //     />
    //   ),
    // },
  ];
  const submitHandler = (rowDto: any) => {
    const { pricingMatrixType, mealType, date, workplace, workplaceGroup } =
      form.getFieldsValue(true);
    const cb = () => {
      form.resetFields();
    };

    if (
      +id &&
      rowDto[0]?.minAmount &&
      rowDto[0]?.minAmount >= rowDto[0]?.maxAmount
    ) {
      toast.error("max amount must be greater than min amount");
      return;
    }

    const payload = rowDto.map((item: any, idx: number) => {
      return {
        // intConfigId: +id || 0,
        intDesignationId: item?.designation?.value || 0,
        strDesignationName: item?.designation?.label || "",
        monOwnContribution: item?.ownContribution,
        monTotalCost: item?.TotalCost,
        monCompanyContribution: item?.companyContribution,
        minAmount: item?.minAmount,
        maxAmount: item?.maxAmount,
        isActive: true,
        // intMonthId:
        //   mealType?.value === 2
        //     ? moment(date)?.format("l").split("/")?.[0]
        //     : null,
        // intYearId: mealType?.value === 2 ? moment(date).format("yyyy") : null,
        // strMonthName:
        //   mealType?.value === 2 ? moment(date).format("MMMM") : null,
        rowId: item?.rowId || 0, // Assuming you're assigning or have rowId
      };
    });

    const newPayload = {
      intAccountId: orgId,
      intBusinessUnitId: buId,
      workPlaceId: workplace?.value || 0,
      workPlaceGroupId: workplaceGroup?.value || 0,
      pricingMatrixTypeId: pricingMatrixType?.value || 0,
      pricingMatrixTypeName: pricingMatrixType?.label || "",
      intMealConsumePlaceId: 0,
      mealTypeId: mealType?.value || 0,
      mealTypeName: mealType?.label || "",
      isActive: true,
      rows: payload, // Array of row objects
      headerId: +id || 0,
    };

    if (+id) {
      cafeEditApi.action({
        urlKey: "EditCafeteriaConfig",
        method: "PUT",
        payload: newPayload,
        onSuccess: (res) => {
          if (res?.statusCode === 406) {
            return toast.warn(res?.message);
          }
          if (res?.statusCode === 200) {
            cb();
            history.push("/profile/cafeteriaManagement/cafeteriaPricingSetup");
          }
        },
        // toast: true,
      });
    } else {
      cafeApi.action({
        urlKey: "CreateCafeteriaConfig",
        method: "POST",
        payload: newPayload,
        onSuccess: (res) => {
          if (res?.statusCode === 406) {
            return toast.warn(res?.message);
          }
          if (res?.statusCode === 200) {
            cb();
            history.push("/profile/cafeteriaManagement/cafeteriaPricingSetup");
            return toast.success(res?.message);
          }
        },
        // toast: true,
      });
    }

    // const payload = rowDto.map((item: any, idx: number) => {
    //   return {
    //     sl: rowDto?.sl || idx,
    //     intConfigId: rowDto?.intConfigId || 0,
    //     intAccountId: orgId,
    //     intBusinessUnitId: buId,
    //     intDesignationId: item?.designation?.value || 0,
    //     strDesignationName: item?.designation?.label || "",
    //     monOwnContribution: item?.ownContribution,
    //     monTotalCost: item?.TotalCost,
    //     monCompanyContribution: item?.companyContribution,
    //     isActive: true,
    //     intMealConsumePlaceId: 0,
    //     mealTypeId: mealType?.value,
    //     mealTypeName: mealType?.label,
    //     workPlaceId: item?.workplace?.value,
    //     workPlaceGroupId: item?.workplaceGroup?.value,
    //     pricingMatrixTypeId: pricingMatrixType?.value,
    //     pricingMatrixTypeName: pricingMatrixType?.label,
    //     minAmount: item?.minAmount,
    //     maxAmount: item?.maxAmount,
    //     returnAllSalaryRangeData: true,
    //     intMonthId:
    //       mealType?.value === 2
    //         ? moment(date)?.format("l").split("/")?.[0]
    //         : null,
    //     intYearId: mealType?.value === 2 ? moment(date).format("yyyy") : null,
    //     strMonthName:
    //       mealType?.value === 2 ? moment(date).format("MMMM") : null,
    //   };
    // });

    // if (rowDto?.intConfigId) {
    //   cafeEditApi.action({
    //     urlKey: "EditCafeteriaConfig",
    //     method: "PUT",
    //     payload: payload[0],
    //     onSuccess: () => {
    //       cb();
    //       history.push("/profile/cafeteriaManagement/cafeteriaPricingSetup");
    //     },
    //     toast: true,
    //   });
    // } else {
    //   cafeApi.action({
    //     urlKey: "CreateCafeteriaConfig",
    //     method: "POST",
    //     payload: payload,
    //     onSuccess: () => {
    //       cb();
    //       history.push("/profile/cafeteriaManagement/cafeteriaPricingSetup");
    //     },
    //     toast: true,
    //   });
    // }
  };

  return (
    <PForm form={form} initialValues={{}}>
      <PCard>
        <PCardHeader
          backButton
          title="Cafeteria Pricing Setup"
          buttonList={[
            {
              type: "primary",
              content: +id ? "Edit" : "Save",
              onClick: () => {
                submitHandler(rowDto);
              },
              //   disabled: selectedRow?.length > 0 ? false : true,
            },
            {
              type: "primary-outline",
              content: "Reset",
              onClick: () => {
                form.resetFields();
                // setSelectedRow([]);
              },
              // disabled: true,
              //   icon: <AddOutlined />,
            },
          ]}
        ></PCardHeader>
        <PCardBody className="mb-3">
          <Row gutter={[10, 2]}>
            <Col md={5} sm={12} xs={24}>
              <PSelect
                options={[
                  { label: "Per Meal", value: 1 },
                  { label: "Per Month", value: 2 },
                ]}
                name="mealType"
                label="Meal Type"
                placeholder="Meal Type"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    mealType: op,
                  });
                }}
                disabled={+id ? true : false}
                rules={[{ required: true, message: "Meal Type is required" }]}
              />
            </Col>
            <Form.Item shouldUpdate noStyle>
              {() => {
                const { mealType } = form.getFieldsValue();

                return (
                  <>
                    {mealType?.value === 2 ? (
                      <>
                        <Col md={6} sm={12} xs={24}>
                          <PInput
                            type="date"
                            picker="month"
                            name="date"
                            label="Select Month"
                            placeholder="Select Month"
                            rules={[
                              {
                                required: true,
                                message: "Please Select a month",
                              },
                            ]}
                            format={"MMMM-YYYY"}
                          />
                        </Col>
                      </>
                    ) : undefined}
                  </>
                );
              }}
            </Form.Item>
            <Col md={5} sm={12} xs={24}>
              <PSelect
                options={workplaceGroup?.data || []}
                name="workplaceGroup"
                label="Workplace Group"
                placeholder="Workplace Group"
                disabled={+id ? true : false}
                onChange={(value, op) => {
                  form.setFieldsValue({
                    workplaceGroup: op,
                    workplace: undefined,
                  });
                  getWorkplace();
                  getDesignation();
                }}
                rules={[
                  { required: true, message: "Workplace Group is required" },
                ]}
              />
            </Col>
            <Col md={5} sm={12} xs={24}>
              <PSelect
                options={workplace?.data || []}
                name="workplace"
                label="Workplace"
                placeholder="Workplace"
                disabled={+id ? true : false}
                onChange={(value, op) => {
                  form.setFieldsValue({
                    workplace: op,
                  });
                  getDesignation();
                }}
                rules={[{ required: true, message: "Workplace is required" }]}
              />
            </Col>
            <Col md={5} sm={12} xs={24}>
              <PSelect
                options={[
                  {
                    value: 1,
                    label: "Designation Wise",
                  },
                  {
                    value: 2,
                    label: "Salary Range Wise",
                  },
                  {
                    value: 3,
                    label: "HR Position",
                  },
                ]}
                name="pricingMatrixType"
                label="Pricing Matrix Type
"
                placeholder="Pricing Matrix Type
"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    pricingMatrixType: op,
                  });
                }}
                disabled={+id ? true : false}
                rules={[
                  {
                    required: true,
                    message: "Pricing Matrix Type is required",
                  },
                ]}
              />
            </Col>

            <Form.Item shouldUpdate noStyle>
              {() => {
                const { pricingMatrixType } = form.getFieldsValue();

                return (
                  <>
                    {pricingMatrixType?.value === 1 ? (
                      <>
                        <Col md={5} sm={12} xs={24}>
                          <PSelect
                            mode="multiple"
                            options={designation?.data || []}
                            name="designationDDL"
                            label="Designation"
                            placeholder="Designation"
                            // disabled={+id ? true : false}
                            onChange={(value, op) => {
                              form.setFieldsValue({
                                designationDDL: op,
                              });

                              // value && getWorkplace();
                            }}
                            rules={[
                              {
                                required: true,
                                message: "Designation is required",
                              },
                            ]}
                          />
                        </Col>
                      </>
                    ) : undefined}
                  </>
                );
              }}
            </Form.Item>
            <Col
              style={{
                marginTop: "23px",
              }}
            >
              <PButton
                type="primary"
                action="submit"
                content="Add"
                onClick={() => {
                  const {
                    designationDDL,
                    workplace,
                    workplaceGroup,
                    pricingMatrixType,
                  } = form.getFieldsValue(true);
                  if (
                    pricingMatrixType?.value === 1 &&
                    (!designationDDL || designationDDL.length === 0)
                  ) {
                    toast.warn(
                      "Please select at least one designation before adding."
                    );
                    return; // Exit early if no designation is selected
                  }
                  if (pricingMatrixType?.value === 1) {
                    setRowDto((prevRowDto: any) => [
                      ...prevRowDto,
                      ...designationDDL?.map((item: any) => {
                        return {
                          workplace,
                          workplaceGroup,
                          designation: item,
                          ownContribution: 0,
                          companyContribution: 0,
                          TotalCost: 0,
                        };
                      }),
                    ]);
                  } else {
                    setRowDto((prevRowDto: any) => [
                      ...prevRowDto,
                      {
                        workplace,
                        workplaceGroup,
                        ownContribution: 0,
                        companyContribution: 0,
                        TotalCost: 0,
                      },
                    ]);
                  }
                }}
              />
            </Col>
          </Row>
        </PCardBody>

        <Form.Item shouldUpdate noStyle>
          {() => {
            const { pricingMatrixType } = form.getFieldsValue();

            return (
              <>
                {pricingMatrixType?.value === 1 ? (
                  <DataTable
                    header={headerForDesignation}
                    bordered
                    data={rowDto || []}
                  />
                ) : pricingMatrixType?.value === 2 ? (
                  <DataTable
                    header={headerForSalary}
                    bordered
                    data={rowDto || []}
                  />
                ) : undefined}
              </>
            );
          }}
        </Form.Item>
      </PCard>
    </PForm>
  );
};

export default PricingSetupForm;
