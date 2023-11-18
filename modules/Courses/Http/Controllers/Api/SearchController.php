<?php

namespace modules\Courses\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use modules\Courses\Entities\Course;

class SearchController extends ApiController {


    public function search() {
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
        return $this->return(200, "Query results fetched", ['courses' => $courses, "keyword" => $keyword]);
    }
}
