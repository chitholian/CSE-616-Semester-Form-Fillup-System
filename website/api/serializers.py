from rest_framework import serializers
from .models import *


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminUser
        fields = '__all__'
        # fields = ('user', 'type')


class HallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall
        # fields = '__all__'
        fields = ('id', 'name', 'provost', 'gender')


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        # fields = '__all__'
        fields = ('code', 'title', 'credits')


class SemesterSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True)

    class Meta:
        model = Semester
        fields = ('id', 'number', 'year', 'department', 'active', 'courses')


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'
        # fields = ('id', 'name', 'alias', 'chairman', 'officer')


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = '__all__'


class ExamFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamForm
        fields = '__all__'
