<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCoursesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title');
            $table->integer('regulation_id')->unsigned()->default(1);
            $table->foreign('regulation_id')->references('id')->on('regulations');
            $table->string('number');
            $table->string('code');
            $table->integer('hours');
            $table->text('description');
            $table->date('expiration_date');
            $table->string('class_flyer_template');
            $table->string('class_docs_template');
            $table->string('material');
            $table->string('commercial_link');
            $table->boolean('is_deleted')->default(false);
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
        Schema::dropIfExists('courses');
    }
}
