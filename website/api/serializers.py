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


class ExamFormForOfficeSerializer(serializers.ModelSerializer):
    std_name = serializers.SerializerMethodField('student_name')
    std_session = serializers.SerializerMethodField('student_session')
    std_avatar = serializers.SerializerMethodField('student_avatar')
    std_gender = serializers.SerializerMethodField('student_gender')

    def student_name(self, obj):
        return obj.student.name

    def student_session(self, obj):
        return obj.student.session

    def student_avatar(self, obj):
        return obj.student.avatar.url

    def student_gender(self, obj):
        return obj.student.gender

    class Meta:
        model = ExamForm
        fields = '__all__'

