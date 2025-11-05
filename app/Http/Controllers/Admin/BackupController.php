<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Backup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use ZipArchive;

class BackupController extends Controller
{
    public function index()
    {
        $backups = Backup::with('creator')
            ->latest()
            ->paginate(15);

        return Inertia::render('dashboard/admin/backups/index', [
            'backups' => $backups,
        ]);
    }

    public function create()
    {
        try {
            $timestamp = now()->format('Y-m-d_His');
            $filename = "backup_{$timestamp}.sql";
            $backupPath = storage_path("app/backups/{$filename}");

            // Create backups directory if not exists
            if (!file_exists(storage_path('app/backups'))) {
                mkdir(storage_path('app/backups'), 0755, true);
            }

            // Create backup record
            $backup = Backup::create([
                'filename' => $filename,
                'path' => "backups/{$filename}",
                'type' => 'full',
                'created_by' => Auth::id(),
                'description' => request('description'),
                'status' => 'pending',
            ]);

            // Get database configuration
            $database = config('database.default');
            $dbConfig = config("database.connections.{$database}");

            // SQLite backup
            if ($database === 'sqlite') {
                $sourcePath = database_path($dbConfig['database']);
                
                if (file_exists($sourcePath)) {
                    copy($sourcePath, $backupPath);
                    
                    $backup->update([
                        'status' => 'completed',
                        'completed_at' => now(),
                        'size' => filesize($backupPath),
                    ]);

                    return back()->with('success', 'Backup berhasil dibuat!');
                } else {
                    $backup->update([
                        'status' => 'failed',
                        'error_message' => 'Database file not found',
                    ]);
                    return back()->with('error', 'Database file tidak ditemukan.');
                }
            }

            // MySQL/PostgreSQL backup
            if (in_array($database, ['mysql', 'pgsql'])) {
                $command = $this->getMysqlDumpCommand($dbConfig, $backupPath);
                
                exec($command, $output, $returnVar);

                if ($returnVar === 0 && file_exists($backupPath)) {
                    $backup->update([
                        'status' => 'completed',
                        'completed_at' => now(),
                        'size' => filesize($backupPath),
                    ]);

                    return back()->with('success', 'Backup berhasil dibuat!');
                } else {
                    $backup->update([
                        'status' => 'failed',
                        'error_message' => 'mysqldump command failed',
                    ]);
                    return back()->with('error', 'Backup gagal. Pastikan mysqldump tersedia.');
                }
            }

            throw new \Exception('Unsupported database type');

        } catch (\Exception $e) {
            if (isset($backup)) {
                $backup->update([
                    'status' => 'failed',
                    'error_message' => $e->getMessage(),
                ]);
            }

            return back()->with('error', 'Backup gagal: ' . $e->getMessage());
        }
    }

    public function download(Backup $backup)
    {
        $filePath = storage_path("app/{$backup->path}");

        if (!file_exists($filePath)) {
            return back()->with('error', 'File backup tidak ditemukan.');
        }

        return response()->download($filePath, $backup->filename);
    }

    public function destroy(Backup $backup)
    {
        try {
            $filePath = storage_path("app/{$backup->path}");
            
            if (file_exists($filePath)) {
                unlink($filePath);
            }

            $backup->delete();

            return back()->with('success', 'Backup berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus backup: ' . $e->getMessage());
        }
    }

    public function restore(Backup $backup)
    {
        try {
            $filePath = storage_path("app/{$backup->path}");

            if (!file_exists($filePath)) {
                return back()->with('error', 'File backup tidak ditemukan.');
            }

            $database = config('database.default');
            $dbConfig = config("database.connections.{$database}");

            // SQLite restore
            if ($database === 'sqlite') {
                $targetPath = database_path($dbConfig['database']);
                
                // Backup current database first
                copy($targetPath, $targetPath . '.before_restore');
                
                // Restore
                copy($filePath, $targetPath);

                return back()->with('success', 'Database berhasil di-restore!');
            }

            // MySQL restore
            if ($database === 'mysql') {
                $command = sprintf(
                    'mysql -h %s -u %s -p%s %s < %s',
                    $dbConfig['host'],
                    $dbConfig['username'],
                    $dbConfig['password'],
                    $dbConfig['database'],
                    $filePath
                );

                exec($command, $output, $returnVar);

                if ($returnVar === 0) {
                    return back()->with('success', 'Database berhasil di-restore!');
                } else {
                    return back()->with('error', 'Restore gagal. Pastikan mysql client tersedia.');
                }
            }

            throw new \Exception('Restore hanya support SQLite dan MySQL');

        } catch (\Exception $e) {
            return back()->with('error', 'Restore gagal: ' . $e->getMessage());
        }
    }

    private function getMysqlDumpCommand($config, $outputPath)
    {
        return sprintf(
            'mysqldump -h %s -u %s -p%s %s > %s',
            $config['host'],
            $config['username'],
            $config['password'],
            $config['database'],
            $outputPath
        );
    }
}
