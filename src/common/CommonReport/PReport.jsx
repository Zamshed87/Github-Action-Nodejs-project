import { DataTable, PCard, PCardHeader, PForm } from "Components";
import Loading from "common/loading/Loading";
import PdfExcellDownload from "./PdfExcellDownload";

const PReport = ({
  reportType,
  reportName,
  pdfUrl,
  excelUrl,
  form,
  data,
  landingApiCall,
  loading,
  setLoading,
  searchFunc,
  filter,
  header,
  pageSize,
  totalCount,
}) => {
  return (
    <>
      <PForm
        form={form}
        initialValues={{}}
        // onFinish={() => {
        //   landingApiCall();
        // }}
      >
        <PCard>
          {loading && <Loading />}
          <PCardHeader
            backButton
            // exportIcon={true}
            title={reportName}
            {...(searchFunc && {
              onSearch: (e) => {
                const value = e?.target?.value;
                searchFunc(value);
                form.setFieldsValue({ search: value });
              },
            })}
          >
            {" "}
            <PdfExcellDownload
              data={data}
              setLoading={setLoading}
              excelUrl={excelUrl}
              pdfUrl={pdfUrl}
              reportName={reportName}
            />
            <div className="mt-3">{filter}</div>
          </PCardHeader>
          {reportType === "RDLC" && data && (
            <div
              style={{ overflow: "scroll", marginTop: "" }}
              className="w-100 mt-0"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: data,
                }}
              />
            </div>
          )}
          {reportType !== "RDLC" && data && (
            <DataTable
              bordered
              data={data || []}
              loading={loading}
              header={header}
              pagination={{
                pageSize: pageSize,
                total: totalCount,
              }}
              onChange={(pagination) => {
                landingApiCall({
                  pagination,
                  searchText: form.getFieldValue("search"),
                });
              }}
              // scroll={{ x: 2000 }}
            />
          )}
        </PCard>
      </PForm>
    </>
  );
};

export default PReport;
