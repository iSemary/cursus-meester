<?php

namespace modules\Courses\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Jobs\CertificateMailJob;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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

    public function claimCertificate(int $courseId): JsonResponse {
        $user = auth()->guard('api')->user();
        $course = Course::where('id', $courseId)->first();
        if (!$course) {
            return $this->return(409, 'Course not exists');
        }
        // Check if user has enrolled to the course
        $enrolledCourse = EnrolledCourse::where("user_id", $user->id)->where("course_id", $course->id)->first();
        if (!$enrolledCourse) {
            return $this->return(409, 'Course not enrolled');
        }
        // Check if user finished all course lectures
        $checkFinishedCourse = $this->checkStudentFinishedCourse($user->id, $course->id);
        if (!$checkFinishedCourse) {
            return $this->return(409, 'You have to finish the course before claiming the certificate');
        }
        // Check if user already claimed the certificate
        $checkClaimedCertificate = $this->getCertificateByCourseId($user->id, $course->id);
        if ($checkClaimedCertificate) {
            return $this->return(409, 'You have already claimed this certificate before!');
        }
        // prepare required data for generating new certificate
        $preparedData = $this->prepareDataForCertificate($course, $user);
        // generate a new certificate file and store it into certificates folder
        $fileName = $this->generateNewCertificateFile($preparedData);
        // create a new user certificate record
        $this->createNewUserCertificate($user->id, $course->id, $preparedData['reference_code'], $fileName);
        // prepare and append certificate url to the data 
        $data['certificate_link'] = $this->certificate->storeFilePath . $fileName;
        // Fire Sending Mail Queue
        $this->sendCertificateViaMail($preparedData);
        return $this->return(200, 'Certificate claimed successfully', ['certificate_url' => $data['certificate_link']]);
    }

    public function getCertificate(string $referenceCode): JsonResponse {
        $certificate = $this->getCertificateByReferenceCode($referenceCode);
        if (!$certificate) {
            return $this->return(409, 'There\'s no certificate found');
        }
        return $this->return(200, 'Certificate fetched successfully', ['certificate' => $certificate]);
    }

    private function checkStudentFinishedCourse(int $courseId, int $studentId): bool {
    }

    private function getCertificateByCourseId(int $courseId, int $studentId) {
        return UserCertificate::where("course_id", $courseId)->where("user_id", $studentId)->first();
    }

    private function prepareDataForCertificate(Course $course, User $user) {
        $data =  [
            'course_name' => 'Master backend development using Laravel 10 Master backend development using Laravel 10',
            'instructor_name' => 'Abdelrahman Mostafa',
            'student_name' => 'Kevin Khaled Ahmed Mohammed',
            'student_email' => 'Kevin Khaled Ahmed Mohammed',
            'course_duration' => '57',
            'finished_at' => "04/11/2023",
        ];
        $data['reference_code'] = $this->generateUniqueReferenceCode();
        return $data;
    }

    private function createNewUserCertificate($userId, $courseId, $referenceCode, $fileName) {
        return UserCertificate::create([
            'user_id' => $userId,
            'course_id' => $courseId,
            'reference_code' => $referenceCode,
            'file_name' => $fileName,
        ]);
    }

    private function generateUniqueReferenceCode() {
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

    private function isReferenceCodeExists($referenceCode) {
        return UserCertificate::where("reference_code", $referenceCode)->withTrashed()->exists();
    }

    private function getCertificateByReferenceCode($referenceCode) {
        return UserCertificate::where("reference_code", $referenceCode)->first();
    }

    private function getFirstAppNameLetters() {
        $firstAppNameLetters = '';
        // Split the app name into words
        $appNameWords = explode(' ',  env("APP_NAME"));
        foreach ($appNameWords as $appNameWord) {
            $firstAppNameLetters .= substr($appNameWord, 0, 1);
        }
        return $firstAppNameLetters;
    }

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

    private function pushCertificateClaimedNotification(int $courseId, int $studentId): void {
    }

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
        $pdf->Cell(0, 10, $data['student_name'], 0, 1);
        /* Certify Text */
        $certifyText = $this->certificate->getCertifyText($data['student_name'], $data['course_name'], $data['course_duration'], $data['finished_at']);
        $pdf->SetFont($certificateConfiguration->certifyText->font->family, '', $certificateConfiguration->certifyText->font->size);
        $pdf->SetTextColor($certificateConfiguration->certifyText->font->color[0], $certificateConfiguration->certifyText->font->color[1], $certificateConfiguration->certifyText->font->color[2]);
        $pdf->SetXY($certificateConfiguration->certifyText->position->x, $certificateConfiguration->certifyText->position->y);
        $certifyTextLines = explode("\n", $certifyText);
        $lineHeight = 10;
        foreach ($certifyTextLines as $key => $line) {
            $pdf->SetXY($certificateConfiguration->certifyText->position->x, $certificateConfiguration->certifyText->position->y + ($lineHeight * $key));
            $pdf->Cell(0, $lineHeight, $line, 0, 1);
        }

        // /* Instructor Name*/
        // $pdf->SetFont($certificateConfiguration->instructorName->font->family, '', $certificateConfiguration->instructorName->font->size);
        // $pdf->SetTextColor($certificateConfiguration->instructorName->font->color[0], $certificateConfiguration->instructorName->font->color[1], $certificateConfiguration->instructorName->font->color[2]);
        // $pdf->SetXY($certificateConfiguration->instructorName->position->x, $certificateConfiguration->instructorName->position->y);
        // $pdf->Cell(0, 10, $data['instructor_name'], 0, 1);

        // Save modified certificate file
        $pdf->Output($this->certificate->storeFilePath . $fileName, 'F');
        return $fileName;
    }
}
