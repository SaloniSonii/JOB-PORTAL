// import { Webhook } from "svix";
// import User from "../models/User.js";

// //api controller function to manage clerk user with database
// export const clerkWebhooks = async (req, res) => {
//     try {
//         //create a svix instance with clerk webhook secret
//         const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

//         //verifying headers
//         await whook.verify(JSON.stringify(req.body), {
//             "svix-id": req.headers["svix-id"],
//             "svix-timestamp": req.headers["svix-timestamp"],
//             "svix-signature": req.headers["svix-signature"]
//         })

//         //getting data from request body
//         const { data, type } = req.body

//         //switch  case for different events
//         switch (type) {
//             case 'user.created': {

//                 const userData ={
//                     _id:data.id,
//                     email:data.email_addresses[0].email_address,
//                     name: data.first_name + " " + data.last_name,
//                     image: data.image_url,
//                     resume:''

//                 }
//                 await User.create(userData)
//                 res.json({})
//                 break;

//             }
            

//             case 'user.updated': {
                
//                 const userData ={
//                     email:data.email_addresses[0].email_address,
//                     name: data.first_name + " " + data.last_name,
//                     image: data.image_url,
                

//                 }
//                 await User.findByIdAndUpdate(data.id,userData)
//                 res.json({})
//                 break;


//             }


//             case 'user.deleted': {
//                 await User.findByIdAndDelete(data.id)
//                 res.json({})
//                 break;

//             }
//             default:
//                 break;


//         }

//     }
//     catch (error) {
//         console.log(error.message);
//         res.json({success:false, message:'Webhooks Error'})

//     }
// }














import { Webhook } from "svix";
import User from "../models/User.js";

// API controller to handle Clerk webhooks
export const clerkWebhooks = async (req, res) => {
  try {
    // Create Svix instance
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify webhook signature
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      // ✅ USER CREATED
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url || "",
          resume: "",
        };

        await User.create(userData);
        return res.status(200).json({ success: true });
      }

      // ✅ USER UPDATED
      case "user.updated": {
        const userData = {
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url || "",
        };

        await User.findByIdAndUpdate(data.id, userData);
        return res.status(200).json({ success: true });
      }

      // ✅ USER DELETED
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).json({ success: false, message: "Webhook Error" });
  }
};
