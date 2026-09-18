<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Models\Order;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';

    protected static ?string $navigationGroup = 'Sales';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Order Details')
                ->schema([
                    Forms\Components\TextInput::make('order_number')
                        ->disabled()
                        ->label('Order #'),

                    Forms\Components\TextInput::make('customer_name')
                        ->disabled(),

                    Forms\Components\TextInput::make('customer_email')
                        ->disabled(),

                    Forms\Components\TextInput::make('total_amount')
                        ->disabled()
                        ->prefix('PKR'),
                ])->columns(2),

            Forms\Components\Section::make('Order Status')
                ->schema([
                    Forms\Components\Select::make('status')
                        ->options([
                            'pending'    => 'Pending',
                            'confirmed'  => 'Confirmed',
                            'processing' => 'Processing',
                            'shipped'    => 'Shipped',
                            'delivered'  => 'Delivered',
                            'cancelled'  => 'Cancelled',
                            'returned'   => 'Returned',
                            'refunded'   => 'Refunded',
                        ])
                        ->required(),

                    Forms\Components\Select::make('payment_status')
                        ->options([
                            'pending'  => 'Pending',
                            'paid'     => 'Paid',
                            'failed'   => 'Failed',
                            'refunded' => 'Refunded',
                        ])
                        ->required(),
                ])->columns(2),

            Forms\Components\Section::make('Shipping Information')
                ->schema([
                    Forms\Components\TextInput::make('tracking_number')
                        ->label('Tracking Number'),

                    Forms\Components\Textarea::make('shipping_address')
                        ->disabled()
                        ->rows(3),

                    Forms\Components\Textarea::make('notes')
                        ->label('Admin Notes')
                        ->rows(3),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('order_number')
                    ->label('Order #')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('customer_name')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('customer_email')
                    ->searchable(),

                Tables\Columns\TextColumn::make('total_amount')
                    ->money('PKR')
                    ->sortable(),

                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning'  => 'pending',
                        'primary'  => 'confirmed',
                        'secondary'=> 'processing',
                        'success'  => ['shipped', 'delivered'],
                        'danger'   => ['cancelled', 'returned', 'refunded'],
                    ]),

                Tables\Columns\BadgeColumn::make('payment_status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'paid',
                        'danger'  => ['failed', 'refunded'],
                    ]),

                Tables\Columns\TextColumn::make('payment_method')
                    ->label('Payment'),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending'    => 'Pending',
                        'confirmed'  => 'Confirmed',
                        'processing' => 'Processing',
                        'shipped'    => 'Shipped',
                        'delivered'  => 'Delivered',
                        'cancelled'  => 'Cancelled',
                    ]),
                Tables\Filters\SelectFilter::make('payment_status')
                    ->options([
                        'pending'  => 'Pending',
                        'paid'     => 'Paid',
                        'failed'   => 'Failed',
                        'refunded' => 'Refunded',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListOrders::route('/'),
            'view'   => Pages\ViewOrder::route('/{record}'),
            'edit'   => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
