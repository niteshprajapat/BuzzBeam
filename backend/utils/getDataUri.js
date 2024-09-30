import DataUriParser from 'datauri/parser.js'
import path from 'path';

export const getDataUri = (file) => {
    console.log("file", file);

    const parser = new DataUriParser();

    const extName = path.extname(file.originalname).toString();
    const fileFormat = parser.format(extName, file.buffer).content;
    return fileFormat;
}