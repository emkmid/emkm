<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

trait Auditable
{
    protected static function bootAuditable()
    {
        static::created(function ($model) {
            static::audit('created', $model, [], $model->getAuditableAttributes());
        });

        static::updated(function ($model) {
            $oldValues = $model->getOriginal();
            $newValues = $model->getAuditableAttributes();
            
            // Only log if there are actual changes
            if ($oldValues != $newValues) {
                static::audit('updated', $model, $oldValues, $newValues);
            }
        });

        static::deleted(function ($model) {
            static::audit('deleted', $model, $model->getAuditableAttributes(), []);
        });
    }

    protected static function audit($event, $model, $oldValues, $newValues)
    {
        // Skip if audit logging is disabled for this model
        if (property_exists($model, 'auditDisabled') && $model->auditDisabled) {
            return;
        }

        $auditableFields = $model->getAuditableFields();
        
        // Filter only auditable fields
        if (!empty($auditableFields)) {
            $oldValues = collect($oldValues)->only($auditableFields)->toArray();
            $newValues = collect($newValues)->only($auditableFields)->toArray();
        }

        // Skip sensitive fields
        $hiddenFields = $model->getHidden();
        $oldValues = collect($oldValues)->except($hiddenFields)->toArray();
        $newValues = collect($newValues)->except($hiddenFields)->toArray();

        // Determine current authenticated user id safely. If the session
        // still references a deleted user (rare race from manual DB deletes),
        // avoid using that id to prevent foreign key constraint errors.
        $currentUserId = Auth::id();

        if ($currentUserId !== null) {
            $exists = DB::table('users')->where('id', $currentUserId)->exists();
            if (! $exists) {
                $currentUserId = null;
            }
        }

        try {
            AuditLog::create([
                'user_id' => $currentUserId,
                'event' => $event,
                'auditable_type' => get_class($model),
                'auditable_id' => $model->id,
                'old_values' => $oldValues,
                'new_values' => $newValues,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'url' => request()->fullUrl(),
            ]);
        } catch (\Exception $e) {
            // Audit failure should never block the primary action.
            Log::warning('AuditLog create failed: ' . $e->getMessage(), [
                'event' => $event,
                'auditable_type' => get_class($model),
                'auditable_id' => $model->id,
            ]);
        }
    }

    /**
     * Get attributes that should be audited
     */
    protected function getAuditableAttributes()
    {
        return $this->getAttributes();
    }

    /**
     * Get fields that should be audited (empty means all fields)
     */
    protected function getAuditableFields()
    {
        return property_exists($this, 'auditableFields') ? $this->auditableFields : [];
    }

    /**
     * Relationship to audit logs
     */
    public function auditLogs()
    {
        return $this->morphMany(AuditLog::class, 'auditable')->latest();
    }
}
