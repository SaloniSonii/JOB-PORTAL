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

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = req.body.toString("utf8");

    const event = whook.verify(payload, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = event;

    const email = data.email_addresses?.[0]?.email_address || null;

    if (type === "user.created") {
      if (!email) return res.status(200).json({ ok: true });

      const userData = {
        _id: data.id,
        email,
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        image: data.image_url || "",
        resume: "",
      };

      await User.findByIdAndUpdate(data.id, userData, {
        upsert: true,
        new: true,
      });

      console.log("✅ User saved:", email);
    }

    if (type === "user.updated") {
      await User.findByIdAndUpdate(data.id, {
        email,
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        image: data.image_url || "",
      });
    }

    if (type === "user.deleted") {
      await User.findByIdAndDelete(data.id);
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return res.status(400).json({ success: false });
  }
};
