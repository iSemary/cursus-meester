import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { MdOutlineTitle } from "react-icons/md";
import { AiOutlineLink } from "react-icons/ai";
import { BiCategoryAlt, BiSolidImage } from "react-icons/bi";
import { Dropdown } from "primereact/dropdown";
import { GrStatusGoodSmall } from "react-icons/gr";
import { InputTextarea } from "primereact/inputtextarea";
import { ImFileText2 } from "react-icons/im";
import axiosConfig from "../../../components/axiosConfig/axiosConfig";

export default function FormEditor({
    organization,
    setOrganization,
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

    const [industries, setIndustries] = useState([]);
    const [thumbnailImage, setThumbnailImage] = useState(organization.logo);

    const handleChangeOrganization = (e) => {
        const { name, value } = e.target;
        setOrganization({
            ...organization,
            [name]: value,
        });
    };

    const handleChangeThumbnail = (e) => {
        const file = e.target.files[0];
        setOrganization({
            ...organization,
            logo: file,
        });
        setThumbnailImage(URL.createObjectURL(file));
    };

    useEffect(() => {
        axiosConfig
            .get(process.env.NEXT_PUBLIC_API_URL + "/industries?all=true")
            .then((response) => {
                setIndustries(response.data.data.industries);
            });
    }, []);


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
                        placeholder="Name"
                        name="name"
                        onChange={handleChangeOrganization}
                        value={organization.name}
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
                        onChange={handleChangeOrganization}
                        value={organization.slug}
                        required
                    />
                </div>
                <div className="col-md-12 mt-2 p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <ImFileText2 />
                    </span>
                    <InputTextarea
                        placeholder="Description"
                        name="description"
                        onChange={handleChangeOrganization}
                        value={organization.description}
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
                        onChange={handleChangeOrganization}
                        value={organization.status}
                        required
                    />
                </div>
                <div className="col-md-3 mt-2 p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <BiCategoryAlt />
                    </span>{" "}
                    <Dropdown
                        options={industries}
                        optionLabel="title"
                        optionValue="id"
                        placeholder="Industry"
                        className="w-full md:w-14rem"
                        name="industry_id"
                        onChange={handleChangeOrganization}
                        value={organization.industry_id}
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
                            Upload Logo
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
                        className="thumbnail-image organization"
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
