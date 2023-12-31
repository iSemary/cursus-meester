<?php

namespace modules\Chats\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use modules\Chats\Entities\Conversation;
use modules\Chats\Entities\Message;
use modules\Chats\Http\Requests\InitiateConversationRequest;
use modules\Chats\Http\Requests\SendMessageRequest;
use modules\Chats\Interfaces\MessageType;

class ChatController extends ApiController {

    /**
     * The function initiates a conversation between the authenticated user and a specified receiver.
     * 
     * @param InitiateConversationRequest initiateConversationRequest An instance of the
     * InitiateConversationRequest class, which is a request object containing the data needed to initiate
     * a conversation. It is type-hinted with the InitiateConversationRequest class.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200, a message of "Conversation initiated
     * successfully", and an array containing the initiated conversation.
     */
    public function initiate(InitiateConversationRequest $initiateConversationRequest): JsonResponse {
        $receiver = User::whereUsername($initiateConversationRequest->validated()['receiver_username'])->first();
        $conversation = Conversation::initiate(
            auth()->guard('api')->id(),
            $receiver->id,
            1
        );

        return $this->return(200, "Conversation initiated successfully", ['conversation' => $conversation]);
    }

    /**
     * The function sends a message using the validated data from the SendMessageRequest and returns a JSON
     * response with the message details.
     * 
     * @param SendMessageRequest sendMessageRequest The `sendMessageRequest` parameter is an instance of
     * the `SendMessageRequest` class. It is likely a request object that contains the necessary data for
     * sending a message, such as the recipient, subject, and content of the message.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200, a success message of "Message sent
     * successfully", and the message object as data.
     */
    public function send(SendMessageRequest $sendMessageRequest): JsonResponse {
        $messageInstance = $sendMessageRequest->validated();
        $auth = auth()->guard('api')->user();

        $conversation = Conversation::whereId($sendMessageRequest->conversation_id)
            ->where(function ($query) use ($auth) {
                $query->where("conversations.receiver_id", $auth->id)
                    ->orWhere("conversations.sender_id", $auth->id);
            })
            ->first();

        $messageInstance['sender_id'] = $auth->id;
        $messageInstance['receiver_id'] = ($conversation->sender_id == $auth->id ? $conversation->receiver_id : $conversation->sender_id);

        $message = Message::send($messageInstance);
        return $this->return(200, "Message sent successfully", ['message' => $message]);
    }


    /**
     * The "seen" function updates the "seen_at" field of messages in a conversation to the current time
     * for the authenticated user.
     * 
     * @param int conversationId The `conversationId` parameter is an integer that represents the ID of the
     * conversation that you want to mark as seen.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200 and a message of "Conversation marked
     * seen".
     */
    public function seen(int $conversationId): JsonResponse {
        Message::where("receiver_id", auth()->guard('api')->id())
            ->where("conversation_id", $conversationId)
            ->where('seen_at', null)->update(['seen_at' => now()]);

        return $this->return(200, "Conversation marked seen");
    }


    public function conversations(): JsonResponse {
        $auth = auth()->guard('api')->user();
        $conversations = Conversation::select(
            "conversations.id",
            "conversations.receiver_id",
            "conversations.sender_id",
        )
            ->where(function ($query) use ($auth) {
                $query->where("conversations.receiver_id", $auth->id)
                    ->orWhere("conversations.sender_id", $auth->id);
            })->distinct('conversations.id')->orderBy("conversations.id", "DESC")->get();

        foreach ($conversations as $key => $conversation) {
            $userId = ($conversation->sender_id == $auth->id ? $conversation->receiver_id : $conversation->sender_id);
            $conversation->latest_message = Message::select(['id', 'message_text', 'sender_id', 'seen_at', 'updated_at'])->where("conversation_id", $conversation->id)->latest()->first();
            if ($conversation->latest_message) {
                $conversation->latest_message->updated_at_diff = $conversation->latest_message->updated_at->diffForHumans();
            }
            $conversation->user = User::select(['id', 'full_name', 'username'])->where("id", $userId)->first();
        }

        return $this->return(200, "Conversations fetched successfully", ['conversations' => $conversations]);
    }

    public function messages(int $conversationId): JsonResponse {
        $auth = auth()->guard('api')->user();
        $conversation = Conversation::whereId($conversationId)
            ->where(function ($query) use ($auth) {
                $query->where("conversations.receiver_id", $auth->id)
                    ->orWhere("conversations.sender_id", $auth->id);
            })
            ->first();
        if (!$conversation) {
            return $this->return(400, "Conversation not exists");
        }

        $user = User::select(['users.id', 'full_name', 'username'])->whereId($conversation->receiver_id == $auth->id ? $conversation->sender_id : $conversation->receiver_id)->first();
        $messages = Message::where("conversation_id", $conversationId)->latest('id')->paginate(20);
        foreach ($messages as $message) {
            $message = Message::formatMessage($message, $auth->id);
        }
        
        return $this->return(200, "Conversation fetched successfully", ['messages' => $messages, 'user' => $user]);
    }
}
