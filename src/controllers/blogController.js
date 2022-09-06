const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const moment = require('moment')

const getBlogs = async function (req, res) {
  try {
    const query = req.query;
    const temp = { isDeleted: false, isPublished: true };
    //console.log()
    const final = Object.assign({}, query, temp);

      let data = await blogModel.find(final);
      if (data.length == 0)
        res.status(404).send({ status: false, msg: "no such data" });
      else res.status(200).send({ status: true, data: data });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

//create post api

const createBlog = async function (req, res) {
  try {
    let blog = req.body;
    let authorId = blog.authorId;
    if (!authorId)
      return res.status(404).send({ status: false, msg: "Required Author Id !" });

    let author_id = await authorModel.findById(authorId);
    if (!author_id)
      return res.status(400).send({ status: false, msg: "Invalid Author Id !" });

// validation for title
  if (!/^[a-zA-Z0-9:-]+$/.test(blog.title)) {
  return res.status(400).send({ status: false, message: 'Special character not allowed ! Except : -' })
}

//validate body
  if (!/^[a-zA-Z0-9 :-]+$/.test(blog.body)) {
  return res.status(400).send({ status: false, message: 'Special character not allowed ! Except : -' })
}

    let createBlogs = await blogModel.create(blog);
     res.status(201).send({ status: true, data: createBlogs });
  }  catch (err) {
      res.status(500).send({ error: err.message });
  }
};

const updateBlog = async (req,res) => {
    try{
        let blog = req.body;
        let blogId = req.params.blogId 
        let published= {
            publishedAt:moment().format()
        }
        const final = Object.assign({}, blog, published);
        console.log(published)
       
        let myBlogModel = await blogModel.findById(blogId)
        
        if(!myBlogModel || myBlogModel["isDeleted"]==true){
       return res.status(404).send({status:false, error:"invalid bro!"})}
       if(!blog.isPublished)
        {allBlogs= await blogModel.findOneAndUpdate(
           { _id:blogId},{$push:blog},{new:true}
        )
        res.status(200).send({data:allBlogs})}
        allBlogs= await blogModel.findOneAndUpdate(
            { _id:blogId},{$push:final},{new:true}
         )
        console.log(final)
        res.status(200).send({data:allBlogs})
    } catch(err) {
       console.log({error: err.message})
    }
  
  }



const deleteBlogs=async function(req,res){

    try {
        const query = req.query;
        const temp = { isDeleted: false};
        const final = Object.assign({}, query, temp);
        if(Object.keys(query).length==0)
            res.status(400).send({status:false, msg:"no query given"})
      else{
        let data = await blogModel.updateMany(final,{isDeleted:true});
        if (data.matchedCount == 0)
            res.status(404).send({ status: false, msg: "blog doesn't exist" });
          else res.status(200).send({ status: true, data: data });
      }
    
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
      }

}
const removeBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId
    let blog_id = await blogModel.findById(blogId)
    if (blog_id && blog_id.isDeleted == false) {

      let deletedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, { isDeleted: true }, { new: true })
      return res.status(200).send()

    } else {
      return res.status(404).send({ msg: "not found" })
    }
  }
  catch (err) {
    return res.status(500).send({ error: err })
  }}

module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.deleteBlogs = deleteBlogs
module.exports.removeBlog = removeBlog
module.exports.updateBlog = updateBlog