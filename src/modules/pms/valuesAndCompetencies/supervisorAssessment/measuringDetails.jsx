/* eslint-disable react-hooks/exhaustive-deps */
import FontDownloadOutlinedIcon from '@mui/icons-material/FontDownloadOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import { Formik } from 'formik';
import { useEffect, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import FormikSelect from '../../../../common/FormikSelect';
import PrimaryButton from '../../../../common/PrimaryButton';
import ScrollableTable from '../../../../common/ScrollableTable';
import Loading from '../../../../common/loading/Loading';
import useAxiosGet from '../../../../utility/customHooks/useAxiosGet';
import { customStyles } from '../../../../utility/selectCustomStyle';
import './style.css';
import useAxiosPost from '../../../../utility/customHooks/useAxiosPost';

const initData = {
   measure:""
};

export default function MeasuringDetails({ tabValue, previousData, detailsData, getValuesAndCompetencyNameDDL }) {
   const [valuesMeasuringData, getValuesMeasuringData, measuringLoading, setValuesMeasuringData] =
      useAxiosGet();

   const [
      competenciesMeasuringData,
      getCompetenciesMeasuringData,
      competenciesLoading,
      setCompetenciesMeasuringData
   ] = useAxiosGet();

   const formikRef = useRef();
   const {
      buId,
      orgId,
      employeeId,
   } = useSelector(state => state?.auth?.profileData, shallowEqual);

   const [,createSupervisorAssessmentData ] = useAxiosPost()

   useEffect(() => {
      if (tabValue === '2') {
         getValuesMeasuringData(
            `/PMS/GetScaleForValueDDL?accountId=${orgId}&businessUnitId=${buId}&dimensionTypeId=2`
         );
      }
      if (tabValue === '3') {
         getCompetenciesMeasuringData(
            `/PMS/GetScaleForValueDDL?accountId=${orgId}&businessUnitId=${buId}&dimensionTypeId=3`
         );
      }
   }, []);


   const createSupervisorAssessment = (values, setFieldValue) => {
      const objRow = [
         {
           typeId: +tabValue,
           valuesOrComId: tabValue === "2" ? 
                        previousData?.valuesName?.value : 
                        previousData?.competencyName?.value,
           valuesOrComName: tabValue === "2" ? 
                        previousData?.valuesName?.label : 
                        previousData?.competencyName?.label,
           numDesiredValue: tabValue === "2" ? 
                        previousData?.valuesName?.numDesiredValue : 
                        previousData?.competencyName?.numDesiredValue,
         //   measureIdByEmployee: values?.measure?.value || 0,
         //   measureNameByEmployee: values?.measure?.label || "",
         //   numMeasureValueByEmployee: values?.measure?.mesureValue || 0,
           measureIdBySupervisor: values?.measure?.value || 0,
           measureNameBySupervisor: values?.measure?.label || "",
           numMeasureValueBySupervisor: values?.measure?.mesureValue || 0,
         }
       ]
      const Payload =
      {
        objHeader: {
          accountId: orgId,
          businessUnitId: buId,
          sbuid: 0,
          yearId: previousData?.yearDDLgroup?.value || 0,
          employeeId: employeeId,
          actionBy: employeeId,
          quarterId: previousData?.quarterDDLgroup?.value || 0,
          quarterName: previousData?.quarterDDLgroup?.label || "",
        },
        objRow: objRow        
      }
      createSupervisorAssessmentData("/PMS/CreateValuesAndCompetency", Payload, 
      ()=>{
         if (tabValue === '2') {
            getValuesAndCompetencyNameDDL(
               `/PMS/GetValueList?accountId=${orgId}&businessUnitId=${buId}&yearId=${previousData?.yearDDLgroup?.value}&quarterId=${previousData?.quarterDDLgroup?.value}&employeeId=${employeeId}`
            );
            setValuesMeasuringData([])
            setFieldValue(`${previousData?.valuesName}`,"")
         }
         if (tabValue === '3') {
            getValuesAndCompetencyNameDDL(
               `/PMS/GetCompetencyList?accountId=${orgId}&businessUnitId=${buId}&yearId=${previousData?.yearDDLgroup?.value}&quarterId=${previousData?.quarterDDLgroup?.value}&employeeId=${employeeId}`
            );
            setCompetenciesMeasuringData([])
            setFieldValue(`${previousData?.competencyName}`, "")
         }

      }, true)
   };

   return (
      <>
         <Formik
            enableReinitialize={true}
            initialValues={initData}
            //   validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
               // saveHandler(values, () => {
               //    resetForm(initData);
               // });
            }}
            innerRef={formikRef}
         >
            {({ handleSubmit, values, errors, touched, setFieldValue }) => (
               <>
                  {(measuringLoading || competenciesLoading ) && <Loading />}

                  <div className="measuringDetails">
                     <p>
                        {/* <i className="fa fa-font"></i> */}
                        <FontDownloadOutlinedIcon />
                        <b style={{ marginLeft: '10px' }}>
                           {tabValue === '2' ? 'Value' : 'Competency'} Name:{' '}
                        </b>
                        {tabValue === '2'
                           ? detailsData?.[0]?.coreValueName || ''
                           : detailsData?.[0]?.competencyName || ''}
                     </p>
                     <p>
                        {/* <i className="fa fa-book"></i> */}
                        <MenuBookOutlinedIcon />
                        <b style={{ marginLeft: '10px' }}>Definition: </b>
                        {tabValue === '2'
                           ? detailsData?.[0]?.defination || ''
                           : detailsData?.[0]?.defination || ''}
                     </p>
                     <p>
                        {/* <i className="fa fa-list-ul"></i> */}
                        <FormatListBulletedOutlinedIcon />
                        <b style={{ marginLeft: '10px' }}>
                           Demonstrated Behavior
                        </b>
                     </p>
                     <ul>
                        {tabValue === '2'
                           ? detailsData?.length > 0 && (
                                <div>
                                   <div>
                                      {detailsData?.filter(
                                         item => item.isPositive
                                      ).length > 0 && (
                                         <h3
                                            style={{
                                               background: '#a9f2ab',
                                               padding: '10px 12px',
                                            }}
                                         >
                                            <b>Positive</b>
                                         </h3>
                                      )}
                                      {detailsData?.map((itm, index) => {
                                         return (
                                            itm?.isPositive && (
                                               <li key={index}>
                                                  {itm?.demonstratedBehaviour}
                                               </li>
                                            )
                                         );
                                      })}
                                   </div>
                                   <div>
                                      {detailsData?.filter(
                                         item => !item.isPositive
                                      ).length > 0 && (
                                         <h3
                                            style={{
                                               background: '#f49999',
                                               padding: '10px 12px',
                                            }}
                                         >
                                            <b>Negative</b>
                                         </h3>
                                      )}
                                      {detailsData?.map((itm, index) => {
                                         return (
                                            !itm?.isPositive && (
                                               <li key={index}>
                                                  {itm?.demonstratedBehaviour}
                                               </li>
                                            )
                                         );
                                      })}
                                   </div>
                                </div>
                             )
                           : detailsData?.length > 0 && (
                                <div>
                                   <div>
                                      {detailsData?.filter(
                                         item => item.isPositive
                                      ).length > 0 && (
                                         <h3
                                            style={{
                                               background: '#a9f2ab',
                                               padding: '10px 12px',
                                            }}
                                         >
                                            <b>Positive</b>
                                         </h3>
                                      )}
                                      {detailsData?.map((itm, index) => {
                                         return (
                                            itm?.isPositive && (
                                               <li key={index}>
                                                  {itm?.demonstratedBehaviour}
                                               </li>
                                            )
                                         );
                                      })}
                                   </div>
                                   <div>
                                      {detailsData?.filter(
                                         item => !item.isPositive
                                      ).length > 0 && (
                                         <h3
                                            style={{
                                               background: '#f49999',
                                               padding: '10px 12px',
                                            }}
                                         >
                                            <b>Negative</b>
                                         </h3>
                                      )}
                                      {detailsData?.map((itm, index) => {
                                         return (
                                            !itm?.isPositive && (
                                               <li key={index}>
                                                  {itm?.demonstratedBehaviour}
                                               </li>
                                            )
                                         );
                                      })}
                                   </div>
                                </div>
                             )}
                     </ul>
                     <div className='row'>
                        <div className="input-field-main col-lg-3">
                           <FormikSelect
                              classes="input-sm"
                              name="measure"
                              options={tabValue === '2' ? valuesMeasuringData : competenciesMeasuringData}
                              value={values?.measure}
                              label="Measure"
                              onChange={valueOption => {
                                 if (valueOption) {
                                    setFieldValue('measure', valueOption);
                                 } else {
                                    setFieldValue('measure', '');
                                 }
                              }}
                              placeholder=" "
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                              menuPosition="fixed"
                           />
                        </div>
                        <div className="input-field-main col-lg-3 mt-4">
                        <PrimaryButton
                             type="button"
                             className="btn btn-default flex-center"
                             label={"Save"}
                           //   icon={<AddOutlined sx={{ marginRight: "11px" }} />}
                             onClick={(e) => {
                              //  if (!permission?.isCreate)
                              //    return toast.warn("You don't have permission");
                               e.stopPropagation();
                               createSupervisorAssessment(values, setFieldValue)
                             }}
                             disabled={!values?.measure}
                           />
                        </div>
                     </div>

                     <hr />

                     <div className="row">
                              <div className="col-lg-12">
                                 <ScrollableTable
                                    classes="salary-process-table"
                                    secondClasses="table-card-styled tableOne scroll-table-height"
                                 >
                                    <thead>
                                       <tr>
                                          <th className="text-center">
                                             {tabValue === "2" ? "Value Name" : "Competency Name"}
                                          </th>
                                          <th className="text-center">
                                             Desired Values
                                          </th>
                                          <th className="text-center">
                                             Measure by Employee{' '}
                                          </th>
                                          <th className="text-center">Gap </th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       <tr>
                                          <td>{tabValue === "2" ? previousData?.valuesName?.label : previousData?.competencyName?.label }</td>
                                          <td className='text-center'>{tabValue === "2" ? previousData?.valuesName?.numDesiredValue : previousData?.competencyName?.numDesiredValue }</td>                                          
                                          <td>{values?.measure?.label || ""}</td>
                                          <td className='text-center'>{values?.measure ? values?.measure?.mesureValue === 0 ? 0 : - values?.measure?.mesureValue : 0}</td>
                                       </tr>
                                    </tbody>
                                 </ScrollableTable>
                              </div>
                           </div>
                  </div>
               </>
            )}
         </Formik>
      </>
   );
}
