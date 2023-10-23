import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActionColumn from "../helpers/ActionColumn";
import DashboardTemplate from "../../Templates/DashboardTemplate";
import DashboardTitle from "../../layouts/dashboard/DashboardTitle";

export default function viewCourses({ params }) {
    const courses = [
        {
            name: "Course 1",
            slug: "course-1",
            final_price: "$500",
            original_price: "$500",
            action: <ActionColumn id="1" type="course" />,
        },
        {
            name: "Course 1",
            slug: "course-1",
            final_price: "$500",
            original_price: "$500",
            action: <ActionColumn id="2" type="course" />,
        },
    ];

    return (
        <DashboardTemplate>
            <DashboardTitle
                title="Courses"
                path={[{ label: "Courses", url: "/dashboard/courses" }]}
            />
            <DataTable value={courses} tableStyle={{ minWidth: "50rem" }}>
                <Column field="name" header="Name"></Column>
                <Column field="slug" header="Slug"></Column>
                <Column field="final_price" header="Final Price"></Column>
                <Column field="original_price" header="Original Price"></Column>
                <Column field="action" header="Actions"></Column>
            </DataTable>
        </DashboardTemplate>
    );
}
