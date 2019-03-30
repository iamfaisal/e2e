<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLessonsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned()->default(1);
            $table->foreign('user_id')->references('id')->on('users');
            $table->integer('course_id')->unsigned()->default(1);
            $table->foreign('course_id')->references('id')->on('courses');
            $table->integer('venue_id')->unsigned()->default(1);
            $table->foreign('venue_id')->references('id')->on('venues');
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->integer('price');
            $table->integer('capacity');
            $table->string('alternate_instructor')->nullable();
            $table->string('guest_speaker')->nullable();
            $table->string('rsvp_contact')->nullable();
            $table->string('rsvp_phone')->nullable();
            $table->string('rsvp_email')->nullable();
            $table->string('rsvp_link_text')->nullable();
            $table->string('rsvp_link_url')->nullable();
            $table->string('flyer')->nullable();
            $table->string('flyer_image')->nullable();
            $table->string('docs')->nullable();
            $table->string('roster')->nullable();
            $table->string('status');
            $table->boolean('is_approved')->default(false);
            $table->boolean('is_deleted')->default(false);
            $table->boolean('is_cancelled')->default(false);
            $table->timestamps();
        });

        Schema::create('lesson_sponsor', function (Blueprint $table) {
            $table->integer('lesson_id')->unsigned();
            $table->integer('sponsor_id')->unsigned();
            $table->foreign('lesson_id')->references('id')->on('lessons')->onDelete('cascade');
            $table->foreign('sponsor_id')->references('id')->on('sponsors')->onDelete('cascade');
            $table->primary(['lesson_id', 'sponsor_id']);
        });

        Schema::create('lesson_student', function (Blueprint $table) {
            $table->integer('lesson_id')->unsigned();
            $table->integer('student_id')->unsigned();
            $table->foreign('lesson_id')->references('id')->on('lessons')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');
            $table->primary(['lesson_id', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lesson_student');
        Schema::dropIfExists('lesson_sponsor');
        Schema::dropIfExists('lessons');
    }
}
