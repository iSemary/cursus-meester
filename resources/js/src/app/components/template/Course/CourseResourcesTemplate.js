import { useContext, useState } from "react";
import { GoVideo } from "react-icons/go";
import { AiOutlineFile } from "react-icons/ai";
import { PiExam } from "react-icons/pi";
import Accordion from "react-bootstrap/Accordion";
import AccordionContext from "react-bootstrap/AccordionContext";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import toastAlert from "../../utilities/Alert";
import axiosConfig from "../../axiosConfig/axiosConfig";
import ExamModal from "./ExamModal";

export default function CourseResourcesTemplate({
    courseId,
    purchased,
    resources,
}) {
    const LECTURE_TYPE = 1;
    const FILE_TYPE = 2;
    const EXAM_TYPE = 3;

    const [examId, setExamId] = useState(null);
    const [showExamModal, setShowExamModal] = useState(false);

    /** Toggle List Button */
    function ContextAwareToggle({ children, eventKey, callback }) {
        const { activeEventKey } = useContext(AccordionContext);

        const decoratedOnClick = useAccordionButton(
            eventKey,
            () => callback && callback(eventKey)
        );

        const isCurrentEventKey = activeEventKey === eventKey;

        return (
            <button
                type="button"
                className={
                    " w-100 transparent-button " +
                    (isCurrentEventKey ? "text-primary" : "text-black")
                }
                onClick={decoratedOnClick}
            >
                <div className="row">
                    {children}
                    <div className="col-1">
                        {isCurrentEventKey ? (
                            <IoIosArrowDown />
                        ) : (
                            <IoIosArrowUp />
                        )}
                    </div>
                </div>
            </button>
        );
    }

    /** Load Selected Resource */
    const handleLoadResource = (id, typeId) => {
        // In case user didn't purchase the course
        if (!purchased) {
            toastAlert(
                "You have to purchase the course",
                "info",
                3000,
                "bottom"
            );
            return false;
        }
        switch (typeId) {
            case LECTURE_TYPE:
                loadLecture(id);
                break;
            case FILE_TYPE:
                downloadFile(id);
                break;
            case EXAM_TYPE:
                openExamModal(id);
                break;
            default:
                return false;
        }
    };

    /** Load Lecture Media */
    const loadLecture = (id) => {
        axiosConfig
            .get(`resources/course/${courseId}/lecture/${id}`)
            .then((response) => {})
            .catch((error) => {
                console.error(error);
            });
    };

    /** Prepare file to be downloaded */
    const downloadFile = (id) => {
        axiosConfig
            .get(`resources/course/${courseId}/file/${id}`)
            .then((response) => {
                var link = document.createElement("a");
                link.download = response.data.data.data.name;
                link.href = response.data.data.data.path;
                link.click();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    /** Open exam modal  */
    const openExamModal = (id) => {
        setExamId(id);
        setShowExamModal(true);
    };

    return (
        <>
            <ExamModal
                courseId={courseId}
                examId={examId}
                isShow={showExamModal}
                setExamId={setExamId}
                setShowExamModal={setShowExamModal}
            />
            <div className="row m-auto">
                <Accordion defaultActiveKey={0}>
                    {resources &&
                        resources.length > 0 &&
                        resources.map((resource, index) => (
                            <div
                                class={
                                    "card " +
                                    (index !== resources.length - 1 &&
                                        " border-radius-bottom-0 ") +
                                    (index !== 0 && " border-radius-top-0 ")
                                }
                                key={index}
                            >
                                <div class="card-header">
                                    <ContextAwareToggle eventKey={index}>
                                        <div className="col-11 text-left">
                                            <h6 className="font-weight-bold">
                                                {resource.section.title}
                                            </h6>
                                        </div>
                                    </ContextAwareToggle>
                                </div>
                                <Accordion.Collapse eventKey={index}>
                                    <div class="card-body">
                                        <div className="resources">
                                            {resource.section.resources &&
                                                resource.section.resources
                                                    .length > 0 &&
                                                resource.section.resources.map(
                                                    (item, i) => (
                                                        <button
                                                            type="button"
                                                            className="w-100 primary-hover transparent-button"
                                                            onClick={() =>
                                                                handleLoadResource(
                                                                    item.id,
                                                                    item.type_id
                                                                )
                                                            }
                                                            key={i}
                                                        >
                                                            <div className="row">
                                                                <div className="col-10 align-flex-center">
                                                                    {item.type_id ===
                                                                        LECTURE_TYPE && (
                                                                        <GoVideo className="mx-1" />
                                                                    )}
                                                                    {item.type_id ===
                                                                        FILE_TYPE && (
                                                                        <AiOutlineFile className="mx-1" />
                                                                    )}
                                                                    {item.type_id ===
                                                                        EXAM_TYPE && (
                                                                        <PiExam className="mx-1" />
                                                                    )}
                                                                    {item.title}
                                                                </div>
                                                                <div className="col-2 lecture-length text-right text-muted">
                                                                    <h6 className="text-14">
                                                                        {item.type_id ===
                                                                            LECTURE_TYPE &&
                                                                            item.duration}
                                                                        {item.type_id ===
                                                                            FILE_TYPE &&
                                                                            item.duration}
                                                                        {item.type_id ===
                                                                            EXAM_TYPE &&
                                                                            item.duration}
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    )
                                                )}
                                        </div>
                                    </div>
                                </Accordion.Collapse>
                            </div>
                        ))}
                </Accordion>
            </div>
        </>
    );
}
