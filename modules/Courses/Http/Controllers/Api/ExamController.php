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
    public function getExamByLecture(string $lectureSlug): JsonResponse {
        $exam = $this->checkAndGetExamByLectureSlug($lectureSlug);
        if ($exam) {
            $exam = $this->prepareExamForEdit($exam);
        }
        return $this->return(200, "Exam fetched successfully", ['exam' => $exam, 'questions' => isset($exam['questions']) ? $exam['questions'] : null]);
    }

    private function getQuestions(int $examId) {
        $questions = ExamQuestion::where("exam_id", $examId)->get();
        return $questions;
    }

    private function getOptions(ExamQuestion $examQuestion) {
        if ($examQuestion->type == QuestionTypes::SINGLE_CHOICE->value || $examQuestion->type == QuestionTypes::MULTIPLE_CHOICE->value) {
            return ExamQuestionOption::where("exam_question_id", $examQuestion->id)->get();
        }
        return false;
    }

    private function prepareExamForEdit(Exam $exam) {
        $questions = $this->getQuestions($exam->id);
        if ($questions) {
            $exam->questions = $questions;
            foreach ($questions as $question) {;
                $choices = $this->getOptions($question);
                if ($choices) {
                    $question->choices = $choices;
                }
            }
        }
        return $exam;
    }

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
                'status' => $requestData['status']
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

    private function checkAndGetByExamId(int $examId) {
        return Exam::select(['exams.*'])->leftJoin("lectures", "lectures.id", "exams.lecture_id")->where("exams.id", $examId)->owned()->first();
    }

    private function checkAndGetExamByLectureSlug(string $lectureSlug) {
        return Exam::select(['exams.*'])->leftJoin("lectures", "lectures.id", "exams.lecture_id")->where("lectures.slug", $lectureSlug)->owned()->first();
    }

    public function deleteQuestion(int $examId, int $questionId) {
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
