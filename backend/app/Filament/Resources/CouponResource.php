<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CouponResource\Pages;
use App\Models\Coupon;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;

class CouponResource extends Resource
{
    protected static ?string $model = Coupon::class;

    protected static ?string $navigationIcon = 'heroicon-o-ticket';

    protected static ?string $navigationGroup = 'Marketing';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('code')
                ->required()
                ->maxLength(50)
                ->unique(Coupon::class, 'code', ignoreRecord: true)
                ->uppercase(),

            Forms\Components\Select::make('type')
                ->options([
                    'percentage' => 'Percentage (%)',
                    'fixed'      => 'Fixed Amount (PKR)',
                ])
                ->required()
                ->reactive(),

            Forms\Components\TextInput::make('value')
                ->numeric()
                ->required()
                ->label(fn (callable $get) => $get('type') === 'percentage' ? 'Discount %' : 'Discount Amount (PKR)'),

            Forms\Components\TextInput::make('min_order_amount')
                ->numeric()
                ->prefix('PKR')
                ->label('Minimum Order Amount'),

            Forms\Components\TextInput::make('max_uses')
                ->numeric()
                ->label('Maximum Uses (blank = unlimited)'),

            Forms\Components\DateTimePicker::make('starts_at')
                ->label('Valid From'),

            Forms\Components\DateTimePicker::make('expires_at')
                ->label('Expires At'),

            Forms\Components\Toggle::make('is_active')
                ->label('Active')
                ->default(true),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('code')->searchable()->sortable(),
                Tables\Columns\BadgeColumn::make('type')
                    ->colors(['primary' => 'percentage', 'success' => 'fixed']),
                Tables\Columns\TextColumn::make('value'),
                Tables\Columns\TextColumn::make('uses_count')->label('Used'),
                Tables\Columns\TextColumn::make('max_uses')->label('Max'),
                Tables\Columns\TextColumn::make('expires_at')->dateTime('d M Y')->sortable(),
                Tables\Columns\IconColumn::make('is_active')->boolean()->label('Active'),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')->label('Active'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListCoupons::route('/'),
            'create' => Pages\CreateCoupon::route('/create'),
            'edit'   => Pages\EditCoupon::route('/{record}/edit'),
        ];
    }
}
