import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { MdOutlineTitle } from "react-icons/md";
import { AiOutlineLink } from "react-icons/ai";
import axiosConfig from "../../../components/axiosConfig/axiosConfig";
import { BiCategoryAlt } from "react-icons/bi";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";

export default function FormEditor({
    wording,
    setWording,
    formLoading,
    handleSubmitForm,
    btnLabel,
}) {
    const [languages, setLanguages] = useState([]);

    const handleChangeWording = (e) => {
        const { name, value } = e.target;
        setWording({
            ...wording,
            [name]: value,
        });
    };

    useEffect(() => {
        axiosConfig
            .get(process.env.NEXT_PUBLIC_API_URL + "/languages?all=true")
            .then((response) => {
                setLanguages(response.data.data.languages);
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
                        <AiOutlineLink />
                    </span>
                    <InputText
                        placeholder="Key"
                        name="wording_key"
                        onChange={handleChangeWording}
                        value={wording.wording_key}
                        required
                    />
                </div>
                <div className="col-md-6 mt-2 p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <BiCategoryAlt />
                    </span>{" "}
                    <Dropdown
                        options={languages}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Language"
                        className="w-full md:w-14rem"
                        name="wording_language_id"
                        onChange={handleChangeWording}
                        value={wording.wording_language_id}
                    />
                </div>
                <div className="col-md-12 mt-2 p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <MdOutlineTitle />
                    </span>
                    <InputTextarea
                        placeholder="Value"
                        name="wording_value"
                        onChange={handleChangeWording}
                        value={wording.wording_value}
                        required
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
