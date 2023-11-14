<?php

namespace modules\Courses\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use setasign\Fpdi\Tcpdf\Fpdi;

class CertificateController extends ApiController {

    public function claimCertificate(int $courseId): JsonResponse {
        // Check if user finished all videos
        $certificateUrl = '';


        $data = [
            'course_name' => 'Master backend development using Laravel 10',
            'instructor_name' => 'Abdelrahman Mostafa',
            'student_name' => 'Kevin Khaled Ahmed Mohammed',
            'reference_number' => '478-WEZ-58A-CSL',
            'total_hours' => '57',
            'finished_at' => '04/11/2023',
        ];
        $fileName = $this->generateNewCertificateFile($data);
        return $this->return(200, 'Certificate claimed successfully', ['certificate_url' => $certificateUrl]);
    }

    public function getCertificate(string $referenceNumber): JsonResponse {
    }

    private function sendCertificateViaMail(string $referenceNumber, User $user): void {
    }

    private function checkStudentFinishedCourse(int $courseId, int $studentId): bool {
    }

    private function pushCertificateClaimedNotification(int $courseId, int $studentId): void {
    }

    private function generateNewCertificateFile(array $data): string {
        // clone original certificate and create a new file 
        $fileName =  Str::uuid() . '.pdf';

        // customize the data
        $pdf = new Fpdi();
        $pdf->setSourceFile('path/to/existing.pdf');
        $tpl = $pdf->importPage(1);
        $pdf->AddPage();
        $pdf->useTemplate($tpl);

        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Text(10, 10, 'Modified content');

        $pdf->Output('path/to/new_modified.pdf', 'F');


        return $fileName;
    }
}
