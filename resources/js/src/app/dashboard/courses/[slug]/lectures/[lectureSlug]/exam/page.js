import React from "react";
import DashboardTemplate from "../../../../../../Templates/DashboardTemplate";
import DashboardTitle from "../../../../../../layouts/dashboard/DashboardTitle";

export default function Exams({ params }) {
    return (
        <DashboardTemplate>
            <DashboardTitle
                title={`Edit "${params.lectureSlug}" lecture`}
                path={[
                    { label: "Courses", url: "/dashboard/courses" },
                    { label: params.slug },
                    {
                        label: "Lectures",
                        url: "/dashboard/courses/" + params.slug + "/lectures",
                    },
                    { label: params.lectureSlug },
                    { label: "Edit" },
                ]}
            />
            <ExamEditor
                lecture={lecture}
                lectureVideo={lectureVideo}
                setLectureVideo={setLectureVideo}
                lectureFiles={lectureFiles}
                setLectureFiles={setLectureFiles}
                setLecture={setLecture}
                formLoading={formLoading}
                setFormLoading={setFormLoading}
                handleSubmitLecture={handleSubmitLecture}
                btnLabel="Save"
            />
        </DashboardTemplate>
    );
}
