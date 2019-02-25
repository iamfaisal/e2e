<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use App\Category;
use App\Course;

class CoursesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // define base categories
        $categories = [
            "agency"        => "Agency",
            "agency-law"    => "Agency Law",
            "ce-core"       => "CE Core",
            "ce-credit"     => "CE Credit",
        ];

        $courses = [
            [
                'title' => 'Strategic Financing - What Agents Should Know',
                'state' => 'AZ',
                'number' => 'C2558',
                'code' => 'AZSTF3',
                'hours' => 3,
                'description' => 'We will explore some of the vital “niche” loan products available in the mortgage industry today. You will learn the practical application of these loans and therefore will leave with the knowledge necessary to create more transactions and protect your clients.',
                'expiration_date' => Carbon::now(),
                'class_flyer_template' => 'http://school.educate2earn.com/uploads/courses/25/flyer/AZSTF%20Flyer%207.18.docx',
                'class_docs_template' => 'http://school.educate2earn.com/uploads/courses/25/docs/AZSTF%20Roster%20Cert%20Fillable%2011.18.pdf',
                'material' => 'http://school.educate2earn.com/uploads/courses/25/materials/STF3%20Materials%201.19.zip',
                'commercial_link' => 'http://school.educate2earn.com',
                'is_deleted' => false
            ]
        ];

        // assign courses to categories
        foreach ($categories as $key => $value) {
            $category = new Category([
                'name'  => $key,
                'label' => $value
            ]);
            if ($category->save()) {
                foreach ($courses as $course) {
                    $dbCourse = new Course($course);
                    $dbCourse->save();
                    $dbCourse->assign($category);
                }
            }
        }
    }
}
