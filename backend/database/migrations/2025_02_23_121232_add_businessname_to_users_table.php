<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Lisab businessname veeru olemasolevasse 'users' tabelisse
        Schema::table('users', function (Blueprint $table) {
            $table->string('businessname')->nullable(); // Ärinimi
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Kui migratsiooni tagasi võtame, siis eemaldame businessname veeru
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('businessname');
        });
    }
};
