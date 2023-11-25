<?php

namespace modules\Wordings\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Models\Utilities\Language;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use modules\Wordings\Entities\Wording;
use modules\Wordings\Http\Requests\CreateWordingRequest;
use modules\Wordings\Http\Requests\UpdateWordingRequest;
use stdClass;

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
     * The function generates translation files for multiple languages based on the available wordings and
     * exported translation paths.
     * 
     * @return JsonResponse a JsonResponse object.
     */
    public function generate(): JsonResponse {
        try {
            $languages = Language::select("id", "key")->get();
            $generatedPaths = (new Wording)->translationPaths;
            if ($languages && count($languages)) {
                // loop over available system languages
                foreach ($languages as $language) {
                    // Check and get wordings by it's language
                    $wordings = $this->getWordingsByLanguageId($language->id);
                    if ($wordings && count($wordings)) {
                        // loop over exported generated translation paths
                        foreach ($generatedPaths as $key => $generatedPath) {
                            if (chmod($generatedPath, 0777)) {
                                $this->createTranslationFile($generatedPath, $language->key, $wordings);
                            } else {
                                return $this->return(400, 'Permission denied: Couldn\'t overwrite the translation.');
                            }
                        }
                    }
                }
            }
            return $this->return(200, 'Translation files generated successfully');
        } catch (\Exception $e) {
            return $this->return(400, 'Something went wrong', debug: $e->getMessage());
        }
    }


    /**
     * The function creates a translation file in JSON format with the provided language key and wordings.
     * 
     * @param string generatedPath The path where the translation file will be generated. It should be a
     * string representing the directory path where the file will be created.
     * @param string languageKey The `languageKey` parameter is a string that represents the language code
     * or key for the translation file. It is used to generate the file name for the translation file. For
     * example, if the `languageKey` is "en", the generated file name will be "en.json".
     * @param Collection wordings The `wordings` parameter is a `Collection` object that contains a
     * collection of wordings. Each wording has a `wording_key` and a `wording_value`.
     */
    public function createTranslationFile(string $generatedPath, string $languageKey, Collection $wordings): void {
        // prepare file path
        $langPath = $generatedPath . $languageKey . '.json';
        // check if file not exists then create the file
        if (!file_exists($langPath)) {
            fopen($langPath, "w");
        }
        $translateObject = new stdClass();

        foreach ($wordings as $wording) {
            $translateObject->{$wording->wording_key} = $wording->wording_value;
        }
        $translateArray = (array) $translateObject;
        $jsonResult = json_encode($translateArray, JSON_PRETTY_PRINT);

        file_put_contents($langPath, $jsonResult);
    }

    public function getWordingsByLanguageId($languageId) {
        return Wording::select('wording_key', 'wording_value')
            ->where("wording_language_id", $languageId)
            ->orderBy("wording_key")
            ->get();
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
