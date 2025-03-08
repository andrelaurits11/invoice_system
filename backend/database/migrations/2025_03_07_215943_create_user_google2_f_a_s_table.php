<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserGoogle2faTable extends Migration
{
    public function up()
    {
        Schema::create('user_google2fa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('google2fa_secret');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_google2fa');
    }
}
