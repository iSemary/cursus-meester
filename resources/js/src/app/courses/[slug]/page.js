import CoursePageTemplate from "../../components/template/CoursePageTemplate";

export default function Course({ params }) {
    const resources = [
        {
            title: "Front End",
            lectures: [
                {
                    title: "What is html",
                    type: 1, // video
                    length: "00:50",
                },
                {
                    title: "What is css",
                    type: 2, // media
                    length: "50 MB",
                },
                {
                    title: "What is js",
                    type: 1, // video
                    length: "00:50",
                },
            ],
        },
        {
            title: "Back End",
            lectures: [
                {
                    title: "What is php",
                    type: 1, // video
                    length: "00:50",
                },
                {
                    title: "What is mysql",
                    type: 2, // media
                    length: "50 MB",
                },
                {
                    title: "What is docker",
                    type: 1, // video
                    length: "00:50",
                },
            ],
        },
    ];

    const instructor = {
        name: "Ahmed",
        username: "ahmedali",
        total_lectures: 500,
        total_students: 152452,
    };

    const course = {
        name: "Course Name",
        description:
            "lorem course lorem course lorem course lorem course lorem course lorem course lorem course lorem course lorem course ",
        image: "https://placehold.co/600x450/png",
        rate: {
            average: 4.2,
            total: 4454852,
        },
        students: 1205156,
        last_updated: "Jul 2023",
        total_price: "500.50.",
        original_price: "700",
        currency: "$",
        total_hours: "40.5",
        total_files: "105",
        total_exercise: 5,
        requirements: "<ul><li>First</li><li>Second</li><li>Third</li></ul>",
        content:
            "<p>lorem content lorem content lorem content lorem content lorem content lorem content lorem content lorem content lorem content lorem content </p>",
        resources: resources,
        instructor: instructor,
    };
    return (
        <div className="container">
            <CoursePageTemplate course={course} />
        </div>
    );
}
