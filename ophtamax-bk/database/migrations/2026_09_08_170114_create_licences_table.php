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
        Schema::create('licences', function (Blueprint $table) {
            $table->id();
            $table->string('societe_id');
            $table->string('numero_licence', 100)->unique();
            $table->string('cle_licence', 255)->unique();
            $table->string('type_licence', 50)->default('standard');
            $table->date('date_activation')->nullable();
            $table->date('date_debut');
            $table->date('date_expiration');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('licences');
    }
};
