import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axiosConfig from "../../axiosConfig/axiosConfig";
import CourseListLoader from "../../loaders/CourseListLoader";

export default function ExamModal({
    courseId,
    examId,
    isShow,
    setExamId,
    setShowExamModal,
}) {
    const [exam, setExam] = useState({});
    const [show, setShow] = useState(false);
    const [examResults, setExamResults] = useState([]);

    const handleClose = () => {
        setExamId(null);
        setShowExamModal(false);
        setShow(false);
        setExam({});
    };

    const handleChangeExam = (e, questionId) => {
        const { name, value } = e.target;
        setExamResults({
            ...examResults,
            [questionId]: value,
        });
    };

    const handleChangeSingleOption = (e, questionId) => {
        const { name, value } = e.target;
        setExamResults({
            ...examResults,
            [questionId]: value,
        });
    };

    const handleChangeMultipleOption = (e, questionId, optionId) => {
        const isChecked = e.target.checked;
        setExamResults((prevResults) => {
            const updatedAnswers = { ...prevResults };

            if (!updatedAnswers[questionId]) {
                updatedAnswers[questionId] = [];
            }

            if (isChecked && !updatedAnswers[questionId].includes(optionId)) {
                // Add the selected option to the answers array
                updatedAnswers[questionId] = [
                    ...updatedAnswers[questionId],
                    optionId,
                ];
            } else if (!isChecked) {
                // Remove the deselected option from the answers array
                updatedAnswers[questionId] = updatedAnswers[questionId].filter(
                    (id) => id !== optionId
                );
            }

            return {
                ...prevResults,
                ...updatedAnswers,
            };
        });
    };

    useEffect(() => {
        if (examId) {
            axiosConfig
                .get(`resources/course/${courseId}/exam/${examId}`)
                .then((response) => {
                    setExam(response.data.data.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [examId]);

    const handleSubmitExam = (e) => {
        e.preventDefault();
        axiosConfig
            .post(`exams/${examId}/submit`, {
                answers: { ...examResults },
                exam_id: exam.id,
            })
            .then((response) => {
                setExam(response.data.data.results);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        setShow(isShow);
    }, [isShow]);

    return (
        <Modal
            show={show}
            size="lg"
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            {exam.id ? (
                <>
                    <form method="POST" onSubmit={(e) => handleSubmitExam(e)}>
                        <Modal.Header>
                            <Modal.Title>{exam.title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <p>{exam.description}</p>
                                <div className="row questions">
                                    {exam.questions && exam.questions.length > 0
                                        ? exam.questions.map(
                                              (question, index) => (
                                                  <div
                                                      className="col-12 question-item"
                                                      key={index}
                                                  >
                                                      <div className="">
                                                          <input
                                                              type="hidden"
                                                              name={`questions[${question.id}]`}
                                                              value={
                                                                  question.id
                                                              }
                                                          />
                                                          {/* Question Title */}
                                                          <h5>
                                                              {question.title}
                                                          </h5>
                                                          {/* Open Answer Input */}

                                                          {question.type ===
                                                              1 && (
                                                              <input
                                                                  className="form-control"
                                                                  placeholder="Write your answer..."
                                                                  type="text"
                                                                  name={`answers`}
                                                                  disabled={
                                                                      exam.can_answer
                                                                          ? ""
                                                                          : "disabled"
                                                                  }
                                                                  value={
                                                                      exam.can_answer
                                                                          ? examResults
                                                                                ?.answers
                                                                                ?.question
                                                                                ?.id
                                                                          : question.student_answer_text
                                                                  }
                                                                  onChange={(
                                                                      e
                                                                  ) =>
                                                                      handleChangeExam(
                                                                          e,
                                                                          question.id
                                                                      )
                                                                  }
                                                                  required
                                                              />
                                                          )}
                                                          {/* Single Choice Inputs */}
                                                          <div className="row options">
                                                              {question.type ===
                                                                  2 &&
                                                                  question.options &&
                                                                  question.options.map(
                                                                      (
                                                                          option,
                                                                          i
                                                                      ) => (
                                                                          <div
                                                                              className="col-3"
                                                                              key={
                                                                                  i
                                                                              }
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
                                                                                      onChange={(
                                                                                          e
                                                                                      ) =>
                                                                                          handleChangeSingleOption(
                                                                                              e,
                                                                                              question.id
                                                                                          )
                                                                                      }
                                                                                      required
                                                                                  />
                                                                                  {
                                                                                      option.title
                                                                                  }
                                                                              </label>
                                                                          </div>
                                                                      )
                                                                  )}
                                                          </div>
                                                          {/* Multiple Choices Inputs */}
                                                          <div className="row options">
                                                              {question.type ===
                                                                  3 &&
                                                                  question.options &&
                                                                  question.options.map(
                                                                      (
                                                                          option,
                                                                          i
                                                                      ) => (
                                                                          <div
                                                                              className="col-3"
                                                                              key={
                                                                                  i
                                                                              }
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
                                                                                      onChange={(
                                                                                          e
                                                                                      ) =>
                                                                                          handleChangeMultipleOption(
                                                                                              e,
                                                                                              question.id,
                                                                                              option.id
                                                                                          )
                                                                                      }
                                                                                      className="me-1"
                                                                                      type="checkbox"
                                                                                      disabled={
                                                                                          exam.can_answer
                                                                                              ? ""
                                                                                              : "disabled"
                                                                                      }
                                                                                  />
                                                                                  {
                                                                                      option.title
                                                                                  }
                                                                              </label>
                                                                          </div>
                                                                      )
                                                                  )}
                                                          </div>
                                                          {/* Line */}
                                                          {index + 1 !==
                                                              exam.questions
                                                                  .length && (
                                                              <hr />
                                                          )}
                                                      </div>
                                                  </div>
                                              )
                                          )
                                        : "There's no questions."}
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={exam.can_answer ? "" : "disabled"}
                            >
                                Submit
                            </Button>
                        </Modal.Footer>
                    </form>
                </>
            ) : (
                <CourseListLoader className="py-3" />
            )}
        </Modal>
    );
}
