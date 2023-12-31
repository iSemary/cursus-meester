<?php

namespace modules\Categories\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Services\Formatter\Slug;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use modules\Categories\Entities\Category;
use modules\Categories\Http\Requests\CreateCategoryRequest;
use modules\Categories\Http\Requests\UpdateCategoryRequest;
use modules\Courses\Entities\Course;
use modules\Instructors\Entities\InstructorProfile;
use stdClass;

class CategoryController extends ApiController {
    /**
     * The index function retrieves categories from the database and returns them as a JSON response.
     * 
     * @param Request request The  parameter is an instance of the Request class, which represents
     * an HTTP request. It contains information about the request such as the request method, headers,
     * query parameters, and request body. In this case, it is used to retrieve any query parameters that
     * may be passed to the index method.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200, a success message of 'Categories
     * fetched successfully', and an array of categories.
     */
    public function index(Request $request): JsonResponse {
        $total = $request->total ?? 9;
        $categories = Category::orderBy('order_number')
            ->when($request->parents, function ($query, $request) {
                $query->where("parent_id", 0)->orWhere("parent_id", null);
            })
            ->when($request->all, function ($query) {
                return $query->get();
            }, function ($query) use ($total) {
                return $query->paginate($total);
            });
        return $this->return(200, 'Categories fetched successfully', ['categories' => $categories]);
    }

    /**
     * The function "show" retrieves a category by its ID and returns a JSON response with the category's
     * title, parent ID, and icon if it exists, or an error message if it doesn't.
     * 
     * @param Category category The parameter "category" is an instance of the Category model. It is used
     * to retrieve the category with the specified ID from the database.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function show(Category $category): JsonResponse {
        $category = Category::find($category->id);
        if (!$category) {
            return $this->return(400, 'Category not exists');
        }
        return $this->return(200, 'Category fetched Successfully', ['category' => $category]);
    }


    /**
     * The getCoursesBySlug function retrieves courses based on a given category slug and returns a JSON
     * response with the category, sub-categories, and paginated courses.
     * 
     * @param string categorySlug The categorySlug parameter is a string that represents the slug of a
     * category. A slug is a URL-friendly version of a category's title, typically used in the URL to
     * identify the category.
     * 
     * @return JsonResponse a JsonResponse.
     */
    public function getCoursesBySlug(string $categorySlug): JsonResponse {
        $category = Category::select(['id', 'title', 'slug', 'parent_id', 'icon'])->whereSlug($categorySlug)->first();
        if (!$category) {
            return $this->return(400, 'Category not exists');
        }
        $response = new stdClass();
        $response->category = $category;
        $response->sub_categories = Category::select(['title', 'slug', 'parent_id', 'icon'])->where("parent_id", $category->id)->get();
        $response->top_courses = Course::selectPreview()
            ->join('rates', 'rates.course_id', 'courses.id')
            ->selectRaw('MAX(rates.rate) AS max_rate')
            ->whereCategoryId($category->id)
            ->groupBy('courses.id')
            ->orderBy("max_rate", "DESC")
            ->limit(10)
            ->get();
        $response->top_instructors = InstructorProfile::getTopInTypeId('category_id', $category->id, 10);
        $response->new_courses = Course::selectPreview()->whereCategoryId($category->id)->latest()->limit(10)->get();
        return $this->return(200, 'Courses fetched successfully', ['data' => $response]);
    }

    /**
     * The function stores a new category using the validated data from the CreateCategoryRequest and
     * returns a JSON response with a success message.
     * 
     * @param CreateCategoryRequest createCategoryRequest The  parameter is an
     * instance of the CreateCategoryRequest class. It is used to validate and store the data for creating
     * a new category.
     * 
     * @return JsonResponse A JsonResponse object is being returned.
     */
    public function store(CreateCategoryRequest $createCategoryRequest): JsonResponse {
        // create a new category from the validated data
        $data = $createCategoryRequest->validated();
        $data['slug'] = Slug::returnFormatted($data['slug']);
        Category::create($data);
        return $this->return(200, 'Category Added Successfully');
    }

    /**
     * This PHP function updates a category with validated data and returns a JSON response indicating the
     * success or failure of the update.
     * 
     * @param UpdateCategoryRequest updateCategoryRequest An instance of the UpdateCategoryRequest class,
     * which is a request object that contains the data to update the category.
     * @param Category category The "category" parameter is an instance of the Category model. It
     * represents the category that needs to be updated.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */
    public function update(UpdateCategoryRequest $updateCategoryRequest, Category $category): JsonResponse {
        // Checking if the category not exists
        if (!$category) {
            return $this->return(400, 'Category not exists');
        }
        // Update the category with the validated data
        $data = $updateCategoryRequest->validated();
        $data['slug'] = Slug::returnFormatted($data['slug']);
        $category->update($data);
        return $this->return(200, 'Category updated Successfully');
    }

    /**
     * The function destroys a category object and returns a JSON response indicating whether the deletion
     * was successful or not.
     * 
     * @param Category category The parameter "category" is an instance of the Category model. It is used
     * to identify the category that needs to be deleted.
     * 
     * @return JsonResponse A JsonResponse is being returned.
     */

    public function destroy(Category $category): JsonResponse {
        // Checking if the category not exists
        if (!$category) {
            return $this->return(400, 'Category not exists');
        }
        $category->delete();
        return $this->return(200, 'Category deleted Successfully');
    }
}
