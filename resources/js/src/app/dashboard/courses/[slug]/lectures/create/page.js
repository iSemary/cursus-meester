"use client";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import DashboardTemplate from "../../../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../../../layouts/dashboard/DashboardTitle";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { ToggleButton } from "primereact/togglebutton";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { BiCategoryAlt, BiSolidImage, BiSolidOffer } from "react-icons/bi";
import { MdOutlineTitle } from "react-icons/md";
import { AiOutlineLink } from "react-icons/ai";
import { ImFileText2 } from "react-icons/im";
import { LuScrollText, LuCalendarClock, LuCalendarCheck } from "react-icons/lu";
import { FaLanguage } from "react-icons/fa6";
import { HiMiniChartBar } from "react-icons/hi2";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
export default function createCourse() {
    const initialCourse = {
        title: "",
        slug: "",
        description: "",
        content: "",
        thumbnail: "",
        skill_level: "",
        category_id: "",
        organization_id: "",
        language_id: "",
        currency_id: "",
        price: "",
        offer_price: "",
        offer_percentage: "",
        offer_expired_at: "",
        published_at: "",
    };

    const [Course, setCourse] = useState(initialCourse);

    const levels = [
        { title: "Beginner", value: "1" },
        { title: "Intermediate", value: "2" },
        { title: "Expert", value: "3" },
    ];

    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Create a new lecture"
                path={[
                    { label: "Courses", url: "/dashboard/courses" },
                    { label: "Lectures", url: "/dashboard/courses/slug/lectures" },
                    { label: "Create", url: "/dashboard/courses/slug/lectures/create" },
                ]}
            />
            <div>
                <div className="my-2 row">
                    <div className="col-md-6 p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <MdOutlineTitle />
                        </span>
                        <InputText placeholder="Title" />
                    </div>
                    <div className="col-md-6 p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <AiOutlineLink />
                        </span>
                        <InputText placeholder="Slug" />
                    </div>
                </div>
                <div className="my-2 row">
                    <div className="col-md-12 p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <ImFileText2 />
                        </span>
                        <InputTextarea placeholder="Description" />
                    </div>
                </div>
                <div className="my-2 row">
                    <div className="col-md-12 p-inputgroup flex-1 w-100">
                        <span className="p-inputgroup-addon">
                            <LuScrollText />
                        </span>
                        <div className="w-100">
                            <CKEditor
                                editor={ClassicEditor}
                                data=""
                                config={{
                                    placeholder: "Enter your course content",
                                }}
                            />
                        </div>
                    </div>
                </div>
                <hr className="w-50 m-auto my-5" />
                <div className="my-2 row">
                    <div className="col-md-3 p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <HiMiniChartBar />
                        </span>
                        <Dropdown
                            options={levels}
                            optionLabel="title"
                            editable
                            placeholder="Level"
                            className="w-full md:w-14rem"
                        />
                    </div>
                    <div className="col-md-3 p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <BiCategoryAlt />
                        </span>{" "}
                        <Dropdown
                            options={levels}
                            optionLabel="title"
                            editable
                            placeholder="Category"
                            className="w-full md:w-14rem"
                        />
                    </div>
                    <div className="col-md-3 p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <FaLanguage />
                        </span>{" "}
                        <Dropdown
                            options={levels}
                            optionLabel="title"
                            editable
                            placeholder="Course language"
                            className="w-full md:w-14rem"
                        />
                    </div>
                    <div className="col-md-3">
                        <div className="d-flex mt-2 align-items-center">
                            <Checkbox
                                id="organizationId"
                                name="organization_id"
                                value=""
                            />
                            <label htmlFor="organizationId" className="ms-2">
                                Part of your organization
                            </label>
                        </div>
                    </div>
                </div>
                <div className="my-2 row">
                    <div className="col-md-3 p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">$</span>
                        <InputNumber placeholder="Price" />
                    </div>
                    <div className="col-md-3 p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <BiSolidOffer />
                        </span>
                        <InputNumber placeholder="Offer Price" />
                    </div>
                    <div className="col-md-3">
                        <ToggleButton
                            checked={false}
                            onLabel={"Enable Offer"}
                            className="w-100"
                            onIcon="pi pi-check"
                            offIcon="pi pi-times"
                            offLabel={"Disable Offer"}
                        />
                    </div>
                    <div className="col-md-3 p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <LuCalendarClock />
                        </span>
                        <DatePicker
                            className="p-inputtext w-100"
                            placeholderText="Offer Expiration Date"
                            selected={""}
                            onChange={""}
                        />
                    </div>
                </div>
                <hr className="w-50 m-auto my-5" />
                <div className="my-2 row">
                    <div className="col-md-3 p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <LuCalendarCheck />
                        </span>
                        <DatePicker
                            className="p-inputtext w-100"
                            placeholderText="Publish Date"
                            selected={""}
                            onChange={""}
                        />
                    </div>
                    <div className="col-md-3 p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <BiSolidImage />
                        </span>
                        <div className="upload-thumbnail">
                            <label
                                htmlFor="thumbnailUpload"
                                className="p-button border-left-0"
                            >
                                Upload Thumbnail
                                {/* <Button */}
                                {/* label="" */}
                                {/* className="border-left-0" */}
                                {/* /> */}
                                <input
                                    id="thumbnailUpload"
                                    type="file"
                                    name="thumbnail"
                                    accept="image/png, image/jpg, image/jpeg"
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <Button
                        label="Save and Continue to Lectures"
                        icon="pi pi-save"
                        rounded={true}
                        raised={true}
                    />
                </div>
            </div>
        </DashboardTemplate>
    );
}
