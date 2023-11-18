<?php

namespace App\Enums;

enum QuestionTypes: int {
    case OPEN = 1;
    case SINGLE_CHOICE = 2;
    case MULTIPLE_CHOICE = 3;
}
