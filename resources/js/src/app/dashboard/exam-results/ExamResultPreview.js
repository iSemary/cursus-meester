import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import CourseListLoader from "../../components/loaders/CourseListLoader";

export default function ExamResultPreview({ exam, isShow, setShowExamModal }) {
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShowExamModal(false);
        setShow(false);
    };

    useEffect(() => {
        setShow(isShow);
    }, [isShow]);

    return exam.id ? (
        <Dialog
            visible={show}
            size="lg"
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            header={exam.title}
        >
            <div>
                <p className="my-1">{exam.description}</p>
                <div className="row questions">
                    {exam.questions && exam.questions.length > 0
                        ? exam.questions.map((question, index) => (
                              <div className="col-12 question-item" key={index}>
                                  <div className="">
                                      {/* Question Title */}
                                      <h3>{question.title}</h3>
                                      {/* Open Answer */}
                                      {question.type === 1 && (
                                          <div>
                                              {exam.can_answer
                                                  ? examResults?.answers
                                                        ?.question?.id
                                                  : question.student_answer_text}
                                          </div>
                                      )}
                                      {/* Single Choice */}
                                      <div className="row options">
                                          {question.type === 2 &&
                                              question.options &&
                                              question.options.map(
                                                  (option, i) => (
                                                      <div
                                                          className="col-3"
                                                          key={i}
                                                      >
                                                          <label
                                                              className={
                                                                  exam.can_answer
                                                                      ? ""
                                                                      : option.valid_answer
                                                                      ? "text-success font-weight-bold"
                                                                      : "text-danger"
                                                              }
                                                          >
                                                              <input
                                                                  name={`answers`}
                                                                  value={
                                                                      option.id
                                                                  }
                                                                  checked={
                                                                      exam.can_answer
                                                                          ? examResults
                                                                                ?.answers
                                                                                ?.question
                                                                                ?.id
                                                                          : question.student_answer_id ===
                                                                            option.id
                                                                          ? "checked"
                                                                          : ""
                                                                  }
                                                                  className="me-1"
                                                                  disabled={
                                                                      exam.can_answer
                                                                          ? ""
                                                                          : "disabled"
                                                                  }
                                                                  type="radio"
                                                              />
                                                              {option.title}
                                                          </label>
                                                      </div>
                                                  )
                                              )}
                                      </div>
                                      {/* Multiple Choices Inputs */}
                                      <div className="row options">
                                          {question.type === 3 &&
                                              question.options &&
                                              question.options.map(
                                                  (option, i) => (
                                                      <div
                                                          className="col-3"
                                                          key={i}
                                                      >
                                                          <label
                                                              className={
                                                                  exam.can_answer
                                                                      ? ""
                                                                      : option.valid_answer
                                                                      ? "text-success font-weight-bold"
                                                                      : "text-danger"
                                                              }
                                                          >
                                                              <input
                                                                  name={`answers[${question.id}]`}
                                                                  value={
                                                                      option.id
                                                                  }
                                                                  checked={
                                                                      exam.can_answer
                                                                          ? examResults
                                                                                ?.answers
                                                                                ?.question
                                                                                ?.id
                                                                          : question.student_answer_id.includes(
                                                                                option.id
                                                                            )
                                                                          ? "checked"
                                                                          : ""
                                                                  }
                                                                  className="me-1"
                                                                  type="checkbox"
                                                                  disabled={
                                                                      exam.can_answer
                                                                          ? ""
                                                                          : "disabled"
                                                                  }
                                                              />
                                                              {option.title}
                                                          </label>
                                                      </div>
                                                  )
                                              )}
                                      </div>
                                      {/* Line */}
                                      {index + 1 !== exam.questions.length && (
                                          <hr />
                                      )}
                                  </div>
                              </div>
                          ))
                        : "There's no questions."}
                </div>
            </div>
        </Dialog>
    ) : (
        <CourseListLoader className="py-3" />
    );
}
