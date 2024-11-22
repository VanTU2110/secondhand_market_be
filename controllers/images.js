

const uploadImage = (req, res) => {
    try {
        // Chi tiết file sau khi upload có trong req.file
        const { path, filename } = req.file;  // path là URL của ảnh trên Cloudinary
        return res.status(200).json({
            message: 'Tải ảnh lên thành công!',
            imageUrl: path,
            imageFilename: filename
        });
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi khi tải ảnh lên' });
    }
};

module.exports = {
    uploadImage
};
