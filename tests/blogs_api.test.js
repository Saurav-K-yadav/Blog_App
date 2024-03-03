const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const { json } = require('express')
const jwt = require('jsonwebtoken')
const bcrypt=require('bcrypt')
const User=require('../models/user')

let token1
beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    const password = await bcrypt.hash('SAURAV', 10)
    let user = new User({
        username: 'root',
        name:'saurav',
        passwordHash:password
    })
    await user.save()
    const usertoken = {
        username: user.username,
        id:user._id
    }
    token1=jwt.sign(usertoken,process.env.SECRET)
    let BlogObject = new Blog({
        ...helper.initialBlog[0],
        user: user.id
    })
    await BlogObject.save()
    BlogObject = new Blog({
        ...helper.initialBlog[1],
        user:user.id
    })
    await BlogObject.save()

    // user = new User({
    //     username: 'notroot',
    //     name: 'sky',
    //     passwordHash: await bcrypt.hash('sky',100)
    // })
    // await user.save()

})
describe('Initial Tests', () => { 
    test('All blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlog.length)
    })

    test('A specific Blog is returned', async () => {
        const response = await api.get('/api/blogs')

        const titles = response.body.map(res => res.title)
        expect(titles).toContain(' The prince')
    })

    test('A specific Blog is returned', async () => {
        const allNotes = (await helper.blogsInDb()).map(blog => blog.id)
        const response = await api.get(`/api/blogs/${allNotes[0]}`)
        const titles = response.body.title
        const pattern = helper.initialBlog[0].title
        expect(titles).toContain(pattern)
    })

    test('Unknown ids are rejected', async () => {
        const response = await api.get(`/api/blogs/0007`)
        expect(response.status).toBe(404)
    })

    test('Id is defined', async () => {
        let allblogs = await api.get('/api/blogs')
        allblogs = allblogs.body.map(blog => blog)

        allblogs.forEach(blog => {
            expect(blog.id).toBeDefined
            expect(blog).not.toHaveProperty('_id')
        })
    }, 100000)
    
})


describe('post', () => {
  
    test('A valid blog can be added', async () => {
        const newBlog = {
            title: ' Temporary addition',
            author: 'Saurav',
            url: 'localhost',
            likes: 400000000,
        }

        await api.post('/api/blogs').send(newBlog).set('Authorization',`Bearer ${token1}`).expect(201).
            expect('Content-Type', /application\/json/)
        const finalBlogs = await helper.blogsInDb()
        expect(finalBlogs).toHaveLength(helper.initialBlog.length + 1)
        const titles = finalBlogs.map(blog => blog.title)
        expect(titles).toContain(' Temporary addition')
    })

    test('If likes is missing it default to 0', async () => {
        const newBlog = {
            title: ' Temporary addition',
            author: 'Saurav',
            url: 'localhost',
        }
        await api.post('/api/blogs').send(newBlog).set('Authorization', `Bearer ${token1}`).expect(201).
            expect('Content-Type', /application\/json/)
        const finalBlogs = await helper.blogsInDb()
        expect(finalBlogs).toHaveLength(helper.initialBlog.length + 1)
        const likes = finalBlogs.map(blog => blog.likes)
        expect(likes).toContain(0)
    })

    test('If token is not provided', async () => {
        const newBlog = {
            title: ' Temporary addition',
            author: 'Saurav',
            url: 'localhost',
        }
        await api.post('/api/blogs').send(newBlog).expect(401)
       
    })

    test('Title is required to post', async () => {
        const newBlog = [
            {
                author: 'Saurav',
                url: 'localhost',
                likes: 400000000,
            }
            , {
                title: ' Temporary addition',
                author: 'Saurav',
                likes: 400000000,
            },
        ]

        newBlog.forEach(async (blog) => {
            await api.post('/api/blogs').send(blog).set('Authorization', `Bearer ${token1}`).expect(400).
                expect('Content-Type', /application\/json/)
        })

        const finalBlogs = await helper.blogsInDb()
        expect(finalBlogs).toHaveLength(helper.initialBlog.length)
        const titles = finalBlogs.map(blog => blog.title)
        expect(titles).not.toContain(' Temporary addition')
        const urls = finalBlogs.map(blog => blog.url)
        expect(urls).not.toContain('localhost')
    })

})

describe('deleting blogs', () => {
    test('Deleting a blog', async () => {
        const blogs = await helper.blogsInDb()
        await api.delete(`/api/blogs/${blogs[0].id}`).set('Authorization', `Bearer ${token1}`).expect(204)
        const finalBlogs = await helper.blogsInDb()

        expect(finalBlogs).toHaveLength(helper.initialBlog.length - 1)
        const titles = finalBlogs.map(blog => blog.title)
        expect(titles).not.toContain(blogs[0].title)

    })
})

describe('Updating the blogs', () => {
    test('Update by id', async () => {
        let blog = await helper.blogsInDb()
        newBlog = {
            title: "Temporary blog",
            author: "Saurav",
            url: "Localhost",
            likes: 1000,
        }
        await api.put(`/api/blogs/${blog[0].id}`).send(newBlog).expect(200)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})
