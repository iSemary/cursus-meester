<?php

namespace modules\Chats\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use modules\Chats\Interfaces\MessageType;

class SendMessageRequest extends FormRequest {
    private string $messageTypes;
    public function __construct() {
        $messageTypes = [
            MessageType::TYPE_TEXT,
            MessageType::TYPE_IMAGE,
            MessageType::TYPE_VIDEO,
            MessageType::TYPE_VOICE,
            MessageType::TYPE_FILE,
        ];

        $this->messageTypes = implode(",", $messageTypes);
    }
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array {
        return [
            'conversation_id' => 'required|numeric|exists:conversations,id',
            'message_text' => 'sometimes|max:5000',
            'message_type' => 'required|numeric|in:' . $this->messageTypes,
            'message_file' => 'sometimes|file|mimes:png,jpg,pdf,xlsx,csv,doc,docx,mp3,ogg',
        ];
    }
}
