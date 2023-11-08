"use client";
import ActionColumn from "../helpers/ActionColumn";
import DashboardTemplate from "../../Templates/DashboardTemplate";
import DashboardTitle from "../../layouts/dashboard/DashboardTitle";
import { Grid, html } from "gridjs-react";
import { Token } from "../../components/utilities/Authentication/Token";

export default function viewCourses() {
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
                            course.price,
                            course.price,
                            course.price,
                            null,
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
                ]}
            />
        </DashboardTemplate>
    );
}
