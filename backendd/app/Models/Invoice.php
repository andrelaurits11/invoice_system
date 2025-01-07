<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'invoice_id', // Kasutaja sisestatud ArveID
        'company_name',
        'email',
        'phone',
        'address1',
        'address2',
        'city',
        'state',
        'zip',
        'country',
        'due_date',
        'total',
        'status',
    ];


    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }
}
