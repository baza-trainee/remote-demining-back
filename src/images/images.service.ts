import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateImageDto } from './dto/create-image-dto';
import { UpdateImageDto } from './dto/update-image-dto';
import { Image } from './schema/image.schema';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel('Image') private readonly imageModel: Model<Image>,
  ) {}
  checkBlobTypes(image: any) {
    try {
      if (!image.blob) {
        return;
      }
      const typeChecks = [
        { type: 'data', message: ' "data:" expected' },
        { type: 'image/png', message: 'image/png; expected' },
        { type: 'base64', message: '"base64" expected' },
      ];
      const typeErrors = typeChecks
        .filter((check) => image.blob.includes(check.type))
        .map((check) => check.message)
        .join('; ');

      if (typeErrors) {
        throw new BadRequestException(
          `${typeErrors}` + 'Expect: data:image/png;base64,<BLOB>',
        );
      }
    } catch (e) {
      throw e;
    }
  }
  async create(image: CreateImageDto) {
    try {
      this.checkBlobTypes(image);
      const newImage = new this.imageModel({
        ...image,
      });
      const result = await newImage.save();
      return result;
    } catch (e) {
      throw e;
    }
  }
  async findOne(id: string) {
    try {
      const image = await this.imageModel.findById(id);
      if (!image) {
        throw new NotFoundException(`Image with id: ${id}`);
      }
      return image;
    } catch (e) {
      throw e;
    }
  }
  async update(id: string, updateImageDto: UpdateImageDto) {
    try {
      this.checkBlobTypes(updateImageDto);
      const updatedImage = await this.imageModel.findByIdAndUpdate(
        id,
        { ...updateImageDto },
        {
          new: true,
        },
      );
      return updatedImage;
    } catch (e) {
      throw e;
    }
  }
  async remove(id: string) {
    try {
      const image = await this.imageModel.findById(id);
      if (image) {
        await image.deleteOne({ id });
        return image;
      }
    } catch (e) {
      throw e;
    }
  }
}
