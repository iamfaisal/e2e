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
            $table->date('start_date');
            $table->date('end_date');
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
            $table->boolean('is_approved')->default(0);
            $table->boolean('is_deleted')->default(0);
            $table->boolean('is_cancelled')->default(0);
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
        Schema::dropIfExists('lessons');
    }
}
