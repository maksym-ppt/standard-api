import { BaseModel } from '../types/mongo'
import { Schema } from 'mongoose'
import { BadRequestError, UnauthorizedError } from '../types/errors'
import { Collection } from '../mongo'
import { users } from './users'


export interface UserImage extends BaseModel {
  user_id: string
  image_url: string
  metadata?: Record<string, any>
}

class UserImagesCollection extends Collection<UserImage> {
  constructor() {
    super('user_images', {
      user_id: {
        type: String,
        required: true
      },
      image_url: {
        type: String,
        required: true
      },
      metadata: {
        type: Schema.Types.Mixed, // Accepts any JSON object
        default: {}
      }
    }, {
      configure(schema) {
        schema.index({ user_id: 1 })
      }
    })
  }

  async createIfUserExists(userImage: Partial<UserImage>): Promise<UserImage> {
    if (!userImage.user_id) {
      throw new BadRequestError('User ID is required');
    }

    // Check if user exists
    const userExists = await users.exists({ _id: userImage.user_id });
    if (!userExists) {
      throw new BadRequestError('User not found');
    }

    // Create the user image
    return this.insertOne(userImage);
  }

  async getAllUserImages(userId: string): Promise<Array<{ imageId: string, userId: string, imageUrl: string }>> {
    const images = await this.model.find({ user_id: userId }).select('user_id image_url').exec();

    return images.map(image => ({
      imageId: image._id,
      userId: image.user_id,
      imageUrl: image.image_url
    }));
  }

}

export const userImages = new UserImagesCollection()
