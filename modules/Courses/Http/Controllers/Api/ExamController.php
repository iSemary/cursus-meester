<?php

namespace modules\Courses\Http\Controllers\Api;

use App\Enums\QuestionTypes;
use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use modules\Courses\Entities\Exam\Exam;
use modules\Courses\Entities\Exam\ExamQuestion;
use modules\Courses\Entities\Exam\ExamQuestionOption;
use modules\Courses\Entities\Lecture;
use modules\Courses\Http\Requests\Exam\CreateOrUpdateExamRequest;
use stdClass;

class ExamController extends ApiController {
    /**
     * The function retrieves an exam by its lecture slug and prepares it for editing, then returns a JSON
     * response with the exam and its questions.
     * 
     * @param string lectureSlug The parameter "lectureSlug" is a string that represents the unique
     * identifier or slug of a lecture. It is used to retrieve the exam associated with that lecture.
     * 
     * @return JsonResponse a JsonResponse object.
     */
    public function getExamByLecture(string $lectureSlug): JsonResponse {
        $exam = $this->checkAndGetExamByLectureSlug($lectureSlug);
        if ($exam) {
            $exam = $this->prepareExamForEdit($exam);
        }
        return $this->return(200, "Exam fetched successfully", ['exam' => $exam, 'questions' => isset($exam['questions']) ? $exam['questions'] : null]);
    }

    /**
     * The function "getQuestions" retrieves all the questions associated with a specific exam ID.
     * 
     * @param int examId The examId parameter is an integer that represents the ID of the exam for which
     * you want to retrieve the questions.
     * 
     * @return collection of ExamQuestion objects.
     */
    private function getQuestions(int $examId, $fields = ['*']) {
        $questions = ExamQuestion::select($fields)->where("exam_id", $examId)->get();
        return $questions;
    }

    /**
     * The function "getOptions" returns the options for a given exam question if it is of type single
     * choice or multiple choice.
     * 
     * @param ExamQuestion examQuestion An instance of the ExamQuestion class, which represents a question
     * in an exam.
     * 
     * @return mixed either a collection of ExamQuestionOption objects if the exam question type is single choice
     * or multiple choice, or it returns false if the exam question type is not single choice or multiple
     * choice.
     */
    private function getOptions(ExamQuestion $examQuestion, $fields = ['*']) {
        if ($examQuestion->type == QuestionTypes::SINGLE_CHOICE->value || $examQuestion->type == QuestionTypes::MULTIPLE_CHOICE->value) {
            return ExamQuestionOption::select($fields)->where("exam_question_id", $examQuestion->id)->get();
        }
        return false;
    }

    /**
     * The function prepares an exam for editing by retrieving and assigning questions and their
     * options to the exam object.
     * 
     * @param Exam exam The parameter "exam" is an instance of the Exam class.
     * 
     * @return collection modified Exam object with the questions and options added.
     */
    private function prepareExamForEdit(Exam $exam) {
        $questions = $this->getQuestions($exam->id);
        if ($questions) {
            $exam->questions = $questions;
            foreach ($questions as $question) {;
                $choices = $this->getOptions($question);
                if ($choices) {
                    $question->options = $choices;
                }
            }
        }
        return $exam;
    }


    /**
     * The function prepares an exam for a student by retrieving the questions and options for each
     * question.
     * 
     * @param Exam exam An object of the Exam class, which represents an exam.
     * 
     * @return Exam object with the questions and options added to it.
     */
    public function prepareExamForStudent(Exam $exam) {
        $questions = $this->getQuestions($exam->id, ['id', 'title', 'type']);
        if ($questions) {
            $exam->questions = $questions;
            foreach ($questions as $question) {;
                $choices = $this->getOptions($question, ['id', 'title']);
                if ($choices) {
                    $question->options = $choices;
                }
            }
        }
        return $exam;
    }

    /**
     * The function creates or updates an exam for a lecture, including its questions and options, and
     * returns the updated exam data.
     * 
     * @param CreateOrUpdateExamRequest createOrUpdateExamRequest The  parameter
     * is an instance of the CreateOrUpdateExamRequest class, which is used to validate and retrieve the
     * request data for creating or updating an exam.
     * @param string lectureSlug The lectureSlug parameter is a string that represents the unique
     * identifier (slug) of a lecture. It is used to retrieve the lecture from the database.
     * 
     * @return JsonResponse a JsonResponse.
     */
    public function createOrUpdateExamByLecture(CreateOrUpdateExamRequest $createOrUpdateExamRequest, string $lectureSlug): JsonResponse {
        $requestData = $createOrUpdateExamRequest->all();
        try {
            // create new object instance of the updated exam, And append each question with it's options IDs to pass it to the front end after finishing. 
            $updatedExam = new stdClass();
            $updatedQuestions = [];
            $lecture = Lecture::select(['lectures.id'])->where("lectures.slug", $lectureSlug)->owned()->first();
            // Update or create the rate based on the user id and the course id
            $exam = Exam::updateOrCreate(['lecture_id' => $lecture->id], [
                'title' => $requestData['title'],
                'description' => $requestData['description'],
                'status' => +$requestData['status']
            ]);
            // Append exam to updated exam object
            $updatedExam = $exam->getAttributes();
            $requestQuestions = $requestData['questions'];
            // Some defensive programming
            if ($requestQuestions && is_array($requestQuestions) && count($requestQuestions))
                // looping over request exam questions
                foreach ($requestQuestions as $key => $requestQuestion) {
                    // Update or create exam questions
                    $examQuestion = ExamQuestion::updateOrCreate(
                        [
                            'id' => $requestQuestion > 0 ? $requestQuestion : 0, // 0 means create a new one
                            'exam_id' => $exam->id
                        ],
                        [
                            'title' => $requestQuestion['title'],
                            'type' => $requestQuestion['type']
                        ]
                    );
                    $updatedQuestions[$key] = $examQuestion->getAttributes();
                    // check if the current question if type single choice or multiple choice. then update or create it's options
                    // else remove it's choices if it exists;-
                    // [Because maybe the user changed the old question from multiple choice to open answer, so le'ts make sure the old choices is deleted] 
                    if ($examQuestion->type == QuestionTypes::SINGLE_CHOICE->value || $examQuestion->type == QuestionTypes::MULTIPLE_CHOICE->value) {
                        $requestQuestionOptions = $requestQuestion['options'];
                        if (isset($requestQuestionOptions) && is_array($requestQuestionOptions) && count($requestQuestionOptions)) {
                            foreach ($requestQuestionOptions as $requestQuestionOption) {
                                $examQuestionOption = ExamQuestionOption::updateOrCreate(
                                    [
                                        'id' => (isset($requestQuestionOption['id']) && $requestQuestionOption['id'] > 0) ? $requestQuestionOption['id'] : 0,
                                        'exam_question_id' => $examQuestion->id
                                    ],
                                    [
                                        'title' => $requestQuestionOption['title'],
                                        'valid_answer' => $requestQuestionOption['valid_answer'],
                                        'order_number' => $requestQuestionOption['order_number'],
                                    ]
                                );
                                // append update option to the object
                                $updatedQuestions[$key]['options'][] = $examQuestionOption->getAttributes();
                            }
                        }
                    } else {
                        ExamQuestionOption::where('exam_question_id', $examQuestion->id)->delete();
                    }
                }
            // return the exam object with it's new ids, to apply it after updating in the front side. [instead of refreshing the whole page]
            return $this->return(200, "Exam updated successfully", ['exam' => $updatedExam, 'questions' => $updatedQuestions]);
        } catch (\Exception $e) {
            return $this->return(400, "Something went wrong!", ['exam' => $requestData], debug: $e->getMessage());
        }
    }

    /**
     * The function checks and retrieves an exam by its ID, along with its associated lecture, if it is
     * owned by the user.
     * 
     * @param int examId The examId parameter is an integer that represents the ID of the exam we want to
     * retrieve.
     * 
     * @return Exam an instance of the Exam model.
     */
    private function checkAndGetByExamId(int $examId) {
        return Exam::select(['exams.*'])->leftJoin("lectures", "lectures.id", "exams.lecture_id")->where("exams.id", $examId)->owned()->first();
    }

    /**
     * The function checks and retrieves an exam based on the lecture slug.
     * 
     * @param string lectureSlug The lectureSlug parameter is a string that represents the slug of a
     * lecture.
     * 
     * @return Exam an instance of the Exam model.
     */
    private function checkAndGetExamByLectureSlug(string $lectureSlug) {
        return Exam::select(['exams.*'])->leftJoin("lectures", "lectures.id", "exams.lecture_id")->where("lectures.slug", $lectureSlug)->owned()->first();
    }

    /**
     * The function `deleteQuestion` deletes a question from an exam and its associated options.
     * 
     * @param int examId The examId parameter is an integer that represents the ID of the exam from
     * which the question needs to be deleted.
     * @param int questionId The parameter `` is an integer that represents the ID of the
     * question that needs to be deleted from the exam.
     * 
     * @return JsonResponse a JsonResponse object.
     */
    public function deleteQuestion(int $examId, int $questionId): JsonResponse {
        $exam = $this->checkAndGetByExamId($examId);
        if ($exam) {
            $examQuestion = ExamQuestion::where("exam_id", $examId)->where("id", $questionId)->first();
            if (!$examQuestion) {
                return $this->return(409, "Question not exists");
            }
            ExamQuestionOption::where("exam_question_id", $examQuestion->id)->delete();
            $examQuestion->delete();
        } else {
            return $this->return(409, "Exam not exists");
        }
        return $this->return(200, "Question deleted successfully");
    }
}
