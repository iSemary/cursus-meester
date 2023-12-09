<?php

namespace modules\Payments\Interfaces;

interface Payment {
    const EXPIRE_AFTER_MINUTES = 60;
    const REFERENCE_NUMBER_LENGTH = 10;
}
