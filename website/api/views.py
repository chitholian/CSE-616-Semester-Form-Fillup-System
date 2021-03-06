from django.http import HttpResponse
from django.template.loader import get_template
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from weasyprint import HTML

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

    @action(methods=permissions.SAFE_METHODS, detail=True)
    def halls(self, request, pk=None):
        admin = self.get_object()
        try:
            return Response(HallSerializer(Hall.objects.filter(provost=admin), many=True).data)
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
    queryset = Semester.objects.filter(active=True)
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
    def students(self, request, pk=None):
        department = self.get_object()
        return Response(
            StudentSerializer(Student.objects.filter(department=department, semester__active=True), many=True).data)

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
        exam_id = request.GET.get('exam-id', None)
        if exam_id is not None:
            forms = ExamForm.objects.filter(student=student, exam__id=exam_id)
        else:
            forms = ExamForm.objects.filter(student=student)
        return Response(ExamFormSerializer(forms, many=True).data)


class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.filter(active=True)
    serializer_class = ExamSerializer

    @action(methods=permissions.SAFE_METHODS, detail=True)
    def forms(self, request, pk=None):
        exam = self.get_object()
        forms = ExamForm.objects.filter(exam=exam)
        return Response(ExamFormForOfficeSerializer(forms, many=True).data)


class ExamFormViewSet(viewsets.ModelViewSet):
    queryset = ExamForm.objects.all()
    serializer_class = ExamFormSerializer

    @action(methods=permissions.SAFE_METHODS, detail=True)
    def admit(self, request, pk=None):
        form = self.get_object()
        if form.status < 6:
            return HttpResponse('Payment must be completed to download admit card.',
                                status=status.HTTP_402_PAYMENT_REQUIRED)
        exam = Exam.objects.filter(examform=form).first()
        student = Student.objects.filter(examform=form).first()
        semester = Semester.objects.filter(student=student)
        html = get_template('admit_card.html').render({
            'exam': exam,
            'student': student,
            'semester': semester,
            'form': form,
            'qrtext': '{} :=: {} :=: {}'.format(
                student.id, student.name, exam.title
            )
        })
        pdf = HTML(string=html, base_url=request.build_absolute_uri()).write_pdf()
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="' + str(student.id) + '.pdf"'
        return response


class InputAttendanceView(generics.UpdateAPIView):
    serializer_class = ExamFormForOfficeSerializer

    def partial_update(self, request, *args, **kwargs):
        exam_id = request.data.get('exam_id')
        forms = request.data.get('forms')
        for data in forms:
            form = ExamForm.objects.get(id=data['id'])
            form.status = 4
            form.attendance = data['attendance']
            form.save()
        Exam.objects.filter(id=exam_id).update(status=3)
        return Response(status=status.HTTP_202_ACCEPTED)


class ApproveFormsView(generics.UpdateAPIView):
    def partial_update(self, request, *args, **kwargs):
        exam_id = request.data.get('exam')
        forms = request.data.get('forms')
        for data in forms:
            ExamForm.objects.filter(id=data['id']).update(status=5)
        Exam.objects.filter(id=exam_id).update(status=5)
        return Response(status=status.HTTP_202_ACCEPTED)
