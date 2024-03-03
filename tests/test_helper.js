const Blog = require('../models/blog')
const User=require('../models/user')
const initialBlog = [
    {
        title: ' Art of War',
        author: 'Sun Tzu',
        url: 'wikipedia',
        likes: 5000,
    },
    {
        title: ' The prince',
        author: 'Niccolo Machiavelli',
        url: 'wikipedia',
        likes: 4000,
    }
]

const nonExisitingId = async () => {
    const blog = new Blog({
        title: "Temp",
        author: "tester",
        url: "localhost",
        likes:0
    })
    await blog.save()
    await blog.deleteOne()
    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog=>blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user=>user.toJSON())
}
module.exports = {
    initialBlog,
    nonExisitingId,
    blogsInDb,usersInDb
}