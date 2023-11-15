<?php

namespace modules\Courses\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use modules\Courses\Entities\Certificate;
use modules\Courses\Entities\Course;
use setasign\Fpdi\Tcpdf\Fpdi;

class CertificateController extends ApiController {
    private $certificate;

    public function __construct(Certificate $certificate) {
        $this->certificate = $certificate;
    }

    public function claimCertificate(int $courseId): JsonResponse {
        // Check if user finished all videos
        $certificateUrl = '';
        $user = User::first();
        $course = Course::first();
        $data = $this->prepareDataForCertificate($course, $user);
        $fileName = $this->generateNewCertificateFile($data);
        return $this->return(200, 'Certificate claimed successfully', ['certificate_url' => $certificateUrl]);
    }

    public function getCertificate(string $referenceNumber): JsonResponse {
    }

    private function prepareDataForCertificate(Course $course, User $user) {
        return [
            'course_name' => 'Master backend development using Laravel 10 Master backend development using Laravel 10',
            'instructor_name' => 'Abdelrahman Mostafa',
            'student_name' => 'Kevin Khaled Ahmed Mohammed',
            'reference_number' => '478-WEZ-58A-CSL',
            'course_duration' => '57',
            'finished_at' => "04/11/2023",
        ];
    }

    private function sendCertificateViaMail(string $referenceNumber, User $user): void {
    }

    private function checkStudentFinishedCourse(int $courseId, int $studentId): bool {
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
