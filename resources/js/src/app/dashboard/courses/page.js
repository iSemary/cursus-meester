"use client";
import { SplitButton } from "primereact/splitbutton";
import DashboardTemplate from "../../Templates/DashboardTemplate";
import DashboardTitle from "../../layouts/dashboard/DashboardTitle";
import { Grid, html } from "gridjs-react";
import { _ } from "gridjs-react";
import { Token } from "../../components/utilities/Authentication/Token";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axiosConfig from "../../components/axiosConfig/axiosConfig";
import toastAlert from "../../components/utilities/Alert";
export default function viewCourses() {
    const router = useRouter();
    /** Split button items */
    const dropDownItems = (slug) => [
        {
            label: "Edit",
            icon: "pi pi-file-edit",
            command: () => {
                router.push(`/dashboard/courses/${slug}/edit`);
            },
        },
        {
            label: "Delete",
            icon: "pi pi-trash",
            command: () => {
                handleDeleteCourse(slug);
            },
        },
    ];
    /** Delete course by slug */
    const handleDeleteCourse = (slug) => {
        Swal.fire({
            title: "Are you sure you want to delete this course?",
            showCancelButton: true,
            confirmButtonText: "Delete",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return axiosConfig
                    .delete("/courses/" + slug)
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
                toastAlert("Course deleted successfully", "success");
            }
        });
    };

    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Courses"
                path={[{ label: "Courses", url: "/dashboard/courses" }]}
            />
            <Grid
                server={{
                    url: `${process.env.NEXT_PUBLIC_API_URL}/courses`,
                    headers: {
                        Authorization: "Bearer " + Token.get(),
                    },
                    then: (data) =>
                        data.data.courses.data.map((course) => [
                            course.title,
                            course.slug,
                            course.total_lectures,
                            course.price,
                            course.final_price,
                            course.status,
                        ]),
                    total: (data) => data.data.courses.total,
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
                    "Total Lectures",
                    "Final Price",
                    "Original Price",
                    "Status",
                    {
                        name: "Actions",
                        formatter: (cell, row) => {
                            return _(
                                <SplitButton
                                    label={
                                        <Link
                                            href={
                                                "/courses/" + row.cells[1].data
                                            }
                                            target="_blank"
                                            className="text-white no-link"
                                        >
                                            View
                                        </Link>
                                    }
                                    raised
                                    rounded
                                    model={dropDownItems(row.cells[1].data)}
                                />
                            );
                        },
                    },
                ]}
            />
        </DashboardTemplate>
    );
}
