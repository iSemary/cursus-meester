<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use iSemary\BackupSentry\BackupSentry;

class Backup extends Command {
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:backup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Back up the application';

    /**
     * Execute the console command.
     */
    public function handle() {
        (new BackupSentry)->run();
    }
}
