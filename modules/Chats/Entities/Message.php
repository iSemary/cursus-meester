<?php

namespace modules\Chats\Entities;

use App\Services\Uploader\FileHandler;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use modules\Chats\Interfaces\MessageType;

class Message extends Model {
    use HasFactory;

    public static string $filePath = 'chat/attachment/';
    public static string $fileDisk = 'public';

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
            'message_type_id' => (int) $data['message_type'],
            'message_text' => $data['message_text'],
            'message' => $messageFile
        ]);


        // self::sendToSocket($data['message_text']);

        
        return self::formatMessage($message, $data['sender_id']);
    }


    public static function sendToSocket($message) {
        // Send message to Node.js WebSocket server
        $response = Http::get(env("SOCKET_URL") . ":" . env("SOCKET_PORT") . '/chat-message', [
            'message' => $message,
        ]);
    }

    public static function handleMessageFile($file): JsonResponse {
        $mediaFileResponse = FileHandler::file($file, self::$filePath, null, self::$fileDisk);
        return $mediaFileResponse;
    }

    public static function formatMessage($message, $authId) {
        $message->type = $authId == $message->sender_id ? "out" : "in";
        if ($message->message_type_id != MessageType::TYPE_TEXT) {
            $message->message = asset("storage/" . self::$filePath . $message->message);
        }
        return $message;
    }
}
