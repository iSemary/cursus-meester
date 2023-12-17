"use client";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { InputText } from "primereact/inputtext";
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

export default function FormEditor({
    course,
    setCourse,
    setThumbnailImage,
    formLoading,
    setFormLoading,
    handleSubmitCourse,
    btnLabel,
}) {
    const [categories, setCategories] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [levels, setLevels] = useState([]);

    const handleChangeCourse = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case "offer_price":
                setCourse({
                    ...course,
                    offer_price: !course.offer_price,
                });
                break;
            case "has_certificate":
                setCourse({
                    ...course,
                    has_certificate: !course.has_certificate,
                });
                break;
            case "organization_id":
                setCourse({
                    ...course,
                    organization_id: !course.organization_id,
                });
                break;
            default:
                setCourse({
                    ...course,
                    [name]: value,
                });
                break;
        }
    };

    const handleCourseContentChange = (event, editor) => {
        const data = editor.getData();
        setCourse({ ...course, content: data });
    };

    const handleChangeCourseThumbnail = (e) => {
        const file = e.target.files[0];
        setCourse({
            ...course,
            thumbnail: file,
        });
        setThumbnailImage(URL.createObjectURL(file));
    };

    const handleOfferExpiredDateChange = (date) => {
        setCourse({
            ...course,
            offer_expired_at: date,
        });
    };

    const handlePublishedDateChange = (date) => {
        setCourse({
            ...course,
            published_at: date,
        });
    };

    useEffect(() => {
        // Get essentials data for creating new course
        axiosConfig
            .get("courses/create")
            .then((response) => {
                setCategories(response.data.data.data.categories);
                setLanguages(response.data.data.data.languages);
                setLevels(response.data.data.data.levels);
            })
            .catch(({ response }) => {
                console.log(response, "error");
            });
    }, []);

    return (
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
                            data={course.content}
                            onChange={handleCourseContentChange}
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
                        optionValue="id"
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
                        <label htmlFor="organizationId" className="d-flex ms-2">
                            <input
                                type="checkbox"
                                className="p-checkbox-box"
                                id="organizationId"
                                name="organization_id"
                                onChange={handleChangeCourse}
                                checked={course.organization_id ? true : false}
                            />
                            Part of your organization
                        </label>
                    </div>
                </div>
            </div>
            <div className="my-2 row">
                <div className="col-md-3 p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">$</span>
                    <InputText
                        type="number"
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
                    <InputText
                        type="number"
                        placeholder="Offer Percentage"
                        name="offer_percentage"
                        min="0"
                        max="100"
                        step="0.01"
                        onChange={handleChangeCourse}
                        value={course.offer_percentage}
                        required={course.offer_price ? "required" : ""}
                    />
                </div>
                <div className="col-md-3">
                    <ToggleButton
                        checked={course.offer_price}
                        onLabel={"Enable Offer"}
                        className="w-100"
                        name="offer_price"
                        onChange={handleChangeCourse}
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
                        name="offer_expired_at"
                        dateFormat="yyyy-MM-dd"
                        onChange={handleOfferExpiredDateChange}
                        selected={
                            course.offer_expired_at
                                ? new Date(course.offer_expired_at)
                                : ""
                        }
                        required
                    />
                </div>
            </div>
            <hr className="w-50 m-auto my-5" />
            <div className="my-2 row">
                <div className="col-md-3">
                    <ToggleButton
                        checked={course.has_certificate}
                        onLabel={"Enable Certificate"}
                        className="w-100"
                        name="has_certificate"
                        onChange={handleChangeCourse}
                        onIcon="pi pi-check"
                        offIcon="pi pi-times"
                        offLabel={"Disable Certificate"}
                    />
                </div>{" "}
                <div className="col-md-3 p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <LuCalendarCheck />
                    </span>
                    <DatePicker
                        className="p-inputtext w-100"
                        placeholderText="Publish Date"
                        name="published_at"
                        dateFormat="yyyy-MM-dd"
                        onChange={handlePublishedDateChange}
                        selected={
                            course.published_at
                                ? new Date(course.published_at)
                                : ""
                        }
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
                    label={btnLabel}
                    icon="pi pi-save"
                    type="submit"
                    loading={formLoading}
                    rounded={true}
                    raised={true}
                />
            </div>
        </form>
    );
}
