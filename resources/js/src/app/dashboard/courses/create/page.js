"use client";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import DashboardTemplate from "../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../layouts/dashboard/DashboardTitle";
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
import axiosConfig from "../../../components/axiosConfig/axiosConfig";
import toastAlert from "../../../components/utilities/Alert";
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

    const [course, setCourse] = useState(initialCourse);
    const [categories, setCategories] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [levels, setLevels] = useState([]);
    const [thumbnailImage, setThumbnailImage] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const submitBtn = useRef(null);

    useEffect(() => {
        // Get essentials data for creating new course
        axiosConfig
            .get("courses/create")
            .then((response) => {
                console.log(response.data.data.data.categories)
                setCategories(response.data.data.data.categories);
                setLanguages(response.data.data.data.languages);
                setLevels(response.data.data.data.levels);
            })
            .catch(({ response }) => {
                toastAlert("Something went wrong", "error");
            });
    }, []);

    const handleChangeCourse = (e) => {
        const { name, value } = e.target;
        setCourse({
            ...course,
            [name]: value,
        });
    };

    const handleChangeCourseThumbnail = (e) => {
        const file = e.target.files[0];
        setCourse({
            ...course,
            thumbnail: file,
        });
        setThumbnailImage(URL.createObjectURL(file));
    };

    const handleSubmitCourse = (e) => {
        e.preventDefault();
        setFormLoading(true);

        // Success
        // Clear the inputs or keep disabled
        // Show success alert
        // Navigate to create lectures page with the course slug
    };

    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Create a new course"
                path={[
                    { label: "Courses", url: "/dashboard/courses" },
                    { label: "Create", url: "/dashboard/courses/create" },
                ]}
            />
            <div>
                <form
                    method="POST"
                    encType="multipart/form-data"
                    onSubmit={handleSubmitCourse}
                >
                    <div className="my-2 row">
                        <div className="col-md-6 p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <MdOutlineTitle />
                            </span>
                            <InputText
                                placeholder="Title"
                                name="title"
                                onChange={handleChangeCourse}
                                value={course.title}
                                required
                            />
                        </div>
                        <div className="col-md-6 p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <AiOutlineLink />
                            </span>
                            <InputText
                                placeholder="Slug"
                                name="slug"
                                onChange={handleChangeCourse}
                                value={course.slug}
                                required
                            />
                        </div>
                    </div>
                    <div className="my-2 row">
                        <div className="col-md-12 p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <ImFileText2 />
                            </span>
                            <InputTextarea
                                placeholder="Description"
                                name="description"
                                onChange={handleChangeCourse}
                                value={course.description}
                                required
                            />
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
                                        placeholder:
                                            "Enter your course content",
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
                                optionValue="id"
                                editable
                                placeholder="Level"
                                className="w-full md:w-14rem"
                                name="skill_level"
                                onChange={handleChangeCourse}
                                value={course.skill_level}
                                required
                            />
                        </div>
                        <div className="col-md-3 p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <BiCategoryAlt />
                            </span>{" "}
                            <Dropdown
                                options={categories}
                                optionLabel="title"
                                optionValue="id"
                                editable
                                placeholder="Category"
                                className="w-full md:w-14rem"
                                name="category_id"
                                onChange={handleChangeCourse}
                                value={course.category_id}
                                required
                            />
                        </div>
                        <div className="col-md-3 p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <FaLanguage />
                            </span>{" "}
                            <Dropdown
                                options={languages}
                                optionLabel="name"
                                optionValue="id"
                                editable
                                placeholder="Course language"
                                className="w-full md:w-14rem"
                                name="language_id"
                                onChange={handleChangeCourse}
                                value={course.language_id}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <div className="d-flex mt-2 align-items-center">
                                <Checkbox
                                    id="organizationId"
                                    name="organization_id"
                                    value=""
                                />
                                <label
                                    htmlFor="organizationId"
                                    className="ms-2"
                                >
                                    Part of your organization
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="my-2 row">
                        <div className="col-md-3 p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">$</span>
                            <InputNumber
                                placeholder="Price"
                                name="price"
                                onChange={handleChangeCourse}
                                value={course.price}
                                required
                            />
                        </div>
                        <div className="col-md-3 p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <BiSolidOffer />
                            </span>
                            <InputNumber
                                placeholder="Offer Price"
                                name="offer_price"
                                onChange={handleChangeCourse}
                                value={course.offer_price}
                                required
                            />
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
                                // selected={""}
                                name="offer_expired_at"
                                onChange={handleChangeCourse}
                                value={course.offer_expired_at}
                                required
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
                                // selected={""}
                                name="published_at"
                                onChange={handleChangeCourse}
                                value={course.published_at}
                                required
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
                                    <input
                                        id="thumbnailUpload"
                                        type="file"
                                        name="thumbnail"
                                        onChange={handleChangeCourseThumbnail}
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
                            type="submit"
                            loading={formLoading}
                            ref={submitBtn}
                            rounded={true}
                            raised={true}
                        />
                    </div>
                </form>
                <hr />
                <div className="col-md-3">
                    <h5>Course Thumbnail Image</h5>
                    <img
                        src={
                            thumbnailImage
                                ? thumbnailImage
                                : "https://placehold.co/600x400/EEE/31343C"
                        }
                        className="thumbnail-image course"
                        alt="thumbnail"
                    />
                </div>
            </div>
        </DashboardTemplate>
    );
}
