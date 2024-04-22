const dummy = (blogs) => { 
    return 1;
}

const total_likes = (blogs) => {
    const reduce=(total,curr)=>{
        return total+curr.likes
    }
return blogs.reduce(reduce,0)
}

const mostLikes = (blogs) => {
    author = ""
    if (!blogs) {
        return { author: `${author}`, likes: '0' }
    }
    const reducer = (prev, curr) => {
        if (curr.likes >= prev) {
            prev = curr.likes
            author=curr.author
        }
        return prev
    }
    const mostLiked = blogs.reduce(reducer, 0)
    return ({ author: `${author}`, likes: `${mostLiked}` })
}

module.exports = {
    dummy,
    total_likes,
    mostLikes
}