<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateApprovalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('approvals', function (Blueprint $table) {
            $table->integer('lesson_id')->unsigned()->nullable();
            $table->foreign('lesson_id')->references('id')->on('lessons');
            $table->boolean('start_time')->default(false);
            $table->boolean('end_time')->default(false);
            $table->boolean('course')->default(false);
            $table->boolean('venue')->default(false);
            $table->boolean('price')->default(false);
            $table->boolean('capacity')->default(false);
            $table->boolean('alternate_instructor')->default(false);
            $table->boolean('guest_speaker')->default(false);
            $table->boolean('sponsors')->default(false);
            $table->boolean('flyer_image')->default(false);
            $table->text('notes')->nullable();
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
        Schema::dropIfExists('approvals');
    }
}
