const mongoose = require('mongoose')
require('dotenv').config()

// const password = process.argv[2]

const url = process.env.TEST_MONGODB_URI
    // `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})


const Blog = mongoose.model('blog', blogSchema)

const blog = new Blog({
    title: ' Art of War',
    author: 'Sun Tzu',
    url: 'wiipedia',
    likes:5000,
})


blog.save().then(result => {
  console.log('Blog saved!')
  mongoose.connection.close()
})


// Blog.find({}).then(result => {
//     result.forEach(note => {
//         console.log(note)
//     })
//     mongoose.connection.close()
// })