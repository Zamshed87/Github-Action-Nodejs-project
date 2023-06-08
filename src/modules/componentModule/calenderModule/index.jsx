import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import moment from "moment";
import { Form, Formik } from "formik";
import { setFirstLevelNameAction } from '../../../commonRedux/reduxForLocalStorage/actions';
import Calender from './calender';
import FormikSelect from './../../../common/FormikSelect';
import { customStyles } from './../../../utility/newSelectCustomStyle';
import { yearDDLAction } from './../../../utility/yearDDL';

const initData = {
  year: ""
};

export default function CalenderModule() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const monthList = moment.months();

  return (
    <><Formik
      enableReinitialize={true}
      initialValues={{
        ...initData,
        year: {
          value: 2022,
          label: "2022"
        }
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        resetForm(initData);
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        errors,
        touched,
        setFieldValue,
        isValid,
      }) => (
        <>
          <Form onSubmit={handleSubmit}>
            <div className="table-card all-candidate">
              <div className="table-card-heading">
                <h2>Calender</h2>
                <div className="table-card-head-right">
                  <ul className="d-flex flex-wrap">
                    <li>
                      <FormikSelect
                        name="year"
                        options={yearDDLAction(5, 10) || []}
                        value={values?.year}
                        onChange={(valueOption) => {
                          setFieldValue("year", valueOption);
                        }}
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                      />
                    </li>
                  </ul>
                </div>
              </div>
              <div className="table-card-body">
                {values?.year?.value && (
                  <div className="attendence-report dashboard-scroll">
                    <div>
                      <div className="table-card-heading">
                        <h2>{values?.year?.value}</h2>
                      </div>
                      <div className="row">
                        {monthList?.length > 0 && monthList.map((item, index) => {
                          const calenderDate = `${values?.year?.value}/${index + 1}/1`;
                          const endDay = Number(moment(calenderDate).endOf("months").format("D"));
                          let blankList = [
                            ...Array(
                              Number(
                                moment(calenderDate)
                                  .startOf("month")
                                  .format("day")[0]
                              )
                            ),
                          ];

                          const lastWeekDay = [
                            ...Array(
                              Number(
                                6 -
                                moment(calenderDate)
                                  .endOf("month")
                                  .format("day")[0]
                              )
                            ),
                          ]
                          return (
                            <div className="col-md-4 mb-2" key={index}>
                              <div className="card notice-card">
                                <div className="card-body px-4 pt-4 pb-0">
                                  <Calender
                                    item={item}
                                    index={index}
                                    year={values?.year?.value}
                                    endDay={endDay}
                                    blankList={blankList}
                                    lastWeekDay={lastWeekDay}
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Form>
        </>
      )}
    </Formik>

    </>
  );
}
