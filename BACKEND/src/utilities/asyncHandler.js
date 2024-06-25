// is file mai hum kuch aisa common kam krne vale hai..jo kai jgah kam aayega..
// this is called utility function
//The purpose of this pattern is to handle asynchronous errors in Express.js middleware functions more cleanly. Normally, you'd have to manually wrap each asynchronous operation in a try-catch block. With this pattern, you can avoid that boilerplate by automatically catching errors and passing them to the next middleware.
const asyncHandler=(requestHandler)=>{

 return (req,res,next)=>{
    Promise.resolve(requestHandler(req,res,next)).
    catch((err)=>next(err))

    
  }
}
     


export {asyncHandler}

// const asyncHandler=(fn) => async(req,res,next) => {
//   try {
//     await fn(req,res,next)
//   } catch (err) {
//     res.status(err.code || 500).json({
//       success:false,
//       message: err.message
//     })
//   }
// }