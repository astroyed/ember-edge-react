<?php

namespace App\Filament\Resources\CouponResource\Pages;

use App\Filament\Resources\CouponResource;
use Filament\Pages\Actions;
use Filament\Resources\Pages\CreateRecord;
use Filament\Resources\Pages\EditRecord;
use Filament\Resources\Pages\ListRecords;

class ListCoupons extends ListRecords
{
    protected static string $resource = CouponResource::class;

    protected function getActions(): array
    {
        return [Actions\CreateAction::make()];
    }
}

class CreateCoupon extends CreateRecord
{
    protected static string $resource = CouponResource::class;
}

class EditCoupon extends EditRecord
{
    protected static string $resource = CouponResource::class;

    protected function getActions(): array
    {
        return [Actions\DeleteAction::make()];
    }
}
