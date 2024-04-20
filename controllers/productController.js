const Product=require('../models/product');
const axios=require('axios');
const express=require('express');
const router=express.Router();

exports.saveProducts=async (req,res)=>{
    const response=await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const data=response.data;
    try{
    for(const productData of data){
        
            const product=new Product({
            id:productData.id,
            title:productData.title,
            name: productData.name,
            description: productData.description,
            price: productData.price,
            category: productData.category,
            sold: productData.sold,
            image: productData.image,
            dateOfSale: productData.dateOfSale
            });
            await product.save();
        }
        res.status(200).json('Products saved successfully');
    }
        catch(error){
            res.status(500).json(error);
        }
}

exports.getProducts=async (req,res)=>{
    const {search='',limit=10,page=1,month="03"}=req.query;
    const skip=(parseInt(page)-1)*limit;
    const filter={};
    if(search){
        filter.$or = [
            {title:{$regex:search, $options:'i'}}, 
            {description:{$regex:search,$options:'i'}}, 
            {price:parseFloat(search) || 0}, 
          ];
    }
    try{
        const products=await Product.find(filter).limit(limit).skip(skip);
        const productsWithDateFilter=products.filter(product=>{
            const productMonth = new Date(product.dateOfSale).getUTCMonth() + 1;
            return productMonth === parseInt(month);
        })
        res.status(200).json(productsWithDateFilter);
    }
    catch(error){
        res.status(500).json(error);
    }
}