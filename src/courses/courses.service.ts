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
      initialDateTime: new Date(createCourseDto.initial_datetime),
      dateTimeCourse: createCourseDto.datetime_course ? new Date(createCourseDto.datetime_course) : undefined,
      dateTimeDebut: createCourseDto.datetime_debut ? new Date(createCourseDto.datetime_debut) : undefined,
      dateTimeFin: createCourseDto.datetime_fin ? new Date(createCourseDto.datetime_fin) : undefined,
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
