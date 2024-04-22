const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User=require('../models/user')
const jwt=require('jsonwebtoken')
const middleware=require('../utils/middleware')

blogsRouter.get('/', async(request, response,next) => {
    try{const allBlogs = await Blog.find({}).populate('user',{username:1,name:1,id:1})
        response.json(allBlogs)    
    
    } catch (error) {
        next(error)
    }
})
 
blogsRouter.get('/:id', async(request, response, next) => {
    try {
        
        const blog=await Blog.findById(request.params.id)
       
        if (blog != null) { 
            response.json(blog)
        
        } 
    } catch (error) {
        response.status(404).end()
        next(error)
    }
})


blogsRouter.post('/', middleware.userExtractor,async(request, response,next) => {
    try {
        const body = request.body
        const user=request.user
        
        const blog = new Blog({
            title: body.title,
            author: body.author,
            likes: body.likes,
            url:body.url,
            user: user.id,
            comment:[]
        })
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.status(201).json(savedBlog)
    }
    catch(error) {
        next(error)
    } 
})

blogsRouter.delete('/:id', middleware.userExtractor,async (request, response, next) => {
    try {
        const { id } = request.params
        const user=request.user
           const owner=await Blog.findById(id)
        
        if (!owner) {
            response.status(401).json({error:'No such Blog exists'})

        }
        if (owner.user.toString() === user.id.toString()) {
            await Blog.findByIdAndDelete(request.params.id)
            response.status(204).end()
        }
        else {
            response.status(401).json({error:'Not the owner'})
        }
    }
    catch (error)
    { next(error) }
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body
   
    const original = await Blog.findById(request.params.id)
    let updatedComment=[...original.comments,body.comments]
    if (body.comments === "" ) {
        updatedComment=[...original.comments]
    }
    if (body.comments == null) {
        updatedComment = [...original.comments]
    }
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        comments:updatedComment
    } 

    try { 
       
    let req=await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        response.json(req)
    }
    catch (error) { next(error) }
})
module.exports=blogsRouter