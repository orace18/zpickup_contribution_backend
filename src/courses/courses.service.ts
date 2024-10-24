import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Courses } from '../Schemas/courses_schema/courses.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Courses.name) private courseModel:Model<Courses>) {}
  async create(createCourseDto: CreateCourseDto) {
    const course = new this.courseModel({
      ...createCourseDto,
      initialDateTime: new Date(createCourseDto.initialDateTime),
      dateTimeCourse: createCourseDto.dateTimeCourse ? new Date(createCourseDto.dateTimeCourse) : undefined,
      dateTimeDebut: createCourseDto.dateTimeDebut ? new Date(createCourseDto.dateTimeDebut) : undefined,
      dateTimeFin: createCourseDto.dateTimeFin ? new Date(createCourseDto.dateTimeFin) : undefined,
    });
    return await course.save();
  }

  findAll() {
    return `This action returns all courses`;
  }

  findOne(id: string) {
    return `This action returns a #${id} course`;
  }

  update(id: string, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: string) {
    return `This action removes a #${id} course`;
  }
}
