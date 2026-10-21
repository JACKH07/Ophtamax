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
        Schema::create('t_consultations', function (Blueprint $table) {
            $table->id();
            $table->string('idpatients');
            $table->string('vl_Sans_corr');
            $table->string('vl_avec_corr');
            $table->string('vp_Sans_corr');
            $table->string('vp_avec_corr');
            $table->string('sphere');
            $table->string('cylindre');
            $table->string('axe0');
            $table->string('pio_mmhg');
            $table->string('addition');
            $table->string('segment_anterieur');
            $table->string('fond_oeil');
            $table->string('diagnostic');
            $table->date('prochain_rdv');
            $table->string('cat');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_consultations');
    }
};
