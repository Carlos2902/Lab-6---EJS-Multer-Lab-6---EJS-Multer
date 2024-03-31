const express = require('express')
const app = express()
const path = require('path')
const multer = require('multer');
//SETTING up the templing engine ejs 
app.set('view engine', 'ejs')

app.use(express.static('public'))

//To know what page we're currently on
app.use((req,res,next)=>{
    app.locals.currentRoute = req.path;
    next();
});

const HTTP_PORT = process.env.PORT || 8080

// middleware function to print out where the request came from
app.use((req, res, next)=>{
    console.log(`Request from: ${req.get('use-agent')} [${new Date()}]`)
    next();
});

// multer
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
 
const upload = multer({ storage: storage });
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Set up home to allow user upload a file
app.get('/', (req,res)=>{
    res.render('home');
})

app.post('/submit-multipart', upload.single('fileSample'), (req, res) => {
    res.send({ body: req.body, file: req.file });
});
 
app.post('/submit-urlencoded', (req, res) => {
    req.body.checkboxSample = req.body.checkboxSample ? true : false;
    res.send(req.body);
});




//setting up the about page
app.get('/about', (req,res)=>{
    res.render('about');
})
app.get('/viewData', function(req,res){
    // Data to be rendered in viewEjs
    let someData = [{
        name: 'John',
        age: 21,
        occupation: 'developer',
        company: 'Scotiabank',
        visible: true,
    },
    {
        name: 'Connor',
        age: 30,
        occupation: 'Figther',
        company: 'UFC',
        visible: true,
    }]

    // Use the viewDaata.ejs to render data in someData using the table 
    res.render('viewData',{
       data: someData, 
    })
})

app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`)
})