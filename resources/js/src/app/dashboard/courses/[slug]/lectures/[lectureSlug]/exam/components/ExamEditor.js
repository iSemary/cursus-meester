import React from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { BsPatchPlus, BsPatchQuestion } from "react-icons/bs";
import { ImFileText2 } from "react-icons/im";
import { MdOutlineTitle } from "react-icons/md";
import { Checkbox } from "primereact/checkbox";

export default function ExamEditor({
    exam,
    setExam,
    examQuestions,
    setExamQuestions,
    formLoading,
    handleSubmitForm,
    btnLabel,
}) {
    const questionOptions = [
        { id: 1, title: "Open Answer" },
        { id: 2, title: "Single Option" },
        { id: 3, title: "Multiple Options" },
    ];

    const handleChangeExam = (e) => {
        const { name, value } = e.target;
        setExam({
            ...exam,
            [name]: value,
        });
    };

    const handleChangeQuestionType = (e, i) => {
        const { value } = e.target;
        const updatedQuestions = [...examQuestions];
        updatedQuestions[i].type = value;
        setExamQuestions(updatedQuestions);
    };

    const handleChangeQuestionTitle = (e, i) => {
        const { value } = e.target;
        const updatedQuestions = [...examQuestions];
        updatedQuestions[i].title = value;
        setExamQuestions(updatedQuestions);
    };

    const addNewQuestion = () => {
        setExamQuestions((prevQuestions) => [
            ...prevQuestions,
            { title: "", type: 1 },
        ]);
    };

    const removeQuestion = (index) => {
        const updatedQuestions = [...examQuestions];
        updatedQuestions.splice(index, 1);
        setExamQuestions(updatedQuestions);
    };

    return (
        <form method="POST" onSubmit={handleSubmitForm}>
            {/* Exam Details Section */}
            <div className="my-2 row">
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
                    <h4>Question #{i + 1}</h4>
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
                                name="type"
                                onChange={(e) => handleChangeQuestionType(e, i)}
                                value={examQuestion.type}
                                required
                            />
                        </div>

                        {/* Remove Question Button */}
                        <div className="col-md-2">
                            <Button
                                icon="pi pi-trash"
                                onClick={() => removeQuestion(i)}
                                className="p-button-danger"
                                type="button"
                            />
                        </div>
                    </div>

                    {/* Question Choices [if exists or if question type is 2/3] */}
                    {examQuestion.options && examQuestion.options.length ? (
                        <div className="mt-3 d-flex flex-wrap justify-content-center gap-3">
                            {examQuestion.options.map((option, i) => (
                                <div className="d-flex align-items-center">
                                    <Checkbox
                                        inputId={"choice" + i}
                                        name="option"
                                        value={option.title}
                                    />
                                    <label
                                        inputId={"choice" + i}
                                        className="mx-1"
                                    >
                                        {option.title}
                                    </label>
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
