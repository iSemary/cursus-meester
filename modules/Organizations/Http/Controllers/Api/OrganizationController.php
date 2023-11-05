<?php

namespace modules\Organizations\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use modules\Organizations\Entities\Organization;
use modules\Organizations\Http\Requests\CreateOrganizationRequest;
use modules\Organizations\Http\Requests\UpdateOrganizationRequest;

class OrganizationController extends ApiController {
    /**
     * The index function retrieves organizations from the database and returns them as a JSON response.
     * 
     * @param Request request The  parameter is an instance of the Request class, which represents
     * an HTTP request. It contains information about the request such as the request method, headers,
     * query parameters, and request body. In this case, it is used to retrieve any query parameters that
     * may be passed to the index method.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200, a success message of 'Organizations
     * fetched successfully', and an array of organizations.
     */
    public function index(Request $request): JsonResponse {
        $organizations = Organization::orderBy('title', "DESC")->paginate(20);
        return $this->return(200, 'Organizations fetched successfully', ['organizations' => $organizations]);
    }

    /**
     * The function "show" retrieves a organization by its ID and returns a JSON response with the organization's
     * title, parent ID, and icon if it exists, or an error message if it doesn't.
     * 
     * @param Organization organization The parameter "organization" is an instance of the Organization model. It is used
     * to retrieve the organization with the specified ID from the database.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function show(Organization $organization): JsonResponse {
        $organization = Organization::select('title', 'parent_id', 'icon')->find($organization->id);
        if (!$organization) {
            return $this->return(400, 'Organization not exists');
        }
        return $this->return(200, 'Organization fetched Successfully', ['organization' => $organization]);
    }

    /**
     * The function stores a new organization using the validated data from the CreateOrganizationRequest and
     * returns a JSON response with a success message.
     * 
     * @param CreateOrganizationRequest createOrganizationRequest The  parameter is an
     * instance of the CreateOrganizationRequest class. It is used to validate and store the data for creating
     * a new organization.
     * 
     * @return JsonResponse A JsonResponse object is being returned.
     */
    public function store(CreateOrganizationRequest $createOrganizationRequest): JsonResponse {
        // create a new organization from the validated data
        Organization::create($createOrganizationRequest->validated());
        return $this->return(200, 'Organization Added Successfully');
    }

    /**
     * This PHP function updates a organization with validated data and returns a JSON response indicating the
     * success or failure of the update.
     * 
     * @param UpdateOrganizationRequest updateOrganizationRequest An instance of the UpdateOrganizationRequest class,
     * which is a request object that contains the data to update the organization.
     * @param Organization organization The "organization" parameter is an instance of the Organization model. It
     * represents the organization that needs to be updated.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function update(UpdateOrganizationRequest $updateOrganizationRequest, Organization $organization): JsonResponse {
        // Checking if the organization not exists
        if (!$organization) {
            return $this->return(400, 'Organization not exists');
        }
        // Update the organization with the validated data
        $organization->update($updateOrganizationRequest->validated());
        return $this->return(200, 'Organization updated Successfully');
    }

    /**
     * The function destroys a organization object and returns a JSON response indicating whether the deletion
     * was successful or not.
     * 
     * @param Organization organization The parameter "organization" is an instance of the Organization model. It is used
     * to identify the organization that needs to be deleted.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */

    public function destroy(Organization $organization): JsonResponse {
        // Checking if the organization not exists
        if (!$organization) {
            return $this->return(400, 'Organization not exists');
        }
        $organization->delete();
        return $this->return(200, 'Organization deleted Successfully');
    }
}
