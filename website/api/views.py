from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import *


class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = AdminUser.objects.all()
    serializer_class = AdminUserSerializer

    @action(methods=permissions.SAFE_METHODS, detail=True)
    def departments(self, request, pk=None):
        admin = self.get_object()
        try:
            if admin.type == "office":
                return Response(DepartmentSerializer(Department.objects.filter(officer=admin), many=True).data)
            elif admin.type == "chairman":
                return Response(DepartmentSerializer(Department.objects.filter(chairman=admin), many=True).data)
            raise AssertionError("User type mismatched")
        except AssertionError:
            return Response([], status=status.HTTP_204_NO_CONTENT)


class HallViewSet(viewsets.ModelViewSet):
    queryset = Hall.objects.all()
    serializer_class = HallSerializer

    @action(methods=permissions.SAFE_METHODS, detail=True)
    def exams(self, request, pk=None):
        hall = self.get_object()
        return Response(ExamSerializer(Exam.objects.filter(semester__department__hall=hall), many=True).data)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer


class SemesterViewSet(viewsets.ModelViewSet):
    queryset = Semester.objects.all()
    serializer_class = SemesterSerializer

    @action(methods=permissions.SAFE_METHODS, detail=True)
    def exams(self, request, pk=None):
        semester = self.get_object()
        return Response(ExamSerializer(Exam.objects.filter(semester=semester), many=True).data)

    @action(methods=permissions.SAFE_METHODS, detail=True)
    def students(self, request, pk=None):
        semester = self.get_object()
        return Response(StudentSerializer(Student.objects.filter(semester=semester), many=True).data)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    @action(methods=permissions.SAFE_METHODS, detail=True)
    def semesters(self, request, pk=None):
        department = self.get_object()
        return Response(SemesterSerializer(Semester.objects.filter(department=department), many=True).data)

    @action(methods=permissions.SAFE_METHODS, detail=True)
    def halls(self, request, pk=None):
        department = self.get_object()
        return Response(HallSerializer(Hall.objects.filter(departments=department), many=True).data)

    @action(methods=permissions.SAFE_METHODS, detail=True)
    def exams(self, request, pk=None):
        department = self.get_object()
        return Response(ExamSerializer(Exam.objects.filter(semester__department=department), many=True).data)


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    @action(methods=permissions.SAFE_METHODS, detail=True)
    def forms(self, request, pk=None):
        student = self.get_object()
        return Response(ExamFormSerializer(ExamForm.objects.filter(student=student), many=True).data)


class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

    @action(methods=permissions.SAFE_METHODS, detail=True)
    def students(self, request, pk=None):
        exam = self.get_object()
        return Response(StudentSerializer(Student.objects.filter(examform__exam=exam), many=True).data)


class ExamFormViewSet(viewsets.ModelViewSet):
    queryset = ExamForm.objects.all()
    serializer_class = ExamFormSerializer