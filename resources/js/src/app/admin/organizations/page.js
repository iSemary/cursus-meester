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

export default function Organizations() {
    const dropDownItems = (id) => [
        {
            label: "Delete",
            icon: "pi pi-trash",
            command: () => {
                handleDeleteOrganization(id);
            },
        },
    ];

    /** Delete course by slug */
    const handleDeleteOrganization = (slug) => {
        Swal.fire({
            title: "Are you sure you want to delete this organization?",
            showCancelButton: true,
            confirmButtonText: "Delete",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return axiosConfig
                    .delete("/organizations/" + slug)
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
                toastAlert("Organization deleted successfully", "success");
            }
        });
    };
    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Organizations"
                path={[{ label: "Organizations", url: "/admin/organizations" }]}
                buttons={[
                    <Link href="/admin/organizations/create">
                        <Button label="Create" size="small" />
                    </Link>,
                ]}
            ></DashboardTitle>
            <Grid
                server={{
                    url: `${process.env.NEXT_PUBLIC_API_URL}/organizations`,
                    headers: {
                        Authorization: "Bearer " + Token.get(),
                    },
                    then: (data) =>
                        data.data.organizations.data.map((organization) => [
                            organization.name,
                            organization.slug,
                            organization.id,
                        ]),
                    total: (data) => data.data.organizations.total,
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
                                                "/admin/organizations/edit/" +
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
