<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\RegisterUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use stdClass;

class AuthController extends ApiController {
    /**
     * Register Method
     *
     * @param RegisterUserRequest $request
     * @return JsonResponse
     */
    public function register(RegisterUserRequest $request): JsonResponse {
        /* Requested data passed the validation */
        // Create new user record
        $user = User::create($request->validated());
        // Fire Email Confirmation Queue

        // Invoke authentication token

        // collect user details to return in the json response
        $response = $this->collectUserDetails($id);
        // Return Success Json Response
        return $this->return(200, 'User Registered Successfully', $response);
    }

    public function login(LoginUserRequest $request): JsonResponse {
        $response = $this->collectUserDetails($id);

        // Return Success Json Response
        return $this->return(200, 'User Logged in Successfully', $response);
    }

    public function collectUserDetails(int $userId): array {
    }

}
