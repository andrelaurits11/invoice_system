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
        // Lisab veerud olemasolevale 'users' tabelile
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable();   // Telefon
            $table->string('address')->nullable(); // Aadress
            $table->string('address2')->nullable(); // Täiendav aadress
            $table->string('state')->nullable();   // Osariik / Maakond
            $table->string('zip')->nullable();     // Postiindeks
            $table->string('country')->nullable(); // Riik
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Kui migratsiooni tagasi võtame, siis eemaldame need veerud
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'address', 'address2', 'state', 'zip', 'country']);
        });
    }
};
