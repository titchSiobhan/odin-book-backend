import cloudinary from '../lib/cloudinary.js';
import prisma from '../lib/prisma.js';
import upload from '../middleware/multer.js';

async function setToPrivate(req, res) {
	const userId = req.user.id;

	const user = await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			isPublic: false,
		},
	});
	res.json({ user });
}

async function setToPublic(req, res) {
	const userId = req.user.id;

	const user = await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			isPublic: true,
		},
	});
	res.json({ user });
}

async function GetUser(req, res) {
	const { userId } = req.params;

	const getUser = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			firstName: true,
			userName: true,
			post: true,
			isPublic: true,
			id: true,
			receivedRequests: true,
			sentRequests: true,
            profileImage:true
		},
	});
	res.json({ user: getUser });
}




async function uploadProfilePicture(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "profile_pics" },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          return res.status(500).json({ error: "Cloudinary upload failed" });
        }

    

        const updatedUser = await prisma.user.update({
          where: { id: req.user.id },
          data: { profileImage: result.secure_url }, 
        });

        

        res.json(updatedUser);
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}

export { setToPrivate, setToPublic, GetUser, uploadProfilePicture };
