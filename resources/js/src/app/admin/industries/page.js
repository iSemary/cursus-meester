"use client";
import React, { useState } from "react";
import DashboardTemplate from "../../Templates/DashboardTemplate";
import DashboardTitle from "../../layouts/dashboard/DashboardTitle";
import { Grid } from "gridjs-react";
import { _ } from "gridjs-react";
import Swal from "sweetalert2";
import axiosConfig from "../../components/axiosConfig/axiosConfig";
import { Token } from "../../components/utilities/Authentication/Token";
import Link from "next/link";
import { SplitButton } from "primereact/splitbutton";
import toastAlert from "../../components/utilities/Alert";
import { Button } from "primereact/button";

export default function Industries() {
    const [reloadKey, setReloadKey] = useState(0);
    const dropDownItems = (id) => [
        {
            label: "Delete",
            icon: "pi pi-trash",
            command: () => {
                handleDeleteIndustry(id);
            },
        },
    ];

    /** Delete course by slug */
    const handleDeleteIndustry = (slug) => {
        Swal.fire({
            title: "Are you sure you want to delete this industry?",
            showCancelButton: true,
            confirmButtonText: "Delete",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return axiosConfig
                    .delete("/industries/" + slug)
                    .then((response) => {
                        setReloadKey((prevKey) => prevKey + 1);
                        return true;
                    })
                    .catch((error) => {
                        Swal.showValidationMessage(`Something went wrong`);
                    });
            },
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                toastAlert("Industry deleted successfully", "success");
            }
        });
    };
    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Industries"
                path={[{ label: "industries", url: "/admin/industries" }]}
                buttons={[
                    <Link href="/admin/industries/create">
                        <Button label="Create" size="small" />
                    </Link>,
                ]}
            ></DashboardTitle>
            <Grid
                key={reloadKey}
                server={{
                    url: `${process.env.NEXT_PUBLIC_API_URL}/industries`,
                    headers: {
                        Authorization: "Bearer " + Token.get(),
                    },
                    then: (data) =>
                        data.data.industries.data.map((industry) => [
                            industry.title,
                            industry.slug,
                            industry.id,
                        ]),
                    total: (data) => data.data.industries.total,
                }}
                pagination={{
                    limit: 5,
                    server: {
                        url: (prev, page, limit) => `${prev}?page=${page}`,
                    },
                }}
                columns={[
                    "Name",
                    "Slug",
                    {
                        name: "Actions",
                        formatter: (cell, row) => {
                            return _(
                                <SplitButton
                                    label={
                                        <Link
                                            href={
                                                "/admin/industries/edit/" +
                                                row.cells[2].data
                                            }
                                            className="text-white no-link"
                                        >
                                            Edit
                                        </Link>
                                    }
                                    raised
                                    rounded
                                    model={dropDownItems(row.cells[2].data)}
                                />
                            );
                        },
                    },
                ]}
            />
        </DashboardTemplate>
    );
}
