<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\Industry\CreateIndustryRequest;
use App\Http\Requests\Industry\UpdateIndustryRequest;
use App\Models\Utilities\Industry;
use App\Services\Formatter\Slug;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IndustryController extends ApiController {
    /**
     * The index function retrieves industries from the database and returns them as a JSON response.
     * 
     * @param Request request The  parameter is an instance of the Request class, which represents
     * an HTTP request. It contains information about the request such as the request method, headers,
     * query parameters, and request body. In this case, it is used to retrieve any query parameters that
     * may be passed to the index method.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200, a success message of 'Industry
     * fetched successfully', and an array of industries.
     */
    public function index(Request $request): JsonResponse {
        $industries = Industry::orderBy('title', "DESC")->paginate(20);
        return $this->return(200, 'Industry fetched successfully', ['industries' => $industries]);
    }

    /**
     * The function "show" retrieves a industry by its ID and returns a JSON response with the industry's
     * title, parent ID, and icon if it exists, or an error message if it doesn't.
     * 
     * @param Industry industry The parameter "industry" is an instance of the Industry model. It is used
     * to retrieve the industry with the specified ID from the database.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function show(Industry $industry): JsonResponse {
        $industry = Industry::select('title', 'slug', 'description')->find($industry->id);
        if (!$industry) {
            return $this->return(400, 'Industry not exists');
        }
        return $this->return(200, 'Industry fetched Successfully', ['industry' => $industry]);
    }

    /**
     * The function stores a new industry using the validated data from the CreateIndustryRequest and
     * returns a JSON response with a success message.
     * 
     * @param CreateIndustryRequest createIndustryRequest The  parameter is an
     * instance of the CreateIndustryRequest class. It is used to validate and store the data for creating
     * a new industry.
     * 
     * @return JsonResponse A JsonResponse object is being returned.
     */
    public function store(CreateIndustryRequest $createIndustryRequest): JsonResponse {
        // create a new industry from the validated data
        $data = $createIndustryRequest->validated();
        $data['slug'] = Slug::returnFormatted($data['slug']);
        Industry::create($data);
        return $this->return(200, 'Industry Added Successfully');
    }

    /**
     * This PHP function updates a industry with validated data and returns a JSON response indicating the
     * success or failure of the update.
     * 
     * @param UpdateIndustryRequest updateIndustryRequest An instance of the UpdateIndustryRequest class,
     * which is a request object that contains the data to update the industry.
     * @param Industry industry The "industry" parameter is an instance of the Industry model. It
     * represents the industry that needs to be updated.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function update(UpdateIndustryRequest $updateIndustryRequest, Industry $industry): JsonResponse {
        // Checking if the industry not exists
        if (!$industry) {
            return $this->return(400, 'Industry not exists');
        }
        // Update the industry with the validated data
        $data = $updateIndustryRequest->validated();
        $data['slug'] = Slug::returnFormatted($data['slug']);
        $industry->update($data);
        return $this->return(200, 'Industry updated Successfully');
    }

    /**
     * The function destroys a industry object and returns a JSON response indicating whether the deletion
     * was successful or not.
     * 
     * @param Industry industry The parameter "industry" is an instance of the Industry model. It is used
     * to identify the industry that needs to be deleted.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */

    public function destroy(Industry $industry): JsonResponse {
        // Checking if the industry not exists
        if (!$industry) {
            return $this->return(400, 'Industry not exists');
        }
        $industry->delete();
        return $this->return(200, 'Industry deleted Successfully');
    }
}
