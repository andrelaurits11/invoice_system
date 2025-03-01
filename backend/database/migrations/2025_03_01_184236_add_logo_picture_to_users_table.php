<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('users', function (Blueprint $table) {
        $table->string('logo_picture')->nullable()->after('email'); // Lisa logo_picture
    });
}

public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('logo_picture');
    });
}

};
