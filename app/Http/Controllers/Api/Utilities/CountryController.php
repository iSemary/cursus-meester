<?php

namespace App\Http\Controllers\Api\Utilities;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\Utilities\Country\CreateCountryRequest;
use App\Http\Requests\Utilities\Country\UpdateCountryRequest;
use App\Models\Country;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CountryController extends ApiController {
    /**
     * The index function retrieves countries from the database and returns them as a JSON response.
     * 
     * @param Request request The  parameter is an instance of the Request class, which represents
     * an HTTP request. It contains information about the request such as the request method, headers,
     * query parameters, and request body. In this case, it is used to retrieve any query parameters that
     * may be passed to the index method.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200, a success message of 'Country
     * fetched successfully', and an array of countries.
     */
    public function index(Request $request): JsonResponse {
        $countries = Country::orderBy('name', "ASC")->paginate(20);
        return $this->return(200, 'Country fetched successfully', ['countries' => $countries]);
    }

    /**
     * The function "show" retrieves a country by its ID and returns a JSON response with the country's
     * title, parent ID, and icon if it exists, or an error message if it doesn't.
     * 
     * @param Country country The parameter "country" is an instance of the Country model. It is used
     * to retrieve the country with the specified ID from the database.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function show(Country $country): JsonResponse {
        $country = Country::select(['iso', 'name', 'iso3', 'num_code', 'phone_code', 'continent_code', 'status'])->find($country->id);
        if (!$country) {
            return $this->return(400, 'Country not exists');
        }
        return $this->return(200, 'Country fetched Successfully', ['country' => $country]);
    }

    /**
     * The function stores a new country using the validated data from the CreateCountryRequest and
     * returns a JSON response with a success message.
     * 
     * @param CreateCountryRequest createCountryRequest The  parameter is an
     * instance of the CreateCountryRequest class. It is used to validate and store the data for creating
     * a new country.
     * 
     * @return JsonResponse A JsonResponse object is being returned.
     */
    public function store(CreateCountryRequest $createCountryRequest): JsonResponse {
        // create a new country from the validated data
        Country::create($createCountryRequest->validated());
        return $this->return(200, 'Country Added Successfully');
    }

    /**
     * This PHP function updates a country with validated data and returns a JSON response indicating the
     * success or failure of the update.
     * 
     * @param UpdateCountryRequest updateCountryRequest An instance of the UpdateCountryRequest class,
     * which is a request object that contains the data to update the country.
     * @param Country country The "country" parameter is an instance of the Country model. It
     * represents the country that needs to be updated.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function update(UpdateCountryRequest $updateCountryRequest, Country $country): JsonResponse {
        // Checking if the country not exists
        if (!$country) {
            return $this->return(400, 'Country not exists');
        }
        // Update the country with the validated data
        $country->update($updateCountryRequest->validated());
        return $this->return(200, 'Country updated Successfully');
    }

    /**
     * The function destroys a country object and returns a JSON response indicating whether the deletion
     * was successful or not.
     * 
     * @param Country country The parameter "country" is an instance of the Country model. It is used
     * to identify the country that needs to be deleted.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */

    public function destroy(Country $country): JsonResponse {
        // Checking if the country not exists
        if (!$country) {
            return $this->return(400, 'Country not exists');
        }
        $country->delete();
        return $this->return(200, 'Country deleted Successfully');
    }
}
