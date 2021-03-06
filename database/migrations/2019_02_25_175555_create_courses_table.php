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
            $table->foreign('regulation_id')->references('id')->on('regulations')->onDelete('cascade');
            $table->string('number')->nullable();
            $table->string('code')->nullable();
            $table->float('hours')->nullable();
            $table->text('description')->nullable();
            $table->date('expiration_date')->nullable();
            $table->string('class_flyer_template')->nullable();
            $table->string('class_docs_template')->nullable();
            $table->string('material')->nullable();
            $table->string('commercial_link')->nullable();
			$table->boolean('is_workshop')->default(false);
            $table->boolean('is_deleted')->default(false);
            $table->timestamps();
        });

        Schema::create('course_user', function (Blueprint $table) {
            $table->integer('course_id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->primary(['course_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('course_user');
        Schema::dropIfExists('courses');
    }
}
