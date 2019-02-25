<?php

use App\Regulation;
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

        $regulations = [
            'name' => 'Texas',
            'abbreviation' => 'TX',
            'commission_name' => 'Texas Real Estate Commission',
            'commission_abbreviation' => 'TREC',
            'contact_first_name' => 'Texas',
            'contact_last_name' => 'Texas',
            'contact_email_address' => 'Texas',
            'contact_phone' => 'Texas',
            'contact_street_address' => 'Texas',
            'contact_state' => 'Texas',
            'contact_city' => 'Texas',
            'contact_zip_code' => 'Texas',
            'regulations' => 'Texas',
            'regulations_doc' => 'Texas',
            'ce_requirements_statement' => '<h3>Active sales agent license renewal requirements:</h3><ul><li>Complete 18 hours of approved Continuing Education (CE) courses<ul><li>8 hours of TREC Legal Update I and II; and</li><li>10 hours of elective CE</li></ul></li><li>If you have been made a supervisor by your broker, you may also need to take the 6-hour Broker Responsibility course as part of your 18 hours of CE.</li></ul><h4>If applying for the first time, you must take:</h4><p>180 classroom hours of the following&nbsp;qualifying real estate courses</p><ul><li>Principles of Real Estate I (30 classroom hours)</li><li>Principles of Real Estate II (30 classroom hours)</li><li>Law of Agency (30 classroom hours)</li><li>Law of Contracts (30 classroom hours)</li><li>Promulgated Contracts Forms (30 classroom hours)</li><li>Real Estate Finance (30 classroom hours)</li></ul>',
            'must_specify_courses' => true
        ];

        $regulation = new Regulation($regulations);
        $regulation->save();

        $courses = [
            [
                'title' => 'Strategic Financing - What Agents Should Know',
                'regulation_id' => $regulation->id,
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
