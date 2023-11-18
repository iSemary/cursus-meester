<?php

namespace modules\Courses\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Jobs\CertificateMailJob;
use App\Jobs\Notifications\CertificateClaimed;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use modules\Courses\Entities\Certificate;
use modules\Courses\Entities\Course;
use modules\Courses\Entities\UserCertificate;
use modules\Payments\Entities\EnrolledCourse;
use setasign\Fpdi\Tcpdf\Fpdi;

class CertificateController extends ApiController {
    private $certificate;

    public function __construct(Certificate $certificate) {
        $this->certificate = $certificate;
    }

    /**
     * The claimCertificate function checks if a user is eligible to claim a certificate for a course,
     * generates a new certificate file, creates a new user certificate record, sends the certificate via
     * email, and returns a response with the certificate URL.
     * 
     * @param int courseId The courseId parameter is an integer that represents the ID of the course for
     * which the certificate is being claimed.
     * 
     * @return JsonResponse a JsonResponse.
     */
    public function claimCertificate(int $courseId): JsonResponse {
        $user = auth()->guard('api')->user();
        $course = Course::where('id', $courseId)->where("has_certificate", 1)->first();
        if (!$course) {
            return $this->return(409, 'Course not exists');
        }
        // Check if user has enrolled to the course
        $enrolledCourse = EnrolledCourse::where("user_id", $user->id)->where("course_id", $course->id)->first();
        if (!$enrolledCourse) {
            return $this->return(409, 'Course not enrolled');
        }
        // Check if user finished all course lectures
        $checkFinishedCourse = $this->checkStudentFinishedCourse($enrolledCourse);
        if (!$checkFinishedCourse) {
            return $this->return(409, 'You have to finish the course before claiming the certificate');
        }
        // Check if user already claimed the certificate
        $checkClaimedCertificate = $this->getCertificateByCourseId($course->id, $user->id);
        if ($checkClaimedCertificate) {
            return $this->return(409, 'You have already claimed this certificate before!');
        }
        try {
            // prepare required data for generating new certificate
            $course->finished_at = $enrolledCourse->finished_at;
            $preparedData = $this->prepareDataForCertificate($course, $user);
            // generate a new certificate file and store it into certificates folder
            $fileName = $this->generateNewCertificateFile($preparedData);
            // create a new user certificate record
            $this->createNewUserCertificate($user->id, $course->id, $preparedData['reference_code'], $fileName);
            // prepare and append certificate url to the data 
            $preparedData['certificate_link'] = asset('storage/certificates/' . $fileName);
            // Fire Sending Mail Queue
            $this->sendCertificateViaMail($preparedData);
            // Fire Sending new notification
            $this->pushCertificateClaimedNotification($preparedData);
            return $this->return(200, 'Certificate claimed successfully', ['certificate_url' => $preparedData['certificate_link']]);
        } catch (\Exception $e) {
            return $this->return(409, 'Something went wrong!', debug: $e->getFile());
        }
    }

    /**
     * The function `getCertificate` retrieves a certificate by course ID and returns a JSON response with
     * the certificate data.
     * 
     * @param int courseId The parameter `courseId` is an integer that represents the ID of a course. It is
     * used to retrieve the certificate associated with that course.
     * 
     * @return JsonResponse a JsonResponse object.
     */
    public function getCertificate(int $courseId): JsonResponse {
        $certificate = $this->getCertificateByCourseId($courseId);
        if (!$certificate) {
            return $this->return(409, 'There\'s no certificate found');
        }
        return $this->return(200, 'Certificate fetched successfully', ['certificate' => $certificate]);
    }

    /**
     * The function retrieves a user certificate based on a given reference code.
     * 
     * @param string referenceCode The parameter "referenceCode" is a string that represents the reference
     * code of a user certificate.
     * 
     * @return `an` instance of the UserCertificate model that matches the given reference code.
     */
    public function getCertificateByReferenceCode(string $referenceCode) {
        $certificate =  UserCertificate::where("reference_code", $referenceCode)->first();
        if (!$certificate) {
            return $this->return(409, 'There\'s no certificate found');
        }
        return $this->return(200, 'Certificate fetched successfully', ['certificate' => $certificate]);
    }

    /**
     * The function checks if a student has finished a course by returning the finished_at property of the
     * EnrolledCourse object.
     * 
     * @param EnrolledCourse enrolledCourse An instance of the EnrolledCourse class, which represents a
     * course that a student is enrolled in.
     * 
     * @return: value of the "finished_at" property of the given "EnrolledCourse" object.
     */
    private function checkStudentFinishedCourse(EnrolledCourse $enrolledCourse) {
        return $enrolledCourse->finished_at;
    }

    /**
     * The function retrieves a user certificate based on the course ID and student ID.
     * 
     * @param int courseId The courseId parameter is an integer that represents the ID of a course. It is
     * used to filter the UserCertificate records based on the course_id column in the database table.
     * @param int studentId The studentId parameter is an integer that represents the unique identifier of
     * a student.
     * 
     * @return UserCertificate model that matches the given course ID and student ID.
     */
    private function getCertificateByCourseId(int $courseId) {
        return UserCertificate::where("course_id", $courseId)->where("user_id", auth()->user()->id)->first();
    }

    /**
     * The function prepares data for a certificate by extracting relevant information from a Course object
     * and a User object and generating a unique reference code.
     * 
     * @param Course course The  parameter is an instance of the Course class. It contains
     * information about a specific course, such as its title, instructor name, duration, and finished
     * date.
     * @param User user The `` parameter is an instance of the `User` class, which represents a user
     * in the system. It contains information about the user, such as their full name and email address.
     * 
     * @return array an array containing the following data:
     */

    private function prepareDataForCertificate(Course $course, User $user): array {
        $data =  [
            'course_name' => $course->title,
            'instructor_name' => $course->instructor->full_name,
            'user_id' => $user->id,
            'student_name' => $user->full_name,
            'student_email' => $user->email,
            'course_duration' => $course->duration,
            'finished_at' => $course->finished_at,
        ];
        $data['reference_code'] = $this->generateUniqueReferenceCode();
        return $data;
    }
    /**
     * The function creates a new user certificate with the given user ID, course ID, reference code, and
     * file name.
     * 
     * @param userId The user ID is the unique identifier of the user for whom the certificate is being
     * created. It is used to associate the certificate with the correct user in the database.
     * @param courseId The courseId parameter is the ID of the course for which the user certificate is
     * being created.
     * @param referenceCode The reference code is a unique identifier for the user certificate. It can be
     * used to track and reference the certificate in the system.
     * @param fileName The `fileName` parameter is the name of the file that will be associated with the
     * user certificate. It could be the name of the certificate file or any other relevant name that helps
     * identify the certificate.
     * 
     * @return UserCertificate an instance of the UserCertificate model.
     */
    private function createNewUserCertificate($userId, $courseId, $referenceCode, $fileName): UserCertificate {
        return UserCertificate::create([
            'user_id' => $userId,
            'course_id' => $courseId,
            'reference_code' => $referenceCode,
            'file_name' => $fileName,
        ]);
    }

    /**
     * The function generates a unique reference code by combining the first letters of an app name with a
     * randomly generated code, and checks if the code already exists before returning it.
     * 
     * @return string a string value, which is the unique reference code.
     */
    private function generateUniqueReferenceCode(): string {
        $firstAppNameLetters = $this->getFirstAppNameLetters();
        $uniqueCode = Str::random(8);
        $uniqueReferenceCode = strtoupper($firstAppNameLetters . '-' . $uniqueCode);

        $checkAvailability = $this->isReferenceCodeExists($uniqueReferenceCode);
        if ($checkAvailability) {
            $this->generateUniqueReferenceCode();
        } else {
            return $uniqueReferenceCode;
        }
    }

    /**
     * The function checks if a reference code exists in the UserCertificate table, including soft deleted
     * records.
     * 
     * @param string referenceCode The parameter "referenceCode" is a string that represents a reference code.
     * 
     * @return boolean value.
     */
    private function isReferenceCodeExists(string $referenceCode): bool {
        return UserCertificate::where("reference_code", $referenceCode)->withTrashed()->exists();
    }

    /**
     * The function `getFirstAppNameLetters` takes the app name and returns the first letter of each word
     * in the app name.
     * 
     * @return string that consists of the first letter of each word in the app name.
     */
    private function getFirstAppNameLetters(): string {
        $firstAppNameLetters = '';
        // Split the app name into words
        $appNameWords = explode(' ',  env("APP_NAME"));
        foreach ($appNameWords as $appNameWord) {
            $firstAppNameLetters .= substr($appNameWord, 0, 1);
        }
        return $firstAppNameLetters;
    }

    /**
     * The function sends a certificate via email by dispatching a job with the necessary data.
     * 
     * @param array data The `data` parameter is an array that contains the following information:
     */
    private function sendCertificateViaMail(array $data): void {
        $mailData = [
            'name' => $data['student_name'],
            'email' => $data['student_email'],
            'reference_code' => $data['reference_code'],
            'course_name' => $data['course_name'],
            'finished_at' => $data['finished_at'],
            'certificate_link' => $data['certificate_link'],
        ];
        CertificateMailJob::dispatch($mailData);
    }

    /**
     * The function `pushCertificateClaimedNotification` dispatches a `CertificateClaimed` event with the
     * given data.
     * 
     * @param array data The data parameter is an array that contains the necessary information for the
     * notification. It could include details such as the user who claimed the certificate, the certificate
     * ID, and any other relevant data needed for the notification.
     */
    private function pushCertificateClaimedNotification(array $data): void {
        CertificateClaimed::dispatch($data);
    }

    /**
     * Generates certificate file and store it in certificates path, based on certificate configuration in the Certificate Class
     *
     * @param array $data of course, student, and instructor
     * @return string of generated file name
     */
    private function generateNewCertificateFile(array $data): string {
        $certificateConfiguration = $this->certificate->getConfiguration();

        // generate random file name
        $fileName =  Str::uuid() . '.pdf';
        // customize the data
        $pdf = new Fpdi();
        // clone original certificate and create a new file 
        $pdf->setSourceFile($this->certificate->baseFilePath);
        // Get dimensions of the first page
        $template = $pdf->importPage(1);
        $size = $pdf->getTemplateSize($template);
        // Create a new page with the same dimensions
        $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
        // Import the first page from the original PDF
        $pdf->useTemplate($template);

        /**
         *   Add text to the imported page
         */
        /* Student Name*/
        $pdf->SetFont($certificateConfiguration->studentName->font->family, '', $certificateConfiguration->studentName->font->size);
        $pdf->SetTextColor($certificateConfiguration->studentName->font->color[0], $certificateConfiguration->studentName->font->color[1], $certificateConfiguration->studentName->font->color[2]);
        $pdf->SetXY($certificateConfiguration->studentName->position->x, $certificateConfiguration->studentName->position->y);
        $pdf->Cell(0, 10, $data['student_name'], 0, 1, 'C');
        /* Certify Text */
        $certifyText = $this->certificate->getCertifyText($data['student_name'], $data['course_name'], $data['course_duration'], $data['finished_at']);
        $pdf->SetFont($certificateConfiguration->certifyText->font->family, '', $certificateConfiguration->certifyText->font->size);
        $pdf->SetTextColor($certificateConfiguration->certifyText->font->color[0], $certificateConfiguration->certifyText->font->color[1], $certificateConfiguration->certifyText->font->color[2]);
        $pdf->SetXY($certificateConfiguration->certifyText->position->x, $certificateConfiguration->certifyText->position->y);
        $certifyTextLines = explode("\n", wordwrap($certifyText, 65));
        $lineHeight = 10;
        foreach ($certifyTextLines as $key => $line) {
            $pdf->SetXY($certificateConfiguration->certifyText->position->x, $certificateConfiguration->certifyText->position->y + ($lineHeight * $key));
            $pdf->Cell(0, $lineHeight, $line, 0, 1, 'C');
        }

        /* Finished Date */
        $pdf->SetFont($certificateConfiguration->finishedDate->font->family, '', $certificateConfiguration->finishedDate->font->size);
        $pdf->SetTextColor($certificateConfiguration->finishedDate->font->color[0], $certificateConfiguration->finishedDate->font->color[1], $certificateConfiguration->finishedDate->font->color[2]);
        $pdf->SetXY($certificateConfiguration->finishedDate->position->x, $certificateConfiguration->finishedDate->position->y);
        $pdf->Cell(0, 10, date("m/d/Y", strtotime($data['finished_at'])), 0, 1);

        /** Reference Code */
        $referenceText = "Certificate Code: " . $data['reference_code'];
        $pdf->SetFont($certificateConfiguration->referenceCode->font->family, '', $certificateConfiguration->referenceCode->font->size);
        $pdf->SetTextColor($certificateConfiguration->referenceCode->font->color[0], $certificateConfiguration->referenceCode->font->color[1], $certificateConfiguration->referenceCode->font->color[2]);
        $pdf->SetXY($certificateConfiguration->referenceCode->position->x, $certificateConfiguration->referenceCode->position->y);
        $pdf->Cell(0, 1, $referenceText, 0, 0);

        /** Reference Code */
        $referenceUrl = "Certificate URL: " . env("APP_URL") . '/certificate/' . $data['reference_code'];
        $pdf->SetFont($certificateConfiguration->certificateUrl->font->family, '', $certificateConfiguration->certificateUrl->font->size);
        $pdf->SetTextColor($certificateConfiguration->certificateUrl->font->color[0], $certificateConfiguration->certificateUrl->font->color[1], $certificateConfiguration->certificateUrl->font->color[2]);
        $pdf->SetXY($certificateConfiguration->certificateUrl->position->x, $certificateConfiguration->certificateUrl->position->y);
        $pdf->Cell(0, 1, $referenceUrl, 0, 0);

        /* Instructor Name*/
        $instructorText = "{$data['instructor_name']}, Instructor";
        $pdf->SetFont($certificateConfiguration->instructorName->font->family, '', $certificateConfiguration->instructorName->font->size);
        $pdf->SetTextColor($certificateConfiguration->instructorName->font->color[0], $certificateConfiguration->instructorName->font->color[1], $certificateConfiguration->instructorName->font->color[2]);
        $pdf->SetXY($certificateConfiguration->instructorName->position->x, $certificateConfiguration->instructorName->position->y);
        $pdf->Cell(0, 10, $instructorText, 0, 1, 'C');

        // Save modified certificate file
        $pdf->Output($this->certificate->storeFilePath . $fileName, 'F');
        return $fileName;
    }
}
