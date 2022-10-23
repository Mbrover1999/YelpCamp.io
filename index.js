const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./modules/campgorund');
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');
const { assert } = require('console');

main().catch(err => console.log(`Could not connect to database: ${err}`));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  console.log("Connection with the data base made!");
  
};
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req,res) => {
    res.render("home")
});

app.get('/campgrounds', async(req,res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {campgrounds});
});

app.get('/campgrounds/new', (req,res) => {
  res.render('campgrounds/new');
})

app.post('/campgrounds', async (req,res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
});

app.get('/campgrounds/:id', async(req,res) => {
  const {id} = req.params;
  const campground =  await Campground.findById(id);
  res.render('campgrounds/show', {campground})

});

app.get('/campgrounds/:id/edit', async(req,res) => {
  const {id} = req.params;
  const campground =  await Campground.findById(id);
  res.render('campgrounds/edit', {campground})
});

app.put('/campgrounds/:id', async(req,res) => {
  const {id} = req.params;
  const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
  res.redirect(`/campgrounds/${campground._id}`);

});

app.delete('/campgrounds/:id', async(req,res) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds')
});

app.get("/", (req,res) => {
  res.render('home')
});







app.listen(3000, () => {
console.log("Listening to port 3000")
});
