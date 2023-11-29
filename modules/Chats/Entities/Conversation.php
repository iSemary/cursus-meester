<?php

namespace modules\Chats\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Collection;

class Conversation extends Model {
    use HasFactory;
    const DIRECT_MESSAGE = 1;
    const GROUP_CHANNEL = 2;
    protected $fillable = ['sender_id', 'receiver_id', 'type'];

    public static function initiate(int $senderId, int $receiverId, int $type): Conversation {
        $conversation = Conversation::where(function ($query) use ($receiverId, $senderId) {
            $query->where("receiver_id", $receiverId)
                ->where("sender_id", $senderId);
        })->orWhere(function ($query) use ($receiverId, $senderId) {
            $query->where("receiver_id", $senderId)
                ->where("sender_id", $receiverId);
        })->first();

        if (!$conversation) {
            $conversation = self::create([
                'sender_id' => $senderId,
                'receiver_id' => $receiverId,
                'type' => $type,
            ]);
        }

        return $conversation;
    }
}
