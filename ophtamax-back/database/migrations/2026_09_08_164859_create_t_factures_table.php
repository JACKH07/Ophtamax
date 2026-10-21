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
        Schema::create('t_factures', function (Blueprint $table) {
            $table->id();
            $table->string('idpatients');
            $table->date('date_fact');
            $table->string('modepaiement');
            $table->decimal('montantfact', 15, 2);
            $table->string('statut');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_factures');
    }
};
