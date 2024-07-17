"use client";

import React, { useState, useEffect } from 'react';
import { FileUpload } from "@/components/FileUpload";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProductData {
    title: string;
    description: string;
    size: string[];
    price: number;
    imageUrl: string;
}

export const Form: React.FC = () => {
    const [productData, setProductData] = useState<ProductData>({
        title: '',
        description: '',
        size: [],
        price: 0,
        imageUrl: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFormValid, setIsFormValid] = useState(false);
 
     /*Product Sizes */
    const sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

    const handleSizeSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedSize = e.target.value;
        if (e.target.checked) {
            setProductData(prev => ({ ...prev, size: [...prev.size, selectedSize] }));
        } else {
            setProductData(prev => ({ ...prev, size: prev.size.filter(size => size !== selectedSize) }));
        }
    };

    /* Add Product */
    const addProduct = useMutation(api.products.add);

    useEffect(() => {
        const { title, description, size, price, imageUrl } = productData;
        setIsFormValid(
            title.trim() !== '' &&
            description.trim() !== '' &&
            size[0] !== '' &&
            price > 0 &&
            imageUrl !== ''
        );
    }, [productData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        const { name, value } = e.target;
        setProductData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) : value,
        }));
    };

    const onUpload = (url: string) => {
        setProductData(prev => ({ ...prev, imageUrl: url }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        console.log(productData)
        try {

            const sizeString = productData.size.join(', '); // Convert array to string
            const modifiedProductData = { ...productData, size: sizeString };

            await addProduct(modifiedProductData);
            setProductData({
                title: '',
                description: '',
                size: [],
                price: 0,
                imageUrl: '',
            });
            alert('Product added successfully!');
        } catch (err) {
            setError('Failed to add product. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-blue-950 text-blue-100 shadow-lg shadow-blue-500/50">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-blue-300">Add New Product</CardTitle>
                    <CardDescription className="text-center text-blue-400">Fill in the details to add a new product</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-blue-300">Title</Label>
                            <Input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Product Title"
                                value={productData.title}
                                onChange={handleInputChange}
                                required
                                className="bg-blue-900 border-blue-700 text-blue-100 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-blue-300">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Product Description"
                                name="description"
                                value={productData.description}
                                onChange={handleInputChange}
                                required
                                className="bg-blue-900 border-blue-700 text-blue-100 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className='space-y-2 '>
                                <Label htmlFor="size" className="text-blue-300">Size Product</Label>
                                <div className="flex flex-wrap">
                                    {sizes.map(size => (
                                        <div key={size} className="flex items-center mr-4">          
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-5 w-5 text-blue-300"
                                                id={`size-${size}`}
                                                name="size[]"
                                                value={size}
                                                onChange={handleSizeSelection}
                                            />
                                            <label htmlFor={`size-${size}`} className="ml-2 text-blue-300">
                                                {size}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                       
                                    
                       {/* 
                                   <div className='space-y-2'>
                            <Label htmlFor="quantityProduct" className="text-blue-300">Quantity</Label>
                            <Input
                                type="number"
                                id="quantityProduct"
                                name="quantityProduct"
                                value={productData.quantityProduct}
                                onChange={handleInputChange}
                                required
                                min="0"
                                className="bg-blue-900 border-blue-700 text-blue-100 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                       */}
              

                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-blue-300">Price</Label>
                            <Input
                                type="number"
                                id="price"
                                name="price"
                                value={productData.price}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="0.01"
                                className="bg-blue-900 border-blue-700 text-blue-100 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-blue-300">Product Image</Label>
                            <FileUpload onUpload={onUpload} />
                            {productData.imageUrl && (
                                <>
                                    <Alert variant="default" className="bg-blue-900 border-blue-500">
                                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                        <AlertDescription className="text-blue-300">
                                            Image uploaded successfully
                                        </AlertDescription>
                                    </Alert>
                                    <img className='rounded-md' src={productData.imageUrl} />
                                </>
                            )}

                        </div>

                        {error && (
                            <Alert variant="destructive" className="bg-red-900 border-red-700">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            disabled={!isFormValid || isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-800 disabled:text-blue-400 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
                        >
                            {isSubmitting ? 'Adding Product...' : 'Add Product'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};