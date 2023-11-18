<?php

namespace modules\Courses\Entities;

use Illuminate\Database\Eloquent\Model;

class Certificate extends Model {
    /** @var string */
    public string $baseFilePath;

    /** @var string */
    public string $storeFilePath;

    /** @var object */
    private object $configuration;

    /** @var string */
    public string $certifyText;

    public function __construct() {
        $this->baseFilePath = public_path() . '/storage/certificates/base/certificate.pdf';
        $this->storeFilePath = public_path() . '/storage/certificates/';

        $this->setConfiguration();
        $this->setCertifyText();
    }

    public function setConfiguration(): void {
        $configuration = (object)[
            'studentName' => (object)[
                'position' => (object)['x' => 0, 'y' => 90],
                'font' => (object)['size' => 30, 'family' => '', 'color' => [164, 130, 213]]
            ],
            'instructorName' => (object)[
                'position' => (object)['x' => 0, 'y' => 170],
                'font' => (object)['size' => 12, 'family' => '', 'color' => [113, 61, 190]]
            ],
            'certifyText' => (object)[
                'position' => (object)['x' => 10, 'y' => 110],
                'font' => (object)['size' => 20, 'family' => '', 'color' => [0, 0, 0]]
            ],
            'finishedDate' => (object)[
                'position' => (object)['x' => 60, 'y' => 170],
                'font' => (object)['size' => 20, 'family' => '', 'color' => [164, 130, 213]]
            ],
            'referenceCode' => (object)[
                'position' => (object)['x' => 0, 'y' => 150],
                'font' => (object)['size' => 11, 'family' => '', 'color' => [105, 105, 105]]
            ],
            'certificateUrl' => (object)[
                'position' => (object)['x' => 0, 'y' => 155],
                'font' => (object)['size' => 11, 'family' => '', 'color' => [105, 105, 105]]
            ],
        ];
        // set the configuration
        $this->configuration = $configuration;
    }

    // Get configuration details -> to generate new certificates
    public function getConfiguration(): object {
        return $this->configuration;
    }

    // Set Certify Text Template
    public function setCertifyText(): void {
        $this->certifyText = "This is to certify that CERT_STUDENT_NAME successfully completed CERT_TOTAL_HOURS of CERT_COURSE_NAME online course on CERT_FINISHED_DATE.";
    }

    // Get Certify Text
    public function getCertifyText(string $studentName, string $courseName, int $courseDuration, string $finishedDate): string {
        $certifyText = $this->certifyText;
        // replace student name
        $certifyText = str_replace('CERT_STUDENT_NAME', $studentName, $certifyText);
        // replace course name
        $certifyText = str_replace('CERT_COURSE_NAME', $courseName, $certifyText);
        // replace course duration
        $certifyText = str_replace('CERT_TOTAL_HOURS', ($courseDuration . ($courseDuration >= 60 ? ' hours' : ' minutes')), $certifyText);
        // replace finished date
        $certifyText = str_replace('CERT_FINISHED_DATE', date("j F Y", strtotime($finishedDate)), $certifyText);
        return $certifyText;
    }
}
