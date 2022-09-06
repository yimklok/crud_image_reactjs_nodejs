import Product from "../models/ProductModel.js";
import path from 'path';
import fs from 'fs'

export const getProducts = async(req,res) => {
    try {
        const respone = await Product.findAll();
        res.json(respone)
        //Or
        /*
        const sqlGet = "SELECT * FROM product";
        db.query(sqlGet,(error,respone)=>{
            res.json(respone)
        })
        */
    } catch (error) {
        console.log(error.message)
    }
}

export const getProductById = async(req,res) => {
    try {
        const respone = await Product.findOne({
            where:{
                id: req.params.id
            }
        });
        res.json(respone)
        //Or
        /*
        const sqlGet = "SELECT * FROM product WHERE id =?";
        db.query(sqlGet,[reg.params.id],(error,respone)=>{
            res.json(respone)
        })
        */
    } catch (error) {
        console.log(error.message)
    }
}

export const saveProducts = async(req,res) => {
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"})
    const name = req.body.title; //get title
    const file = req.files.file; //get name image or file
    const fileSize = file.data.length; //Size of file or image
    const ext = path.extname(file.name); //get extension (.png,.jpg,....)
    const filename = file.md5 + ext; //(name is hush)+extension we used for data security
    console.log(ext)
    const url = `${req.protocol}://${req.get('host')}/images/${filename}`;
    const allowedType = ['.png','.jpg','.jpeg'];
    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid images"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Images must be less than 5MB"});
    file.mv(`./public/images/${filename}`, async(err)=>{
        if(err) res.status(500).json({msg: err.message});
        try {
            await Product.create({name:name,image:filename,url:url});
            /* 
            const sqlInsert = "INSERT INTO product (name,image,url) VALUES (?,?,?)";
            db.query(sqlInsert,[name,image,url],(error,result)=>{
                if(error)
                    console.log('error',error);
            })
            */
            res.status(201).json({msg: "Product Created Successfully"});
        } catch (error) {
            console.log(error.message);
        }
    })
}

export const deleteProduct = async(req,res) => {
    const product = await Product.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!product) res.status(404).json({msg: "No Data Found"});
    try {
        const filepath = `./public/images/${product.image}`;
        fs.unlinkSync(filepath);
        res.status(200).json({msg: "Product Deleted Successfully"});
        await Product.destroy({
            where:{
                id : req.params.id
            }
        })
        res.status(200).json({msg: "Product Deleted Successfully"});
    } catch (error) {
        console.log(error.message);
    }
}

export const updateProduct = async(req,res) => {
    const product = await Product.findOne({
        where:{
            id: req.params.id
        }
    });
    if(!product) res.status(404).json({msg: "No Data Found"});
    let filename = ''
    if(req.files === null){
        filename = Product.image;
    }else{
        const file = req.files.file; //get name
        const fileSize = file.data.length; //grt size
        const ext = path.extname(file.name); //get extension(.png,.jpg,....)
        filename = file.md5 + ext;//get name+extension
        const allowedType = ['.png','jpg','jpeg'];
        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid images"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Images must be less than 5MB"});
        const filepath = `./public/images/${product.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${filename}`, (err)=>{
            if(err) res.status(500).json({msg: err.message});
        }) 
    }
    const name = req.body.title;
    const url = `${req.protocol}://${req.get('host')}/images/${filename}`; 
    try {
        await Product.update({name: name,image: filename,url: url},{
            where:{
                id: req.params.id
            }
        })
        return res.status(200).json({msg: "Product Updated Successfully"});
    } catch (error) {
        console.log(error.message);
    }
}