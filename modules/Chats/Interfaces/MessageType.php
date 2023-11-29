<?php

namespace modules\Chats\Interfaces;

interface MessageType {
    const TYPE_TEXT = 1;
    const TYPE_IMAGE = 2;
    const TYPE_VIDEO = 3;
    const TYPE_VOICE = 4;
    const TYPE_FILE = 5;
}
