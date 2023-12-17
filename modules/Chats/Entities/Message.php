<?php

namespace modules\Chats\Entities;

use App\Services\Uploader\FileHandler;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

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


        self::sendToSocket($data['message_text']);

        return $message;
    }


    public static function sendToSocket($message) {
        // Send message to Node.js WebSocket server
        $response = Http::post(env("SOCKET_URL") . ":" . env("SOCKET_PORT") . '/send-message', [
            'message' => $message,
        ]);
    }

    public static function handleMessageFile($file): JsonResponse {
        $data = [];
        $mediaFileResponse = FileHandler::file($file, self::$filePath, null, 'protected');
        return $mediaFileResponse;
    }
}
