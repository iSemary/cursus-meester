<?php

namespace App\Http\Controllers\Api\Utilities;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\Utilities\Currency\CreateCurrencyRequest;
use App\Http\Requests\Utilities\Currency\UpdateCurrencyRequest;
use App\Models\Utilities\Currency;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CurrencyController extends ApiController {
    /**
     * The index function retrieves currencies from the database and returns them as a JSON response.
     * 
     * @param Request request The  parameter is an instance of the Request class, which represents
     * an HTTP request. It contains information about the request such as the request method, headers,
     * query parameters, and request body. In this case, it is used to retrieve any query parameters that
     * may be passed to the index method.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200, a success message of 'Currency
     * fetched successfully', and an array of currencies.
     */
    public function index(Request $request): JsonResponse {
        $currencies = Currency::orderBy('name', 'ASC')->when($request->all, function ($query) {
            return $query->get();
        }, function ($query) {
            return $query->paginate(20);
        });
        
        return $this->return(200, 'Currency fetched successfully', ['currencies' => $currencies]);
    }

    /**
     * The function "show" retrieves a currency by its ID and returns a JSON response with the currency's
     * title, parent ID, and icon if it exists, or an error message if it doesn't.
     * 
     * @param Currency currency The parameter "currency" is an instance of the Currency model. It is used
     * to retrieve the currency with the specified ID from the database.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function show(Currency $currency): JsonResponse {
        $currency = Currency::select(['name', 'value', 'country_id'])->find($currency->id);
        if (!$currency) {
            return $this->return(400, 'Currency not exists');
        }
        return $this->return(200, 'Currency fetched Successfully', ['currency' => $currency]);
    }

    /**
     * The function stores a new currency using the validated data from the CreateCurrencyRequest and
     * returns a JSON response with a success message.
     * 
     * @param CreateCurrencyRequest createCurrencyRequest The  parameter is an
     * instance of the CreateCurrencyRequest class. It is used to validate and store the data for creating
     * a new currency.
     * 
     * @return JsonResponse A JsonResponse object is being returned.
     */
    public function store(CreateCurrencyRequest $createCurrencyRequest): JsonResponse {
        // create a new currency from the validated data
        Currency::create($createCurrencyRequest->validated());
        return $this->return(200, 'Currency Added Successfully');
    }

    /**
     * This PHP function updates a currency with validated data and returns a JSON response indicating the
     * success or failure of the update.
     * 
     * @param UpdateCurrencyRequest updateCurrencyRequest An instance of the UpdateCurrencyRequest class,
     * which is a request object that contains the data to update the currency.
     * @param Currency currency The "currency" parameter is an instance of the Currency model. It
     * represents the currency that needs to be updated.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function update(UpdateCurrencyRequest $updateCurrencyRequest, Currency $currency): JsonResponse {
        // Checking if the currency not exists
        if (!$currency) {
            return $this->return(400, 'Currency not exists');
        }
        // Update the currency with the validated data
        $currency->update($updateCurrencyRequest->validated());
        return $this->return(200, 'Currency updated Successfully');
    }

    /**
     * The function destroys a currency object and returns a JSON response indicating whether the deletion
     * was successful or not.
     * 
     * @param Currency currency The parameter "currency" is an instance of the Currency model. It is used
     * to identify the currency that needs to be deleted.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */

    public function destroy(Currency $currency): JsonResponse {
        // Checking if the currency not exists
        if (!$currency) {
            return $this->return(400, 'Currency not exists');
        }
        $currency->delete();
        return $this->return(200, 'Currency deleted Successfully');
    }
}
