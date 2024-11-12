import {Col, Form, Row} from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import {setFirstLevelNameAction} from "commonRedux/reduxForLocalStorage/actions";
import {PCard, PCardBody, PCardHeader, PForm, PSelect} from "Components";
import React, {useEffect, useState} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {useHistory, useLocation, useParams} from "react-router-dom";
import {useApiRequest} from "../../../../Hooks";
import {getWorkplaceGroup} from "../../../../common/api/commonApi";

const QuestionCreationAddEdit = () => {
    // Router state
    const {quesId}: any = useParams();
    const location = useLocation();
    const letterData: any = location?.state;
    const history = useHistory();

    // Form Instance
    const [form] = Form.useForm();

    const dispatch = useDispatch();

    const {permissionList, profileData, businessUnitDDL} = useSelector(
        (state: any) => state?.auth,
        shallowEqual
    );
    const {orgId} = profileData;

    const addLabelValue = (ddlArray: any[], labelField: string, valueField: string) => {
        return ddlArray.map(item => ({
            ...item,
            label: item[labelField],
            value: item[valueField]
        }));
    };

    //   states
    const [loading, setLoading] = useState(false);

    // menu permission
    let letterConfigPermission: any = null;
    permissionList.forEach((item: any) => {
        if (item?.menuReferenceId === 30440) {
            letterConfigPermission = item;
        }
    });

    useEffect(() => {
        dispatch(setFirstLevelNameAction("Employee Management"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // api states
    const workplaceGroupDDL: any = useApiRequest([]);
    const workplaceDDL = useApiRequest([]);

    return letterConfigPermission?.isCreate ? (
        <PForm
            formName="tempCreate"
            form={form}

        >
            <PCard>
                <PCardHeader
                    title={quesId ? "Edit Question" : "Create Question"}
                    backButton={true}
                    buttonList={[
                        {
                            type: "primary",
                            content: "Save",
                            icon: "plus",
                            disabled: loading,
                            onClick: () => {
                                // const values = form.getFieldsValue(true);
                            },
                        },
                    ]}
                />
                <PCardBody>
                    <Row gutter={[10, 2]}>
                        <Col md={6} sm={24}>
                            <PSelect
                                options={addLabelValue(businessUnitDDL, 'BusinessUnitName', 'BusinessUnitId') || []}
                                name="buDDL"
                                label="Business Unit"
                                placeholder="Business Unit"
                                onChange={(value: number, op) => {
                                    form.setFieldsValue({
                                        buDDL: op,
                                    });
                                    getWorkplaceGroup({workplaceGroupDDL, orgId, buId: value})
                                }}
                            />
                        </Col>
                        {/*
            <Col md={6} sm={24}>*/}
                        {/*  <PSelect*/}
                        {/*      options={addLabelValue(workplaceGroupDDL, 'WorkplaceGroupName', 'WorkplaceGroupId') || []}*/}
                        {/*      name="wgDDL"*/}
                        {/*      label="Workplace Group"*/}
                        {/*      placeholder="Workplace Group"*/}
                        {/*      onChange={(value, op) => {*/}
                        {/*        form.setFieldsValue({*/}
                        {/*          wgDDL: op,*/}
                        {/*        });*/}
                        {/*      }}*/}
                        {/*  />*/}
                        {/*</Col><Col md={6} sm={24}>*/}
                        {/*  <PSelect*/}
                        {/*      options={addLabelValue(workplaceDDL, 'WorkplaceName', 'WorkplaceId') || []}*/}
                        {/*      name="wDDL"*/}
                        {/*      label="Workplace"*/}
                        {/*      placeholder="Workplace"*/}
                        {/*      onChange={(value, op) => {*/}
                        {/*        form.setFieldsValue({*/}
                        {/*          wDDL: op,*/}
                        {/*        });*/}
                        {/*      }}*/}
                        {/*  />*/}
                        {/*</Col>*/}
                    </Row>
                </PCardBody>
            </PCard>
        </PForm>
    ) : (
        <NotPermittedPage/>
    );
};

export default QuestionCreationAddEdit;
