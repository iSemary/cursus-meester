"use client";
import React from "react";
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

export default function Languages() {
    const dropDownItems = (id) => [
        {
            label: "Delete",
            icon: "pi pi-trash",
            command: () => {
                handleDeleteLanguage(id);
            },
        },
    ];

    /** Delete course by slug */
    const handleDeleteLanguage = (slug) => {
        Swal.fire({
            title: "Are you sure you want to delete this language?",
            showCancelButton: true,
            confirmButtonText: "Delete",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return axiosConfig
                    .delete("/languages/" + slug)
                    .then((response) => {
                        return true;
                    })
                    .catch((error) => {
                        Swal.showValidationMessage(`Something went wrong`);
                    });
            },
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                toastAlert("Language deleted successfully", "success");
            }
        });
    };
    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Languages"
                path={[{ label: "Languages", url: "/admin/languages" }]}
                buttons={[
                    <Link href="/admin/languages/create">
                        <Button label="Create" size="small" />
                    </Link>,
                ]}
            ></DashboardTitle>
            <Grid
                server={{
                    url: `${process.env.NEXT_PUBLIC_API_URL}/languages`,
                    headers: {
                        Authorization: "Bearer " + Token.get(),
                    },
                    then: (data) =>
                        data.data.languages.data.map((language) => [
                            language.name,
                            language.key,
                            language.id,
                        ]),
                    total: (data) => data.data.languages.total,
                }}
                pagination={{
                    limit: 5,
                    server: {
                        url: (prev, page, limit) => `${prev}?page=${page}`,
                    },
                }}
                columns={[
                    "Name",
                    "Key",
                    {
                        name: "Actions",
                        formatter: (cell, row) => {
                            return _(
                                <SplitButton
                                    label={
                                        <Link
                                            href={
                                                "/admin/languages/edit/" +
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
