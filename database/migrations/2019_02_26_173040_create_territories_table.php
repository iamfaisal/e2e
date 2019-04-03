<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTerritoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('territories', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->integer('regulation_id')->unsigned()->default(1);
            $table->foreign('regulation_id')->references('id')->on('regulations')->onDelete('cascade');
            $table->string('zip_codes');
            $table->timestamps();
        });

        Schema::create('territory_user', function (Blueprint $table) {
            $table->integer('territory_id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->foreign('territory_id')->references('id')->on('territories')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->primary(['territory_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('territory_user');
        Schema::dropIfExists('territories');
    }
}
