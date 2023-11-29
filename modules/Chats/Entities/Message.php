<?php

namespace modules\Chats\Entities;

use App\Services\Uploader\FileHandler;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Http\JsonResponse;

class Message extends Model {
    use HasFactory;

    public static string $filePath = 'chat/attachment/';

    protected $fillable = ['conversation_id', 'sender_id', 'receiver_id', 'message_type_id', 'message_text', 'message', 'seen'];

    public static function send(array $data): Message {
        $conversation = Conversation::find($data['conversation_id']);

        $messageFile = null;
        if (isset($data['message_file'])) {
            $messageFile = self::handleMessageFile($data['message_file']);
            $messageFile = $messageFile->getData();
            $messageFile = $messageFile->hash_name . '.' . $messageFile->extension;
        }

        $message = self::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $data['sender_id'],
            'receiver_id' => $data['receiver_id'],
            'message_type_id' => $data['message_type'],
            'message_text' => $data['message_text'],
            'message' => $messageFile
        ]);

        return $message;
    }

    public static function handleMessageFile($file): JsonResponse {
        $data = [];
        $mediaFileResponse = FileHandler::file($file, self::$filePath);
        return $mediaFileResponse;
    }
}
