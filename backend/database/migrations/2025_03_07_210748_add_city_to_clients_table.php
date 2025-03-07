<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCityToClientsTable extends Migration
{
    /**
     * Kas teostame migratsiooni.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->string('city')->nullable();  // Lisab 'city' veeru
        });
    }

    /**
     * Tagasta muudatused, kui migratsioonitööd ei soorita.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn('city');  // Eemaldab 'city' veeru, kui migratsioon tagasi võetakse
        });
    }
}
