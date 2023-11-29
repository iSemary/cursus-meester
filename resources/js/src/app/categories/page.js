"use client";
import React, { useEffect, useState } from "react";
import StudentTemplate from "../Templates/StudentTemplate";
import axiosConfig from "../components/axiosConfig/axiosConfig";
import HomeCategoryTemplate from "../components/template/HomeCategoryTemplate";

export default function categories() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axiosConfig.get("categories?parents=1").then((response) => {
            setCategories(response.data.data.categories.data);
        });
    }, []);

    return (
        <StudentTemplate>
            <div className="home-categories row">
                {categories &&
                    categories.length > 0 &&
                    categories.map((category, index) => (
                        <HomeCategoryTemplate
                            category={category}
                            containerClass={"col-3"}
                        />
                    ))}
            </div>
        </StudentTemplate>
    );
}
