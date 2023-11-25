<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Collection;
use modules\Courses\Entities\Course;
use stdClass;

class HomeController extends ApiController {
    public function index() {
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

    public function getMostRecentCourses(): Collection {
        return Course::selectPreview()->limit(10)->get();
    }

    public function getTopRatedCourses(): Collection {
        return Course::selectPreview()->limit(10)->get();
    }

    public function getRandomPopularCategory(): Collection {
        return Course::selectPreview()->limit(10)->get();
    }

    public function getShortCourses(): Collection {
        return Course::selectPreview()->limit(10)->get();
    }

    public function getTopInstructors(): Collection {
        return Course::selectPreview()->limit(10)->get();
    }

    public function getTopOrganizations(): Collection {
        return Course::selectPreview()->limit(10)->get();
    }

    public function getTopSoftSkillsCourses(): Collection {
        return Course::selectPreview()->limit(10)->get();
    }
}
