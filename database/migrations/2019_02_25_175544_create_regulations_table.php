<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRegulationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('regulations', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('abbreviation');
            $table->string('commission_name');
            $table->string('commission_abbreviation');
            $table->string('contact_first_name');
            $table->string('contact_last_name');
            $table->string('contact_email_address');
            $table->string('contact_phone');
            $table->string('contact_street_address');
            $table->string('contact_city');
            $table->string('contact_state');
            $table->string('contact_zip_code');
            $table->text('regulations');
            $table->string('regulations_doc');
            $table->text('ce_requirements_statement');
            $table->boolean('must_specify_courses');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('regulations');
    }
}
