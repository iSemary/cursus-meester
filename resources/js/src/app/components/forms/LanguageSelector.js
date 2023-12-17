import axios from "axios";
import React, { useEffect, useState } from "react";

export default function LanguageSelector({
    defaultValue = "",
    className = "",
    name = "language_id",
    id = "language",
    required = false,
}) {
    const [languages, setLanguages] = useState([]);
    useEffect(() => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + "/languages?all=true")
            .then((response) => {
                if (response.data.status === 200) {
                    setLanguages(response.data.data.languages);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
    return (
        <select
            className={"form-control " + className}
            name={name}
            id={id}
            required={required ? "required" : ""}
        >
            <option value="">Select your language</option>
            {languages &&
                languages.map((language, index) => {
                    return (
                        <option
                            value={language.id}
                            selected={
                                defaultValue === language.id ? "selected" : ""
                            }
                        >
                            {language.name}
                        </option>
                    );
                })}
        </select>
    );
}
