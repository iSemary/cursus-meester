import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { MdOutlineTitle } from "react-icons/md";
import { AiOutlineLink } from "react-icons/ai";

export default function FormEditor({
    language,
    setLanguage,
    formLoading,
    handleSubmitForm,
    btnLabel,
}) {
    const handleChangeLanguage = (e) => {
        const { name, value } = e.target;
        setLanguage({
            ...language,
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
                        placeholder="Name"
                        name="name"
                        onChange={handleChangeLanguage}
                        value={language.name}
                        required
                    />
                </div>
                <div className="col-md-6 p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <AiOutlineLink />
                    </span>
                    <InputText
                        placeholder="Key"
                        name="key"
                        onChange={handleChangeLanguage}
                        value={language.key}
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
