import axios from "axios";
import React, { useEffect, useState } from "react";

export default function CountrySelector({
    defaultValue = "",
    className = "",
    name = "country_id",
    id = "countryId",
    onChange = null,
    required = false,
}) {
    const [countries, setCountries] = useState([]);
    useEffect(() => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + "/countries?all=true")
            .then((response) => {
                if (response.data.status === 200) {
                    setCountries(response.data.data.countries);
                }
            });
    }, []);
    return (
        <select
            className={"form-control " + className}
            name={name}
            id={id}
            onChange={onChange}
            required={required ? "required" : ""}
        >
            <option value="">Select your country</option>
            {countries &&
                countries.map((country, index) => {
                    return (
                        <option
                            value={country.id}
                            selected={
                                defaultValue === country.id ? "selected" : ""
                            }
                        >
                            {country.name}
                        </option>
                    );
                })}
        </select>
    );
}
