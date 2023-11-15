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

    public function setConfiguration() {
        $configuration = (object)[
            'studentName' => (object)[
                'position' => (object)['x' => 70, 'y' => 90],
                'font' => (object)['size' => 30, 'family' => '', 'color' => [164, 130, 213]]
            ],
            'instructorName' => (object)[
                'position' => (object)['x' => 100, 'y' => 120],
                'font' => (object)['size' => 15, 'family' => '', 'color' => [0, 0, 0]]
            ],
            'certifyText' => (object)[
                'position' => (object)['x' => 50, 'y' => 110],
                'font' => (object)['size' => 20, 'family' => '', 'color' => [0, 0, 0]]
            ],
            'finishedDate' => (object)[
                'position' => (object)['x' => '', 'y' => ''],
                'font' => (object)['size' => '', 'family' => '', 'color' => '']
            ],
            'signature' => (object)[
                'position' => (object)['x' => '', 'y' => ''],
                'font' => (object)['size' => '', 'family' => '', 'color' => '']
            ]
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
        $this->certifyText = "This is to certify that CERT_STUDENT_NAME successfully \ncompleted CERT_TOTAL_HOURS of CERT_COURSE_NAME online course on CERT_FINISHED_DATE.";
    }

    // Get Certify Text
    public function getCertifyText(string $studentName, string $courseName, int $courseDuration, string $finishedDate): string {
        $certifyText = $this->certifyText;
        // replace student name
        $certifyText = str_replace('CERT_STUDENT_NAME', $studentName, $certifyText);
        // replace course name
        $certifyText = str_replace('CERT_COURSE_NAME', $this->formatTextByWords($courseName), $certifyText);
        // replace course duration
        $certifyText = str_replace('CERT_TOTAL_HOURS', ($courseDuration . ($courseDuration >= 60 ? ' hours' : ' minutes')), $certifyText);
        // replace finished date
        $certifyText = str_replace('CERT_FINISHED_DATE', $finishedDate, $certifyText);
        return $certifyText;
    }


    /**
     * The function takes string like course name, and implode \n after each 6 words to create a new line in the certificate style
     * 
     * @param string text The `text` parameter is a string that represents the text that needs to be
     * formatted.
     * 
     * @return string a formatted string where the words from the input text are divided into lines of 6
     * words each, separated by newlines.
     */
    private function formatTextByWords(string $text): string {
        $words = explode(' ', $text);
        $lines = [];
        $chunks = array_chunk($words, 6);
        foreach ($chunks as $chunk) {
            $lines[] = implode(' ', $chunk);
        }
        $formattedText = implode("\n", $lines);
        return $formattedText;
    }
}
