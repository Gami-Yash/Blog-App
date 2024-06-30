const express = require('express');
const cors = require('cors');
const mongo = require('mongoose')
const bodyParser = require('body-parser');
const User = require('../models/users')
const Post = require('../models/post')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const multer =  require('multer')
const fs = require('fs')


const port = 8000;
const salt = bcrypt.genSaltSync(10)
const sec = '47qc65noqieal674tinsxjknfakqwjr;odkw589p8'
const uploadMiddleware = multer({dest : 'uploads'})
const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(__dirname+'/uploads'))

mongo .connect('mongodb://localhost:27017/blogapplication')

.then(()=>{
    console.log('database connected')
})
.catch(()=>{
    console.log('Error connecting database')
})


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));





// APIS
app.get('/', (req, res) => {
    res.send('hello');
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userInfo = await User.create({username,password:bcrypt.hashSync(password,salt)})
        res.json(userInfo)    
    } catch (e) {
        res.status(400).json(e.message)
    }
});

app.post('/login', async(req,res) =>{
    const {username , password } = req.body;
    try {
        const user = await User.findOne({username})
        if(!user){
            // return res.status(400).json('user not found')
            console.log('User not found')
        }
        const validPassword = await bcrypt.compare(password,user.password)
        if(validPassword){
            jwt.sign({username,id:user._id}, sec, {}, (err,token)=>{
                if(err) throw(err)
                res.cookie('token',token).json({
                    id : user._id,
                    username,
                })
            })
        }else{
            res.status(400).json('Wrong credentials')
        }
    } catch (error) {
        console.log('error occured')
    }
})


app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json('Token not provided');
    }
    jwt.verify(token, sec, (err, info) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(403).json('Invalid token');
        }
        res.json(info);
    });
});


app.post('/create',uploadMiddleware.single('file'),async (req,res)=>{
    console.log(req.file)
    const {originalname,path} = req.file;
    const part = originalname.split('.');
    const ext = part[part.length - 1];
    const newPath = path +'.'+ext;
    fs.renameSync(path, newPath)
    
    const {token} = req.cookies;
    jwt.verify(token,sec, {}, async (err,info)=>{
        if(err) throw err
        const {title,summary,content} = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover:newPath,
            author:info.id
        })
    })
    res.json({sucess:true})
})


app.get('/post',async (req,res)=>{
    console.log('in post')
    const post = await Post.find().populate('author',['username']).sort({createdAt:-1}).limit(20)
    res.json(post)
})



app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok')
})


app.listen(port, () => {
    console.log(`server started and running on ${port}`);
});
