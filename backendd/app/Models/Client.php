<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
        'contact_person',
        'email',
        'phone',
        'address',
        'address2',
        'state',
        'zip',
        'country',
        'user_id', // Lisa kasutaja ID täidetavate väljade hulka
    ];
}
