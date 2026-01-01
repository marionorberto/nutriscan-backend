class MulterConfig {
  multerConfig(dest: string) {
    return {
      destination: dest,
      filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
      },
    };
  }
}

export default new MulterConfig().multerConfig;
