<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use stdClass;

class ApiController extends Controller {


    /**
     * The function returns a JSON response with a status code, message, data, errors, and timestamp.
     * 
     * @param int status The status parameter is an integer that represents the HTTP status code of the
     * response. It indicates the success or failure of the request.
     * @param string message The "message" parameter is a string that represents a custom message that you
     * want to include in the response. It can be used to provide additional information or instructions to
     * the client.
     * @param array data The `` parameter is an array that contains any additional data that you want
     * to include in the response. This can be any information that you want to send back to the client.
     * @param array errors The `errors` parameter is an array that contains any error messages or
     * information related to the request or operation. It can be used to provide additional details about
     * any errors that occurred during the execution of the code.
     * 
     * @return JsonResponse a JsonResponse object.
     */
    public function return(int $status, string $message = '', array $data = [], array $errors = []): JsonResponse {
        $response = new stdClass();
        $response->status = $status;
        $response->success = $status == 200 ? true : false;
        $response->message = $message;
        $response->data = $data;
        $response->errors = $errors;
        $response->timestamp = time();
        return response()->json($response, $status);
    }
}
