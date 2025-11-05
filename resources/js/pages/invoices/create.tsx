import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { QuotaDisplay } from '@/components/feature-limits';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

interface Customer {
    id: number;
    name: string;
    email: string | null;
    company_name: string | null;
    display_name: string;
}

interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
}

interface Quota {
    current: number;
    limit: number;
    remaining: number;
    is_unlimited: boolean;
}

interface Props {
    customers: Customer[];
    quota?: Quota;
}

export default function CreateInvoice({ customers, quota }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: '',
        tax_rate: '0',
        discount_amount: '0',
        notes: '',
        terms: '',
        items: [] as any,
    });

    const [items, setItems] = useState<InvoiceItem[]>([
        {
            id: Math.random().toString(),
            description: '',
            quantity: 1,
            unit_price: 0,
            amount: 0,
        },
    ]);

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxRate = typeof data.tax_rate === 'string' ? parseFloat(data.tax_rate) : 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const discountAmt = typeof data.discount_amount === 'string' ? parseFloat(data.discount_amount) : 0;
    const total = subtotal + taxAmount - discountAmt;

    useEffect(() => {
        setData('items', items);
    }, [items]);

    const addItem = () => {
        setItems([
            ...items,
            {
                id: Math.random().toString(),
                description: '',
                quantity: 1,
                unit_price: 0,
                amount: 0,
            },
        ]);
    };

    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter((item) => item.id !== id));
        }
    };

    const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
        setItems(
            items.map((item) => {
                if (item.id === id) {
                    const updatedItem = { ...item, [field]: value };
                    if (field === 'quantity' || field === 'unit_price') {
                        updatedItem.amount =
                            parseFloat(updatedItem.quantity.toString() || '0') *
                            parseFloat(updatedItem.unit_price.toString() || '0');
                    }
                    return updatedItem;
                }
                return item;
            })
        );
    };

    const handleSubmit = (e: FormEvent, status: 'draft' | 'sent' = 'draft') => {
        e.preventDefault();
        post(route('invoices.store', { status }));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AppLayout>
            <Head title="Buat Invoice" />

            <div className="container max-w-6xl mx-auto py-6 space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <Button variant="ghost" size="sm" asChild className="mb-2">
                                <Link href={route('invoices.index')}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Kembali
                                </Link>
                            </Button>
                            <h1 className="text-3xl font-bold tracking-tight">Buat Invoice</h1>
                            <p className="text-muted-foreground mt-1">
                                Buat invoice baru untuk customer
                            </p>
                        </div>
                        
                        {/* Display Quota if available */}
                        {quota && (
                            <Card className="sm:w-auto">
                                <CardContent className="pt-6">
                                    <QuotaDisplay
                                        current={quota.current}
                                        limit={quota.limit}
                                        remaining={quota.remaining}
                                        isUnlimited={quota.is_unlimited}
                                        featureName="Invoice"
                                    />
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    
                    {/* Warning if approaching limit */}
                    {quota && !quota.is_unlimited && quota.remaining <= 5 && quota.remaining > 0 && (
                        <Card className="border-amber-200 bg-amber-50">
                            <CardContent className="pt-4">
                                <p className="text-sm text-amber-800">
                                    ⚠️ Hanya {quota.remaining} invoice tersisa bulan ini. 
                                    <Link href={route('packages.index')} className="ml-2 underline font-medium">
                                        Upgrade ke Pro untuk unlimited invoice
                                    </Link>
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Left Column - Invoice Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Customer & Dates */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Invoice</CardTitle>
                                    <CardDescription>
                                        Pilih customer dan tanggal invoice
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {/* Customer */}
                                        <div className="space-y-2">
                                            <Label htmlFor="customer_id">
                                                Customer <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={data.customer_id as string}
                                                onValueChange={(value) =>
                                                    setData('customer_id', value)
                                                }
                                            >
                                                <SelectTrigger
                                                    className={errors.customer_id ? 'border-red-500' : ''}
                                                >
                                                    <SelectValue placeholder="Pilih customer" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {customers.map((customer) => (
                                                        <SelectItem
                                                            key={customer.id}
                                                            value={customer.id.toString()}
                                                        >
                                                            {customer.display_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.customer_id && (
                                                <p className="text-sm text-red-500">
                                                    {errors.customer_id}
                                                </p>
                                            )}
                                            {customers.length === 0 && (
                                                <p className="text-sm text-muted-foreground">
                                                    Belum ada customer.{' '}
                                                    <Link
                                                        href={route('customers.create')}
                                                        className="text-primary hover:underline"
                                                    >
                                                        Tambah customer
                                                    </Link>
                                                </p>
                                            )}
                                        </div>

                                        {/* Invoice Date */}
                                        <div className="space-y-2">
                                            <Label htmlFor="invoice_date">
                                                Tanggal Invoice <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="invoice_date"
                                                type="date"
                                                value={data.invoice_date as string}
                                                onChange={(e) =>
                                                    setData('invoice_date', e.target.value)
                                                }
                                                className={errors.invoice_date ? 'border-red-500' : ''}
                                            />
                                            {errors.invoice_date && (
                                                <p className="text-sm text-red-500">
                                                    {errors.invoice_date}
                                                </p>
                                            )}
                                        </div>

                                        {/* Due Date */}
                                        <div className="space-y-2">
                                            <Label htmlFor="due_date">
                                                Jatuh Tempo <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="due_date"
                                                type="date"
                                                value={data.due_date as string}
                                                onChange={(e) => setData('due_date', e.target.value)}
                                                className={errors.due_date ? 'border-red-500' : ''}
                                            />
                                            {errors.due_date && (
                                                <p className="text-sm text-red-500">
                                                    {errors.due_date}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Line Items */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Item Invoice</CardTitle>
                                            <CardDescription>
                                                Tambahkan produk atau layanan
                                            </CardDescription>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addItem}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Tambah Item
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-md border overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="min-w-[250px]">
                                                        Deskripsi
                                                    </TableHead>
                                                    <TableHead className="w-[100px]">Qty</TableHead>
                                                    <TableHead className="w-[150px]">
                                                        Harga Satuan
                                                    </TableHead>
                                                    <TableHead className="w-[150px] text-right">
                                                        Jumlah
                                                    </TableHead>
                                                    <TableHead className="w-[50px]"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {items.map((item, index) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>
                                                            <Input
                                                                placeholder="Nama produk/layanan"
                                                                value={item.description}
                                                                onChange={(e) =>
                                                                    updateItem(
                                                                        item.id,
                                                                        'description',
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className={
                                                                    (errors as any)[`items.${index}.description`]
                                                                        ? 'border-red-500'
                                                                        : ''
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                value={item.quantity}
                                                                onChange={(e) =>
                                                                    updateItem(
                                                                        item.id,
                                                                        'quantity',
                                                                        parseFloat(e.target.value)
                                                                    )
                                                                }
                                                                className={
                                                                    (errors as any)[`items.${index}.quantity`]
                                                                        ? 'border-red-500'
                                                                        : ''
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={item.unit_price}
                                                                onChange={(e) =>
                                                                    updateItem(
                                                                        item.id,
                                                                        'unit_price',
                                                                        parseFloat(e.target.value)
                                                                    )
                                                                }
                                                                className={
                                                                    (errors as any)[`items.${index}.unit_price`]
                                                                        ? 'border-red-500'
                                                                        : ''
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium">
                                                            {formatCurrency(item.amount)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => removeItem(item.id)}
                                                                disabled={items.length === 1}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    {errors.items && (
                                        <p className="text-sm text-red-500 mt-2">
                                            {errors.items}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Notes & Terms */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Catatan & Syarat</CardTitle>
                                    <CardDescription>
                                        Informasi tambahan (opsional)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Catatan</Label>
                                        <Textarea
                                            id="notes"
                                            placeholder="Catatan untuk customer..."
                                            value={data.notes as string}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="terms">Syarat & Ketentuan</Label>
                                        <Textarea
                                            id="terms"
                                            placeholder="Syarat pembayaran..."
                                            value={data.terms as string}
                                            onChange={(e) => setData('terms', e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Summary */}
                        <div className="space-y-6">
                            {/* Calculations */}
                            <Card className="sticky top-6">
                                <CardHeader>
                                    <CardTitle>Ringkasan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Tax */}
                                    <div className="space-y-2">
                                        <Label htmlFor="tax_rate">Pajak (%)</Label>
                                        <Input
                                            id="tax_rate"
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            value={data.tax_rate as string}
                                            onChange={(e) => setData('tax_rate', e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>

                                    {/* Discount */}
                                    <div className="space-y-2">
                                        <Label htmlFor="discount_amount">Diskon (Rp)</Label>
                                        <Input
                                            id="discount_amount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.discount_amount as string}
                                            onChange={(e) =>
                                                setData('discount_amount', e.target.value)
                                            }
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="border-t pt-4 space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span className="font-medium">
                                                {formatCurrency(subtotal)}
                                            </span>
                                        </div>

                                        {taxAmount > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Pajak ({taxRate}%)
                                                </span>
                                                <span className="font-medium">
                                                    {formatCurrency(taxAmount)}
                                                </span>
                                            </div>
                                        )}

                                        {discountAmt > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Diskon</span>
                                                <span className="font-medium text-red-600">
                                                    -{formatCurrency(discountAmt)}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center pt-3 border-t">
                                            <span className="text-lg font-semibold">Total</span>
                                            <span className="text-2xl font-bold text-primary">
                                                {formatCurrency(total)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-2 pt-4 border-t">
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={processing || customers.length === 0}
                                            onClick={(e) => handleSubmit(e, 'sent')}
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            Simpan & Kirim
                                        </Button>

                                        <Button
                                            type="submit"
                                            variant="outline"
                                            className="w-full"
                                            disabled={processing || customers.length === 0}
                                            onClick={(e) => handleSubmit(e, 'draft')}
                                        >
                                            Simpan sebagai Draft
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="w-full"
                                            asChild
                                        >
                                            <Link href={route('invoices.index')}>Batal</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
