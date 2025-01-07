<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInvoicesTable extends Migration
{
    public function up()
{
    Schema::create('invoices', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
        $table->string('invoice_id')->unique(); // Lisa unikaalsus
        $table->string('company_name');
        $table->string('email');
        $table->string('phone')->nullable();
        $table->string('address1')->nullable();
        $table->string('address2')->nullable();
        $table->string('city')->nullable();
        $table->string('state')->nullable();
        $table->string('zip')->nullable();
        $table->string('country')->nullable();
        $table->date('due_date');
        $table->decimal('total', 10, 2)->default(0);
        $table->string('status')->default('pending');
        $table->timestamps();
    });


}


    public function down()
    {
        Schema::dropIfExists('invoices');
    }
}
