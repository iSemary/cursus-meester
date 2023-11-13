import React from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { BsPatchPlus, BsPatchQuestion } from "react-icons/bs";
import { ImFileText2 } from "react-icons/im";
import { MdOutlineTitle } from "react-icons/md";
import { Checkbox } from "primereact/checkbox";
import { ToggleButton } from "primereact/togglebutton";
import axiosConfig from "../../../../../../../components/axiosConfig/axiosConfig";
import toastAlert from "../../../../../../../components/utilities/Alert";

export default function ExamEditor({
    exam,
    setExam,
    examQuestions,
    setExamQuestions,
    formLoading,
    handleSubmitForm,
    btnLabel,
}) {
    // Default Options used for creating a new single/choice question
    const initialOptions = [
        {
            valid_answer: 1,
            title: "Yes",
            order_number: 1,
        },
        {
            valid_answer: 0,
            title: "No",
            order_number: 2,
        },
        {
            valid_answer: 0,
            title: "Other",
            order_number: 3,
        },
        {
            valid_answer: 0,
            title: "All the above",
            order_number: 4,
        },
    ];

    // Question options
    const questionOptions = [
        { id: 1, title: "Open Answer" },
        { id: 2, title: "Single Option" },
        { id: 3, title: "Multiple Options" },
    ];

    /** Change current exam [title or description]  */
    const handleChangeExam = (e) => {
        const { name, value } = e.target;
        setExam({
            ...exam,
            [name]: value,
        });
    };

    /** Update question title */
    const handleChangeQuestionTitle = (e, i) => {
        const { value } = e.target;
        const updatedQuestions = [...examQuestions];
        updatedQuestions[i].title = value;
        setExamQuestions(updatedQuestions);
    };

    /** Update question option */
    const handleChangeQuestionOption = (e, questionId, optionId) => {
        const { value } = e.target;
        const updatedQuestions = [...examQuestions];
        updatedQuestions.find((question) => question.id === questionId).options[
            optionId
        ] = value;
        setExamQuestions(updatedQuestions);
    };

    /** Update question option */
    const handleChangeQuestionOptionValid = (e, questionId, optionId) => {
        const updatedQuestions = [...examQuestions];
        // check if it's a single choice option
        // then set the other choices as invalid
        if (currentQuestion.type == 2) {
            updatedQuestions
                .find((question) => question.id === questionId)
                .options.forEach((option) => {
                    option.valid_answer = 0;
                });

            updatedQuestions.find(
                (question) => question.id === questionId
            ).options[optionId].valid_answer = 1;
        } else {
            // update the current option with opposite of the current option [if the current option is 1 then make it 0]
            // Note: +true => 1 | +false => 0 [Bool to int conversion]
            const currentQuestion = updatedQuestions.find(
                (question) => question.id === questionId
            );
            updatedQuestions.find(
                (question) => question.id === questionId
            ).options[optionId].valid_answer =
                +!currentQuestion.options[optionId].valid_answer;
        }

        setExamQuestions(updatedQuestions);
    };

    /** Update question type */
    const handleChangeQuestionType = (e, i) => {
        const { value } = e.target;
        const updatedQuestions = [...examQuestions];
        updatedQuestions[i].type = value;
        // check if the changed question type is single or multiple choice
        // then append empty options to the new state
        // else remove the options key from the object [as it's an open answer]
        if (value == 2 || value == 3) {
            updatedQuestions[i].options = initialOptions;
        } else {
            delete updatedQuestions[i].options;
        }
        setExamQuestions(updatedQuestions);
    };

    /** Create a new question in the current exam with type [open answer] */
    const addNewQuestion = () => {
        setExamQuestions((prevQuestions) => [
            ...prevQuestions,
            { id: -prevQuestions.length, title: "New Question", type: 1 },
        ]);
    };

    /** Remove the selected question */
    const removeQuestion = (index, questionId) => {
        if (questionId > 0) {
            axiosConfig
                .delete(`exams/${exam.id}/questions/${questionId}`)
                .then((response) => {})
                .catch((error) => {
                    toastAlert(error, "error");
                });
        }
        const updatedQuestions = [...examQuestions];
        updatedQuestions.splice(index, 1);
        setExamQuestions(updatedQuestions);
    };

    return (
        <form method="POST" onSubmit={handleSubmitForm}>
            {/* Exam Details Section */}
            <div className="my-2 row">
                <div className="mb-3 col-md-12 text-right">
                    <ToggleButton
                        onLabel="Active"
                        offLabel="Inactive"
                        onIcon="pi pi-check"
                        offIcon="pi pi-times"
                        name="status"
                        checked={exam.status}
                        onChange={handleChangeExam}
                        className="w-9rem rounded-5"
                    />
                </div>
                <div className="col-md-12 p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <MdOutlineTitle />
                    </span>
                    <InputText
                        placeholder="Exam Title"
                        name="title"
                        onChange={handleChangeExam}
                        value={exam.title}
                        required
                    />
                </div>
                <div className="col-md-12 mt-1 p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <ImFileText2 />
                    </span>
                    <InputTextarea
                        placeholder="Exam Description"
                        name="description"
                        onChange={handleChangeExam}
                        value={exam.description}
                        required
                    />
                </div>
            </div>
            <hr />

            {/* Title, Add new question button */}
            <div className="row">
                <div className="col-6">
                    <h3>Exam Questions</h3>
                </div>
                <div className="col-6 text-right">
                    <Button
                        label="Add New Question"
                        onClick={addNewQuestion}
                        icon={
                            <BsPatchPlus className="me-2 text-white f-bold" />
                        }
                        type="button"
                    />
                </div>
            </div>

            {/* Questions Section */}
            {examQuestions.map((examQuestion, i) => (
                <div key={i}>
                    <h4>
                        Question #{i + 1}
                        &nbsp;
                        <small className="text-muted">
                            {
                                questionOptions.find(
                                    (option) => option.id === examQuestion.type
                                ).title
                            }
                        </small>
                    </h4>
                    {/* Question Title */}
                    <div className="my-2 row">
                        {/* Question Title */}
                        <div className="col-md-12 p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <MdOutlineTitle />
                            </span>
                            <InputTextarea
                                placeholder="Question Title"
                                name={`title[${i}]`}
                                onChange={(e) =>
                                    handleChangeQuestionTitle(e, i)
                                }
                                value={examQuestion.title}
                                required
                            />
                        </div>
                    </div>

                    {/* Question Type */}
                    <div className="my-2 row">
                        <div className="col-md-4 p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <BsPatchQuestion />
                            </span>
                            <Dropdown
                                options={questionOptions}
                                optionLabel="title"
                                optionValue="id"
                                placeholder="Question Type"
                                className="w-full md:w-14rem"
                                name={`type[${i}]`}
                                onChange={(e) => handleChangeQuestionType(e, i)}
                                value={examQuestion.type}
                                required
                            />
                        </div>

                        {/* Remove Question Button */}
                        <div className="col-md-2">
                            <Button
                                icon="pi pi-trash"
                                onClick={() =>
                                    removeQuestion(i, examQuestion.id)
                                }
                                className="p-button-danger"
                                type="button"
                            />
                        </div>
                    </div>

                    {/* Question Choices [if exists or if question type is 2/3] */}
                    {examQuestion.options && examQuestion.options.length ? (
                        <div className="row question-options-container">
                            <h6 className="my-2 text-center text-muted">
                                Question Choices
                            </h6>
                            {examQuestion.options.map((option, optionId) => (
                                <div className="col-3 d-flex position-relative question-option px-2">
                                    <InputTextarea
                                        inputId={"choice" + examQuestion.id}
                                        name={`options[${examQuestion.id}][${optionId}]`}
                                        onChange={(e) =>
                                            handleChangeQuestionOption(
                                                e,
                                                examQuestion.id,
                                                optionId
                                            )
                                        }
                                        className="w-100"
                                        value={option.title}
                                    />
                                    <input
                                        type={
                                            examQuestion.type == 2
                                                ? "radio"
                                                : "checkbox"
                                        }
                                        checked={
                                            option.valid_answer ? "checked" : ""
                                        }
                                        onChange={(e) =>
                                            handleChangeQuestionOptionValid(
                                                e,
                                                examQuestion.id,
                                                optionId
                                            )
                                        }
                                        name={`valid_answer[${examQuestion.id}][${optionId}]`}
                                        className="me-3 position-absolute question-option-input"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        ""
                    )}
                    <hr />
                </div>
            ))}

            {/* Save Button */}
            <div className="text-right">
                <Button
                    label={btnLabel}
                    icon="pi pi-save"
                    type="submit"
                    loading={formLoading}
                    rounded={true}
                    raised={true}
                />
            </div>
        </form>
    );
}
