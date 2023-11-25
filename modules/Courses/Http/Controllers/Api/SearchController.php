<?php

namespace modules\Courses\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use modules\Courses\Entities\Course;
use modules\Courses\Entities\UserSearch;

class SearchController extends ApiController {
    /**
     * The function searches for courses based on a keyword provided in the request, saves the search
     * results for authenticated users, and returns the courses along with the keyword used for the search.
     * 
     * @param Request request The `` parameter is an instance of the `Illuminate\Http\Request`
     * class. It represents the HTTP request made to the server and contains information such as the
     * request method, headers, query parameters, and request body.
     * 
     * @return JsonResponse a JsonResponse.
     */
    public function search(Request $request): JsonResponse {
        $keyword = $request->q;
        if (!$keyword) {
            return $this->return(400, "Keyword is required");
        }
        // for authenticated users, save the results
        if (auth('api')->user()) {
            UserSearch::updateOrCreate(['user_id' => auth('api')->user()->id, 'keyword' => $keyword]);
        }

        $courses = Course::selectPreview()
            ->where("title", "like", "%" . $keyword . "%")
            ->orWhere("description", "like", "%" . $keyword . "%")
            ->orderByDesc("id")->paginate(20);

        return $this->return(200, "Query results fetched", ['results' => $courses, "keyword" => $keyword]);
    }

    /**
     * The function searches for courses in the database based on a keyword and returns the results
     * along with the keyword used for the search.
     * 
     * @param Request request The  parameter is an instance of the Request class, which is used
     * to retrieve data from the HTTP request. In this case, it is used to retrieve the value of the 'q'
     * parameter from the request URL.
     * 
     * @return JsonResponse a JsonResponse with the following data:
     * - Status code: 200
     * - Message: "Query results fetched"
     * - Data: an array containing the 'courses' and 'keyword' values
     */
    public function searchTiny(Request $request): JsonResponse {
        $keyword = $request->q;
        $courses = DB::table('courses')->select(['title', 'slug'])
            ->where("title", "like", "%" . $keyword . "%")
            ->orWhere("description", "like", "%" . $keyword . "%")
            ->limit(10)->orderByDesc("id")->get();
        return $this->return(200, "Query results fetched", ['results' => $courses, "keyword" => $keyword]);
    }
}
