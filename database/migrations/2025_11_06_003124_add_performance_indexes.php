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
        // Journals - Most queried table for dashboard
        Schema::table('journals', function (Blueprint $table) {
            $table->index(['user_id', 'date'], 'idx_journals_user_date');
            $table->index('user_id', 'idx_journals_user');
        });

        // Journal Entries - Heavy joins with journals and accounts
        Schema::table('journal_entries', function (Blueprint $table) {
            $table->index(['journal_id', 'account_id'], 'idx_entries_journal_account');
            $table->index('account_id', 'idx_entries_account');
            $table->index(['type', 'amount'], 'idx_entries_type_amount');
        });

        // Receivables - Dashboard queries for overdue
        Schema::table('receivables', function (Blueprint $table) {
            $table->index(['user_id', 'due_date'], 'idx_receivables_user_due');
            $table->index(['user_id', 'paid_amount', 'amount'], 'idx_receivables_payment_status');
        });

        // Debts - Dashboard queries for upcoming
        Schema::table('debts', function (Blueprint $table) {
            $table->index(['user_id', 'due_date'], 'idx_debts_user_due');
            $table->index(['user_id', 'paid_amount', 'amount'], 'idx_debts_payment_status');
        });

        // Products - Dashboard queries for low stock
        Schema::table('products', function (Blueprint $table) {
            $table->index(['user_id', 'stock'], 'idx_products_user_stock');
            $table->index('user_id', 'idx_products_user');
        });

        // Expenses - Frequently queried with categories
        Schema::table('expenses', function (Blueprint $table) {
            $table->index(['user_id', 'date'], 'idx_expenses_user_date');
            $table->index(['user_id', 'expense_category_id'], 'idx_expenses_user_category');
        });

        // Incomes - Frequently queried with categories
        Schema::table('incomes', function (Blueprint $table) {
            $table->index(['user_id', 'date'], 'idx_incomes_user_date');
            $table->index(['user_id', 'income_category_id'], 'idx_incomes_user_category');
        });

        // Subscriptions - User subscription lookups
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->index(['user_id', 'status', 'ends_at'], 'idx_subscriptions_active');
            $table->index('package_id', 'idx_subscriptions_package');
        });

        // Invoices - User invoice queries
        Schema::table('invoices', function (Blueprint $table) {
            $table->index(['user_id', 'status'], 'idx_invoices_user_status');
            $table->index(['user_id', 'invoice_date'], 'idx_invoices_user_date');
        });

        // Chart of Accounts - Frequently joined
        Schema::table('chart_of_accounts', function (Blueprint $table) {
            $table->index('type', 'idx_coa_type');
            $table->index('code', 'idx_coa_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('journals', function (Blueprint $table) {
            $table->dropIndex('idx_journals_user_date');
            $table->dropIndex('idx_journals_user');
        });

        Schema::table('journal_entries', function (Blueprint $table) {
            $table->dropIndex('idx_entries_journal_account');
            $table->dropIndex('idx_entries_account');
            $table->dropIndex('idx_entries_type_amount');
        });

        Schema::table('receivables', function (Blueprint $table) {
            $table->dropIndex('idx_receivables_user_due');
            $table->dropIndex('idx_receivables_payment_status');
        });

        Schema::table('debts', function (Blueprint $table) {
            $table->dropIndex('idx_debts_user_due');
            $table->dropIndex('idx_debts_payment_status');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('idx_products_user_stock');
            $table->dropIndex('idx_products_user');
        });

        Schema::table('expenses', function (Blueprint $table) {
            $table->dropIndex('idx_expenses_user_date');
            $table->dropIndex('idx_expenses_user_category');
        });

        Schema::table('incomes', function (Blueprint $table) {
            $table->dropIndex('idx_incomes_user_date');
            $table->dropIndex('idx_incomes_user_category');
        });

        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropIndex('idx_subscriptions_active');
            $table->dropIndex('idx_subscriptions_package');
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->dropIndex('idx_invoices_user_status');
            $table->dropIndex('idx_invoices_user_date');
        });

        Schema::table('chart_of_accounts', function (Blueprint $table) {
            $table->dropIndex('idx_coa_type');
            $table->dropIndex('idx_coa_code');
        });
    }
};
