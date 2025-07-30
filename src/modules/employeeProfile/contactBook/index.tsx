import { Avatar, DataTable, PCard, PCardHeader, PForm } from "Components";

import { useApiRequest } from "Hooks";
import { Form } from "antd";
import Loading from "common/loading/Loading";
import { paginationSize } from "common/peopleDeskTable";
import { useEffect, useState } from "react";
import { getSerial } from "Utils";
import { debounce } from "lodash";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import moment from "moment";

const ContactBook = () => {
  const dispatch = useDispatch();

  // redux
  const { buId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const landingApi = useApiRequest({});
  //   const debounce = useDebounce();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    document.title = "Contact Book ";
    return () => {
      document.title = "PeopleDesk";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [pages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  const [filterList, setFilterList] = useState<any>({});

  // Form Instance
  const [form] = Form.useForm();
  //   api states
  // navTitle
  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filerList?: any;
    searchText?: string;
    excelDownload?: boolean;
  };
  const landingApiCall = ({
    pagination = { current: 1, pageSize: paginationSize },
    searchText = "",
    filerList,
  }: TLandingApi = {}) => {
    landingApi.action({
      urlKey: "EmployeeContactInfo",
      method: "post",
      payload: {
        businessUnitId: buId,
        pageSize: pagination.pageSize || 25,
        pageNo: pagination.current || 1,
        isForEXL: false,
        searchText: searchText || "",
        strDesignationList: filerList?.strDesignation || [],
        strDepartmentList: filerList?.strDepartment || [],
      },
    });
  };

  useEffect(() => {
    // getWorkplaceGroup();
    landingApiCall();
  }, []);

  const header: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: landingApi?.data?.data?.currentPage,
          pageSize: landingApi?.data?.data?.pageSize,
          index,
        }),
      fixed: "left",
      width: 15,
      align: "center",
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      // sort: true,
      filter: false,
      width: 50,
      // fieldType: "string",
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      render: (_: any, rec: any) => {
        return (
          <div className="d-flex align-items-center">
            <Avatar title={rec?.employeeName} />
            <span className="ml-2">{rec?.employeeName}</span>
          </div>
        );
      },
      sorter: true,
      fixed: "left",
      width: 50,
    },

    {
      title: "Reference Id",
      dataIndex: "strReferenceId",
      width: 40,
    },

    {
      title: "Department",
      dataIndex: "departmentName",
      // dataIndex: "strDepartment",
      sorter: true,
      filter: true,
      filterKey: "strDepartmentList",
      filterSearch: true,
      width: 50,
    },
    {
      title: "Designation",
      dataIndex: "designationName",
      // dataIndex: "strDesignation",
      sorter: true,
      filter: true,
      filterKey: "strDesignationList",
      filterSearch: true,
      width: 50,
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      width: 40,
    },
    {
      title: "Blood donate date",
      dataIndex: "bloodGroup",
      render: (_: any, item: any) => (
        <div>
          {item?.bloodDonateDate
            ? moment(item?.bloodDonateDate).format("ll")
            : "-"}
        </div>
      ),
      width: 40,
    },
    {
      title: "Mobile No",
      dataIndex: "phone",
      width: 40,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 70,
    },
  ];
  const searchFunc = debounce((value) => {
    landingApiCall({
      filerList: filterList,
      searchText: value,
    });
  }, 500);
  return (
    <>
      <PForm
        form={form}
        initialValues={{}}
        onFinish={() => {
          landingApiCall({
            pagination: {
              current: landingApi?.data?.currentPage,
              pageSize: landingApi?.data?.totalCount,
            },
          });
        }}
      >
        <PCard>
          {landingApi?.loading && <Loading />}
          <PCardHeader
            // exportIcon={true}
            title={`Total ${landingApi?.data?.data?.totalCount || 0} employees`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
          />

          <DataTable
            bordered
            data={landingApi?.data?.data?.items || []}
            loading={landingApi?.loading}
            header={header}
            pagination={{
              pageSize: landingApi?.data?.pageSize,
              total: landingApi?.data?.totalCount,
            }}
            filterData={landingApi?.data?.employeeHeader}
            onChange={(pagination, filters, sorter, extra) => {
              // Return if sort function is called
              if (extra.action === "sort") return;
              const { search } = form.getFieldsValue(true);
              setFilterList(filters);
              landingApiCall({
                pagination,
                filerList: filters,
                searchText: search,
              });
            }}
          />
        </PCard>
      </PForm>
    </>
  );
};

export default ContactBook;
