<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Category;
use App\Models\Product;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;
use Illuminate\Support\Str;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $navigationGroup = 'Catalog';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Product Information')
                ->schema([
                    Forms\Components\TextInput::make('name')
                        ->required()
                        ->maxLength(255)
                        ->reactive()
                        ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),

                    Forms\Components\TextInput::make('slug')
                        ->required()
                        ->maxLength(255)
                        ->unique(Product::class, 'slug', ignoreRecord: true),

                    Forms\Components\Select::make('category_id')
                        ->label('Category')
                        ->options(Category::pluck('name', 'id'))
                        ->searchable()
                        ->required(),

                    Forms\Components\Textarea::make('description')
                        ->rows(4)
                        ->columnSpan('full'),

                    Forms\Components\Textarea::make('material')
                        ->label('Material & Fabric')
                        ->rows(2),

                    Forms\Components\Textarea::make('care_instructions')
                        ->label('Care Instructions')
                        ->rows(2),
                ])->columns(2),

            Forms\Components\Section::make('Pricing & Inventory')
                ->schema([
                    Forms\Components\TextInput::make('price')
                        ->numeric()
                        ->prefix('PKR')
                        ->required(),

                    Forms\Components\TextInput::make('compare_price')
                        ->numeric()
                        ->prefix('PKR')
                        ->label('Compare at Price'),

                    Forms\Components\TextInput::make('cost_price')
                        ->numeric()
                        ->prefix('PKR')
                        ->label('Cost Price'),

                    Forms\Components\TextInput::make('sku')
                        ->label('SKU')
                        ->maxLength(100),

                    Forms\Components\TextInput::make('stock')
                        ->numeric()
                        ->default(0)
                        ->required(),

                    Forms\Components\TextInput::make('weight')
                        ->numeric()
                        ->label('Weight (grams)'),
                ])->columns(3),

            Forms\Components\Section::make('Status & Flags')
                ->schema([
                    Forms\Components\Toggle::make('is_active')
                        ->label('Active')
                        ->default(true),

                    Forms\Components\Toggle::make('is_featured')
                        ->label('Featured'),

                    Forms\Components\Toggle::make('is_new_arrival')
                        ->label('New Arrival'),

                    Forms\Components\Toggle::make('is_on_sale')
                        ->label('On Sale'),

                    Forms\Components\Select::make('gender')
                        ->options([
                            'men' => 'Men',
                            'women' => 'Women',
                            'kids' => 'Kids',
                            'unisex' => 'Unisex',
                        ])
                        ->required(),
                ])->columns(3),

            Forms\Components\Section::make('Tags')
                ->schema([
                    Forms\Components\TagsInput::make('tags')
                        ->placeholder('Add tag'),
                ])->collapsible(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('primary_image_url')
                    ->label('Image')
                    ->width(60)
                    ->height(60),

                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('category.name')
                    ->label('Category')
                    ->sortable(),

                Tables\Columns\TextColumn::make('price')
                    ->money('PKR')
                    ->sortable(),

                Tables\Columns\TextColumn::make('stock')
                    ->sortable()
                    ->color(fn ($record) => $record->stock < 5 ? 'danger' : 'success'),

                Tables\Columns\BadgeColumn::make('gender')
                    ->colors([
                        'primary' => 'men',
                        'success' => 'women',
                        'warning' => 'kids',
                        'secondary' => 'unisex',
                    ]),

                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->label('Active'),

                Tables\Columns\IconColumn::make('is_featured')
                    ->boolean()
                    ->label('Featured'),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime('d M Y')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category_id')
                    ->label('Category')
                    ->options(Category::pluck('name', 'id')),

                Tables\Filters\SelectFilter::make('gender')
                    ->options([
                        'men' => 'Men',
                        'women' => 'Women',
                        'kids' => 'Kids',
                        'unisex' => 'Unisex',
                    ]),

                Tables\Filters\TernaryFilter::make('is_active')->label('Active'),
                Tables\Filters\TernaryFilter::make('is_featured')->label('Featured'),
                Tables\Filters\TernaryFilter::make('is_new_arrival')->label('New Arrival'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
