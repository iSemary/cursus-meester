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
import i18next from "../../components/utilities/i18next";

export default function Wordings() {
    const dropDownItems = (id) => [
        {
            label: "Delete",
            icon: "pi pi-trash",
            command: () => {
                handleDeleteWording(id);
            },
        },
    ];

    const handleGenerateJsonFiles = () => {
        axiosConfig
            .get("wordings/generate")
            .then((response) => {
                toastAlert(response.data.message, "success");
            })
            .catch(({ response }) => {
                toastAlert(response.data.message, "error");
            });
    };

    /** Delete course by slug */
    const handleDeleteWording = (slug) => {
        Swal.fire({
            title: "Are you sure you want to delete this wording?",
            showCancelButton: true,
            confirmButtonText: "Delete",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return axiosConfig
                    .delete("/wordings/" + slug)
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
                toastAlert("Wording deleted successfully", "success");
            }
        });
    };
    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Wordings"
                path={[{ label: "Wordings", url: "/admin/wordings" }]}
                buttons={[
                    <Button
                        severity="success"
                        className="mx-2"
                        label="Generate"
                        onClick={handleGenerateJsonFiles}
                        size="small"
                    />,
                    <Link href="/admin/wordings/create">
                        <Button
                            label="Create"
                            size="small"
                        />
                    </Link>,
                ]}
            />
            <Grid
                server={{
                    url: `${process.env.NEXT_PUBLIC_API_URL}/wordings`,
                    headers: {
                        Authorization: "Bearer " + Token.get(),
                    },
                    then: (data) =>
                        data.data.wordings.data.map((wording) => [
                            wording.wording_key,
                            wording.wording_value,
                            wording.language?.name,
                            wording.id,
                        ]),
                    total: (data) => data.data.wordings.total,
                }}
                pagination={{
                    limit: 5,
                    server: {
                        url: (prev, page, limit) => `${prev}?page=${page}`,
                    },
                }}
                columns={[
                    "Key",
                    "Value",
                    "Language",
                    {
                        name: "Actions",
                        formatter: (cell, row) => {
                            return _(
                                <SplitButton
                                    label={
                                        <Link
                                            href={
                                                "/admin/wordings/edit/" +
                                                row.cells[3].data
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
