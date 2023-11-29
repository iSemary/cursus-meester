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
        $conversation = Conversation::initiate(
            auth()->guard('api')->id(),
            $initiateConversationRequest->validated()['receiver_id'],
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
        $messageInstance['sender_id'] = auth()->guard('api')->id();

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
            })->distinct('conversations.id')->get();

        foreach ($conversations as $key => $conversation) {
            $userId = ($conversation->sender_id == $auth->id ? $conversation->receiver_id : $conversation->sender_id);
            $conversation->latest_message = Message::select(['id', 'message_text', 'seen_at'])->where("conversation_id", $conversation->id)->latest()->first();
            $conversation->user = User::select(['id', 'full_name', 'username'])->where("id", $userId)->first();
        }

        return $this->return(200, "Conversations fetched successfully", ['conversations' => $conversations]);
    }
    public function messages(): JsonResponse {
        return $this->return(200, "Conversation marked seen");
    }
}
