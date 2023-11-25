import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { MdOutlineTitle } from "react-icons/md";
import { AiOutlineLink } from "react-icons/ai";
import { InputTextarea } from "primereact/inputtextarea";
import { ImFileText2 } from "react-icons/im";

export default function FormEditor({
    industry,
    setIndustry,
    formLoading,
    handleSubmitForm,
    btnLabel,
}) {
    const handleChangeIndustry = (e) => {
        const { name, value } = e.target;
        setIndustry({
            ...industry,
            [name]: value,
        });
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
                        onChange={handleChangeIndustry}
                        value={industry.title}
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
                        onChange={handleChangeIndustry}
                        value={industry.slug}
                        required
                    />
                </div>
                <div className="my-2 row">
                    <div className="col-md-12 p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <ImFileText2 />
                        </span>
                        <InputTextarea
                            placeholder="Description"
                            name="description"
                            onChange={handleChangeIndustry}
                            value={industry.description}
                            required
                        />
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
