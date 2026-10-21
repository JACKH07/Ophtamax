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
        Schema::create('t_pr_lunettes', function (Blueprint $table) {
            $table->id();
            $table->string('idpatients');
            $table->string('medecin');
            $table->string('type_verre');
            $table->string('od_sphere');
            $table->string('od_cylindre');
            $table->string('od_axe');
            $table->string('od_addition');
            $table->string('og_sphere');
            $table->string('og_cylindre');
            $table->string('og_axe');
            $table->string('og_addition');
            $table->string('correction');
            $table->string('note');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_pr_lunettes');
    }
};
