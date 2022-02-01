const express=require('express');
const mongoose=require('mongoose');
const shortID=require('shortid')
const app=express();

const url='mongodb+srv://saidheeraj:saidheeraj@cluster0.ua7re.mongodb.net/urlCutter?retryWrites=true&w=majority'
mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const urlSchema=new mongoose.Schema({
    name:String,
    url:String,
    shortid:{
        type:String,
        default:shortID.generate
    },
    click:{
        type:Number,
        default:0
    }
})

const namesColl=mongoose.model('namesColl',urlSchema)


app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use(express.static(__dirname+'/public'))


app.get('/',function(req,res){
    namesColl.find({},function(err,data){
        res.render('index',{names:data})
    })
})




app.get('/:shortUrl', function (req, res) {
    namesColl.findOne({ shortid: req.params.shortUrl })
    .then((data)=>{
        ++data.click;
        return data.save()
  })
  .then((data)=>{
      res.redirect(data.url)
  })
})  

app.get('/:shortUrl/:del',function(req,res){
    namesColl.deleteOne({shortid:req.params.shortUrl}).then((data)=>{
        res.redirect('/')
    })

})

app.post('/names',async function(req,res){
    const name=new namesColl({
        name:req.body.nameInp,
        url:req.body.urlInp,
    })
    await name.save()

    res.redirect('/')
    
})

app.listen(process.env.PORT || 3000)