<?php

namespace modules\Wordings\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use modules\Wordings\Entities\Wording;
use modules\Wordings\Http\Requests\CreateWordingRequest;
use modules\Wordings\Http\Requests\UpdateWordingRequest;

class WordingController extends ApiController {
    /**
     * The index function retrieves wordings from the database and returns them as a JSON response.
     * 
     * @param Request request The  parameter is an instance of the Request class, which represents
     * an HTTP request. It contains information about the request such as the request method, headers,
     * query parameters, and request body. In this case, it is used to retrieve any query parameters that
     * may be passed to the index method.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200, a success message of 'Wording
     * fetched successfully', and an array of wordings.
     */
    public function index(Request $request): JsonResponse {
        $wordings = Wording::select(['id', 'wording_key', 'wording_value', 'wording_language_id'])
            ->orderBy('id', 'DESC')
            ->with('language')
            ->when($request->all, function ($query) {
                return $query->get();
            }, function ($query) {
                return $query->paginate(5);
            });

        $lastWordingUpdatedAt = Wording::orderBy('updated_at', 'DESC')->first();
        if ($lastWordingUpdatedAt) {
            $lastWordingUpdatedAt = strtotime($lastWordingUpdatedAt->updated_at);
        }

        $allowGeneration = $lastWordingUpdatedAt;

        return $this->return(200, 'Wording fetched successfully', ['wordings' => $wordings, 'allow_generation' => $allowGeneration]);
    }

    /**
     * The function "show" retrieves a wording by its ID and returns a JSON response with the wording's
     * title, parent ID, and icon if it exists, or an error message if it doesn't.
     * 
     * @param Wording wording The parameter "wording" is an instance of the Wording model. It is used
     * to retrieve the wording with the specified ID from the database.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function show(Wording $wording): JsonResponse {
        $wording = Wording::select(['id', 'wording_key', 'wording_value', 'wording_language_id'])->whereId($wording->id)
            ->with('language')
            ->first();
        if (!$wording) {
            return $this->return(400, 'Wording not exists');
        }
        return $this->return(200, 'Wording fetched Successfully', ['wording' => $wording]);
    }

    /**
     * The function stores a new wording using the validated data from the CreateWordingRequest and
     * returns a JSON response with a success message.
     * 
     * @param CreateWordingRequest createWordingRequest The  parameter is an
     * instance of the CreateWordingRequest class. It is used to validate and store the data for creating
     * a new wording.
     * 
     * @return JsonResponse A JsonResponse object is being returned.
     */
    public function store(CreateWordingRequest $createWordingRequest): JsonResponse {
        // create a new wording from the validated data
        Wording::create($createWordingRequest->validated());
        return $this->return(200, 'Wording Added Successfully');
    }

    /**
     * This PHP function updates a wording with validated data and returns a JSON response indicating the
     * success or failure of the update.
     * 
     * @param UpdateWordingRequest updateWordingRequest An instance of the UpdateWordingRequest class,
     * which is a request object that contains the data to update the wording.
     * @param Wording wording The "wording" parameter is an instance of the Wording model. It
     * represents the wording that needs to be updated.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function update(UpdateWordingRequest $updateWordingRequest, Wording $wording): JsonResponse {
        // Checking if the wording not exists
        if (!$wording) {
            return $this->return(400, 'Wording not exists');
        }
        // Update the wording with the validated data
        $wording->update($updateWordingRequest->validated());
        return $this->return(200, 'Wording updated Successfully');
    }

    /**
     * The function destroys a wording object and returns a JSON response indicating whether the deletion
     * was successful or not.
     * 
     * @param Wording wording The parameter "wording" is an instance of the Wording model. It is used
     * to identify the wording that needs to be deleted.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */

    public function destroy(Wording $wording): JsonResponse {
        // Checking if the wording not exists
        if (!$wording) {
            return $this->return(400, 'Wording not exists');
        }
        $wording->delete();
        return $this->return(200, 'Wording deleted Successfully');
    }
}
