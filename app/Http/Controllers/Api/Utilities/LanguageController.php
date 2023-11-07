<?php

namespace App\Http\Controllers\Api\Utilities;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\Utilities\Language\CreateLanguageRequest;
use App\Http\Requests\Utilities\Language\UpdateLanguageRequest;
use App\Models\Utilities\Language;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LanguageController extends ApiController {
    /**
     * The index function retrieves languages from the database and returns them as a JSON response.
     * 
     * @param Request request The  parameter is an instance of the Request class, which represents
     * an HTTP request. It contains information about the request such as the request method, headers,
     * query parameters, and request body. In this case, it is used to retrieve any query parameters that
     * may be passed to the index method.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200, a success message of 'Language
     * fetched successfully', and an array of languages.
     */
    public function index(Request $request): JsonResponse {
        $languages = Language::select(['id', 'name', 'key'])->orderBy('name', 'ASC')->when($request->all, function ($query) {
            return $query->get();
        }, function ($query) {
            return $query->paginate(20);
        });

        return $this->return(200, 'Language fetched successfully', ['languages' => $languages]);
    }

    /**
     * The function "show" retrieves a language by its ID and returns a JSON response with the language's
     * title, parent ID, and icon if it exists, or an error message if it doesn't.
     * 
     * @param Language language The parameter "language" is an instance of the Language model. It is used
     * to retrieve the language with the specified ID from the database.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function show(Language $language): JsonResponse {
        $language = Language::select(['name', 'key'])->find($language->id);
        if (!$language) {
            return $this->return(400, 'Language not exists');
        }
        return $this->return(200, 'Language fetched Successfully', ['language' => $language]);
    }

    /**
     * The function stores a new language using the validated data from the CreateLanguageRequest and
     * returns a JSON response with a success message.
     * 
     * @param CreateLanguageRequest createLanguageRequest The  parameter is an
     * instance of the CreateLanguageRequest class. It is used to validate and store the data for creating
     * a new language.
     * 
     * @return JsonResponse A JsonResponse object is being returned.
     */
    public function store(CreateLanguageRequest $createLanguageRequest): JsonResponse {
        // create a new language from the validated data
        Language::create($createLanguageRequest->validated());
        return $this->return(200, 'Language Added Successfully');
    }

    /**
     * This PHP function updates a language with validated data and returns a JSON response indicating the
     * success or failure of the update.
     * 
     * @param UpdateLanguageRequest updateLanguageRequest An instance of the UpdateLanguageRequest class,
     * which is a request object that contains the data to update the language.
     * @param Language language The "language" parameter is an instance of the Language model. It
     * represents the language that needs to be updated.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function update(UpdateLanguageRequest $updateLanguageRequest, Language $language): JsonResponse {
        // Checking if the language not exists
        if (!$language) {
            return $this->return(400, 'Language not exists');
        }
        // Update the language with the validated data
        $language->update($updateLanguageRequest->validated());
        return $this->return(200, 'Language updated Successfully');
    }

    /**
     * The function destroys a language object and returns a JSON response indicating whether the deletion
     * was successful or not.
     * 
     * @param Language language The parameter "language" is an instance of the Language model. It is used
     * to identify the language that needs to be deleted.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */

    public function destroy(Language $language): JsonResponse {
        // Checking if the language not exists
        if (!$language) {
            return $this->return(400, 'Language not exists');
        }
        $language->delete();
        return $this->return(200, 'Language deleted Successfully');
    }
}
