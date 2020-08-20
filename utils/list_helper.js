const Blog = require("../models/blog");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let likeSum = 0;

  blogs.forEach((blog) => {
    likeSum += blog.likes;
  });

  return likeSum;
};

const favoriteBlog = (blogs) => {
  let highestLikedBlog = {
      title: "",
      author: "",
      likes: -1
  };

  blogs.forEach((blog) => {
    if (blog.likes > highestLikedBlog.likes) {
      highestLikes = blog.likes;
      highestLikedBlog = {
          title: blog.title,
          author: blog.author,
          likes: blog.likes
      }
    }
  });

    return highestLikedBlog;
};

const mostBlogs = (blogs) => {
    let blogAuthors = [];
    let count = [];
    let mostBlogs = {
        author: '',
        blogs: -1
    }

    blogs.forEach(blog => {
        let index = blogAuthors.indexOf(blog.author);

        if(index != -1) {
            count[index] = count[index] + 1;
            console.log(`${count[index]} for ${blogAuthors[index]}`)
        } else {
            blogAuthors.push(blog.author)
            count.push(1);
            index = blogAuthors.length - 1;
            console.log(`added ${blogAuthors[index]}, with ${count[index]}`)
        }

        if(count[index] > mostBlogs.count) {
            mostBlogs = {
                author: blogAuthors[index],
                blogs: count[index]
            }
        }
    })

    return mostBlogs;
}

const mostLikes = (blogs) => {
    return 0;
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
