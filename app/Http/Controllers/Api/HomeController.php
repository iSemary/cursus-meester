<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use modules\Categories\Entities\Category;
use modules\Courses\Entities\Course;
use modules\Instructors\Entities\InstructorProfile;
use modules\Organizations\Entities\Organization;
use stdClass;

class HomeController extends ApiController {
    /**
     * The index function returns a JSON response containing various data related to courses, instructors,
     * and organizations.
     * 
     * @return JsonResponse a JsonResponse object.
     */
    public function index(): JsonResponse {
        $response = new stdClass();

        $response->most_recent_courses = $this->getMostRecentCourses();
        $response->top_rated_courses = $this->getTopRatedCourses();
        $response->random_popular_category_courses = $this->getRandomPopularCategory();
        $response->short_courses = $this->getShortCourses();
        $response->top_instructors = $this->getTopInstructors();
        $response->top_organizations = $this->getTopOrganizations();
        $response->top_soft_skills_courses = $this->getTopSoftSkillsCourses();

        return $this->return(200, "Home fetched successfully", ['response' => $response]);
    }

    /**
     * The function returns the 10 most recent courses with their preview information.
     * 
     * @return Collection a collection of the most recent courses.
     */
    public function getMostRecentCourses(): Collection {
        return Course::selectPreview()->orderByDesc('id')->limit(10)->get();
    }
    /**
     * The function `getTopRatedCourses` returns a collection of the top 10 rated courses with their
     * preview information.
     * 
     * @return Collection a collection of the top-rated courses.
     */
    public function getTopRatedCourses(): Collection {
        return Course::selectPreview()->topRated()->limit(10)->get();
    }


    /**
     * The function getRandomPopularCategory() returns a random popular category with its associated
     * courses.
     * 
     * @return Category a random popular category.
     */
    public function getRandomPopularCategory(): Category {
        return Category::getRandomWithCourses()->first();
    }

    /**
     * The function returns a collection of short courses with a preview, limited to 10.
     * 
     * @return Collection a collection of short courses.
     */
    public function getShortCourses(): Collection {
        return Course::selectPreview()->shorts()->limit(10)->get();
    }

    /**
     * The function "getTopInstructors" returns a collection of the top 10 instructor profiles.
     * 
     * @return Collection a collection of the top 10 instructor profiles.
     */
    public function getTopInstructors(): Collection {
        return InstructorProfile::getTop(4);
    }

    /**
     * The function returns a collection of the top 10 organizations.
     * 
     * @return Collection a collection of the top 10 organizations.
     */
    public function getTopOrganizations(): Collection {
        return Organization::getTop()->limit(10)->get();
    }

    /**
     * The function getTopSoftSkillsCourses() returns a soft skill category with its associated
     * courses.
     * 
     * @return Category a soft skill with it's courses.
     */
    public function getTopSoftSkillsCourses(): Category {
        return Category::getSoftSkillsCourses()->first();
    }
}
