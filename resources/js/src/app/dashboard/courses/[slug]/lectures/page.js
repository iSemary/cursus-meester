"use client";
import { SplitButton } from "primereact/splitbutton";
import DashboardTemplate from "../../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../../layouts/dashboard/DashboardTitle";
import { Grid } from "gridjs-react";
import { _ } from "gridjs-react";
import { Token } from "../../../../components/utilities/Authentication/Token";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axiosConfig from "../../../../components/axiosConfig/axiosConfig";
import toastAlert from "../../../../components/utilities/Alert";
import { MdRestore } from "react-icons/md";
import { useState } from "react";
export default function viewLectures({ params }) {
    const router = useRouter();
    const [reloadKey, setReloadKey] = useState(0);

    /** Split button items */
    const dropDownItems = (row) => [
        {
            label: "Add Exam",
            icon: "pi pi-file",
            command: () => {
                // Add or edit exam
                router.push(
                    `/dashboard/courses/${params.slug}/lectures/${row.cells[1].data}/exam/editor`
                );
            },
        },
        {
            // Edit lecture
            label: "Edit",
            icon: "pi pi-file-edit",
            command: () => {
                router.push(
                    `/dashboard/courses/${params.slug}/lectures/${row.cells[1].data}/edit`
                );
            },
        },
        {
            // Restore or delete lecture
            label: row.cells[6].data ? "Restore" : "Delete",
            icon: row.cells[6].data ? (
                <MdRestore className="dropdown-icon" />
            ) : (
                "pi pi-trash"
            ),
            command: () => {
                row.cells[6].data
                    ? handleRestoreLecture(row.cells[1].data)
                    : handleDeleteLecture(row.cells[1].data);
            },
        },
    ];
    /** Delete lecture by slug */
    const handleDeleteLecture = (slug) => {
        Swal.fire({
            title: "Are you sure you want to delete this lecture?",
            showCancelButton: true,
            confirmButtonText: "Delete",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return axiosConfig
                    .delete("/lectures/" + slug)
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
                toastAlert("Lecture deleted successfully", "success");
            }
        });
    };

    /** Restore lecture by slug */
    const handleRestoreLecture = (slug) => {
        Swal.fire({
            title: "Are you sure you want to restore this lecture?",
            showCancelButton: true,
            confirmButtonText: "Restore",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return axiosConfig
                    .post("/lectures/restore/" + slug)
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
                toastAlert("Lecture restored successfully", "success");
            }
        });
    };

    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Lectures"
                path={[
                    { label: "Courses", url: "/dashboard/courses" },
                    { label: params.slug },
                    { label: "Lectures" },
                ]}
            />
            <Grid
                key={reloadKey}
                server={{
                    url: `${process.env.NEXT_PUBLIC_API_URL}/courses/${params.slug}/lectures`,
                    headers: {
                        Authorization: "Bearer " + Token.get(),
                    },
                    then: (data) =>
                        data.data.lectures.data.map((lecture) => [
                            lecture.title,
                            lecture.slug,
                            lecture.order_number,
                            lecture.total_files,
                            lecture.has_exam,
                            lecture.status,
                            lecture.deleted_at,
                        ]),
                    total: (data) => data.data.lectures.total,
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
                    "Order Number",
                    "Lecture Files",
                    {
                        name: "Contains Exam",
                        formatter: (cell, row) => {
                            return row.cells[4].data === 0 ? "No" : "Yes";
                        },
                    },
                    "Status",
                    {
                        name: "Actions",
                        formatter: (cell, row) => {
                            return _(
                                <SplitButton
                                    label={
                                        <Link
                                            href={
                                                `/courses/${params.slug}/lectures/` +
                                                row.cells[1].data
                                            }
                                            target="_blank"
                                            className="text-white no-link"
                                        >
                                            View
                                        </Link>
                                    }
                                    raised
                                    rounded
                                    model={dropDownItems(row)}
                                />
                            );
                        },
                    },
                ]}
            />
        </DashboardTemplate>
    );
}
