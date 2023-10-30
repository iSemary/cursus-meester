"use client";
import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import DashboardTemplate from "../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../layouts/dashboard/DashboardTitle";
import { ToggleButton } from "primereact/togglebutton";
import { Button } from "primereact/button";

export default function createCourse() {
    const [Form, setForm] = useState({});
    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Create new course"
                path={[
                    { label: "Courses", url: "/dashboard/courses" },
                    { label: "Create", url: "/dashboard/courses/create" },
                ]}
            />
            <div>
                <div className="my-2 row">
                    <div className="col-md-6 p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Username" />
                    </div>
                    <div className="col-md-6 p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">$</span>
                        <InputText placeholder="Slug" />
                    </div>
                </div>
                <div className="my-2 row">
                    <div className="col-md-2">
                        <ToggleButton
                            checked={false}
                            onLabel={"Enable Offer"}
                            onIcon="pi pi-check"
                            offIcon="pi pi-times"
                            offLabel={"Disable Offer"}
                        />
                    </div>
                    <div className="col-md-5 p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">www</span>
                        <InputNumber placeholder="Price" />
                    </div>
                    <div className="col-md-5 p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">www</span>
                        <InputNumber placeholder="Offer Price" />
                    </div>
                </div>
                
                <div>
                    <Button label="Create" icon="pi pi-save" rounded={true} raised={true}  />
                </div>
            </div>
        </DashboardTemplate>
    );
}
