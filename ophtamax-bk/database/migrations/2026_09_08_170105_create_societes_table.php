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
        Schema::create('societes', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20)->unique();
            $table->string('raison_sociale', 150);
            $table->string('sigle', 30)->nullable();
            $table->string('forme_juridique', 50)->nullable();

            $table->string('numero_contribuable', 50)->nullable();
            $table->string('registre_commerce', 50)->nullable();

            $table->string('adresse', 255)->nullable();
            $table->string('ville', 100)->nullable();
            $table->string('pays', 100)->nullable();
            $table->string('boite_postale', 50)->nullable();

            $table->string('telephone', 30)->nullable();
            $table->string('telephone2', 30)->nullable();
            $table->string('email', 150)->nullable();
            $table->string('site_web', 150)->nullable();

            $table->string('logo', 255)->nullable();

            $table->decimal('capital_social', 15, 2)->nullable();
            $table->string('devise', 10)->default('XOF');

            $table->date('date_creation')->nullable();
            $table->string('nom_dirigeant', 150)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('societes');
    }
};
