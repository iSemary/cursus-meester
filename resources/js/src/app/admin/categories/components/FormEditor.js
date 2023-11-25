import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { MdOutlineTitle } from "react-icons/md";
import { AiOutlineLink } from "react-icons/ai";
import { BiCategoryAlt, BiSolidImage } from "react-icons/bi";
import { Dropdown } from "primereact/dropdown";
import { GrStatusGoodSmall } from "react-icons/gr";
import { FaSortNumericDown } from "react-icons/fa";

export default function FormEditor({
    category,
    setCategory,
    parentCategories,
    setParentCategories,
    formLoading,
    handleSubmitForm,
    btnLabel,
}) {
    const statues = [
        {
            id: 1,
            title: "Active",
        },
        {
            id: 0,
            title: "In Active",
        },
    ];

    const [thumbnailImage, setThumbnailImage] = useState(category.icon);

    const handleChangeCategory = (e) => {
        const { name, value } = e.target;
        setCategory({
            ...category,
            [name]: value,
        });
    };

    const handleChangeThumbnail = (e) => {
        const file = e.target.files[0];
        setCategory({
            ...category,
            icon: file,
        });
        setThumbnailImage(URL.createObjectURL(file));
    };

    return (
        <form
            method="POST"
            encType="multipart/form-data"
            onSubmit={handleSubmitForm}
        >
            <div className="my-2 row">
                <div className="col-md-6 p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <MdOutlineTitle />
                    </span>
                    <InputText
                        placeholder="Title"
                        name="title"
                        onChange={handleChangeCategory}
                        value={category.title}
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
                        onChange={handleChangeCategory}
                        value={category.slug}
                        required
                    />
                </div>
                <div className="col-md-3 mt-2 p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <FaSortNumericDown />
                    </span>
                    <InputText
                        placeholder="Order Number"
                        name="order_number"
                        onChange={handleChangeCategory}
                        value={category.order_number}
                        required
                    />
                </div>
                <div className="col-md-3 mt-2 p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <GrStatusGoodSmall />
                    </span>{" "}
                    <Dropdown
                        options={statues}
                        optionLabel="title"
                        optionValue="id"
                        placeholder="Status"
                        className="w-full md:w-14rem"
                        name="status"
                        onChange={handleChangeCategory}
                        value={category.status}
                        required
                    />
                </div>
                <div className="col-md-3 mt-2 p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <BiCategoryAlt />
                    </span>{" "}
                    <Dropdown
                        options={parentCategories}
                        optionLabel="title"
                        optionValue="id"
                        placeholder="Parent Category"
                        className="w-full md:w-14rem"
                        name="parent_id"
                        onChange={handleChangeCategory}
                        value={category.parent_id}
                    />
                </div>
                <div className="col-md-3 mt-2 p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <BiSolidImage />
                    </span>
                    <div className="upload-thumbnail">
                        <label
                            htmlFor="thumbnailUpload"
                            className="p-button border-left-0"
                        >
                            Upload Icon
                            <input
                                id="thumbnailUpload"
                                type="file"
                                name="icon"
                                onChange={handleChangeThumbnail}
                                accept="image/png, image/jpg, image/jpeg"
                            />
                        </label>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-3">
                    <img
                        src={
                            thumbnailImage
                                ? thumbnailImage
                                : "https://placehold.co/160x160/EEE/31343C"
                        }
                        className="thumbnail-image category"
                        width={160}
                        height={160}
                        alt="thumbnail"
                    />
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
