import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as AWS from "aws-sdk";

//AKIAQYUS2O7OSS34AQDO
//hqIkMUr9SQcDyg5iLQWPkL/3B/MgP7vbx4Z+45A7
const BUCKET_NAME = "kingstartnubereats745";

@Controller('uploads')
export class UploadsController {
    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    async UploadedFile(@UploadedFile() file) {
        AWS.config.update({
            credentials: {
                accessKeyId: 'AKIAQYUS2O7OSS34AQDO',
                secretAccessKey: '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',
            }
        });
        try {
            //bucket 생성
            // const upload = await new AWS.S3().createBucket({
            //     Bucket: 'kingstartnubereats745',
            // }).promise();
            const objectName = `${Date.now() + file.originalname}`;
            await new AWS.S3().putObject({
                Body: file.buffer,
                Bucket: BUCKET_NAME,
                Key: objectName,
                ACL: 'public-read',
            }).promise();
            const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
            return { url };
        } catch (error) {
            console.error(error);
            return null
        }
    }
}